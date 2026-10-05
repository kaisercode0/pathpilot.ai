import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { RoadmapForm } from "@/components/RoadmapForm";
import { TaskItem } from "@/components/TaskItem";
import { ProgressOverview } from "@/components/ProgressOverview";
import { ErrorMessage } from "@/components/ErrorMessage";
import { DashboardView } from "@/components/DashboardView";
import type { Task } from "@/lib/schemas";
import type { RoadmapProgress } from "@/types/roadmap";

describe("UI Components Tests", () => {
  describe("RoadmapForm Component", () => {
    it("renders all form fields with accessible labels", () => {
      const onSubmit = vi.fn();
      render(<RoadmapForm onSubmit={onSubmit} isLoading={false} />);

      expect(screen.getByLabelText(/Target Career Goal/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Current Skills & Prerequisites/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Available Time per Week/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Target Timeline/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Generate Career Roadmap/i })).toBeInTheDocument();
    });

    it("displays validation error when submitted empty", () => {
      const onSubmit = vi.fn();
      render(<RoadmapForm onSubmit={onSubmit} isLoading={false} />);

      const submitButton = screen.getByRole("button", { name: /Generate Career Roadmap/i });
      fireEvent.click(submitButton);

      expect(onSubmit).not.toHaveBeenCalled();
      expect(screen.getByText(/Career goal must be at least 2 characters/i)).toBeInTheDocument();
    });

    it("calls onSubmit when valid data is entered", () => {
      const onSubmit = vi.fn();
      render(<RoadmapForm onSubmit={onSubmit} isLoading={false} />);

      fireEvent.change(screen.getByLabelText(/Target Career Goal/i), {
        target: { value: "Frontend Engineer" },
      });
      fireEvent.change(screen.getByLabelText(/Current Skills & Prerequisites/i), {
        target: { value: "HTML, CSS, JS" },
      });

      const submitButton = screen.getByRole("button", { name: /Generate Career Roadmap/i });
      fireEvent.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          careerGoal: "Frontend Engineer",
          currentSkills: ["HTML", "CSS", "JS"],
        })
      );
    });
  });

  describe("TaskItem Component", () => {
    const sampleTask: Task = {
      id: "task-test-1",
      title: "Learn TypeScript Interfaces",
      description: "Understand object shapes, structural typing, and extending interfaces.",
      estimatedHours: 4,
      category: "concept",
      skillsCovered: ["TypeScript", "Interfaces"],
      resources: [
        {
          title: "TS Handbook Interfaces",
          url: "https://www.typescriptlang.org",
          type: "doc",
          isFree: true,
          provider: "TypeScript",
          status: "FREE",
        },
      ],
      tips: "Use interfaces when designing public API contracts.",
      completed: false,
    };

    it("renders task details and category badge", () => {
      const onToggle = vi.fn();
      render(<TaskItem task={sampleTask} isCompleted={false} onToggle={onToggle} />);

      expect(screen.getByText("Learn TypeScript Interfaces")).toBeInTheDocument();
      expect(screen.getByText("4 hrs")).toBeInTheDocument();
      expect(screen.getByText("Concept")).toBeInTheDocument();
    });

    it("calls onToggle when clicking the accessible checkbox", () => {
      const onToggle = vi.fn();
      render(<TaskItem task={sampleTask} isCompleted={false} onToggle={onToggle} />);

      const checkbox = screen.getByRole("checkbox", { name: /Mark task as complete/i });
      fireEvent.click(checkbox);

      expect(onToggle).toHaveBeenCalledWith("task-test-1");
    });

    it("expands resources and advisor tips on click", () => {
      const onToggle = vi.fn();
      render(<TaskItem task={sampleTask} isCompleted={false} onToggle={onToggle} />);

      const detailsBtn = screen.getByRole("button", { name: /Resources & Tips/i });
      fireEvent.click(detailsBtn);

      expect(screen.getByText("TS Handbook Interfaces")).toBeInTheDocument();
      expect(screen.getByText(/Use interfaces when designing public API contracts/i)).toBeInTheDocument();
    });
  });

  describe("ProgressOverview Component", () => {
    const progress: RoadmapProgress = {
      totalTasks: 10,
      completedTasks: 5,
      totalHours: 100,
      completedHours: 50,
      percentComplete: 50,
      completedPhaseIds: ["phase-1"],
    };

    it("renders progressbar with correct aria attributes", () => {
      render(<ProgressOverview progress={progress} careerGoal="Full-Stack Developer" />);

      const progressBar = screen.getByRole("progressbar");
      expect(progressBar).toHaveAttribute("aria-valuenow", "50");
      expect(progressBar).toHaveAttribute("aria-valuemin", "0");
      expect(progressBar).toHaveAttribute("aria-valuemax", "100");
      expect(screen.getByText("50%")).toBeInTheDocument();
      expect(screen.getByText("5 of 10 Tasks Completed")).toBeInTheDocument();
    });
  });

  describe("ErrorMessage Component", () => {
    it("renders error message and handles retry button click", () => {
      const onRetry = vi.fn();
      render(<ErrorMessage message="Network request timed out" onRetry={onRetry} />);

      expect(screen.getByRole("alert")).toBeInTheDocument();
      expect(screen.getByText("Network request timed out")).toBeInTheDocument();

      const retryBtn = screen.getByRole("button", { name: /Retry Request/i });
      fireEvent.click(retryBtn);
      expect(onRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dashboard Components", () => {
    const sampleRoadmap = {
      id: "roadmap-test-1",
      careerGoal: "Full-Stack AI Developer",
      title: "Full-Stack AI Developer Pathway",
      summary: "Comprehensive roadmap for modern AI application engineering.",
      experienceLevel: "beginner" as const,
      hoursPerWeek: 15,
      targetDuration: "3 Months",
      totalEstimatedHours: 180,
      isFallback: false,
      generatedAt: new Date().toISOString(),
      careerInsights: {
        inDemandSkills: ["React", "TypeScript", "Python"],
        recommendedCertifications: ["AWS Cloud Practitioner"],
        portfolioTips: ["Build 2 full-stack projects"],
        interviewPrepFocus: ["State management and async flows"],
        potentialJobTitles: ["Full-Stack AI Developer"],
      },
      phases: [
        {
          id: "phase-1",
          phaseNumber: 1,
          title: "Frontend Foundations",
          description: "Master React & TypeScript",
          estimatedWeeks: 4,
          estimatedHours: 40,
          tasks: [
            {
              id: "t-1",
              title: "Build Responsive Layouts",
              description: "Use CSS Flexbox and Grid.",
              estimatedHours: 6,
              category: "project" as const,
              skillsCovered: ["CSS", "HTML"],
              resources: [],
              completed: false,
            },
          ],
          milestoneProject: {
            title: "Portfolio Dashboard",
            description: "A responsive student dashboard.",
            deliverables: ["Responsive UI", "Dark mode"],
            estimatedHours: 20,
          },
        },
      ],
    };

    it("renders DashboardView with header, cards, and daily focus", () => {
      const onToggle = vi.fn();
      const onReset = vi.fn();

      render(
        <DashboardView
          roadmap={sampleRoadmap}
          completedTaskIds={[]}
          onToggleTask={onToggle}
          onReset={onReset}
        />
      );

      expect(screen.getByText("Full-Stack AI Developer Pathway")).toBeInTheDocument();
      expect(screen.getAllByText(/12-Day Streak/i)[0]).toBeInTheDocument();
      expect(screen.getByText(/Today's Focus & Action Plan/i)).toBeInTheDocument();
      expect(screen.getAllByText("Build Responsive Layouts")[0]).toBeInTheDocument();
    });
  });
});
