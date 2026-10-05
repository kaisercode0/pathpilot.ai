import Anthropic from "@anthropic-ai/sdk";
import {
  RoadmapRequest,
  RoadmapResponse,
  RoadmapResponseSchema,
} from "./schemas";
import { findMatchingRole, validateRoadmapAgainstRole } from "./validation";

export type AnthropicErrorCode =
  | "ANTHROPIC_KEY_MISSING"
  | "ANTHROPIC_KEY_INVALID"
  | "RATE_LIMIT_EXCEEDED"
  | "NETWORK_ERROR"
  | "INVALID_AI_RESPONSE"
  | "SCHEMA_VALIDATION_FAILED";

export class AnthropicGenerationError extends Error {
  code: AnthropicErrorCode;
  statusCode: number;

  constructor(code: AnthropicErrorCode, message: string, statusCode: number = 400) {
    super(message);
    this.name = "AnthropicGenerationError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

const SYSTEM_PROMPT = `You are PathPilot AI, an expert career advisor and technical curriculum architect for college students and career switchers.
Your mission is to generate a comprehensive, structured, step-by-step learning roadmap tailored strictly to the student's specified career goal, current skills, experience level, weekly hours, and target duration.

STRICT DOMAIN ACCURACY & ISOLATION RULES:
1. Output ONLY a valid JSON object conforming strictly to the requested schema. Do not include introductory text or trailing commentary.
2. Structure the roadmap into logical sequential phases matching the career track.
3. CRITICAL DOMAIN ACCURACY: The generated roadmap MUST strictly reflect the specific career domain requested.
   - Do NOT introduce technologies or frameworks from unrelated career domains.
   - For Cybersecurity & Security Operations: Focus strictly on Networking (TCP/IP, DNS, Linux/Windows), Security Fundamentals (CIA triad, OWASP), SOC Operations & SIEM (Splunk/Elastic, Log Triage), Threat Intelligence (MITRE ATT&CK, IOCs), Incident Response (Forensics, Containment), and a Capstone SOC Home Lab. DO NOT include React, Next.js, TypeScript, Prisma, or full-stack web development.
4. Each phase MUST contain realistic estimated weeks, estimated hours, a practical milestone capstone project with deliverables, and actionable tasks.
5. Each task must have a category ("concept", "project", "practice", "reading", or "milestone"), estimated hours, domain-relevant skills covered, high-quality learning resources with free/freemium/paid status labels, and practical advisor tips.
6. Provide actionable career insights: in-demand domain skills, recommended certifications, portfolio project tips, technical interview focus areas, and prospective job titles.
7. The sum of task hours in each phase must align with the user's weekly commitment and total target duration.`;

export async function generateRoadmapWithClaude(
  request: RoadmapRequest
): Promise<RoadmapResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (
    !apiKey ||
    apiKey.trim() === "" ||
    apiKey.includes("your_anthropic_api_key_here") ||
    apiKey.includes("your-api-key-here") ||
    apiKey.includes("placeholder")
  ) {
    throw new AnthropicGenerationError(
      "ANTHROPIC_KEY_MISSING",
      "ANTHROPIC_API_KEY is missing or unconfigured in the environment. Please add your Anthropic API key to .env.local to enable live AI generation, or select 'Load Demo Roadmap' to view the curated career path offline.",
      401
    );
  }

  const roleConfig = findMatchingRole(request.careerGoal);
  const anthropic = new Anthropic({
    apiKey: apiKey.trim(),
  });

  const skillsList = Array.isArray(request.currentSkills)
    ? request.currentSkills.join(", ")
    : request.currentSkills;

  const durationText =
    request.targetDuration === "1_month"
      ? "1 Month (Intensive 4 weeks)"
      : request.targetDuration === "3_months"
      ? "3 Months (12 weeks quarter)"
      : request.targetDuration === "6_months"
      ? "6 Months (24 weeks in-depth)"
      : "12 Months (52 weeks comprehensive)";

  const isCybersecurity =
    request.careerGoal.toLowerCase().includes("cyber") ||
    request.careerGoal.toLowerCase().includes("security") ||
    request.careerGoal.toLowerCase().includes("soc") ||
    request.careerGoal.toLowerCase().includes("infosec");

  const forbiddenTechList =
    roleConfig?.forbiddenTech ||
    (isCybersecurity
      ? ["react", "next.js", "typescript", "prisma", "drizzle", "tailwind", "server components", "full-stack"]
      : []);

  const roleContextPrompt = roleConfig
    ? `
ROLE: ${roleConfig.title}
ROLE ID: ${roleConfig.id}
CATEGORY: ${roleConfig.category}
ALLOWED SKILLS: ${roleConfig.skills.join(", ")}
ALLOWED TECHNOLOGIES: ${roleConfig.technologies.join(", ")}
FORBIDDEN TECHNOLOGIES (STRICTLY PROHIBITED): ${forbiddenTechList.join(", ")}
REQUIRED PHASES: ${roleConfig.phases.map((p) => `Phase ${p.phaseNumber}: ${p.title} (${p.description})`).join(" -> ")}
AVAILABLE FREE RESOURCES: ${roleConfig.freeLearningResources.map((r) => `${r.title} (${r.provider})`).join(", ")}
CAPSTONE PROJECT: ${roleConfig.capstoneProject.title}`
    : `
ROLE: ${request.careerGoal}
${forbiddenTechList.length > 0 ? `FORBIDDEN TECHNOLOGIES (STRICTLY PROHIBITED): ${forbiddenTechList.join(", ")}` : ""}
STRICT RULE: Strictly adhere to the requested role's domain. Do NOT include generic web development, React, Next.js, or full-stack templates.`;

  const userPrompt = `Generate a structured career roadmap with the following parameters:
- Career Goal: "${request.careerGoal}"
${roleContextPrompt}
- Current Skills/Knowledge: "${skillsList}"
- Experience Level: ${request.experienceLevel}
- Available Hours Per Week: ${request.hoursPerWeek} hours/week
- Target Duration: ${durationText}
- Learning Style Preference: ${request.learningStyle || "balanced"}

Respond ONLY with a valid JSON object with this exact structure:
{
  "id": "roadmap-generated-id",
  "careerGoal": "${request.careerGoal}",
  "title": "Clear Inspiring Title",
  "summary": "2-3 sentence overview of this personalized learning journey.",
  "experienceLevel": "${request.experienceLevel}",
  "hoursPerWeek": ${request.hoursPerWeek},
  "targetDuration": "${durationText}",
  "totalEstimatedHours": <number: total calculated hours>,
  "phases": [
    {
      "id": "phase-1",
      "phaseNumber": 1,
      "title": "Phase Title",
      "description": "Phase description...",
      "estimatedWeeks": <number>,
      "estimatedHours": <number>,
      "milestoneProject": {
        "title": "Capstone Project Title",
        "description": "Project overview...",
        "deliverables": ["Deliverable 1", "Deliverable 2"],
        "estimatedHours": <number>
      },
      "tasks": [
        {
          "id": "task-1-1",
          "title": "Task Title",
          "description": "Actionable task instructions...",
          "estimatedHours": <number>,
          "category": "concept" | "project" | "practice" | "reading" | "milestone",
          "skillsCovered": ["Skill 1", "Skill 2"],
          "resources": [
            {
              "title": "Resource Name",
              "url": "https://...",
              "type": "doc" | "tutorial" | "video" | "interactive" | "book" | "course" | "repo",
              "isFree": true,
              "provider": "Resource Provider",
              "whyUseful": "Why this resource is useful",
              "recommendedOrder": 1,
              "status": "FREE" | "FREEMIUM" | "PAID"
            }
          ],
          "tips": "Practical tip for completing this task effectively...",
          "completed": false
        }
      ]
    }
  ],
  "careerInsights": {
    "inDemandSkills": ["Skill A", "Skill B"],
    "recommendedCertifications": ["Cert 1", "Cert 2"],
    "portfolioTips": ["Tip 1", "Tip 2"],
    "interviewPrepFocus": ["Topic 1", "Topic 2"],
    "potentialJobTitles": ["Job 1", "Job 2"]
  }
}`;

  let response;
  try {
    response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      temperature: 0.2,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
  } catch (error: unknown) {
    if (error instanceof AnthropicGenerationError) {
      throw error;
    }
    if (error instanceof Anthropic.AuthenticationError || (error as { status?: number })?.status === 401) {
      throw new AnthropicGenerationError(
        "ANTHROPIC_KEY_INVALID",
        "The provided ANTHROPIC_API_KEY is invalid or expired. Please verify your credentials in .env.local.",
        401
      );
    }
    if (error instanceof Anthropic.RateLimitError || (error as { status?: number })?.status === 429) {
      throw new AnthropicGenerationError(
        "RATE_LIMIT_EXCEEDED",
        "Anthropic API rate limit exceeded. Please wait a moment before trying again, or select 'Load Demo Roadmap'.",
        429
      );
    }
    if (
      error instanceof Anthropic.APIConnectionError ||
      error instanceof Anthropic.APIConnectionTimeoutError ||
      (error as { code?: string })?.code === "ENOTFOUND" ||
      (error as { code?: string })?.code === "ECONNREFUSED" ||
      (error as Error)?.message?.includes("fetch failed")
    ) {
      throw new AnthropicGenerationError(
        "NETWORK_ERROR",
        "Network connection error: Unable to reach Anthropic API servers. Please check your internet connection.",
        503
      );
    }
    throw new AnthropicGenerationError(
      "INVALID_AI_RESPONSE",
      `AI generation failed: ${(error as Error)?.message || String(error)}`,
      502
    );
  }

  const firstBlock = response.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    throw new AnthropicGenerationError(
      "INVALID_AI_RESPONSE",
      "No valid text response content was received from the AI model.",
      502
    );
  }

