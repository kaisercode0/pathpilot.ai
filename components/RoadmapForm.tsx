"use client";

import React, { useState, useEffect } from "react";
import { RoadmapRequestSchema, type RoadmapRequest } from "@/lib/schemas";
import { SparklesIcon, ClockIcon, TargetIcon, LayersIcon, AlertCircleIcon } from "./icons/Icons";

interface RoadmapFormProps {
  onSubmit: (data: RoadmapRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<RoadmapRequest> | null;
}

export function RoadmapForm({ onSubmit, isLoading, initialValues }: RoadmapFormProps) {
  const [careerGoal, setCareerGoal] = useState("");
  const [currentSkills, setCurrentSkills] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [hoursPerWeek, setHoursPerWeek] = useState(15);
  const [targetDuration, setTargetDuration] = useState<"1_month" | "3_months" | "6_months" | "12_months">("3_months");
  const [learningStyle, setLearningStyle] = useState<"project_based" | "theory_first" | "balanced" | "certification">("balanced");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Sync initial values when user clicks a preset
  useEffect(() => {
    if (initialValues) {
      if (initialValues.careerGoal) setCareerGoal(initialValues.careerGoal);
      if (initialValues.currentSkills) {
        setCurrentSkills(
          Array.isArray(initialValues.currentSkills)
            ? initialValues.currentSkills.join(", ")
            : initialValues.currentSkills
        );
      }
      if (initialValues.experienceLevel) setExperienceLevel(initialValues.experienceLevel);
      if (initialValues.hoursPerWeek) setHoursPerWeek(initialValues.hoursPerWeek);
      if (initialValues.targetDuration) setTargetDuration(initialValues.targetDuration);
      if (initialValues.learningStyle) setLearningStyle(initialValues.learningStyle);
      setErrors({});
    }
  }, [initialValues]);

  const validate = () => {
    const skillsArray = currentSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const result = RoadmapRequestSchema.safeParse({
      careerGoal,
      currentSkills: skillsArray.length > 0 ? skillsArray : currentSkills,
      experienceLevel,
      hoursPerWeek: Number(hoursPerWeek),
      targetDuration,
      learningStyle,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (fieldName && !fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({
      careerGoal: true,
      currentSkills: true,
      experienceLevel: true,
      hoursPerWeek: true,
      targetDuration: true,
    });

    if (!validate()) return;

    const skillsArray = currentSkills
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onSubmit({
      careerGoal: careerGoal.trim(),
      currentSkills: skillsArray,
      experienceLevel,
      hoursPerWeek: Number(hoursPerWeek),
      targetDuration,
      learningStyle,
    });
  };

  // Duration labels and total hour calculation preview
  const durationMultiplier =
    targetDuration === "1_month" ? 4 : targetDuration === "3_months" ? 12 : targetDuration === "6_months" ? 24 : 52;
  const estimatedTotalHours = hoursPerWeek * durationMultiplier;

  return (
    <form
      id="roadmap-generator-form"
      onSubmit={handleSubmit}
      className="w-full max-w-4xl mx-auto rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-10 space-y-8"
      noValidate
      aria-label="Career Roadmap Generator Form"
    >
      <div className="border-b border-slate-100 dark:border-slate-800/80 pb-5">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold text-xs tracking-wider uppercase">
          <SparklesIcon className="w-4 h-4" />
          <span>Path Configuration</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
          Define Your Learning Trajectory
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Tell us where you want to go and your current foundation. We’ll generate your tailored step-by-step roadmap.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Field 1: Career Goal */}
        <div className="space-y-2">
          <label
            htmlFor="career-goal-input"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Target Career Goal <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="career-goal-input"
            type="text"
            value={careerGoal}
            onChange={(e) => {
              setCareerGoal(e.target.value);
              if (touched.careerGoal) setErrors((prev) => ({ ...prev, careerGoal: "" }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, careerGoal: true }))}
            placeholder="e.g. Full-Stack Engineer, AI Specialist, Cloud Architect"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.careerGoal && touched.careerGoal
                ? "border-red-500 focus:ring-red-400"
                : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            aria-invalid={Boolean(errors.careerGoal && touched.careerGoal)}
            aria-describedby={errors.careerGoal && touched.careerGoal ? "career-goal-error" : "career-goal-hint"}
            required
          />
          <div className="flex justify-between items-center text-xs">
            <span id="career-goal-hint" className="text-slate-500 dark:text-slate-400">
              The professional role or specialty you are working towards.
            </span>
          </div>
          {errors.careerGoal && touched.careerGoal && (
            <p id="career-goal-error" className="text-xs text-red-500 font-medium flex items-center gap-1" role="alert">
              <AlertCircleIcon className="w-3.5 h-3.5" />
              {errors.careerGoal}
            </p>
          )}
        </div>

        {/* Field 2: Current Skills */}
        <div className="space-y-2">
          <label
            htmlFor="current-skills-input"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Current Skills & Prerequisites <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <input
            id="current-skills-input"
            type="text"
            value={currentSkills}
            onChange={(e) => {
              setCurrentSkills(e.target.value);
              if (touched.currentSkills) setErrors((prev) => ({ ...prev, currentSkills: "" }));
            }}
            onBlur={() => setTouched((prev) => ({ ...prev, currentSkills: true }))}
            placeholder="e.g. HTML, Basic JavaScript, Git, Python 101"
            className={`w-full px-4 py-3 rounded-xl border text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 transition-all ${
              errors.currentSkills && touched.currentSkills
                ? "border-red-500 focus:ring-red-400"
                : "border-slate-200 dark:border-slate-700 focus:ring-indigo-500 focus:border-indigo-500"
            }`}
            aria-invalid={Boolean(errors.currentSkills && touched.currentSkills)}
            aria-describedby={errors.currentSkills && touched.currentSkills ? "skills-error" : "skills-hint"}
            required
          />
          <div className="flex justify-between items-center text-xs">
            <span id="skills-hint" className="text-slate-500 dark:text-slate-400">
              Separate skills with commas (e.g. React, SQL, Java).
            </span>
          </div>
          {errors.currentSkills && touched.currentSkills && (
            <p id="skills-error" className="text-xs text-red-500 font-medium flex items-center gap-1" role="alert">
              <AlertCircleIcon className="w-3.5 h-3.5" />
              {errors.currentSkills}
            </p>
          )}
        </div>

        {/* Field 3: Experience Level */}
        <div className="space-y-2 md:col-span-2">
          <fieldset>
            <legend className="block text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Current Experience Level <span className="text-red-500" aria-hidden="true">*</span>
            </legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  id: "beginner",
                  label: "Beginner",
                  desc: "New to programming or this specific tech domain",
                },
                {
                  id: "intermediate",
                  label: "Intermediate",
                  desc: "Comfortable with syntax, ready for full architectures",
                },
                {
                  id: "advanced",
                  label: "Advanced",
                  desc: "Experienced dev upskilling in cutting-edge specialties",
                },
              ].map((level) => (
                <label
                  key={level.id}
                  htmlFor={`exp-level-${level.id}`}
                  className={`relative p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    experienceLevel === level.id
                      ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-950 dark:text-indigo-100 ring-2 ring-indigo-500/20"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm">{level.label}</span>
                    <input
                      type="radio"
                      id={`exp-level-${level.id}`}
                      name="experienceLevel"
                      value={level.id}
                      checked={experienceLevel === level.id}
                      onChange={() => setExperienceLevel(level.id as "beginner" | "intermediate" | "advanced")}
                      className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {level.desc}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        {/* Field 4: Hours Per Week Slider */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label
              htmlFor="hours-slider"
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5"
            >
              <ClockIcon className="w-4 h-4 text-indigo-500" />
              <span>Available Time per Week</span>
            </label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
              {hoursPerWeek} hrs/week
            </span>
          </div>

          <input
            id="hours-slider"
            type="range"
            min="2"
            max="40"
            step="1"
            value={hoursPerWeek}
            onChange={(e) => setHoursPerWeek(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label="Weekly hours commitment"
          />

          <div className="flex justify-between text-[11px] text-slate-400">
            <span>2 hrs (Casual)</span>
            <span>15 hrs (Standard)</span>
            <span>40 hrs (Full-time Bootcamp)</span>
          </div>
        </div>

        {/* Field 5: Target Duration */}
        <div className="space-y-2">
          <label
            htmlFor="duration-select"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Target Timeline <span className="text-red-500" aria-hidden="true">*</span>
          </label>
          <select
            id="duration-select"
            value={targetDuration}
            onChange={(e) =>
              setTargetDuration(
                e.target.value as "1_month" | "3_months" | "6_months" | "12_months"
              )
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            aria-label="Target roadmap duration"
          >
            <option value="1_month">1 Month (Sprint / Crash Course)</option>
            <option value="3_months">3 Months (Academic Quarter / Standard)</option>
            <option value="6_months">6 Months (Semester / In-Depth)</option>
            <option value="12_months">1 Year (Comprehensive Mastery)</option>
          </select>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Projected total learning budget: <strong className="text-indigo-600 dark:text-indigo-400">~{estimatedTotalHours} hours</strong>
          </p>
        </div>

        {/* Field 6: Learning Style */}
        <div className="space-y-2 md:col-span-2">
          <label
            htmlFor="learning-style-select"
            className="block text-sm font-semibold text-slate-900 dark:text-slate-100"
          >
            Learning Approach Preference
          </label>
          <select
            id="learning-style-select"
            value={learningStyle}
            onChange={(e) =>
              setLearningStyle(
                e.target.value as "project_based" | "theory_first" | "balanced" | "certification"
              )
            }
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800/60 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            aria-label="Learning style preference"
          >
            <option value="balanced">Balanced (Hands-on projects + Core fundamentals)</option>
            <option value="project_based">Project-Heavy (Build deliverables at every step)</option>
            <option value="theory_first">Theory & System Design First (Deep engineering foundations)</option>
            <option value="certification">Industry Certification Focused (Exam readiness)</option>
          </select>
        </div>
      </div>

      {/* Action / Submit Row */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <TargetIcon className="w-4 h-4 text-emerald-500" />
          <span>Structured output verified with Zod & Anthropic Claude</span>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span>Generating Custom Roadmap...</span>
            </>
          ) : (
            <>
              <SparklesIcon className="w-4 h-4" />
              <span>Generate Career Roadmap</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
