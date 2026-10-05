"use client";

import React, { useState } from "react";
import type { Task } from "@/lib/schemas";
import {
  CheckIcon,
  ClockIcon,
  BookOpenIcon,
  CodeIcon,
  ExternalLinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  SparklesIcon,
} from "./icons/Icons";

interface TaskItemProps {
  task: Task;
  isCompleted: boolean;
  onToggle: (taskId: string) => void;
}

export function TaskItem({ task, isCompleted, onToggle }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
      case "milestone":
        return {
          label: "Milestone",
          color: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800",
          icon: <SparklesIcon className="w-3 h-3" />,
        };
      default:
        return {
          label: "Concept",
          color: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800",
          icon: <BookOpenIcon className="w-3 h-3" />,
        };
    }
  };

  const catBadge = getCategoryBadge(task.category);

  return (
    <article
      className={`rounded-2xl border transition-all duration-200 ${
        isCompleted
          ? "bg-slate-50/70 dark:bg-slate-900/40 border-slate-200/80 dark:border-slate-800/60 opacity-90"
          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600"
      }`}
      aria-label={`Task: ${task.title}`}
    >
      <div className="p-4 sm:p-5 flex items-start gap-3.5">
        {/* Custom Accessible Checkbox Button */}
        <button
          type="button"
          role="checkbox"
          aria-checked={isCompleted}
          onClick={() => onToggle(task.id)}
          className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shrink-0 cursor-pointer ${
            isCompleted
              ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
              : "border-slate-300 dark:border-slate-600 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800 text-transparent"
          }`}
          aria-label={`Mark task as ${isCompleted ? "incomplete" : "complete"}: ${task.title}`}
        >
          <CheckIcon className={`w-3.5 h-3.5 ${isCompleted ? "opacity-100" : "opacity-0"}`} />
        </button>

        {/* Task Content */}
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${catBadge.color}`}
              >
                {catBadge.icon}
                <span>{catBadge.label}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                <ClockIcon className="w-3 h-3 text-slate-400" />
                <span>{task.estimatedHours} hrs</span>
              </span>
            </div>

            {/* Expand / Collapse Details Button */}
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-controls={`task-details-${task.id}`}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1 p-1 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
            >
              <span>{isExpanded ? "Hide Details" : "Resources & Tips"}</span>
              {isExpanded ? (
                <ChevronUpIcon className="w-3.5 h-3.5" />
              ) : (
                <ChevronDownIcon className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <h4
            className={`text-sm sm:text-base font-bold transition-all ${
              isCompleted
                ? "text-slate-500 dark:text-slate-400 line-through decoration-slate-400"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {task.title}
          </h4>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {task.description}
          </p>

          {/* Skills Covered Pills */}
          {task.skillsCovered && task.skillsCovered.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Skills:</span>
              {task.skillsCovered.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Expandable Details Section (Resources & Tips) */}
      {isExpanded && (
        <div
          id={`task-details-${task.id}`}
          className="border-t border-slate-100 dark:border-slate-800/80 p-4 sm:p-5 bg-slate-50/50 dark:bg-slate-950/40 rounded-b-2xl space-y-3.5 animate-in fade-in duration-150"
        >
          {/* Study / Execution Tip */}
          {task.tips && (
            <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
              <SparklesIcon className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Advisor Tip:</span> {task.tips}
              </div>
            </div>
          )}

          {/* Curated Free Resources */}
          {task.resources && task.resources.length > 0 ? (
            <div className="space-y-2">
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpenIcon className="w-3.5 h-3.5 text-indigo-500" />
                <span>Curated Learning Resources</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {task.resources.map((res, rIdx) => (
                  <a
                    key={rIdx}
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm transition-all flex flex-col justify-between group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          {res.recommendedOrder && (
                            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                              #{res.recommendedOrder}
                            </span>
                          )}
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {res.title}
                          </span>
                        </div>
                        {res.provider && (
                          <span className="text-[10px] text-slate-400 block font-medium">
                            Provider: {res.provider}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                            res.status === "FREE" || res.isFree !== false
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                              : res.status === "FREEMIUM"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
                          }`}
                        >
                          {res.status || (res.isFree !== false ? "FREE" : "PAID")}
                        </span>
                        <ExternalLinkIcon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-500" />
                      </div>
                    </div>

                    {res.whyUseful && (
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                        {res.whyUseful}
                      </p>
                    )}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No extra external links required.</p>
          )}
        </div>
      )}
    </article>
  );
}
