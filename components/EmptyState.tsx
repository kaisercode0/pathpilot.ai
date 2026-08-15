"use client";

import React from "react";
import { CAREER_PRESETS, type CareerPreset } from "@/types/roadmap";
import {
  CodeIcon,
  CpuIcon,
  CloudIcon,
  DatabaseIcon,
  ShieldIcon,
  SparklesIcon,
  ClockIcon,
  TargetIcon,
  TrophyIcon,
} from "./icons/Icons";

interface EmptyStateProps {
  onSelectPreset: (preset: CareerPreset) => void;
  onFocusForm: () => void;
}

export function EmptyState({ onSelectPreset, onFocusForm }: EmptyStateProps) {
  const getPresetIcon = (iconName: CareerPreset["iconName"]) => {
    switch (iconName) {
      case "code":
        return <CodeIcon className="w-5 h-5" />;
      case "cpu":
        return <CpuIcon className="w-5 h-5" />;
      case "cloud":
        return <CloudIcon className="w-5 h-5" />;
      case "database":
        return <DatabaseIcon className="w-5 h-5" />;
      case "shield":
        return <ShieldIcon className="w-5 h-5" />;
      default:
        return <SparklesIcon className="w-5 h-5" />;
    }
  };

  return (
    <section className="w-full py-6 sm:py-10 space-y-12" aria-labelledby="hero-title">
      {/* Hero Headline & Value Props */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-sm animate-pulse">
          <SparklesIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Structured AI Architecture for College Students</span>
        </div>
        <h1
          id="hero-title"
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          Your Personalized Path to a{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Dream Tech Career
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No generic chat paragraphs. Enter your career goal, background, and weekly availability to generate a verified, milestone-driven learning roadmap with interactive task tracking.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-2xl mx-auto">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ClockIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Time-Budgeted</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Calibrated to your exact hours/week commitment.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrophyIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Milestone Projects</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Build portfolio-ready deliverables at each phase.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <TargetIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Progress Tracking</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Check off tasks and track completed study hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 1-Click Popular Career Presets */}
      <div className="space-y-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Explore Popular Career Tracks
            </h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Click to autofill form
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CAREER_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="text-left group relative p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-sm hover:shadow-md transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label={`Select preset career: ${preset.name}`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    {getPresetIcon(preset.iconName)}
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {preset.badge}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {preset.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {preset.description}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span className="font-medium text-indigo-600 dark:text-indigo-400">
                  {preset.hoursPerWeek} hrs/wk • {preset.targetDuration.replace("_", " ")}
                </span>
                <span className="group-hover:translate-x-1 transition-transform text-slate-400 font-bold">
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
