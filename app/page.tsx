"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { EmptyState } from "@/components/EmptyState";
import { RoadmapForm } from "@/components/RoadmapForm";
import { DashboardView } from "@/components/DashboardView";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorMessage } from "@/components/ErrorMessage";
import { validateRoadmapRelevance, type RoadmapRequest, type RoadmapResponse } from "@/lib/schemas";
import type { CareerPreset } from "@/types/roadmap";
import {
  getStoredActiveRoadmap,
  saveStoredActiveRoadmap,
  getStoredCompletedTasks,
  saveStoredCompletedTasks,
  getStoredSavedRoadmaps,
} from "@/lib/storage";
import { generateCuratedFallbackRoadmap } from "@/lib/fallback-roadmaps";

export default function Home() {
  const [savedRoadmaps, setSavedRoadmaps] = useState<RoadmapResponse[]>(() => getStoredSavedRoadmaps());
  const [activeRoadmap, setActiveRoadmap] = useState<RoadmapResponse | null>(() => getStoredActiveRoadmap());
  const [completedTaskIds, setCompletedTaskIds] = useState<string[]>(() => {
    const active = getStoredActiveRoadmap();
    return active ? getStoredCompletedTasks(active.id) : [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<{ message: string; details?: string } | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<Partial<RoadmapRequest> | null>(null);
  const [lastRequest, setLastRequest] = useState<RoadmapRequest | null>(null);


  // Handle roadmap generation request
  const handleGenerateRoadmap = async (requestData: RoadmapRequest) => {
    setIsLoading(true);
    setError(null);
    setLastRequest(requestData);

    try {
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || data.error || `Server responded with status ${res.status}`
        );
      }

      // Generation successful - validate relevance before accepting
      const roadmap: RoadmapResponse = data;
      const relevance = validateRoadmapRelevance(roadmap, requestData);
      if (!relevance.valid) {
        throw new Error(`Roadmap relevance validation failed: ${relevance.reason}`);
      }

      setActiveRoadmap(roadmap);
      saveStoredActiveRoadmap(roadmap);

      // Load or reset completed tasks for new roadmap
      const storedTasks = getStoredCompletedTasks(roadmap.id);
      setCompletedTaskIds(storedTasks);

      // Refresh saved history list
      setSavedRoadmaps(getStoredSavedRoadmaps());

      // Scroll to top of content smoothly
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Failed to generate roadmap";
      setError({
        message: errMsg,
        details:
          "Please verify your input fields or internet connection. If using an Anthropic API key, check that ANTHROPIC_API_KEY is properly set in .env.local.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle task completion toggle
  const handleToggleTask = (taskId: string) => {
    if (!activeRoadmap) return;

    setCompletedTaskIds((prev) => {
      const updated = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];

      saveStoredCompletedTasks(activeRoadmap.id, updated);
      return updated;
    });
  };

  // Handle preset selection
  const handleSelectPreset = (preset: CareerPreset) => {
    setSelectedPreset({
      careerGoal: preset.careerGoal,
      currentSkills: preset.suggestedSkills,
      experienceLevel: preset.experienceLevel,
      hoursPerWeek: preset.hoursPerWeek,
      targetDuration: preset.targetDuration,
      learningStyle: preset.learningStyle,
    });

    const formElement = document.getElementById("roadmap-generator-form");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Reset to create new roadmap
  const handleReset = () => {
    setActiveRoadmap(null);
    saveStoredActiveRoadmap(null);
    setError(null);
    setSelectedPreset(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Select historical roadmap
  const handleSelectSavedRoadmap = (roadmap: RoadmapResponse) => {
    setActiveRoadmap(roadmap);
    saveStoredActiveRoadmap(roadmap);
    const storedTasks = getStoredCompletedTasks(roadmap.id);
    setCompletedTaskIds(storedTasks);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Load fallback directly using user's actual selected input
  const handleLoadFallbackDirectly = () => {
    const fallbackInput: RoadmapRequest = lastRequest || {
      careerGoal: selectedPreset?.careerGoal || "Cybersecurity & Security Operations Analyst",
      currentSkills: selectedPreset?.currentSkills || ["Computer Networking", "Linux", "Bash"],
      experienceLevel: selectedPreset?.experienceLevel || "beginner",
      hoursPerWeek: selectedPreset?.hoursPerWeek || 12,
      targetDuration: selectedPreset?.targetDuration || "6_months",
      learningStyle: selectedPreset?.learningStyle || "certification",
    };

    const roadmap = generateCuratedFallbackRoadmap(fallbackInput);
    setActiveRoadmap(roadmap);
    saveStoredActiveRoadmap(roadmap);
    setCompletedTaskIds([]);
    setError(null);
    setSavedRoadmaps(getStoredSavedRoadmaps());
  };


  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F5F0] dark:bg-slate-950">
      {/* Accessible Navbar */}
      <Navbar
        onReset={handleReset}
        hasActiveRoadmap={Boolean(activeRoadmap)}
        savedRoadmaps={savedRoadmaps}
        onSelectSavedRoadmap={handleSelectSavedRoadmap}
      />

      {/* Main Landmark */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 focus:outline-none"
      >
        {/* Loading State */}
        {isLoading && <LoadingSkeleton />}

        {/* Error State */}
        {!isLoading && error && (
          <div className="space-y-8">
            <ErrorMessage
              message={error.message}
              details={error.details}
              onRetry={lastRequest ? () => handleGenerateRoadmap(lastRequest) : undefined}
              onLoadFallback={handleLoadFallbackDirectly}
            />
            {/* Also render form so user can modify input */}
            <RoadmapForm
              onSubmit={handleGenerateRoadmap}
              isLoading={isLoading}
              initialValues={lastRequest || selectedPreset}
            />
          </div>
        )}

        {/* Active Roadmap / Modern Student Dashboard State */}
        {!isLoading && !error && activeRoadmap && (
          <DashboardView
            roadmap={activeRoadmap}
            completedTaskIds={completedTaskIds}
            onToggleTask={handleToggleTask}
            onReset={handleReset}
            onOpenGenerator={() => {
              setActiveRoadmap(null);
            }}
          />
        )}

        {/* Initial / Empty State & Input Form */}
        {!isLoading && !error && !activeRoadmap && (
          <div className="space-y-12">
            <EmptyState
              onSelectPreset={handleSelectPreset}
              onFocusForm={() => {
                const el = document.getElementById("career-goal-input");
                if (el) el.focus();
              }}
            />
            <RoadmapForm
              onSubmit={handleGenerateRoadmap}
              isLoading={isLoading}
              initialValues={selectedPreset}
            />
          </div>
        )}
      </main>

      {/* Accessible Footer */}
      <footer className="w-full border-t border-[#EAEAEA] dark:border-slate-800 bg-[#FAFAF8]/80 dark:bg-slate-950/50 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              PathPilot AI
            </span>
            <span>•</span>
            <span>WCAG 2.1 AA Compliant Career Roadmap Platform</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Next.js 16 App Router</span>
            <span>•</span>
            <span>TypeScript Strict Mode</span>
            <span>•</span>
            <span>Zod Validation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
