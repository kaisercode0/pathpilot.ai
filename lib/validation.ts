import type { RoadmapRequest, RoadmapResponse } from "./schemas";
import { CAREER_ROLES, type CareerRoleConfig } from "./career-roles";

export interface ValidationResult {
  valid: boolean;
  reason?: string;
  matchedRole?: CareerRoleConfig;
}

/**
 * Finds the matching CareerRoleConfig for a given role ID or user career goal string.
 */
export function findMatchingRole(roleIdOrGoal: string): CareerRoleConfig | undefined {
  if (!roleIdOrGoal) return undefined;
  const inputLower = roleIdOrGoal.toLowerCase().trim();

  // Direct ID lookup
  if (CAREER_ROLES[inputLower]) {
    return CAREER_ROLES[inputLower];
  }

  // Exact ID or title match
  for (const role of Object.values(CAREER_ROLES)) {
    if (
      role.id.toLowerCase() === inputLower ||
      role.title.toLowerCase() === inputLower
    ) {
      return role;
    }
  }

  // Comprehensive Substring & Alias Matching
  if (
    inputLower.includes("cyber") ||
    inputLower.includes("security") ||
    inputLower.includes("soc") ||
    inputLower.includes("infosec") ||
    inputLower.includes("penetration") ||
    inputLower.includes("threat") ||
    inputLower.includes("vulnerability") ||
    inputLower.includes("incident") ||
    inputLower.includes("ethical hack")
  ) {
    return CAREER_ROLES["cybersecurity-analyst"];
  }
  if (inputLower.includes("blockchain") || inputLower.includes("solidity") || inputLower.includes("web3") || inputLower.includes("crypto") || inputLower.includes("smart contract")) {
    return CAREER_ROLES["blockchain-developer"];
  }
  if (inputLower.includes("system admin") || inputLower.includes("sysadmin") || inputLower.includes("linux admin") || inputLower.includes("windows admin")) {
    return CAREER_ROLES["system-administrator"];
  }
  if (inputLower.includes("database admin") || inputLower.includes("dba") || inputLower.includes("sql admin")) {
    return CAREER_ROLES["database-administrator"];
  }
  if (inputLower.includes("game") || inputLower.includes("unity") || inputLower.includes("unreal") || inputLower.includes("gamedev")) {
    return CAREER_ROLES["game-developer"];
  }
  if (inputLower.includes("ui/ux") || inputLower.includes("ux") || inputLower.includes("product design") || inputLower.includes("figma")) {
    return CAREER_ROLES["ui-ux-designer"];
  }
  if (inputLower.includes("graphic") || inputLower.includes("photoshop") || inputLower.includes("illustrator") || inputLower.includes("visual design")) {
    return CAREER_ROLES["graphic-designer"];
  }
  if (inputLower.includes("big data") || inputLower.includes("hadoop") || inputLower.includes("spark")) {
    return CAREER_ROLES["big-data-engineer"];
  }
  if (inputLower.includes("data engineer") || inputLower.includes("etl") || inputLower.includes("data pipeline")) {
    return CAREER_ROLES["data-engineer"];
  }
  if (inputLower.includes("prompt engineer") || inputLower.includes("ai prompt") || inputLower.includes("llm prompt")) {
    return CAREER_ROLES["ai-prompt-engineer"];
  }
  if (inputLower.includes("robotics") || inputLower.includes("ros") || inputLower.includes("mechatronics")) {
    return CAREER_ROLES["robotics-engineer"];
  }
  if (inputLower.includes("firmware") || inputLower.includes("embedded") || inputLower.includes("microcontroller")) {
    return CAREER_ROLES["firmware-engineer"];
  }
  if (inputLower.includes("site reliability") || inputLower.includes("sre") || inputLower.includes("devops") || inputLower.includes("infrastructure")) {
    return CAREER_ROLES["site-reliability-engineer"];
  }
  if (inputLower.includes("computer vision") || inputLower.includes("opencv") || inputLower.includes("image processing")) {
    return CAREER_ROLES["computer-vision-engineer"];
  }
  if (inputLower.includes("nlp") || inputLower.includes("natural language") || inputLower.includes("text mining")) {
    return CAREER_ROLES["nlp-engineer"];
  }
  if (inputLower.includes("marketer") || inputLower.includes("seo") || inputLower.includes("marketing") || inputLower.includes("growth")) {
    return CAREER_ROLES["digital-marketer"];
  }
  if (inputLower.includes("writer") || inputLower.includes("copywriter") || inputLower.includes("content creator")) {
    return CAREER_ROLES["content-writer"];
  }
  if (inputLower.includes("full-stack") || inputLower.includes("full stack") || inputLower.includes("web dev") || inputLower.includes("frontend") || inputLower.includes("backend")) {
    return CAREER_ROLES["full-stack"];
  }
  if (inputLower.includes("ai") || inputLower.includes("machine learning") || inputLower.includes("deep learning") || inputLower.includes("llm")) {
    return CAREER_ROLES["ai-engineer"];
  }
  if (inputLower.includes("animator") || inputLower.includes("blender") || inputLower.includes("3d")) {
    return CAREER_ROLES["animator"];
  }

  return undefined;
}

