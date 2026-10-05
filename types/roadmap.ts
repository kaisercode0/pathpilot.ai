import type {
  RoadmapRequest,
  RoadmapResponse,
  Phase,
  Task,
  Resource,
  MilestoneProject,
  CareerInsights,
} from "@/lib/schemas";
import { CAREER_ROLES, type RoleFilterCategory } from "@/lib/career-roles";

export type {
  RoadmapRequest,
  RoadmapResponse,
  Phase,
  Task,
  Resource,
  MilestoneProject,
  CareerInsights,
};

export type FilterCategory = "all" | "concept" | "project" | "practice" | "reading";
export type FilterStatus = "all" | "incomplete" | "completed";

export interface RoadmapProgress {
  totalTasks: number;
  completedTasks: number;
  totalHours: number;
  completedHours: number;
  percentComplete: number;
  completedPhaseIds: string[];
}

export interface CareerPreset {
  id: string;
  name: string;
  careerGoal: string;
  category: "technical" | "non-technical";
  filterCategory: RoleFilterCategory;
  suggestedSkills: string[];
  tools: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  hoursPerWeek: number;
  targetDuration: "1_month" | "3_months" | "6_months" | "12_months";
  learningStyle: "project_based" | "theory_first" | "balanced" | "certification";
  description: string;
  badge: string;
  iconName: "code" | "cpu" | "cloud" | "database" | "shield" | "sparkles" | "design" | "marketing" | "bot" | "writer";
  totalEstimatedHours: number;
}

export const CAREER_PRESETS: CareerPreset[] = Object.values(CAREER_ROLES).map((role) => {
  let iconName: CareerPreset["iconName"] = "sparkles";
  if (role.filterCategory === "cybersecurity") iconName = "shield";
  else if (role.filterCategory === "infrastructure") iconName = "cloud";
  else if (role.filterCategory === "ai-data") iconName = "cpu";
  else if (role.filterCategory === "software") iconName = "code";
  else if (role.filterCategory === "design") iconName = "design";
  else if (role.filterCategory === "hardware-robotics") iconName = "bot";
  else if (role.filterCategory === "marketing-content") iconName = "marketing";

  return {
    id: role.id,
    name: role.title,
    careerGoal: role.title,
    category: role.category,
    filterCategory: role.filterCategory,
    suggestedSkills: role.skills.slice(0, 4),
    tools: role.tools,
    experienceLevel: role.defaultDifficulty,
    hoursPerWeek: role.weeklyHours,
    targetDuration: role.recommendedDuration,
    learningStyle: role.filterCategory === "cybersecurity" ? "certification" : "balanced",
    description: role.description,
    badge: role.category === "technical" ? "Technical" : "Non-Technical",
    iconName,
    totalEstimatedHours: role.totalEstimatedHours,
  };
});
