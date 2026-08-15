"use client";

import React, { useState } from "react";
import { CompassIcon, BookOpenIcon, SparklesIcon, CheckIcon } from "./icons/Icons";
import type { RoadmapResponse } from "@/lib/schemas";

interface NavbarProps {
  onReset: () => void;
  hasActiveRoadmap: boolean;
  savedRoadmaps: RoadmapResponse[];
  onSelectSavedRoadmap: (roadmap: RoadmapResponse) => void;
}

export function Navbar({
  onReset,
  hasActiveRoadmap,
  savedRoadmaps,
  onSelectSavedRoadmap,
}: NavbarProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-lg p-1"
              aria-label="PathPilot AI - Return to Home"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <CompassIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                    PathPilot <span className="text-indigo-600 dark:text-indigo-400">AI</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                    Capstone
                  </span>
                </div>
                <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline">
                  AI Career Roadmap for Students
                </span>
              </div>
            </button>
          </div>

          {/* Actions & Accessibility Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Saved Roadmaps History */}
            {savedRoadmaps.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors flex items-center gap-1.5"
                  aria-expanded={showHistoryDropdown}
                  aria-haspopup="true"
                  aria-label={`Saved Roadmaps (${savedRoadmaps.length})`}
                >
                  <BookOpenIcon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden md:inline">Saved Plans</span>
                  <span className="bg-indigo-600 text-white rounded-full text-[10px] px-1.5 py-0.2">
                    {savedRoadmaps.length}
                  </span>
                </button>

                {showHistoryDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Your Saved Roadmaps
                      </span>
                      <span className="text-[10px] text-slate-400">LocalStorage</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {savedRoadmaps.map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => {
                            onSelectSavedRoadmap(r);
                            setShowHistoryDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2.5 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 flex flex-col gap-0.5 transition-colors group focus:outline-none focus:bg-indigo-50 dark:focus:bg-indigo-950/40"
                          role="menuitem"
                        >
                          <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 line-clamp-1">
                            {r.title}
                          </span>
                          <span className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2">
                            <span>{r.experienceLevel}</span>
                            <span>•</span>
                            <span>{r.targetDuration}</span>
                            <span>•</span>
                            <span>{r.totalEstimatedHours} hrs</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Accessibility & Keyboard Guide Button */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-2 text-xs sm:text-sm font-medium rounded-lg text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              aria-label="Keyboard Shortcuts & Accessibility Info"
              title="Accessibility & Keyboard Shortcuts"
            >
              <kbd className="px-1.5 py-0.5 text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded shadow-sm">
                ? Help
              </kbd>
            </button>

            {/* Generate New Button if active roadmap */}
            {hasActiveRoadmap && (
              <button
                type="button"
                onClick={onReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 transition-all shadow-sm"
              >
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>New Roadmap</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Accessibility & Help Modal */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-modal-title"
          onClick={() => setShowHelpModal(false)}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <CompassIcon className="w-5 h-5" />
                </div>
                <h2 id="help-modal-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  Accessibility & Navigation Guide
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm text-slate-600 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-1.5">
                  <CheckIcon className="w-4 h-4 text-emerald-500" />
                  WCAG 2.1 AA Compliance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  PathPilot AI is built with accessible contrast ratios, visible focus indicators, screen reader ARIA landmarks, and semantic HTML5 structures.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                  Keyboard Shortcuts
                </h3>
                <dl className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <span>Navigate elements</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">Tab</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <span>Toggle task / Expand</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">Space / Enter</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <span>Close modals</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">Escape</kbd>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-slate-50 dark:bg-slate-800/60">
                    <span>Skip to Main Content</span>
                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono">Tab on Load</kbd>
                  </div>
                </dl>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowHelpModal(false)}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  Got It
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
