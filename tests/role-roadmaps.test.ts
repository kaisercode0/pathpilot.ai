import { describe, test, expect } from "vitest";
import { generateCuratedFallbackRoadmap } from "../lib/fallback-roadmaps";
import { validateRoadmapAgainstRole } from "../lib/validation";
import { CAREER_ROLES } from "../lib/career-roles";
import type { RoadmapRequest, RoadmapResponse } from "../lib/schemas";

describe("Role-Specific Roadmap Engine & Anti-Leakage Validation", () => {
  test("All 18+ career roles exist in CAREER_ROLES dictionary", () => {
    const requiredRoleIds = [
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
      "animator",
    ];

    for (const roleId of requiredRoleIds) {
      expect(CAREER_ROLES[roleId]).toBeDefined();
      expect(CAREER_ROLES[roleId].id).toBe(roleId);
      expect(CAREER_ROLES[roleId].phases.length).toBeGreaterThanOrEqual(3);
    }
  });

  // 1. Cybersecurity Analyst Test
  test("Cybersecurity Analyst → generates security roadmap without React/Next.js/TypeScript leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "Cybersecurity & Security Operations Analyst",
      currentSkills: ["Networking", "Linux", "Bash"],
      experienceLevel: "beginner",
      hoursPerWeek: 12,
      targetDuration: "6_months",
      learningStyle: "certification",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("Cybersecurity");

    const allText = JSON.stringify(roadmap).toLowerCase();

    // Check required security concepts
    expect(allText).toContain("siem");
    expect(allText).toContain("linux");
    expect(allText).toContain("tcp/ip");
    expect(allText).toContain("vulnerability");
    expect(allText).toContain("security operations center");

    // Check anti-leakage: MUST NOT contain web dev frameworks
    expect(allText).not.toContain("react");
    expect(allText).not.toContain("next.js");
    expect(allText).not.toContain("prisma");
    expect(allText).not.toContain("drizzle");

    const validation = validateRoadmapAgainstRole("cybersecurity-analyst", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 2. Data Engineer Test
  test("Data Engineer → generates data pipeline roadmap without Unity/Solidity/Figma leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "Data Engineer",
      currentSkills: ["Python", "SQL"],
      experienceLevel: "intermediate",
      hoursPerWeek: 12,
      targetDuration: "6_months",
      learningStyle: "project_based",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("Data Engineer");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("airflow");
    expect(allText).toContain("spark");
    expect(allText).toContain("etl");
    expect(allText).toContain("star schema");

    // Anti-leakage checks
    expect(allText).not.toContain("unity");
    expect(allText).not.toContain("solidity");
    expect(allText).not.toContain("figma");

    const validation = validateRoadmapAgainstRole("data-engineer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 3. Computer Vision Engineer Test
  test("Computer Vision Engineer → generates PyTorch/OpenCV roadmap without web dev leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "Computer Vision Engineer",
      currentSkills: ["Python", "NumPy"],
      experienceLevel: "intermediate",
      hoursPerWeek: 15,
      targetDuration: "6_months",
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("Computer Vision");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("opencv");
    expect(allText).toContain("pytorch");
    expect(allText).toContain("cnn");
    expect(allText).toContain("yolo");

    expect(allText).not.toContain("react");
    expect(allText).not.toContain("prisma");
    expect(allText).not.toContain("solidity");

    const validation = validateRoadmapAgainstRole("computer-vision-engineer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 4. NLP Engineer Test
  test("NLP Engineer → generates HuggingFace/BERT/RAG roadmap without game dev leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "NLP Engineer",
      currentSkills: ["Python", "Machine Learning"],
      experienceLevel: "intermediate",
      hoursPerWeek: 15,
      targetDuration: "6_months",
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("NLP Engineer");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("hugging face");
    expect(allText).toContain("transformers");
    expect(allText).toContain("bert");
    expect(allText).toContain("tokenization");

    expect(allText).not.toContain("unity");
    expect(allText).not.toContain("unreal");
    expect(allText).not.toContain("solidity");

    const validation = validateRoadmapAgainstRole("nlp-engineer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 5. Blockchain Developer Test
  test("Blockchain Developer → generates Solidity/Web3 roadmap without vision/SIEM leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "Blockchain Developer",
      currentSkills: ["JavaScript", "Git"],
      experienceLevel: "intermediate",
      hoursPerWeek: 12,
      targetDuration: "6_months",
      learningStyle: "project_based",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("Blockchain Developer");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("solidity");
    expect(allText).toContain("smart contracts");
    expect(allText).toContain("ethereum");
    expect(allText).toContain("hardhat");

    expect(allText).not.toContain("opencv");
    expect(allText).not.toContain("siem");
    expect(allText).not.toContain("splunk");

    const validation = validateRoadmapAgainstRole("blockchain-developer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 6. UI/UX Designer Test
  test("UI/UX Designer → generates Figma/Wireframing roadmap without backend code leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "UI/UX Designer",
      currentSkills: ["Design Thinking"],
      experienceLevel: "beginner",
      hoursPerWeek: 10,
      targetDuration: "6_months",
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("UI/UX Designer");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("figma");
    expect(allText).toContain("wireframing");
    expect(allText).toContain("user research");
    expect(allText).toContain("prototyping");

    expect(allText).not.toContain("solidity");
    expect(allText).not.toContain("c++");
    expect(allText).not.toContain("kubernetes");

    const validation = validateRoadmapAgainstRole("ui-ux-designer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 7. System Administrator Test
  test("System Administrator → generates Linux/Windows Server roadmap without frontend framework leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "System Administrator",
      currentSkills: ["Linux", "Networking"],
      experienceLevel: "beginner",
      hoursPerWeek: 10,
      targetDuration: "6_months",
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("System Administrator");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("linux");
    expect(allText).toContain("windows server");
    expect(allText).toContain("active directory");
    expect(allText).toContain("powershell");

    expect(allText).not.toContain("react");
    expect(allText).not.toContain("next.js");
    expect(allText).not.toContain("solidity");

    const validation = validateRoadmapAgainstRole("system-administrator", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // 8. Digital Marketer Test
  test("Digital Marketer → generates SEO/GA4 marketing roadmap without code leakage", () => {
    const request: RoadmapRequest = {
      careerGoal: "Digital Marketer",
      currentSkills: ["Social Media"],
      experienceLevel: "beginner",
      hoursPerWeek: 10,
      targetDuration: "3_months",
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.title).toContain("Digital Marketer");

    const allText = JSON.stringify(roadmap).toLowerCase();

    expect(allText).toContain("seo");
    expect(allText).toContain("google analytics 4");
    expect(allText).toContain("content marketing");
    expect(allText).toContain("copywriting");

    expect(allText).not.toContain("python");
    expect(allText).not.toContain("c++");
    expect(allText).not.toContain("solidity");

    const validation = validateRoadmapAgainstRole("digital-marketer", roadmap, request);
    expect(validation.valid).toBe(true);
  });

  // Dynamic Workload Calculation Test
  test("Dynamic Workload Calculation scales hours according to targetDuration and hoursPerWeek", () => {
    const request: RoadmapRequest = {
      careerGoal: "Robotics Engineer",
      currentSkills: ["Math", "Physics"],
      experienceLevel: "intermediate",
      hoursPerWeek: 15,
      targetDuration: "6_months", // 24 weeks * 15 hrs = 360 hours
      learningStyle: "balanced",
    };

    const roadmap = generateCuratedFallbackRoadmap(request);
    expect(roadmap.totalEstimatedHours).toBe(360);
  });

  // Role Configuration Unavailable Error Test
  test("Returns clear error when role configuration is unavailable for unconfigured careers", () => {
    const request: RoadmapRequest = {
      careerGoal: "Astronaut Rocket Driver Specialist 99",
      currentSkills: ["Physics"],
      experienceLevel: "beginner",
      hoursPerWeek: 10,
      targetDuration: "3_months",
      learningStyle: "balanced",
    };

    expect(() => generateCuratedFallbackRoadmap(request)).toThrow(
      'Roadmap configuration unavailable for this career ("Astronaut Rocket Driver Specialist 99").'
    );

    const validation = validateRoadmapAgainstRole("Astronaut Rocket Driver Specialist 99", {} as RoadmapResponse, request);
    expect(validation.valid).toBe(false);
    expect(validation.reason).toContain("Roadmap configuration unavailable");
  });
});
