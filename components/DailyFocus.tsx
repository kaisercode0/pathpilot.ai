"use client";

import React, { useState } from "react";
import type { Task } from "@/lib/schemas";
import {
  CheckIcon,
  ClockIcon,
  BookOpenIcon,
  CodeIcon,
  SparklesIcon,
  ExternalLinkIcon,
  PlayIcon,
  TargetIcon,
} from "./icons/Icons";

interface DailyFocusProps {
  tasks: Task[];
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  careerGoal: string;
}

export function DailyFocus({
  tasks,
  completedTaskIds,
  onToggleTask,
  careerGoal,
}: DailyFocusProps) {
  const [activeTimerTask, setActiveTimerTask] = useState<string | null>(null);

  // Pick the first 3 incomplete tasks as today's action focus
  const pendingTasks = tasks.filter((t) => !completedTaskIds.includes(t.id));
  const focusTasks = pendingTasks.slice(0, 3);
  const todaysHours = focusTasks.reduce((acc, t) => acc + t.estimatedHours, 0);

  const getCategoryBadge = (category: Task["category"]) => {
    switch (category) {
      case "project":
        return {
          label: "Project",
          color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
          icon: <CodeIcon className="w-3 h-3" />,
        };
      case "practice":
        return {
          label: "Practice",
          color: "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800",
          icon: <ClockIcon className="w-3 h-3" />,
        };
      case "reading":
        return {
          label: "Reading",
          color: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800",
          icon: <BookOpenIcon className="w-3 h-3" />,
        };
      default:
        return {
          label: "Core Concept",
          color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
          icon: <SparklesIcon className="w-3 h-3" />,
        };
    }
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-900/90 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-indigo-500/20 relative overflow-hidden">
      {/* Subtle Glow Accents */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-500/20 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <TargetIcon className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white">
                Today&apos;s Focus &amp; Action Plan
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {focusTasks.length} High-Yield Tasks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300">
              Targeting immediate milestones for <span className="font-semibold text-indigo-200">{careerGoal}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block font-medium">Estimated Time</span>
              <span className="text-sm font-bold text-indigo-300">{todaysHours} hrs total</span>
            </div>
          </div>
        </div>

        {/* Task Cards List */}
        {focusTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {focusTasks.map((task, index) => {
              const badge = getCategoryBadge(task.category);
              const isTimerRunning = activeTimerTask === task.id;

              return (
                <div
                  key={task.id}
                  className="rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:border-indigo-400/50 p-4 sm:p-5 flex flex-col justify-between space-y-4 transition-all hover:bg-white/[0.08] group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold border ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
                        <ClockIcon className="w-3 h-3 text-slate-400" />
                        <span>{task.estimatedHours} hrs</span>
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-indigo-400">Step {index + 1}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors line-clamp-2">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    {/* Mark Complete Checkbox CTA */}
                    <button
                      type="button"
                      onClick={() => onToggleTask(task.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      aria-label={`Mark task as complete: ${task.title}`}
                    >
                      <CheckIcon className="w-3.5 h-3.5" />
                      <span>Complete</span>
                    </button>

                    {/* Resources Link or Timer */}
                    {task.resources && task.resources.length > 0 ? (
                      <a
                        href={task.resources[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-medium transition-colors"
                      >
                        <span>Resource</span>
                        <ExternalLinkIcon className="w-3 h-3" />
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setActiveTimerTask(isTimerRunning ? null : task.id)}
                        className="inline-flex items-center gap-1 text-xs text-indigo-300 hover:text-white font-medium transition-colors"
                      >
                        <PlayIcon className="w-3 h-3" />
                        <span>{isTimerRunning ? "Pause" : "Start"}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl bg-white/5 p-6 text-center space-y-2 border border-white/10">
            <SparklesIcon className="w-8 h-8 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-white">All Today&apos;s Focus Tasks Completed! 🎉</h4>
            <p className="text-xs text-slate-300 max-w-md mx-auto">
              Outstanding discipline! You&apos;ve accomplished every key milestone scheduled for today. Ready for the next phase?
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
