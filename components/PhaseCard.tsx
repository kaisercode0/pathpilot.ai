"use client";

import React, { useState } from "react";
import type { Phase } from "@/lib/schemas";
import { TaskItem } from "./TaskItem";
import {
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "./icons/Icons";

interface PhaseCardProps {
  phase: Phase;
  completedTaskIds: string[];
  onToggleTask: (taskId: string) => void;
  filterCategory: string;
  filterStatus: string;
}

export function PhaseCard({
  phase,
  completedTaskIds,
  onToggleTask,
  filterCategory,
  filterStatus,
}: PhaseCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Calculate phase completion metrics
  const totalTasksInPhase = phase.tasks.length;
  const completedTasksInPhase = phase.tasks.filter((t) =>
    completedTaskIds.includes(t.id)
  ).length;
  const isPhaseCompleted =
    totalTasksInPhase > 0 && completedTasksInPhase === totalTasksInPhase;
  const phaseProgressPct =
    totalTasksInPhase > 0
      ? Math.round((completedTasksInPhase / totalTasksInPhase) * 100)
      : 0;

  // Filter tasks
  const filteredTasks = phase.tasks.filter((task) => {
    const matchesCategory =
      filterCategory === "all" || task.category === filterCategory;
    const isCompleted = completedTaskIds.includes(task.id);
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "completed" && isCompleted) ||
      (filterStatus === "incomplete" && !isCompleted);

    return matchesCategory && matchesStatus;
  });

  return (
    <section
      className={`rounded-3xl border transition-all duration-300 ${
        isPhaseCompleted
          ? "bg-slate-50/50 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-800/60 shadow-sm"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-md"
      }`}
      aria-label={`Phase ${phase.phaseNumber}: ${phase.title}`}
    >
      {/* Phase Header / Accordion Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={`phase-content-${phase.id}`}
        className="w-full text-left p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-3xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 shadow-sm ${
              isPhaseCompleted
                ? "bg-emerald-600 text-white"
                : "bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
            }`}
          >
            {isPhaseCompleted ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <span>P{phase.phaseNumber}</span>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                Phase {phase.phaseNumber}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <CalendarIcon className="w-3 h-3" />
                <span>{phase.estimatedWeeks} {phase.estimatedWeeks === 1 ? "Week" : "Weeks"}</span>
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ClockIcon className="w-3 h-3" />
                <span>~{phase.estimatedHours} hrs</span>
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
              {phase.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              {phase.description}
            </p>
          </div>
        </div>

        {/* Phase Progress & Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 pl-14 sm:pl-0">
          <div className="text-right">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
              {completedTasksInPhase}/{totalTasksInPhase} Tasks
            </span>
            <div className="w-24 sm:w-28 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${phaseProgressPct}%` }}
              />
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
            {isOpen ? <ChevronUpIcon className="w-4 h-4" /> : <ChevronDownIcon className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Collapsible Phase Body */}
      {isOpen && (
        <div
          id={`phase-content-${phase.id}`}
          className="px-6 pb-6 sm:px-8 sm:pb-8 pt-0 space-y-6 animate-in fade-in duration-200"
        >
          {/* Milestone Capstone Deliverable Card */}
          {phase.milestoneProject && (
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-100 dark:border-indigo-900/50 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-600 text-white shadow-sm">
                    <TrophyIcon className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Phase Milestone Project
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                      {phase.milestoneProject.title}
                    </h4>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-300">
                  <ClockIcon className="w-3 h-3" />
                  <span>{phase.milestoneProject.estimatedHours} hrs capstone</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {phase.milestoneProject.description}
              </p>

              {/* Deliverables Checklist */}
              {phase.milestoneProject.deliverables && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Key Deliverables:
                  </span>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                    {phase.milestoneProject.deliverables.map((deliv, dIdx) => (
                      <li key={dIdx} className="flex items-start gap-1.5">
                        <CheckIcon className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{deliv}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Tasks List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              <span>Actionable Learning Modules</span>
              <span>{filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}</span>
            </div>

            {filteredTasks.length > 0 ? (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    isCompleted={completedTaskIds.includes(task.id)}
                    onToggle={onToggleTask}
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500 dark:text-slate-400">
                No tasks match current filter selection in this phase.
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
