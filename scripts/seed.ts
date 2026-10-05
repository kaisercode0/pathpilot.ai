import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { CAREER_ROLES } from "../lib/career-roles";

// Safely load environment variables from .env.local if not already present
if (!process.env.DATABASE_URL) {
  const envLocalPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, "utf-8");
    for (const line of envContent.split("\n")) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
        const [key, ...valParts] = trimmed.split("=");
        const k = key.trim();
        const v = valParts.join("=").trim().replace(/^["']|["']$/g, "");
        if (k && !process.env[k]) {
          process.env[k] = v;
        }
      }
    }
  }
}

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database with PathPilot career roles and resources...");

  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes("placeholder")) {
    console.log("DATABASE_URL is unconfigured or a placeholder. Skipping live PostgreSQL seed safely.");
    return;
  }

  try {
    for (const roleConfig of Object.values(CAREER_ROLES)) {
      // 1. Seed CareerRole
      await prisma.careerRole.upsert({
        where: { id: roleConfig.id },
        update: {
          title: roleConfig.title,
          category: roleConfig.category,
          description: roleConfig.description,
          skills: roleConfig.skills,
          degree: "Bachelor's in CS / IT or equivalent self-taught portfolio",
        },
        create: {
          id: roleConfig.id,
          title: roleConfig.title,
          category: roleConfig.category,
          description: roleConfig.description,
          skills: roleConfig.skills,
          degree: "Bachelor's in CS / IT or equivalent self-taught portfolio",
        },
      });

      // 2. Seed Resources from roleConfig.freeLearningResources
      for (const res of roleConfig.freeLearningResources || []) {
        const existing = await prisma.resource.findFirst({
          where: { url: res.url },
        });

        if (!existing) {
          await prisma.resource.create({
            data: {
              title: res.title,
              url: res.url,
              provider: res.provider,
              type: res.type,
              skill: roleConfig.skills[0] || roleConfig.title,
              isFree: res.status === "FREE",
            },
          });
        }
      }
    }

    console.log("Database seed completed successfully.");
  } catch (dbError: unknown) {
    const msg = dbError instanceof Error ? dbError.message : String(dbError);
    if (msg.includes("Authentication failed") || msg.includes("Can't reach database server")) {
      console.log(`Notice: PostgreSQL database connection unverified on localhost (${msg.split('\n')[0]}). Seed script ready to populate live DB once PostgreSQL credentials are provided.`);
    } else {
      throw dbError;
    }
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
