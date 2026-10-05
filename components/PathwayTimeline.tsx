"use client";

import React, { useState } from "react";
import type { Phase } from "@/lib/schemas";
import type { FilterCategory, FilterStatus } from "@/types/roadmap";
import { PhaseCard } from "./PhaseCard";
import {
  FilterIcon,
  CheckIcon,
  LayersIcon,
} from "./icons/Icons";

interface PathwayTimelineProps {
  phases: Phase[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  careerGoal: string;
}

export function PathwayTimeline({
  phases,
  completedTaskIds,
  onToggleTask,
  careerGoal,
}: PathwayTimelineProps) {
  const [filterCategory, setFilterCategory] = useState<FilterCategory>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Determine completion state for each phase
  const phaseStatuses = phases.map((phase) => {
    const total = phase.tasks.length;
    const completed = phase.tasks.filter((t) => completedTaskIds.includes(t.id)).length;
    const isCompleted = total > 0 && completed === total;
    const isStarted = completed > 0 && !isCompleted;
    return {
      phaseId: phase.id,
      phaseNumber: phase.phaseNumber,
      total,
      completed,
      isCompleted,
      isStarted,
    };
  });

  return (
    <div className="space-y-6">
      {/* Visual Phase Milestone Stepper */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80 mb-5">
          <div className="space-y-0.5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <LayersIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span>Pathway Milestone Trajectory</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sequential phase progression toward mastery of <span className="font-semibold text-slate-800 dark:text-slate-200">{careerGoal}</span>
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
            {phases.length} Phases Total
          </span>
        </div>

        {/* Responsive Horizontal Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {phases.map((phase, idx) => {
            const status = phaseStatuses[idx];
            const isCompleted = status.isCompleted;
            const isCurrent = !isCompleted && (idx === 0 || phaseStatuses[idx - 1]?.isCompleted);

            return (
              <div
                key={phase.id}
                className={`p-3.5 rounded-2xl border transition-all flex flex-col justify-between space-y-2 ${
                  isCompleted
                    ? "bg-emerald-50/60 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800/70"
                    : isCurrent
                    ? "bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-300 dark:border-indigo-700 shadow-sm ring-2 ring-indigo-500/20"
                    : "bg-slate-50/80 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-70"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-indigo-600 text-white animate-pulse"
                          : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {isCompleted ? <CheckIcon className="w-3.5 h-3.5" /> : phase.phaseNumber}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Phase {phase.phaseNumber}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isCompleted
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/70 dark:text-emerald-300"
                        : isCurrent
                        ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    {isCompleted ? "Done" : isCurrent ? "Active" : "Locked"}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">
                    {phase.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    <span>{status.completed} / {status.total} Tasks</span>
                    <span>•</span>
                    <span>{phase.estimatedWeeks}w</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filter and Search Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        {/* Category Filters */}
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
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                filterCategory === cat.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Status Filters */}
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
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
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

      {/* Accordion Phase Cards */}
      <div className="space-y-6">
        {phases.map((phase) => (
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
  );
}
