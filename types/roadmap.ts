import type {
  RoadmapRequest,
  RoadmapResponse,
  Phase,
  Task,
  Resource,
  MilestoneProject,
  CareerInsights,
} from "@/lib/schemas";

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
  suggestedSkills: string[];
  experienceLevel: "beginner" | "intermediate" | "advanced";
  hoursPerWeek: number;
  targetDuration: "1_month" | "3_months" | "6_months" | "12_months";
  learningStyle: "project_based" | "theory_first" | "balanced" | "certification";
  description: string;
  badge: string;
  iconName: "code" | "cpu" | "cloud" | "database" | "shield" | "sparkles";
}

export const CAREER_PRESETS: CareerPreset[] = [
  {
    id: "full-stack",
    name: "Full-Stack Web Developer",
    careerGoal: "Full-Stack Web Developer (Next.js & TypeScript)",
    suggestedSkills: ["Basic HTML/CSS", "JavaScript Fundamentals", "Git"],
    experienceLevel: "beginner",
    hoursPerWeek: 15,
    targetDuration: "3_months",
    learningStyle: "project_based",
    description: "Master modern frontend, serverless backends, relational databases, and end-to-end full-stack architectures.",
    badge: "Most Popular",
    iconName: "code",
  },
  {
    id: "ai-engineer",
    name: "AI & LLM Application Engineer",
    careerGoal: "AI Application Engineer (LLMs, LangChain, RAG)",
    suggestedSkills: ["Python", "Basic APIs", "Linear Algebra basics"],
    experienceLevel: "intermediate",
    hoursPerWeek: 12,
    targetDuration: "3_months",
    learningStyle: "project_based",
    description: "Build production AI apps with vector databases, embeddings, retrieval augmented generation, and agentic workflows.",
    badge: "High Growth",
    iconName: "cpu",
  },
  {
    id: "cloud-devops",
    name: "Cloud & DevOps Engineer",
    careerGoal: "Cloud DevOps & Platform Engineer",
    suggestedSkills: ["Linux CLI", "Basic Networking", "Python or Go basics"],
    experienceLevel: "intermediate",
    hoursPerWeek: 10,
    targetDuration: "6_months",
    learningStyle: "balanced",
    description: "Learn infrastructure as code, container orchestration with Kubernetes, CI/CD pipelines, and AWS/GCP cloud services.",
    badge: "In Demand",
    iconName: "cloud",
  },
  {
    id: "data-scientist",
    name: "Data Scientist & Analyst",
    careerGoal: "Data Scientist & Analytics Engineer",
    suggestedSkills: ["Python", "SQL", "Statistics 101"],
    experienceLevel: "beginner",
    hoursPerWeek: 10,
    targetDuration: "3_months",
    learningStyle: "balanced",
    description: "Derive actionable intelligence with Pandas, NumPy, SQL data warehouses, statistical modeling, and interactive dashboards.",
    badge: "High Value",
    iconName: "database",
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Analyst",
    careerGoal: "Cybersecurity & Security Operations Analyst",
    suggestedSkills: ["Computer Networking", "Operating Systems", "Bash/Python"],
    experienceLevel: "beginner",
    hoursPerWeek: 12,
    targetDuration: "6_months",
    learningStyle: "certification",
    description: "Master threat detection, vulnerability analysis, SIEM log triage, network security, and security compliance frameworks.",
    badge: "Critical Role",
    iconName: "shield",
  },
];
