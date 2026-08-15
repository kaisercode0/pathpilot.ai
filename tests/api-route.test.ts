import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/roadmap/route";
import { NextRequest } from "next/server";

describe("API Route Handler: /api/roadmap", () => {
  it("returns 200 with structured roadmap for valid request", async () => {
    const validBody = {
      careerGoal: "Full-Stack Web Developer",
      currentSkills: ["HTML", "JavaScript"],
      experienceLevel: "beginner",
      hoursPerWeek: 15,
      targetDuration: "3_months",
      learningStyle: "balanced",
    };

    const req = new NextRequest("http://localhost:3000/api/roadmap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.careerGoal).toBe("Full-Stack Web Developer");
    expect(json.phases).toBeInstanceOf(Array);
    expect(json.phases.length).toBeGreaterThanOrEqual(1);
    expect(json.totalEstimatedHours).toBe(15 * 12);
  });

  it("returns 400 Bad Request when missing required fields", async () => {
    const invalidBody = {
      careerGoal: "A", // too short (min 2 chars)
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
    expect(json.error).toBe("Validation failed");
    expect(json.fieldErrors).toBeDefined();
  });
});
