"use client";

import React, { useState } from "react";
import type { RoadmapResponse } from "@/lib/schemas";
import type { RoadmapProgress } from "@/types/roadmap";
import { DashboardCards } from "./DashboardCards";
import { DailyFocus } from "./DailyFocus";
import { PathwayTimeline } from "./PathwayTimeline";
import { CareerRadar } from "./CareerRadar";
import { ExportModal } from "./ExportModal";
import {
  SparklesIcon,
  DownloadIcon,
  RefreshIcon,
  TargetIcon,
  LayersIcon,
  FlameIcon,
  ZapIcon,
  BriefcaseIcon,
} from "./icons/Icons";

interface DashboardViewProps {
  roadmap: RoadmapResponse;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  onReset: () => void;
  onOpenGenerator?: () => void;
}

export function DashboardView({
  roadmap,
  completedTaskIds,
  onToggleTask,
  onReset,
  onOpenGenerator,
}: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "timeline" | "career">("overview");
  const [showExportModal, setShowExportModal] = useState(false);

  // Live progress metrics calculation
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
    <div className="w-full max-w-7xl mx-auto space-y-8 py-2 sm:py-6" aria-label="Student Learning Dashboard">
      {/* 1. Hero Student Welcome Banner */}
      <section className="relative rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-indigo-500/20 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -right-12 -bottom-12 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-24 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                {roadmap.experienceLevel} Track
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {roadmap.targetDuration}
              </span>
              <div className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <FlameIcon className="w-3.5 h-3.5 text-amber-400" />
                <span>12-Day Streak</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {roadmap.title}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed line-clamp-2">
              {roadmap.summary}
            </p>

            {/* Weekly Target Progress Indicator */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Weekly Commitment:</span>
                <span className="text-indigo-300 font-bold">{roadmap.hoursPerWeek} hrs/week</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">Logged Velocity:</span>
                <span className="text-emerald-400 font-bold">{Math.round(progress.completedHours)} hrs finished</span>
              </div>
              <span>•</span>
              <span className="text-amber-300 font-medium">
                {totalTasks - completedTasks} tasks remaining
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap sm:flex-col gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                setActiveTab("timeline");
                const el = document.getElementById("daily-focus-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 shadow-lg shadow-indigo-500/30 transition-all hover:scale-102"
            >
              <ZapIcon className="w-4 h-4 text-amber-300" />
              <span>Continue Active Phase</span>
            </button>

            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-semibold text-xs sm:text-sm text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 transition-all"
            >
              <DownloadIcon className="w-4 h-4" />
              <span>Export Pathway</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl font-medium text-xs sm:text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <RefreshIcon className="w-4 h-4" />
              <span>Configure New Goal</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Modern Dashboard Metric Cards Grid */}
      <DashboardCards roadmap={roadmap} progress={progress} />

      {/* 3. Navigation View Switcher (Dashboard Overview vs Full Roadmap vs Career Radar) */}
      <div className="border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1" role="tablist" aria-label="Dashboard Views">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "overview"}
            aria-controls="overview-tabpanel"
            id="overview-tab"
            onClick={() => setActiveTab("overview")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <TargetIcon className="w-4 h-4" />
            <span>Dashboard &amp; Focus</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "timeline"}
            aria-controls="timeline-tabpanel"
            id="timeline-tab"
            onClick={() => setActiveTab("timeline")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "timeline"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <LayersIcon className="w-4 h-4" />
            <span>Pathway Roadmap ({roadmap.phases.length} Phases)</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "career"}
            aria-controls="career-tabpanel"
            id="career-tab"
            onClick={() => setActiveTab("career")}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
              activeTab === "career"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            }`}
          >
            <BriefcaseIcon className="w-4 h-4" />
            <span>Career Radar &amp; Market</span>
          </button>
        </div>

        {/* Quick CTA to configure new goal */}
        {onOpenGenerator && (
          <button
            type="button"
            onClick={onOpenGenerator}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 transition-colors"
          >
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>New AI Pathway</span>
          </button>
        )}
      </div>

      {/* 4. Tab Content Sections */}
      {/* Tab Panel 1: Overview & Daily Focus */}
      {activeTab === "overview" && (
        <div id="overview-tabpanel" role="tabpanel" aria-labelledby="overview-tab" className="space-y-8">
          {/* Today's Focus Action Plan */}
          <div id="daily-focus-section">
            <DailyFocus
              tasks={allTasks}
              completedTaskIds={completedTaskIds}
              onToggleTask={onToggleTask}
              careerGoal={roadmap.careerGoal}
            />
          </div>

          {/* Quick Pathway Timeline Preview */}
          <PathwayTimeline
            phases={roadmap.phases}
            completedTaskIds={completedTaskIds}
            onToggleTask={onToggleTask}
            careerGoal={roadmap.careerGoal}
          />
        </div>
      )}

      {/* Tab Panel 2: Full Pathway Roadmap */}
      {activeTab === "timeline" && (
        <div id="timeline-tabpanel" role="tabpanel" aria-labelledby="timeline-tab" className="space-y-6">
          <PathwayTimeline
            phases={roadmap.phases}
            completedTaskIds={completedTaskIds}
            onToggleTask={onToggleTask}
            careerGoal={roadmap.careerGoal}
          />
        </div>
      )}

      {/* Tab Panel 3: Career Radar & Market */}
      {activeTab === "career" && (
        <div id="career-tabpanel" role="tabpanel" aria-labelledby="career-tab" className="space-y-6">
          <CareerRadar
            insights={roadmap.careerInsights}
            careerGoal={roadmap.careerGoal}
            experienceLevel={roadmap.experienceLevel}
          />
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
