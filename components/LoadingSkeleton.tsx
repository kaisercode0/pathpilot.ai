"use client";

import React, { useEffect, useState } from "react";
import { SparklesIcon, CompassIcon } from "./icons/Icons";

const LOADING_STEPS = [
  "Analyzing current skillset & experience level...",
  "Architecting phased curriculum & milestone deadlines...",
  "Calibrating task estimates to your weekly hour budget...",
  "Curating high-yield learning documentation & video tutorials...",
  "Finalizing interactive milestone capstones & interview insights...",
];

export function LoadingSkeleton() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="w-full max-w-4xl mx-auto space-y-6 py-6"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      {/* Loading Header Card */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl text-center space-y-4">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center animate-bounce shadow-md">
          <CompassIcon className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
            <SparklesIcon className="w-3 h-3 animate-spin" />
            <span>AI Architecture Engine Running</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
            Drafting Your Personalized Career Roadmap
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium transition-all duration-300">
            {LOADING_STEPS[currentStepIndex]}
          </p>
        </div>

        {/* Step Progress Dots */}
        <div className="flex justify-center items-center gap-2 pt-2">
          {LOADING_STEPS.map((_, idx) => (
            <div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                idx <= currentStepIndex
                  ? "w-8 bg-indigo-600 dark:bg-indigo-500"
                  : "w-2 bg-slate-200 dark:bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Skeleton Content Cards */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 animate-pulse">
        {/* Top Summary Skeleton */}
        <div className="space-y-3">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-lg w-1/3" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-3/4" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800/60 rounded w-1/2" />
        </div>

        {/* Stats Row Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-800 p-3 flex flex-col justify-between"
            >
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              <div className="h-5 bg-slate-300 dark:bg-slate-600 rounded w-2/3" />
            </div>
          ))}
        </div>

        {/* Phase Timeline Skeleton */}
        <div className="space-y-4 pt-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3"
            >
              <div className="flex justify-between items-center">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-20" />
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
              <div className="space-y-2 pt-2">
                <div className="h-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl" />
                <div className="h-10 bg-slate-50 dark:bg-slate-800/30 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
