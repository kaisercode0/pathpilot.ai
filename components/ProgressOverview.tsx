"use client";

import React from "react";
import type { RoadmapProgress } from "@/types/roadmap";
import { TrophyIcon, ClockIcon, TargetIcon, CheckIcon } from "./icons/Icons";

interface ProgressOverviewProps {
  progress: RoadmapProgress;
  careerGoal: string;
}

export function ProgressOverview({ progress, careerGoal }: ProgressOverviewProps) {
  const getBadge = (pct: number) => {
    if (pct === 100) return { label: "Career Ready Master", icon: "🎓", color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800" };
    if (pct >= 75) return { label: "Advanced Specialist", icon: "🌟", color: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800" };
    if (pct >= 50) return { label: "Core Competency", icon: "⚡", color: "text-blue-500 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800" };
    if (pct >= 25) return { label: "Foundation Builder", icon: "🛠️", color: "text-amber-500 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800" };
    return { label: "Journey Initiated", icon: "🚀", color: "text-slate-500 bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700" };
  };

  const badge = getBadge(progress.percentComplete);
  const remainingHours = Math.max(0, progress.totalHours - progress.completedHours);

  return (
    <div
      className="w-full rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6"
      aria-label="Roadmap Progress and Completion Overview"
    >
      {/* Top Banner: Progress Bar & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
              Roadmap Progress
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}
            >
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Tracking milestones for <span className="font-semibold text-slate-800 dark:text-slate-200">{careerGoal}</span>
          </p>
        </div>

        {/* Big Percentage Indicator */}
        <div className="flex items-baseline gap-1 text-right">
          <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            {progress.percentComplete}%
          </span>
          <span className="text-xs text-slate-400 font-semibold uppercase">Done</span>
        </div>
      </div>

      {/* Accessible Progress Bar */}
      <div className="space-y-1.5">
        <div
          role="progressbar"
          aria-valuenow={progress.percentComplete}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Overall roadmap completion progress: ${progress.percentComplete}%`}
          className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-200 dark:ring-slate-700/50"
        >
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out shadow-sm"
            style={{ width: `${progress.percentComplete}%` }}
          />
        </div>
        <div className="flex justify-between text-[11px] font-medium text-slate-500 dark:text-slate-400">
          <span>0%</span>
          <span>{progress.completedTasks} of {progress.totalTasks} Tasks Completed</span>
          <span>100%</span>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        {/* Metric 1: Tasks Finished */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <CheckIcon className="w-3.5 h-3.5 text-emerald-500" />
            <span>Tasks Done</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {progress.completedTasks} <span className="text-xs text-slate-400 font-normal">/ {progress.totalTasks}</span>
          </p>
        </div>

        {/* Metric 2: Hours Completed */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <ClockIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Hours Invested</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {Math.round(progress.completedHours)} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </p>
        </div>

        {/* Metric 3: Hours Remaining */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <TargetIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Hours Left</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {Math.round(remainingHours)} <span className="text-xs text-slate-400 font-normal">hrs</span>
          </p>
        </div>

        {/* Metric 4: Milestones Cleared */}
        <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <TrophyIcon className="w-3.5 h-3.5 text-purple-500" />
            <span>Phases Cleared</span>
          </div>
          <p className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {progress.completedPhaseIds.length} <span className="text-xs text-slate-400 font-normal">Phases</span>
          </p>
        </div>
      </div>
    </div>
  );
}
