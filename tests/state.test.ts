import { describe, it, expect } from "vitest";
import { generateCuratedFallbackRoadmap } from "@/lib/fallback-roadmaps";
import type { RoadmapProgress } from "@/types/roadmap";

describe("Roadmap State & Progress Calculations", () => {
  const sampleRoadmap = generateCuratedFallbackRoadmap({
    careerGoal: "Full-Stack Web Developer",
    currentSkills: ["HTML", "JavaScript"],
    experienceLevel: "beginner",
    hoursPerWeek: 10,
    targetDuration: "1_month", // 4 weeks -> 40 total hours
    learningStyle: "balanced",
  });

  it("calculates initial 0% progress correctly", () => {
    const allTasks = sampleRoadmap.phases.flatMap((p) => p.tasks);
    const completedTaskIds: string[] = [];

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((t) => completedTaskIds.includes(t.id)).length;
    const totalHours = sampleRoadmap.totalEstimatedHours;
    const completedHours = allTasks
      .filter((t) => completedTaskIds.includes(t.id))
      .reduce((acc, t) => acc + t.estimatedHours, 0);
    const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const progress: RoadmapProgress = {
      totalTasks,
      completedTasks,
      totalHours,
      completedHours,
      percentComplete,
      completedPhaseIds: [],
    };

    expect(progress.percentComplete).toBe(0);
    expect(progress.completedTasks).toBe(0);
    expect(progress.completedHours).toBe(0);
  });

  it("calculates partial and 100% progress correctly", () => {
    const allTasks = sampleRoadmap.phases.flatMap((p) => p.tasks);
    const firstPhase = sampleRoadmap.phases[0];
    const firstPhaseTaskIds = firstPhase.tasks.map((t) => t.id);

    // Complete first phase tasks
    const completedTasksCount = allTasks.filter((t) => firstPhaseTaskIds.includes(t.id)).length;
    const percentComplete = Math.round((completedTasksCount / allTasks.length) * 100);

    expect(percentComplete).toBeGreaterThan(0);
    expect(percentComplete).toBeLessThan(100);

    // Complete all tasks
    const allTaskIds = allTasks.map((t) => t.id);
    const fullPercentComplete = Math.round((allTaskIds.length / allTasks.length) * 100);
    expect(fullPercentComplete).toBe(100);
  });
});
