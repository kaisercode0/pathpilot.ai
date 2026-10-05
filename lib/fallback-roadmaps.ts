import type { RoadmapRequest, RoadmapResponse, Task, Phase } from "./schemas";
import { findMatchingRole, validateRoadmapAgainstRole } from "./validation";

/**
 * Generates a career-specific curated fallback roadmap when live AI generation is unavailable or fails.
 * Guarantees domain-aligned curricula without resorting to generic software development templates.
 */
export function generateCuratedFallbackRoadmap(request: RoadmapRequest): RoadmapResponse {
  const roleConfig = findMatchingRole(request.careerGoal);

  if (!roleConfig) {
    throw new Error(`Roadmap configuration unavailable for this career ("${request.careerGoal}").`);
  }

  const weeks =
    request.targetDuration === "1_month"
      ? 4
      : request.targetDuration === "3_months"
      ? 12
      : request.targetDuration === "6_months"
      ? 24
      : 52;

  const totalCalculatedHours = weeks * request.hoursPerWeek;

  const durationFormatted =
    request.targetDuration === "1_month"
      ? "1 Month (Sprint)"
      : request.targetDuration === "3_months"
      ? "3 Months (Standard)"
      : request.targetDuration === "6_months"
      ? "6 Months (In-Depth)"
      : "1 Year (Comprehensive)";

  const currentSkillsList = Array.isArray(request.currentSkills)
    ? request.currentSkills.join(", ")
    : request.currentSkills;

  // Build phases dynamically from roleConfig.phases
  const phases: Phase[] = roleConfig.phases.map((phaseTemplate, idx) => {
    const phaseHours = Math.max(2, Math.round(totalCalculatedHours * phaseTemplate.hourPercentage));
    const phaseWeeks = Math.max(1, Math.round(weeks * phaseTemplate.hourPercentage));
    const taskIdBase = `task-${roleConfig.id}-${idx + 1}`;

    // Tasks breakdown
    const tasks: Task[] = [
      {
        id: `${taskIdBase}-1`,
        title: `${phaseTemplate.title}: Core Domain Concepts`,
        description: `Study and master key modules: ${phaseTemplate.modules.slice(0, 3).join(", ")}.`,
        estimatedHours: Math.max(1, Math.round(phaseHours * 0.4)),
        category: "concept",
        skillsCovered: phaseTemplate.skillsCovered.slice(0, 3),
        resources: phaseTemplate.resources.map((res) => ({
          title: res.title,
          url: res.url,
          type: res.type,
          isFree: res.status === "FREE",
          provider: res.provider,
          whyUseful: res.whyUseful,
          recommendedOrder: res.recommendedOrder,
          status: res.status,
        })),
        tips: `Focus on mastering ${phaseTemplate.skillsCovered[0] || "core concepts"} before moving forward.`,
        completed: false,
      },
      {
        id: `${taskIdBase}-2`,
        title: `Practical Task: ${phaseTemplate.practicalTask.title}`,
        description: phaseTemplate.practicalTask.description,
        estimatedHours: Math.max(1, Math.round(phaseHours * 0.35)),
        category: "practice",
        skillsCovered: phaseTemplate.skillsCovered,
        resources: phaseTemplate.resources.slice(0, 2).map((res) => ({
          title: res.title,
          url: res.url,
          type: res.type,
          isFree: res.status === "FREE",
          provider: res.provider,
          whyUseful: res.whyUseful,
          recommendedOrder: res.recommendedOrder,
          status: res.status,
        })),
        tips: "Document your practical steps in your portfolio notes.",
        completed: false,
      },
      {
        id: `${taskIdBase}-3`,
        title: `Milestone Deliverable: ${phaseTemplate.milestoneProject.title}`,
        description: phaseTemplate.milestoneProject.description,
        estimatedHours: Math.max(1, Math.round(phaseHours * 0.25)),
        category: "project",
        skillsCovered: phaseTemplate.skillsCovered,
        resources: [],
        tips: `Deliverables: ${phaseTemplate.milestoneProject.deliverables.join("; ")}.`,
        completed: false,
      },
    ];

    return {
      id: `phase-${roleConfig.id}-${idx + 1}`,
      phaseNumber: idx + 1,
      title: phaseTemplate.title,
      description: phaseTemplate.description,
      estimatedWeeks: phaseWeeks,
      estimatedHours: phaseHours,
      milestoneProject: {
        title: phaseTemplate.milestoneProject.title,
        description: phaseTemplate.milestoneProject.description,
        deliverables: phaseTemplate.milestoneProject.deliverables,
        estimatedHours: Math.max(1, Math.round(phaseHours * 0.25)),
      },
      tasks,
    };
  });

  const response: RoadmapResponse = {
    id: `roadmap-${roleConfig.id}-${Date.now()}`,
    careerGoal: request.careerGoal,
    title: `${roleConfig.title} Roadmap`,
    summary: `A specialized learning path for ${roleConfig.title}, tailored for ${request.experienceLevel} level at ${request.hoursPerWeek} hrs/week over ${durationFormatted}. Building on your background (${currentSkillsList || "prerequisites"}) towards ${roleConfig.careerOutcomes.jobTitles[0]}.`,
    experienceLevel: request.experienceLevel,
    hoursPerWeek: request.hoursPerWeek,
    targetDuration: durationFormatted,
    totalEstimatedHours: totalCalculatedHours,
    isFallback: true,
    generatedAt: new Date().toISOString(),
    phases,
    careerInsights: {
      inDemandSkills: roleConfig.careerOutcomes.inDemandSkills,
      recommendedCertifications: roleConfig.certifications || [],
      portfolioTips: roleConfig.portfolioProjects,
      interviewPrepFocus: roleConfig.careerOutcomes.prepFocus,
      potentialJobTitles: roleConfig.careerOutcomes.jobTitles,
    },
  };

  // Perform validation check
  const validation = validateRoadmapAgainstRole(roleConfig.id, response, request);
  if (!validation.valid) {
    throw new Error(`Curated fallback roadmap failed validation: ${validation.reason}`);
  }

  return response;
}
