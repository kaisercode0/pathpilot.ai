import { z } from "zod";

/**
 * Schema for the user's roadmap generation request.
 */
export const RoadmapRequestSchema = z.object({
  careerGoal: z
    .string()
    .min(2, "Career goal must be at least 2 characters")
    .max(120, "Career goal must not exceed 120 characters"),
  currentSkills: z
    .array(z.string())
    .min(1, "Please specify at least one current skill or concept")
    .or(
      z.string().min(1, "Please enter your current skills").transform((val) =>
        val
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      )
    ),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
    error: "Experience level must be beginner, intermediate, or advanced",
  }),
  hoursPerWeek: z
    .number({ error: "Hours per week must be a number" })
    .min(2, "Must commit at least 2 hours per week")
    .max(80, "Weekly commitment cannot exceed 80 hours"),
  targetDuration: z.enum(
    ["1_month", "3_months", "6_months", "12_months"],
    {
      error: "Please select a target duration",
    }
  ),
  learningStyle: z
    .enum(["project_based", "theory_first", "balanced", "certification"], {
      error: "Please select a valid learning style",
    })
    .optional()
    .default("balanced"),
});

export type RoadmapRequest = z.infer<typeof RoadmapRequestSchema>;

/**
 * Schema for an external learning resource.
 */
export const ResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  type: z.enum(["doc", "tutorial", "video", "interactive", "book", "course", "repo"]),
  isFree: z.boolean().default(true),
});

export type Resource = z.infer<typeof ResourceSchema>;

/**
 * Schema for a single task within a roadmap phase.
 */
export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(5),
  estimatedHours: z.number().min(0.5).max(100),
  category: z.enum(["concept", "project", "practice", "reading", "milestone"]),
  skillsCovered: z.array(z.string()).min(1),
  resources: z.array(ResourceSchema).default([]),
  tips: z.string().optional(),
  completed: z.boolean().default(false),
});

export type Task = z.infer<typeof TaskSchema>;

/**
 * Schema for the capstone/milestone project of a phase.
 */
export const MilestoneProjectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  deliverables: z.array(z.string()).min(1),
  estimatedHours: z.number().min(1),
});

export type MilestoneProject = z.infer<typeof MilestoneProjectSchema>;

/**
 * Schema for a phase in the learning path.
 */
export const PhaseSchema = z.object({
  id: z.string().min(1),
  phaseNumber: z.number().int().positive(),
  title: z.string().min(2),
  description: z.string().min(10),
  estimatedWeeks: z.number().min(1),
  estimatedHours: z.number().min(1),
  milestoneProject: MilestoneProjectSchema.optional(),
  tasks: z.array(TaskSchema).min(1),
});

export type Phase = z.infer<typeof PhaseSchema>;

/**
 * Schema for industry and career insights provided alongside the roadmap.
 */
export const CareerInsightsSchema = z.object({
  inDemandSkills: z.array(z.string()).min(1),
  recommendedCertifications: z.array(z.string()).default([]),
  portfolioTips: z.array(z.string()).min(1),
  interviewPrepFocus: z.array(z.string()).min(1),
  potentialJobTitles: z.array(z.string()).min(1),
});

export type CareerInsights = z.infer<typeof CareerInsightsSchema>;

/**
 * Complete structured schema returned by the AI generator / API route.
 */
export const RoadmapResponseSchema = z.object({
  id: z.string().min(1),
  careerGoal: z.string().min(2),
  title: z.string().min(2),
  summary: z.string().min(20),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]),
  hoursPerWeek: z.number().positive(),
  targetDuration: z.string().min(1),
  totalEstimatedHours: z.number().positive(),
  phases: z.array(PhaseSchema).min(1),
  careerInsights: CareerInsightsSchema,
  generatedAt: z.string().default(() => new Date().toISOString()),
  isFallback: z.boolean().default(false),
});

export type RoadmapResponse = z.infer<typeof RoadmapResponseSchema>;
