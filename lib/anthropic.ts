import Anthropic from "@anthropic-ai/sdk";
import { RoadmapRequest, RoadmapResponse, RoadmapResponseSchema } from "./schemas";

/**
 * System prompt instructing Claude to generate a structured, college-student tailored career roadmap.
 */
const SYSTEM_PROMPT = `You are PathPilot AI, an expert career advisor and technical curriculum architect for college students and career switchers.
Your mission is to generate a comprehensive, structured, step-by-step learning roadmap tailored to the student's career goal, current skills, experience level, weekly hours, and target duration.

IMPORTANT RULES:
1. You must output ONLY a valid JSON object conforming strictly to the requested schema. Do not wrap in markdown quotes if possible, or use standard markdown json fences.
2. Structure the roadmap into 3 to 5 logical sequential phases (e.g. Phase 1: Foundations, Phase 2: Core Engineering, Phase 3: Advanced Specialization, Phase 4: Capstone Portfolio & Interview Prep).
3. Each phase MUST contain realistic estimated weeks, estimated hours, a practical milestone capstone project with deliverables, and 2 to 4 actionable tasks.
4. Each task must have a category ("concept", "project", "practice", "reading", or "milestone"), estimated hours, skills covered, at least 1 high-quality free learning resource URL (e.g., official docs, freeCodeCamp, MDN, fast.ai, Coursera, etc.), and practical tips.
5. Provide actionable career insights: in-demand skills, top recommended certifications, portfolio project tips, interview focus areas, and prospective job titles.
6. The sum of task hours in each phase should realistically align with the user's weekly commitment and total duration.`;

export async function generateRoadmapWithClaude(
  request: RoadmapRequest
): Promise<RoadmapResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey.includes("your-api-key-here")) {
    const error = new Error("ANTHROPIC_API_KEY is not configured in the environment.");
    (error as Error & { code?: string }).code = "ANTHROPIC_KEY_MISSING";
    throw error;
  }

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

  const userPrompt = `Generate a structured career roadmap with the following parameters:
- Career Goal: "${request.careerGoal}"
- Current Skills/Knowledge: "${skillsList}"
- Experience Level: ${request.experienceLevel}
- Available Hours Per Week: ${request.hoursPerWeek} hours/week
- Target Duration: ${durationText}
- Learning Style Preference: ${request.learningStyle || "balanced"}

Please respond with ONLY a JSON object with this exact structure:
{
  "id": "roadmap-generated-id",
  "careerGoal": "${request.careerGoal}",
  "title": "Clear Inspiring Title",
  "summary": "2-3 sentence overview of this personalized learning journey and how it takes the student from current skills to employment-ready competence.",
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
              "isFree": true
            }
          ],
          "tips": "Practical tip for completing this task effectively...",
          "completed": false
        }
      ]
    }
  ],
  "careerInsights": {
    "inDemandSkills": ["Skill A", "Skill B", "Skill C"],
    "recommendedCertifications": ["Cert 1", "Cert 2"],
    "portfolioTips": ["Tip 1", "Tip 2"],
    "interviewPrepFocus": ["Topic 1", "Topic 2"],
    "potentialJobTitles": ["Job 1", "Job 2"]
  }
}`;

  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 4000,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: userPrompt }],
  });

  // Extract text content from the first text block
  const firstBlock = response.content[0];
  if (!firstBlock || firstBlock.type !== "text") {
    throw new Error("No text response received from Anthropic Claude.");
  }

  let textContent = firstBlock.text.trim();

  // Strip markdown code fences if wrapped
  if (textContent.startsWith("```json")) {
    textContent = textContent.replace(/^```json\s*/, "").replace(/\s*```$/, "");
  } else if (textContent.startsWith("```")) {
    textContent = textContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  // Parse JSON
  const rawJson = JSON.parse(textContent);

  // Validate with Zod
  const parsedRoadmap = RoadmapResponseSchema.parse({
    ...rawJson,
    id: rawJson.id || `roadmap-${Date.now()}`,
    isFallback: false,
    generatedAt: new Date().toISOString(),
  });

  return parsedRoadmap;
}
