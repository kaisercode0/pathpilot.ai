"use client";

import React, { useState } from "react";
import {
  CompassIcon,
  BookOpenIcon,
  SparklesIcon,
  FlameIcon,
  ZapIcon,
  BellIcon,
} from "./icons/Icons";
import type { RoadmapResponse } from "@/lib/schemas";

interface NavbarProps {
  onReset: () => void;
  hasActiveRoadmap?: boolean;
  savedRoadmaps: RoadmapResponse[];
  onSelectSavedRoadmap: (roadmap: RoadmapResponse) => void;
  onExplorePresets?: () => void;
}

export function Navbar({
  onReset,
  savedRoadmaps,
  onSelectSavedRoadmap,
}: NavbarProps) {
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showHistoryDropdown, setShowHistoryDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(2);

  const sampleNotifications = [
    {
      id: "notif-1",
      title: "Phase 1 Capstone Verified! 🚀",
      description: "You've finished the frontend components checklist. Ready for API integration.",
      time: "2 hours ago",
      unread: true,
    },
    {
      id: "notif-2",
      title: "Weekly Study Target: 76% Met 🔥",
      description: "11.5 of 15 hours logged this week. Keep up the momentum!",
      time: "1 day ago",
      unread: true,
    },
    {
      id: "notif-3",
      title: "New TypeScript 5.5 Tip Added",
      description: "PathPilot Advisor added a curated resource on advanced generics.",
      time: "3 days ago",
      unread: false,
    },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 w-full border-b border-[#EAEAEA] dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Branding */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 rounded-xl p-1"
              aria-label="PathPilot AI - Return to Home"
            >
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <CompassIcon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                    PathPilot <span className="bg-gradient-to-r from-indigo-600 to-emerald-500 bg-clip-text text-transparent">AI</span>
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                    Dashboard
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:inline font-medium">
                  AI Career &amp; Pathway Navigator
                </span>
              </div>
            </button>
          </div>

          {/* Student Stats & Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Counter Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/70 text-amber-800 dark:text-amber-300 text-xs font-bold shadow-2xs">
              <FlameIcon className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>12 Days</span>
            </div>

            {/* Level & XP Pill */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800/70 text-indigo-800 dark:text-indigo-300 text-xs font-bold shadow-2xs">
              <ZapIcon className="w-3.5 h-3.5 text-indigo-500" />
              <span>Lvl 4 • 2,450 XP</span>
            </div>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setUnreadNotifications(0);
                }}
                className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
                aria-label="Notifications"
                aria-expanded={showNotifications}
              >
                <BellIcon className="w-4 h-4" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white dark:ring-slate-950" />
                )}
              </button>

              {showNotifications && (
                <div
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  role="dialog"
                  aria-label="Student Notifications"
                >
                  <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Recent Activity &amp; Alerts
                    </span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold">
                      All caught up
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {sampleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-3"
                      >
                        <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <div className="space-y-0.5 flex-1">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                            {notif.description}
                          </p>
                          <span className="text-[10px] text-slate-400 block pt-0.5">
                            {notif.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Saved Roadmaps History */}
            {savedRoadmaps.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHistoryDropdown(!showHistoryDropdown)}
                  className="px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors flex items-center gap-1.5"
                  aria-expanded={showHistoryDropdown}
                  aria-haspopup="true"
                  aria-label={`Saved Roadmaps (${savedRoadmaps.length})`}
                >
                  <BookOpenIcon className="w-4 h-4 text-indigo-500" />
                  <span className="hidden md:inline">Saved Plans</span>
                  <span className="bg-indigo-600 text-white rounded-full text-[10px] px-1.5 py-0.2 font-bold">
                    {savedRoadmaps.length}
                  </span>
                </button>

                {showHistoryDropdown && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    role="menu"
                  >
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Your Saved Pathways
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

            {/* Student Profile Avatar Pill */}
            <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                AM
              </div>
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                  Alex Morgan
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Student Member
                </span>
              </div>
            </div>

            {/* Accessibility / Help Modal Trigger */}
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              className="p-2 text-xs font-semibold rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              aria-label="Keyboard Shortcuts & Accessibility Info"
            >
              <span className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-600 flex items-center justify-center text-xs font-bold">
                ?
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Accessibility & Shortcuts Dialog */}
      {showHelpModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          aria-labelledby="help-dialog-title"
        >
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 id="help-dialog-title" className="text-lg font-bold text-slate-900 dark:text-white">
                  PathPilot Platform Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              <div className="space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">
                  Keyboard Shortcuts:
                </span>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">Tab</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">Shift+Tab</kbd> — Navigate interactive controls</li>
                  <li><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">Space</kbd> / <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">Enter</kbd> — Toggle task completion &amp; accordions</li>
                  <li><kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-xs">Esc</kbd> — Dismiss modals</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="font-bold text-slate-900 dark:text-white block">
                  WCAG 2.1 AA Accessibility:
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  PathPilot AI provides screen-reader ARIA live announcements, high contrast ratios ($&gt;4.5:1$), and complete offline graceful failover.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
              >
                Got It, Thanks!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
