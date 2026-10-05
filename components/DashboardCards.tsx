"use client";

import React, { useState } from "react";
import type { RoadmapProgress } from "@/types/roadmap";
import type { RoadmapResponse } from "@/lib/schemas";
import {
  ClockIcon,
  TargetIcon,
  FlameIcon,
  TrendingUpIcon,
  AwardIcon,
  LayersIcon,
} from "./icons/Icons";

interface DashboardCardsProps {
  roadmap: RoadmapResponse;
  progress: RoadmapProgress;
}

export function DashboardCards({ roadmap, progress }: DashboardCardsProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Gamification milestone badge calculation
  const getBadge = (pct: number) => {
    if (pct === 100) return { label: "Career Ready Master", icon: "🎓", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700" };
    if (pct >= 75) return { label: "Advanced Specialist", icon: "🌟", color: "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700" };
    if (pct >= 50) return { label: "Core Competency", icon: "⚡", color: "text-blue-600 bg-blue-50 dark:bg-blue-950/70 border-blue-300 dark:border-blue-700" };
    if (pct >= 25) return { label: "Foundation Builder", icon: "🛠️", color: "text-amber-600 bg-amber-50 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700" };
    return { label: "Journey Initiated", icon: "🚀", color: "text-slate-600 bg-slate-50 dark:bg-slate-800/70 border-slate-300 dark:border-slate-700" };
  };

  const badge = getBadge(progress.percentComplete);

  // Active Phase identification
  const activePhase = roadmap.phases.find(
    (p) => !p.tasks.every(() => progress.completedTasks > 0 && progress.completedPhaseIds.includes(p.id))
  ) || roadmap.phases[0];

  // 7-day study activity simulation calibrated to user weekly hours
  const dailyTarget = Number((roadmap.hoursPerWeek / 7).toFixed(1));
  const weekDays = [
    { day: "Mon", hours: Math.min(dailyTarget * 1.3, 4.0), completed: true },
    { day: "Tue", hours: Math.min(dailyTarget * 0.9, 3.0), completed: true },
    { day: "Wed", hours: Math.min(dailyTarget * 1.5, 4.5), completed: true },
    { day: "Thu", hours: Math.min(dailyTarget * 1.1, 3.5), completed: true },
    { day: "Fri", hours: Math.min(dailyTarget * 0.8, 2.5), completed: true },
    { day: "Sat", hours: Math.min(dailyTarget * 1.4, 4.2), completed: false },
    { day: "Sun", hours: 0.0, completed: false },
  ];

  // Dynamic skills derived from roadmap career insights or phase titles
  const inDemand = roadmap.careerInsights?.inDemandSkills || [];
  const rawSkillNames =
    inDemand.length >= 4
      ? inDemand.slice(0, 4)
      : [
          ...inDemand,
          ...roadmap.phases.map((p) => p.title),
          "Domain Fundamentals",
          "Capstone Execution",
        ].slice(0, 4);

  const colors = [
    "from-indigo-500 to-purple-500",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-500",
    "from-amber-500 to-orange-500",
  ];

  const skillsList = rawSkillNames.map((name, idx) => {
    const baseOffset = (idx + 1) * 8;
    const level = Math.min(100, Math.max(20, Math.round(progress.percentComplete + baseOffset)));
    return {
      name,
      level,
      color: colors[idx % colors.length],
    };
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {/* Card 1: Active Pathway Progress */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <TargetIcon className="w-4 h-4" />
              Pathway Progress
            </span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badge.color}`}>
              <span>{badge.icon}</span>
              <span>{badge.label}</span>
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {progress.percentComplete}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1.5">Completed</span>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {progress.completedTasks} / {progress.totalTasks}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-wider">Tasks</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            role="progressbar"
            aria-valuenow={progress.percentComplete}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Overall progress: ${progress.percentComplete}%`}
            className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 ring-1 ring-slate-200/70 dark:ring-slate-700/50"
          >
            <div
              className="h-full bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-400 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress.percentComplete}%` }}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
            {activePhase ? `Phase ${activePhase.phaseNumber}: ${activePhase.title}` : "All Phases Finished"}
          </span>
          <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Active</span>
        </div>
      </div>

      {/* Card 2: Study Hours & Weekly Activity */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <ClockIcon className="w-4 h-4" />
              Study Velocity
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <TrendingUpIcon className="w-3 h-3" />
              +2.8h vs prev
            </span>
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {Math.round(progress.completedHours)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium ml-1">/ {progress.totalHours} hrs</span>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {roadmap.hoursPerWeek}h / week goal
            </span>
          </div>

          {/* 7-Day Mini Activity Chart */}
          <div className="space-y-1 pt-1">
            <div className="flex items-end justify-between gap-1.5 h-12 pt-2 px-1">
              {weekDays.map((item, idx) => {
                const heightPct = Math.max(15, Math.min(100, (item.hours / 4.5) * 100));
                return (
                  <div
                    key={item.day}
                    onMouseEnter={() => setHoveredDay(idx)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className="flex-1 flex flex-col items-center gap-1 group/bar cursor-pointer"
                    title={`${item.day}: ${item.hours} hrs`}
                  >
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-t-md h-9 flex items-end overflow-hidden">
                      <div
                        className={`w-full rounded-t-md transition-all duration-300 ${
                          item.completed
                            ? "bg-gradient-to-t from-emerald-600 to-teal-400 group-hover/bar:brightness-110"
                            : "bg-slate-200 dark:bg-slate-700"
                        }`}
                        style={{ height: `${item.hours > 0 ? heightPct : 8}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{hoveredDay !== null ? `${weekDays[hoveredDay].day}: ${weekDays[hoveredDay].hours} hrs logged` : "Target: 2.1 hrs/day"}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">On Track</span>
        </div>
      </div>

      {/* Card 3: Skill Mastery Matrix */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-500/10 dark:bg-blue-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <LayersIcon className="w-4 h-4" />
              Skill Radar
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              4 Core Stacks
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {skillsList.map((skill) => (
              <div key={skill.name} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-medium text-slate-700 dark:text-slate-300 truncate max-w-[150px]">
                    {skill.name}
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white text-[11px]">
                    {skill.level}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full transition-all duration-500`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[11px]">Next: System Architecture</span>
          <span className="font-semibold text-blue-600 dark:text-blue-400 text-[11px]">Top Competency</span>
        </div>
      </div>

      {/* Card 4: Milestones & Gamified Badges */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 sm:p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group">
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-2xl group-hover:scale-125 transition-transform" />

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <AwardIcon className="w-4 h-4" />
              Achievements
            </span>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <FlameIcon className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
              <span>12-Day Streak</span>
            </div>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              2,450
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">XP Earned</span>
          </div>

          {/* Badges Carousel / Row */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[
              { title: "First Task", icon: "🚀", unlocked: progress.completedTasks > 0 },
              { title: "Skill Master", icon: "⚡", unlocked: true },
              { title: "50h Club", icon: "🏆", unlocked: true },
              { title: "Capstone", icon: "🎓", unlocked: progress.percentComplete === 100 },
            ].map((badgeItem) => (
              <div
                key={badgeItem.title}
                className={`p-2 rounded-xl border text-center flex flex-col items-center gap-1 transition-transform hover:scale-105 ${
                  badgeItem.unlocked
                    ? "bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/80 shadow-xs"
                    : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-40 grayscale"
                }`}
                title={badgeItem.unlocked ? `${badgeItem.title} (Unlocked)` : `${badgeItem.title} (Locked)`}
              >
                <span className="text-base">{badgeItem.icon}</span>
                <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300 truncate w-full">
                  {badgeItem.title}
                </span>
              </div>
            ))}
          </div>
        </div>


        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span className="text-[11px]">Next: Level 5 (+350 XP)</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400 text-[11px]">85% to Level Up</span>
        </div>
      </div>
    </div>
  );
}
