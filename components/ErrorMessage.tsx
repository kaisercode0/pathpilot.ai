"use client";

import React from "react";
import { AlertCircleIcon, RefreshIcon, SparklesIcon } from "./icons/Icons";

interface ErrorMessageProps {
  message: string;
  details?: string;
  onRetry?: () => void;
  onLoadFallback?: () => void;
}

export function ErrorMessage({
  message,
  details,
  onRetry,
  onLoadFallback,
}: ErrorMessageProps) {
  const isAuthError =
    message.toLowerCase().includes("api key") ||
    message.toLowerCase().includes("401") ||
    message.toLowerCase().includes("anthropic");

  return (
    <div
      className="w-full max-w-4xl mx-auto rounded-3xl bg-red-50/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-6 sm:p-8 shadow-lg space-y-4"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-2xl bg-red-100 dark:bg-red-900/80 text-red-600 dark:text-red-300 shrink-0">
          <AlertCircleIcon className="w-6 h-6" />
        </div>
        <div className="space-y-1.5 flex-1">
          <h2 className="text-lg font-bold text-red-900 dark:text-red-100">
            Unable to Complete Generation
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed font-medium">
            {message}
          </p>
          {details && (
            <p className="text-xs text-red-600/80 dark:text-red-400 font-mono bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-red-200/50 dark:border-red-900/40 mt-2">
              {details}
            </p>
          )}
        </div>
      </div>

      {/* Troubleshooting Hint for Auth issues */}
      {isAuthError && (
        <div className="p-3.5 rounded-xl bg-white/70 dark:bg-slate-900/80 border border-red-100 dark:border-red-900/40 text-xs text-slate-700 dark:text-slate-300 space-y-1">
          <span className="font-bold text-slate-900 dark:text-white">
            Troubleshooting tip for Anthropic API Key (401 error):
          </span>
          <p className="text-slate-500 dark:text-slate-400">
            Ensure your <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">.env.local</code> file defines a valid <code className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono">ANTHROPIC_API_KEY=sk-ant-...</code>. Alternatively, click &quot;Load Demo Roadmap&quot; below to test all interactive features offline!
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="pt-2 flex flex-wrap items-center gap-3">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 transition-colors shadow-sm"
          >
            <RefreshIcon className="w-3.5 h-3.5" />
            <span>Retry Request</span>
          </button>
        )}

        {onLoadFallback && (
          <button
            type="button"
            onClick={onLoadFallback}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 transition-colors"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-indigo-500" />
            <span>Load Demo Roadmap</span>
          </button>
        )}
      </div>
    </div>
  );
}