  let textContent = firstBlock.text.trim();
  if (textContent.startsWith("```json")) {
    textContent = textContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (textContent.startsWith("```")) {
    textContent = textContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  let rawJson: unknown;
  try {
    rawJson = JSON.parse(textContent);
  } catch {
    throw new AnthropicGenerationError(
      "INVALID_AI_RESPONSE",
      "The AI model returned output that could not be parsed as valid JSON.",
      502
    );
  }

  let parsedRoadmap: RoadmapResponse;
  try {
    parsedRoadmap = RoadmapResponseSchema.parse({
      ...(rawJson as object),
      id: (rawJson as { id?: string }).id || `roadmap-${Date.now()}`,
      isFallback: false,
      generatedAt: new Date().toISOString(),
    });
  } catch (zodErr: unknown) {
    const errMsg = zodErr instanceof Error ? zodErr.message : String(zodErr);
    throw new AnthropicGenerationError(
      "SCHEMA_VALIDATION_FAILED",
      `AI generated roadmap failed schema structure validation: ${errMsg}`,
      422
    );
  }

  // Validate AI output against role validation engine
  const validation = validateRoadmapAgainstRole(request.careerGoal, parsedRoadmap, request);
  if (!validation.valid) {
    throw new AnthropicGenerationError(
      "SCHEMA_VALIDATION_FAILED",
      `AI generated roadmap failed role relevance validation: ${validation.reason}`,
      422
    );
  }

  return parsedRoadmap;
}
