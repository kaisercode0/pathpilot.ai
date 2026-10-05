import { PrismaClient } from "@prisma/client";
import type { RoadmapResponse } from "./schemas";
import { findMatchingRole } from "./validation";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

/**
 * Safely executes a database query with fallback error handling.
 * Returns null if the database is unconfigured or unreachable, avoiding server crashes.
 */
export async function safeDbCall<T>(fn: (client: PrismaClient) => Promise<T>): Promise<T | null> {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")) {
    return null;
  }
  try {
    return await fn(prisma);
  } catch (error) {
    console.warn("Database operation failed safely:", error instanceof Error ? error.message : String(error));
    return null;
  }
}

/**
 * Saves a generated roadmap, its steps, resources, and generation log to PostgreSQL via Prisma.
 */
export async function saveRoadmapToDatabase(
  roadmap: RoadmapResponse,
  provider: string = "anthropic-claude",
  errorMessage?: string
) {
  return await safeDbCall(async (prismaClient) => {
    const roleMatch = findMatchingRole(roadmap.careerGoal);
    const careerRoleId = roleMatch?.id;

    // 1. Create Roadmap entry
    const savedRoadmap = await prismaClient.roadmap.create({
      data: {
        id: roadmap.id,
        goal: roadmap.careerGoal,
        careerRoleId: careerRoleId || null,
        currentSkills: roadmap.careerInsights?.inDemandSkills || [],
        experienceLevel: roadmap.experienceLevel,
        hoursPerWeek: Math.round(roadmap.hoursPerWeek),
        targetDuration: roadmap.targetDuration,
        roadmapData: JSON.parse(JSON.stringify(roadmap)),
        isFallback: Boolean(roadmap.isFallback),
      },
    });

    // 2. Create RoadmapSteps & save Resources
    let stepCount = 1;
    for (const phase of roadmap.phases || []) {
      for (const task of phase.tasks || []) {
        await prismaClient.roadmapStep.create({
          data: {
            roadmapId: savedRoadmap.id,
            stepNumber: stepCount++,
            title: task.title,
            description: task.description,
            duration: `${task.estimatedHours}h`,
            skills: task.skillsCovered,
            projects: phase.milestoneProject ? [phase.milestoneProject.title] : [],
            resources: task.resources || [],
          },
        });

        // Store unique resources
        for (const res of task.resources || []) {
          if (res.url) {
            const existingRes = await prismaClient.resource.findFirst({
              where: { url: res.url },
            });
            if (!existingRes) {
              await prismaClient.resource.create({
                data: {
                  title: res.title,
                  url: res.url,
                  provider: res.provider || "Official Resource",
                  type: res.type,
                  skill: task.skillsCovered[0] || roadmap.careerGoal,
                  isFree: res.isFree ?? true,
                },
              });
            }
          }
        }
      }
    }

    // 3. Create GenerationLog entry
    await prismaClient.generationLog.create({
      data: {
        roadmapId: savedRoadmap.id,
        provider,
        status: roadmap.isFallback ? "fallback" : "success",
        errorMessage: errorMessage || null,
      },
    });

    return savedRoadmap;
  });
}
