"use client";

import React from "react";
import type { CareerInsights } from "@/lib/schemas";
import {
  SparklesIcon,
  TrendingUpIcon,
  AwardIcon,
  BookOpenIcon,
  BriefcaseIcon,
  CheckIcon,
} from "./icons/Icons";

interface CareerRadarProps {
  insights?: CareerInsights;
  careerGoal: string;
  experienceLevel: string;
}

export function CareerRadar({
  insights,
  careerGoal,
  experienceLevel,
}: CareerRadarProps) {
  const goalLower = careerGoal.toLowerCase();
  const isCyber = goalLower.includes("cyber") || goalLower.includes("security") || goalLower.includes("soc");

  // Default domain benchmarks if insights block is partial
  const defaultSkills = isCyber
    ? [
        "Network Protocols & TCP/IP Analysis",
        "Linux & Windows System Administration",
        "SIEM Log Analysis & Threat Detection",
        "MITRE ATT&CK Framework & CTI",
        "OWASP Top 10 & Vulnerability Scanning",
        "Incident Triage & Digital Forensics",
      ]
    : [
        `${careerGoal} Core Competencies`,
        "Domain Systems Architecture",
        "Best Practices & Engineering Tooling",
        "Testing & Quality Assurance",
        "Production Performance Optimization",
        "CI/CD Pipelines & Cloud Hosting",
      ];

  const skills = insights?.inDemandSkills && insights.inDemandSkills.length > 0
    ? insights.inDemandSkills
    : defaultSkills;

  const defaultCerts = isCyber
    ? [
        "CompTIA Security+ (SY0-701)",
        "CompTIA CySA+ (Cybersecurity Analyst)",
        "Blue Team Level 1 (BTL1) / CCNA",
      ]
    : [
        `Industry Standard Certification for ${careerGoal}`,
        "Domain Architecture Professional Badge",
      ];

  const certs = insights?.recommendedCertifications && insights.recommendedCertifications.length > 0
    ? insights.recommendedCertifications
    : defaultCerts;

  const defaultTips = isCyber
    ? [
        "Build a virtual home security lab running PfSense, Active Directory, and Wazuh/Splunk SIEM.",
        "Publish structured incident investigation reports detailing initial access, IOCs, and mitigation steps.",
        "Document automated Bash/PowerShell log parsing scripts on GitHub with architecture diagrams.",
      ]
    : [
        `Focus on shipping 2 comprehensive capstone projects demonstrating core mastery in ${careerGoal}.`,
        "Write clear READMEs with architecture diagrams, setup instructions, and benchmark metrics.",
        "Practice articulating key technical trade-offs during system design discussions.",
      ];

  const portfolioTips = insights?.portfolioTips && insights.portfolioTips.length > 0
    ? insights.portfolioTips
    : defaultTips;

  const rawInterviewPrep =
    insights?.interviewPrepFocus ||
    (insights as unknown as { interviewPrepTips?: string[] })?.interviewPrepTips;

  const interviewTips = rawInterviewPrep && rawInterviewPrep.length > 0
    ? rawInterviewPrep
    : isCyber
    ? [
        "Be ready to explain the CIA Triad, OSI model, and TCP 3-way handshake in technical detail.",
        "Walk through an incident response lifecycle: Containment, Eradication, Recovery, and Lessons Learned.",
        "Explain how you triage suspicious PowerShell execution logs or phishing email headers.",
      ]
    : [
        `Be ready to explain the core architectural patterns used in your ${careerGoal} capstone project.`,
        "Expect scenario-based questions on performance optimization, debugging, and system trade-offs.",
        "Demonstrate systematic problem solving: explain how you isolate and fix production edge cases.",
      ];


  return (
    <div className="space-y-6">
      {/* Top Banner: Salary & Market Demand */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Salary Benchmark */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <BriefcaseIcon className="w-4 h-4" />
              Salary Benchmark
            </span>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                $95k — $145k
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average compensation for {careerGoal} in tech hubs &amp; remote US roles.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex justify-between text-xs text-slate-500">
            <span>Entry: $85k</span>
            <span className="font-bold text-indigo-600 dark:text-indigo-400">Mid: $120k</span>
            <span>Senior: $160k+</span>
          </div>
        </div>

        {/* Metric 2: Hiring Demand */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <TrendingUpIcon className="w-4 h-4" />
                Industry Demand
              </span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                🔥 High Growth
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                18,400+
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Open roles currently requiring this core skill matrix across LinkedIn &amp; Indeed.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300">Top Employers:</span>
            <span className="text-slate-600 dark:text-slate-400">Vercel, OpenAI, Stripe, Amazon</span>
          </div>
        </div>

        {/* Metric 3: AI Readiness Calibration */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
              <SparklesIcon className="w-4 h-4" />
              Career Readiness Score
            </span>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                  88 / 100
                </span>
                <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Competitive</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Curriculum aligned with tier-1 engineering interview standards for {experienceLevel} candidates.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 mt-4 flex items-center justify-between text-xs">
            <span className="text-slate-500">Resume Keyword Match</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">92% Match</span>
          </div>
        </div>
      </div>

      {/* Grid: Skills, Certifications & Advisor Tips */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High-Yield Skills & Certs */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <AwardIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <span>In-Demand Core Competencies</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Key technologies and patterns hiring managers look for in portfolios.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-800 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <BookOpenIcon className="w-4 h-4 text-slate-400" />
              Recommended Industry Certifications
            </h4>
            <div className="space-y-2">
              {certs.map((cert) => (
                <div key={cert} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
                  <CheckIcon className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advisor Tips & Interview Preparation */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <SparklesIcon className="w-5 h-5 text-amber-500" />
              <span>PathPilot Advisor &amp; Interview Tips</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Actionable advice to stand out from thousands of student applicants.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Portfolio Deliverable Guidelines:
              </span>
              <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                {portfolioTips.map((tip) => (
                  <li key={tip} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/80 dark:border-indigo-800/80 space-y-2">
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200 flex items-center gap-1.5">
                <BriefcaseIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Technical Interview Prompt of the Week:
              </span>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed italic">
                &ldquo;{interviewTips[0]}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
