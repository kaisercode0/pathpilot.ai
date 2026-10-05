import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/roadmap/route";
import { GET as getHealth } from "@/app/api/health/route";
import { GET as getCareers } from "@/app/api/careers/route";
import { GET as getCareerById } from "@/app/api/careers/[id]/route";
import { GET as getResources } from "@/app/api/resources/route";
import { GET as getRoadmapById } from "@/app/api/roadmap/[id]/route";
import { POST as postFeedback } from "@/app/api/roadmap/[id]/feedback/route";
import { NextRequest } from "next/server";

describe("API Route Handler: /api/roadmap", () => {
  it("returns 200 with curated domain fallback when API key is unconfigured", async () => {
    const validBody = {
      careerGoal: "Cybersecurity & Security Operations Analyst",
      currentSkills: ["Networking", "Linux"],
      experienceLevel: "beginner",
      hoursPerWeek: 12,
      targetDuration: "6_months",
      learningStyle: "certification",
    };

    const req = new NextRequest("http://localhost:3000/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.careerGoal).toBe("Cybersecurity & Security Operations Analyst");
    expect(json.isFallback).toBe(true);
    expect(json.phases).toBeInstanceOf(Array);
    expect(json.phases.length).toBe(6);

    const allText = JSON.stringify(json).toLowerCase();
    expect(allText).toContain("siem");
    expect(allText).not.toContain("react");
  });

  it("returns 400 Bad Request with clean error object when missing required fields", async () => {
    const invalidBody = {
      careerGoal: "", // invalid empty goal
      currentSkills: [],
      hoursPerWeek: -5,
    };

    const req = new NextRequest("http://localhost:3000/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(invalidBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("INVALID_INPUT");
    expect(json.error.message).toBeDefined();
  });

  it("generates career-specific offline demo roadmaps for requested careers", async () => {
    const targetCareers = [
      { goal: "Cybersecurity & Security Operations Analyst", keyword: "siem", forbidden: "react" },
      { goal: "Blockchain Developer", keyword: "solidity", forbidden: "opencv" },
      { goal: "System Administrator", keyword: "active directory", forbidden: "react" },
      { goal: "Database Administrator", keyword: "postgresql", forbidden: "figma" },
      { goal: "Game Developer", keyword: "unity", forbidden: "solidity" },
      { goal: "UI/UX Designer", keyword: "figma", forbidden: "solidity" },
      { goal: "Graphic Designer", keyword: "illustrator", forbidden: "solidity" },
      { goal: "Computer Vision Engineer", keyword: "opencv", forbidden: "react" },
      { goal: "NLP Engineer", keyword: "transformers", forbidden: "unity" },
      { goal: "Digital Marketer", keyword: "seo", forbidden: "python" },
      { goal: "Content Writer", keyword: "copywriting", forbidden: "python" },
      { goal: "Animator", keyword: "blender", forbidden: "solidity" },
    ];

    for (const career of targetCareers) {
      const req = new NextRequest("http://localhost:3000/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          careerGoal: career.goal,
          currentSkills: ["Basic Foundation"],
          experienceLevel: "beginner",
          hoursPerWeek: 12,
          targetDuration: "6_months",
          learningStyle: "balanced",
        }),
      });

      const res = await POST(req);
      expect(res.status).toBe(200);

      const json = await res.json();
      expect(json.isFallback).toBe(true);
      const text = JSON.stringify(json).toLowerCase();
      expect(text).toContain(career.keyword);
      expect(text).not.toContain(career.forbidden);
    }
  });
});

describe("API Route Handlers: Additional endpoints", () => {
  it("GET /api/health returns system health status", async () => {
    const res = await getHealth();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.status).toBe("ok");
    expect(json.database).toBeDefined();
    expect(json.ai).toBeDefined();
  });

  it("GET /api/careers returns all 20 supported career roles", async () => {
    const res = await getCareers();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.careers.length).toBeGreaterThanOrEqual(20);
  });

  it("GET /api/careers/[id] returns details for a valid career role ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/careers/blockchain-developer");
    const params = Promise.resolve({ id: "blockchain-developer" });
    const res = await getCareerById(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.career.id).toBe("blockchain-developer");
  });

  it("GET /api/careers/[id] returns 404 for an invalid role ID", async () => {
    const req = new NextRequest("http://localhost:3000/api/careers/nonexistent-role-xyz");
    const params = Promise.resolve({ id: "nonexistent-role-xyz" });
    const res = await getCareerById(req, { params });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error.code).toBe("NOT_FOUND");
  });

  it("GET /api/resources returns free learning resources", async () => {
    const res = await getResources();
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.resources.length).toBeGreaterThan(0);
  });

  it("GET /api/roadmap/[id] handles requests for missing roadmap IDs", async () => {
    const req = new NextRequest("http://localhost:3000/api/roadmap/missing-id-123");
    const params = Promise.resolve({ id: "missing-id-123" });
    const res = await getRoadmapById(req, { params });
    expect(res.status).toBe(404);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("POST /api/roadmap/[id]/feedback accepts rating and feedback", async () => {
    const req = new NextRequest("http://localhost:3000/api/roadmap/test-roadmap-id/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 5, feedback: "Great roadmap!" }),
    });
    const params = Promise.resolve({ id: "test-roadmap-id" });
    const res = await postFeedback(req, { params });
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
