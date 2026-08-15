"use client";

import React, { useState } from "react";
import type { RoadmapResponse } from "@/lib/schemas";
import type { RoadmapProgress, FilterCategory, FilterStatus } from "@/types/roadmap";
import { ProgressOverview } from "./ProgressOverview";
import { PhaseCard } from "./PhaseCard";
import { ExportModal } from "./ExportModal";
import {
  SparklesIcon,
  DownloadIcon,
  FilterIcon,
  RefreshIcon,
  TrophyIcon,
  BookOpenIcon,
  TargetIcon,
  CheckIcon,
} from "./icons/Icons";

interface RoadmapViewProps {
  roadmap: RoadmapResponse;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onReset: () => void;
}

export function RoadmapView({
  roadmap,
  completedTaskIds,
  onToggleTask,
  onReset,
}: RoadmapViewProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeTab, setActiveTab] = useState<"phases" | "insights">("phases");

  // Calculate live progress stats
  const allTasks = roadmap.phases.flatMap((p) => p.tasks);
  const totalTasks = allTasks.length;
  const completedTasks = allTasks.filter((t) => completedTaskIds.includes(t.id)).length;
  const totalHours = roadmap.totalEstimatedHours || allTasks.reduce((acc, t) => acc + t.estimatedHours, 0);
  const completedHours = allTasks
    .filter((t) => completedTaskIds.includes(t.id))
    .reduce((acc, t) => acc + t.estimatedHours, 0);
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const completedPhaseIds = roadmap.phases
    .filter((p) => p.tasks.length > 0 && p.tasks.every((t) => completedTaskIds.includes(t.id)))
    .map((p) => p.id);

  const progress: RoadmapProgress = {
    totalTasks,
    completedTasks,
    totalHours,
    completedHours,
    percentComplete,
    completedPhaseIds,
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 py-4 sm:py-8" aria-label="Generated Career Roadmap">
      {/* Fallback / Offline Notice Banner if applicable */}
      {roadmap.isFallback && (
        <div
          className="rounded-2xl bg-indigo-50/90 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-indigo-900 dark:text-indigo-200"
          role="note"
        >
          <div className="flex items-center gap-2.5">
            <SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div>
              <span className="font-bold">Verified Curated Roadmap Loaded:</span> Dynamically calibrated for {roadmap.experienceLevel} level at {roadmap.hoursPerWeek} hrs/week.
            </div>
          </div>
          <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold shrink-0">
            Interactive Offline Mode Active
          </span>
        </div>
      )}

      {/* Hero Header Card */}
      <section className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300 uppercase tracking-wider">
                {roadmap.experienceLevel} Level
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
                {roadmap.targetDuration}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {roadmap.hoursPerWeek} hrs/week
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              {roadmap.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {roadmap.summary}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-sm transition-all"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Export Roadmap</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-all"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>New Path</span>
            </button>
          </div>
        </div>
      </section>

      {/* Live Progress Overview */}
      <ProgressOverview progress={progress} careerGoal={roadmap.careerGoal} />

      {/* Tabs Navigation (Phases vs Career Insights) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2" role="tablist" aria-label="Roadmap views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "phases"}
            aria-controls="phases-tabpanel"
            id="phases-tab"
            onClick={() => setActiveTab("phases")}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "phases"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <TrophyIcon className="w-4 h-4" />
            <span>Phases & Milestones ({roadmap.phases.length})</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "insights"}
            aria-controls="insights-tabpanel"
            id="insights-tab"
            onClick={() => setActiveTab("insights")}
            className={`pb-3 px-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "insights"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Industry & Interview Insights</span>
          </button>
        </div>
      </div>

      {/* Tab Panel 1: Phases & Milestone Tasks */}
      {activeTab === "phases" && (
        <div id="phases-tabpanel" role="tabpanel" aria-labelledby="phases-tab" className="space-y-6">
          {/* Filter Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Category Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1 flex items-center gap-1">
                <FilterIcon className="w-3.5 h-3.5" />
                Category:
              </span>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "concept", label: "Concepts" },
                  { id: "project", label: "Projects" },
                  { id: "practice", label: "Practice" },
                  { id: "reading", label: "Reading" },
                ] as const
              ).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    filterCategory === cat.id
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-400 mr-1">Status:</span>
              {(
                [
                  { id: "all", label: "All" },
                  { id: "incomplete", label: "Pending" },
                  { id: "completed", label: "Completed" },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => setFilterStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    filterStatus === st.id
                      ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          {/* Phases List */}
          <div className="space-y-6">
            {roadmap.phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                completedTaskIds={completedTaskIds}
                onToggleTask={onToggleTask}
                filterCategory={filterCategory}
                filterStatus={filterStatus}
              />
            ))}
          </div>
        </div>
      )}

      {/* Tab Panel 2: Career Insights */}
      {activeTab === "insights" && roadmap.careerInsights && (
        <div
          id="insights-tabpanel"
          role="tabpanel"
          aria-labelledby="insights-tab"
          className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200"
        >
          {/* Card 1: In Demand Skills */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400">
                <TargetIcon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                In-Demand Industry Skills
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {roadmap.careerInsights.inDemandSkills.map((skill, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Recommended Certifications */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400">
                <TrophyIcon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recommended Certifications
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {roadmap.careerInsights.recommendedCertifications.map((cert, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <SparklesIcon className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 3: Portfolio Tips */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400">
                <BookOpenIcon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Portfolio Project Strategy
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {roadmap.careerInsights.portfolioTips.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Interview Focus */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400">
                <TargetIcon className="w-5 h-5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Technical Interview Focus Areas
              </h2>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              {roadmap.careerInsights.interviewPrepFocus.map((focus, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <SparklesIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>{focus}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Export Modal */}
      <ExportModal
        roadmap={roadmap}
        completedTaskIds={completedTaskIds}
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  );
}
