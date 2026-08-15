import { describe, it, expect } from "vitest";
import {
  RoadmapRequestSchema,
  TaskSchema,
  PhaseSchema,
  RoadmapResponseSchema,
} from "@/lib/schemas";
import { generateCuratedFallbackRoadmap } from "@/lib/fallback-roadmaps";

describe("Zod Schemas Validation", () => {
  describe("RoadmapRequestSchema", () => {
    it("validates valid input with array of skills", () => {
      const validPayload = {
        careerGoal: "Full-Stack Web Developer",
        currentSkills: ["HTML", "CSS", "JavaScript"],
        experienceLevel: "beginner",
        hoursPerWeek: 15,
        targetDuration: "3_months",
        learningStyle: "balanced",
      };

      const result = RoadmapRequestSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.careerGoal).toBe("Full-Stack Web Developer");
        expect(result.data.currentSkills).toEqual(["HTML", "CSS", "JavaScript"]);
      }
    });

    it("transforms comma-separated string of skills into an array", () => {
      const payloadWithStringSkills = {
        careerGoal: "AI Engineer",
        currentSkills: "Python, PyTorch, Linear Algebra",
        experienceLevel: "intermediate",
        hoursPerWeek: 20,
        targetDuration: "6_months",
      };

      const result = RoadmapRequestSchema.safeParse(payloadWithStringSkills);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.currentSkills).toEqual(["Python", "PyTorch", "Linear Algebra"]);
        expect(result.data.learningStyle).toBe("balanced");
      }
    });

    it("rejects invalid hours per week below 2 or above 80", () => {
      const invalidLow = {
        careerGoal: "DevOps Engineer",
        currentSkills: ["Linux"],
        experienceLevel: "beginner",
        hoursPerWeek: 1,
        targetDuration: "1_month",
      };

      const invalidHigh = {
        careerGoal: "DevOps Engineer",
        currentSkills: ["Linux"],
        experienceLevel: "beginner",
        hoursPerWeek: 100,
        targetDuration: "1_month",
      };

      expect(RoadmapRequestSchema.safeParse(invalidLow).success).toBe(false);
      expect(RoadmapRequestSchema.safeParse(invalidHigh).success).toBe(false);
    });

    it("rejects empty career goal", () => {
      const invalidGoal = {
        careerGoal: "",
        currentSkills: ["React"],
        experienceLevel: "beginner",
        hoursPerWeek: 10,
        targetDuration: "3_months",
      };

      const result = RoadmapRequestSchema.safeParse(invalidGoal);
      expect(result.success).toBe(false);
    });

    it("rejects invalid experience level enum", () => {
      const invalidLevel = {
        careerGoal: "Data Analyst",
        currentSkills: ["Excel"],
        experienceLevel: "expert-ninja",
        hoursPerWeek: 10,
        targetDuration: "3_months",
      };

      const result = RoadmapRequestSchema.safeParse(invalidLevel);
      expect(result.success).toBe(false);
    });
  });

  describe("RoadmapResponseSchema and Fallback Generator", () => {
    it("generates a fallback roadmap that strictly satisfies RoadmapResponseSchema", () => {
      const request = {
        careerGoal: "AI Application Engineer",
        currentSkills: ["Python", "FastAPI"],
        experienceLevel: "intermediate" as const,
        hoursPerWeek: 12,
        targetDuration: "3_months" as const,
        learningStyle: "project_based" as const,
      };

      const roadmap = generateCuratedFallbackRoadmap(request);
      const parseResult = RoadmapResponseSchema.safeParse(roadmap);

      expect(parseResult.success).toBe(true);
      if (parseResult.success) {
        expect(parseResult.data.phases.length).toBeGreaterThanOrEqual(3);
        expect(parseResult.data.careerInsights.inDemandSkills.length).toBeGreaterThan(0);
        expect(parseResult.data.totalEstimatedHours).toBe(12 * 12); // 12 weeks * 12 hours
      }
    });

    it("validates task schema categories and resources", () => {
      const validTask = {
        id: "task-101",
        title: "Master TypeScript Generics",
        description: "Study generic constraints, conditional types, and keyof operator.",
        estimatedHours: 5,
        category: "concept",
        skillsCovered: ["TypeScript", "Generics"],
        resources: [
          {
            title: "TypeScript Handbook",
            url: "https://www.typescriptlang.org",
            type: "doc",
            isFree: true,
          },
        ],
        tips: "Build a generic cache class to practice.",
        completed: false,
      };

      const result = TaskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });
  });
});