/**
 * Validates a generated roadmap against the selected career role parameters.
 * Enforces strict domain isolation and checks for anti-technology leakage.
 */
export function validateRoadmapAgainstRole(
  roleIdOrGoal: string,
  roadmap: RoadmapResponse,
  request: RoadmapRequest
): ValidationResult {
  const roleConfig = findMatchingRole(roleIdOrGoal || request.careerGoal);

  if (!roleConfig) {
    return {
      valid: false,
      reason: `Roadmap configuration unavailable for this career (${roleIdOrGoal || request.careerGoal}).`,
    };
  }

  // 1. Basic structural checks
  if (!roadmap.phases || roadmap.phases.length === 0) {
    return { valid: false, reason: "Roadmap is missing learning phases.", matchedRole: roleConfig };
  }

  for (const phase of roadmap.phases) {
    if (!phase.tasks || phase.tasks.length === 0) {
      return { valid: false, reason: `Phase "${phase.title}" contains no learning tasks.`, matchedRole: roleConfig };
    }
  }

  const allText = JSON.stringify(roadmap).toLowerCase();

  // 2. Strict Anti-Leakage Check for forbidden technologies
  if (roleConfig.forbiddenTech && roleConfig.forbiddenTech.length > 0) {
    for (const forbidden of roleConfig.forbiddenTech) {
      const termLower = forbidden.toLowerCase();
      // Escape special regex characters
      const escaped = termLower.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp(`\\b${escaped}\\b`, "i");
      if (pattern.test(allText)) {
        return {
          valid: false,
          reason: `Technology leakage detected: Roadmap for "${roleConfig.title}" contains forbidden concept "${forbidden}".`,
          matchedRole: roleConfig,
        };
      }
    }
  }

  // 3. Domain skills relevance check (must match role domain keywords)
  const roleSkillKeywords = roleConfig.skills.map((s) => s.toLowerCase());
  const roleTechKeywords = roleConfig.technologies.map((t) => t.toLowerCase());
  const combinedDomainKeywords = [...roleSkillKeywords, ...roleTechKeywords];

  let matchesCount = 0;
  for (const kw of combinedDomainKeywords) {
    if (allText.includes(kw)) {
      matchesCount++;
    }
  }

  if (matchesCount < 2) {
    return {
      valid: false,
      reason: `Roadmap lacks core domain skills relevant to "${roleConfig.title}".`,
      matchedRole: roleConfig,
    };
  }

  // 4. Validate Total Hours calculation alignment
  const expectedWeeks =
    request.targetDuration === "1_month"
      ? 4
      : request.targetDuration === "3_months"
      ? 12
      : request.targetDuration === "6_months"
      ? 24
      : 52;

  const expectedTotalHours = expectedWeeks * request.hoursPerWeek;
  if (roadmap.totalEstimatedHours && Math.abs(roadmap.totalEstimatedHours - expectedTotalHours) > expectedTotalHours * 0.4) {
    return {
      valid: false,
      reason: `Calculated roadmap hours (${roadmap.totalEstimatedHours}h) do not match target duration budget (~${expectedTotalHours}h).`,
      matchedRole: roleConfig,
    };
  }

  return { valid: true, matchedRole: roleConfig };
}
