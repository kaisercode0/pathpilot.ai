import { CAREER_ROLES } from "../lib/career-roles";
import { findMatchingRole, validateRoadmapAgainstRole } from "../lib/validation";
import { generateCuratedFallbackRoadmap } from "../lib/fallback-roadmaps";
import { RoadmapRequest } from "../lib/schemas";

const rolesToTest = [
  "cybersecurity-analyst",
  "blockchain-developer",
  "system-administrator",
  "database-administrator",
  "game-developer",
  "ui-ux-designer",
  "graphic-designer",
  "data-engineer",
  "ai-prompt-engineer",
  "robotics-engineer",
  "firmware-engineer",
  "site-reliability-engineer",
  "big-data-engineer",
  "computer-vision-engineer",
  "nlp-engineer",
  "digital-marketer",
  "content-writer",
  "animator"
];

console.log("=== CHECKING ALL 18 ROLES ===");
let passed = 0;
let failed = 0;

for (const roleId of rolesToTest) {
  const config = CAREER_ROLES[roleId];
  if (!config) {
    console.error(`❌ [FAIL] Missing config for ${roleId}`);
    failed++;
    continue;
  }

  const req: RoadmapRequest = {
    careerGoal: config.title,
    currentSkills: ["General Computer Literacy"],
    experienceLevel: "beginner",
    hoursPerWeek: 12,
    targetDuration: "6_months",
    learningStyle: "balanced"
  };

  try {
    const roadmap = generateCuratedFallbackRoadmap(req);
    const validation = validateRoadmapAgainstRole(roleId, roadmap, req);
    if (validation.valid) {
      console.log(`✅ [PASS] ${roleId} -> "${roadmap.title}" (${roadmap.phases.length} phases, ${roadmap.totalEstimatedHours}h)`);
      passed++;
    } else {
      console.error(`❌ [FAIL] ${roleId} validation failed: ${validation.reason}`);
      failed++;
    }
  } catch (err: any) {
    console.error(`❌ [FAIL] ${roleId} error: ${err.message}`);
    failed++;
  }
}

console.log(`\nSummary: ${passed} passed, ${failed} failed.`);
