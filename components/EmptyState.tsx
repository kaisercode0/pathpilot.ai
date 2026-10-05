"use client";

import React, { useState, useMemo } from "react";
import { CAREER_PRESETS, type CareerPreset } from "@/types/roadmap";
import type { RoleFilterCategory } from "@/lib/career-roles";
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
  SearchIcon,
  BriefcaseIcon,
} from "./icons/Icons";

interface EmptyStateProps {
  onSelectPreset: (preset: CareerPreset) => void;
  onFocusForm: () => void;
}

export function EmptyState({ onSelectPreset, onFocusForm }: EmptyStateProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<RoleFilterCategory>("all");

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
      case "design":
      case "writer":
      case "marketing":
      case "bot":
      default:
        return <SparklesIcon className="w-5 h-5" />;
    }
  };

  const filteredPresets = useMemo(() => {
    return CAREER_PRESETS.filter((preset) => {
      // Category filter check
      let matchesCategory = true;
      if (selectedFilter === "technical") matchesCategory = preset.category === "technical";
      else if (selectedFilter === "non-technical") matchesCategory = preset.category === "non-technical";
      else if (selectedFilter !== "all") matchesCategory = preset.filterCategory === selectedFilter;

      // Search query check
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase().trim();
        const inTitle = preset.name.toLowerCase().includes(query);
        const inDesc = preset.description.toLowerCase().includes(query);
        const inSkills = preset.suggestedSkills.some((s) => s.toLowerCase().includes(query));
        const inTools = preset.tools.some((t) => t.toLowerCase().includes(query));
        matchesSearch = inTitle || inDesc || inSkills || inTools;
      }

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedFilter]);

  const filterCategories: { id: RoleFilterCategory; label: string }[] = [
    { id: "all", label: "All Careers" },
    { id: "technical", label: "Technical" },
    { id: "non-technical", label: "Non-Technical" },
    { id: "cybersecurity", label: "Cybersecurity" },
    { id: "ai-data", label: "AI & Data" },
    { id: "software", label: "Software" },
    { id: "design", label: "Design" },
    { id: "infrastructure", label: "Infrastructure" },
    { id: "hardware-robotics", label: "Hardware & Robotics" },
    { id: "marketing-content", label: "Marketing & Content" },
  ];

  return (
    <section className="w-full py-6 sm:py-10 space-y-12" aria-labelledby="hero-title">
      {/* Hero Headline & Value Props */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 shadow-sm animate-pulse">
          <SparklesIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Role-Specific Career Roadmap Platform</span>
        </div>
        <h1
          id="hero-title"
          className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight"
        >
          Your Role-Specific Path to a{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 bg-clip-text text-transparent">
            Dream Tech Career
          </span>
        </h1>
        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          No generic code templates. Select your career role to generate a verified, milestone-driven roadmap tailored strictly to your domain.
        </p>

        {/* Hero Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => onSelectPreset(CAREER_PRESETS[0])}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 shadow-lg shadow-indigo-500/25 transition-all hover:scale-102 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Launch Cybersecurity Demo Roadmap</span>
          </button>

          <button
            type="button"
            onClick={onFocusForm}
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-semibold text-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
          >
            <TargetIcon className="w-4 h-4 text-indigo-500" />
            <span>Customize My Path</span>
          </button>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-left max-w-2xl mx-auto">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF8] dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 shadow-xs">
            <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
              <ClockIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Strict Role Isolation</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Zero technology leakage across career tracks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF8] dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 shadow-xs">
            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
              <TrophyIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Domain Capstones</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Role-tailored milestone projects and free resources.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-[#FAFAF8] dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 shadow-xs">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 shrink-0">
              <TargetIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">Time & Difficulty Tuning</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Dynamic workload hours based on weekly commitment.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Selection, Search & Filters */}
      <div className="space-y-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BriefcaseIcon className="w-5 h-5 text-indigo-500" />
              <span>Explore Career Paths ({CAREER_PRESETS.length} Roles)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Select a career role below to populate your customized learning roadmap.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search careers..."
              aria-label="Search careers"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EAEAEA] dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === cat.id
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "bg-[#F8F8F6] dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border border-[#EAEAEA] dark:border-transparent hover:bg-slate-200/60 dark:hover:bg-slate-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Career Preset Cards Grid */}
        {filteredPresets.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-[#EAEAEA] dark:border-slate-800 rounded-3xl bg-[#FAFAF8]/50 dark:bg-slate-900/30">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              No career roles match &quot;{searchQuery}&quot; in category &quot;{selectedFilter}&quot;.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFilter("all");
              }}
              className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
            >
              Clear filters and search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => onSelectPreset(preset)}
                className="text-left group relative p-6 rounded-2xl bg-white dark:bg-slate-900 border border-[#EAEAEA] dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 shadow-xs hover:shadow-md transition-all flex flex-col justify-between focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer"
                aria-label={`Select career role: ${preset.name}`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                      {getPresetIcon(preset.iconName)}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F8F8F6] dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-[#EAEAEA]/80 dark:border-transparent">
                        {preset.category === "technical" ? "Technical" : "Non-Technical"}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80">
                        {preset.experienceLevel}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {preset.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                      {preset.description}
                    </p>
                  </div>

                  {/* Core Skills Tags */}
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Core Skills:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {preset.suggestedSkills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F8F8F6] dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 border border-[#EAEAEA]/60 dark:border-transparent"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Typical Tools */}
                  {preset.tools && preset.tools.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Typical Tools:
                      </span>
                      <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
                        {preset.tools.slice(0, 4).join(" • ")}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-5 pt-3 border-t border-[#EAEAEA] dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {preset.targetDuration.replace("_", " ")} • {preset.hoursPerWeek} hrs/wk (~{preset.totalEstimatedHours}h)
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform text-slate-400 font-bold">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
