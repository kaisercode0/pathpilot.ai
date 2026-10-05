import { z } from "zod";

/**
 * Flexible & robust schema for the user's roadmap generation request.
 * Supports both "goal" and "careerGoal" parameters, string array or CSV skills,
 * and standard duration formats ("6 months" or "6_months").
 */
export const RoadmapRequestSchema = z
  .object({
    goal: z.string().optional(),
    careerGoal: z.string().optional(),
    currentSkills: z
      .array(z.string())
      .or(
        z.string().transform((val) =>
          val
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      )
      .optional()
      .default([]),
    experienceLevel: z.enum(["beginner", "intermediate", "advanced"], {
      error: "Experience level must be beginner, intermediate, or advanced",
    }),
    hoursPerWeek: z
      .number({ error: "Hours per week must be a number" })
      .min(2, "Must commit at least 2 hours per week")
      .max(80, "Weekly commitment cannot exceed 80 hours"),
    targetDuration: z.string().min(1, "Target duration must not be empty"),
    learningStyle: z
      .enum(["project_based", "theory_first", "balanced", "certification"], {
        error: "Please select a valid learning style",
      })
      .optional()
      .default("balanced"),
  })
  .transform((data) => {
    const rawGoal = (data.goal || data.careerGoal || "").trim();
    let duration = data.targetDuration.trim();

    const lowerDur = duration.toLowerCase();
    if (lowerDur === "1 month" || lowerDur === "1_month" || lowerDur === "1m") {
      duration = "1_month";
    } else if (lowerDur === "3 months" || lowerDur === "3_months" || lowerDur === "3m") {
      duration = "3_months";
    } else if (lowerDur === "6 months" || lowerDur === "6_months" || lowerDur === "6m") {
      duration = "6_months";
    } else if (
      lowerDur === "12 months" ||
      lowerDur === "12_months" ||
      lowerDur === "1 year" ||
      lowerDur === "1_year" ||
      lowerDur === "12m"
    ) {
      duration = "12_months";
    }

    return {
      ...data,
      goal: rawGoal,
      careerGoal: rawGoal,
      targetDuration: duration,
    };
  })
  .refine((data) => data.careerGoal.length >= 2, {
    message: "Career goal must be at least 2 characters",
    path: ["careerGoal"],
  });

export type RoadmapRequest = {
  goal?: string;
  careerGoal: string;
  currentSkills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  hoursPerWeek: number;
  targetDuration: string;
  learningStyle?: "project_based" | "theory_first" | "balanced" | "certification";
};

/**
 * Schema for an external learning resource.
 */
export const ResourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().min(1),
  type: z.enum(["doc", "tutorial", "video", "interactive", "book", "course", "repo"]),
  isFree: z.boolean().default(true),
  provider: z.string().optional().default("Official Resource"),
  whyUseful: z.string().optional(),
  recommendedOrder: z.number().optional(),
  status: z.enum(["FREE", "FREEMIUM", "PAID"]).optional().default("FREE"),
});

export type Resource = z.infer<typeof ResourceSchema>;

/**
 * Schema for a single task within a roadmap phase.
 */
export const TaskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(2),
  description: z.string().min(5),
  estimatedHours: z.number().min(0.1).max(100),
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

/**
 * Validates whether a generated roadmap is relevant to the requested career goal.
 */
export function validateRoadmapRelevance(
  roadmap: RoadmapResponse,
  request: RoadmapRequest
): { valid: boolean; reason?: string } {
  if (!roadmap.phases || roadmap.phases.length === 0) {
    return { valid: false, reason: "Roadmap is missing phases." };
  }

  for (const phase of roadmap.phases) {
    if (!phase.tasks || phase.tasks.length === 0) {
      return { valid: false, reason: `Phase "${phase.title}" has no tasks.` };
    }
  }

  const requestedGoalLower = (request.careerGoal || request.goal || "").toLowerCase();
  const allText = JSON.stringify(roadmap).toLowerCase();

  // Cybersecurity relevance checks
  const isCybersecurity =
    requestedGoalLower.includes("cyber") ||
    requestedGoalLower.includes("security") ||
    requestedGoalLower.includes("soc") ||
    requestedGoalLower.includes("infosec") ||
    requestedGoalLower.includes("penetration") ||
    requestedGoalLower.includes("threat") ||
    requestedGoalLower.includes("vulnerability") ||
    requestedGoalLower.includes("incident") ||
    requestedGoalLower.includes("ethical hack");

  if (isCybersecurity) {
    const webDevMatches = (
      allText.match(/\b(react|next\.js|prisma|drizzle|wcag|vue|angular|full-stack)\b/g) || []
    ).length;

    if (webDevMatches >= 1) {
      return {
        valid: false,
        reason:
          "Generated roadmap contains software engineering / web framework topics that do not match Cybersecurity.",
      };
    }

    const domainMatches = (
      allText.match(/\b(networking|tcp\/ip|dns|linux|security|siem|splunk|log|threat|vulnerability|incident|mitre|owasp|wireshark|nmap)\b/g) || []
    ).length;

    if (domainMatches < 2) {
      return {
        valid: false,
        reason: "Generated roadmap lacks required Cybersecurity core topics.",
      };
    }
  }

  return { valid: true };
}
