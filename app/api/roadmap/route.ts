import { NextRequest, NextResponse } from "next/server";
import { RoadmapRequestSchema, RoadmapResponseSchema } from "@/lib/schemas";
import { generateRoadmapWithClaude } from "@/lib/anthropic";
import { generateCuratedFallbackRoadmap } from "@/lib/fallback-roadmaps";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    let bodyJson: unknown;
    try {
      bodyJson = await req.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid JSON format",
          details: "The request body must be valid JSON.",
        },
        { status: 400 }
      );
    }

    // 1. Validate incoming request payload with Zod
    const validationResult = RoadmapRequestSchema.safeParse(bodyJson);
    if (!validationResult.success) {
      const fieldErrors = validationResult.error.format();
      return NextResponse.json(
        {
          error: "Validation failed",
          message: "Please check your input values and try again.",
          fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedInput = validationResult.data;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    // 2. If Anthropic API Key is configured, attempt live Claude generation
    if (apiKey && apiKey.trim() !== "" && !apiKey.includes("your-api-key-here")) {
      try {
        const liveRoadmap = await generateRoadmapWithClaude(validatedInput);
        return NextResponse.json(liveRoadmap, {
          status: 200,
          headers: {
            "X-PathPilot-Provider": "anthropic-claude",
          },
        });
      } catch (aiError: unknown) {
        const errorMessage =
          aiError instanceof Error ? aiError.message : String(aiError);
        console.warn(
          "Anthropic API call failed. Falling back to curated domain roadmap generator.",
          errorMessage
        );

        // Serve curated fallback roadmap with clear diagnostic metadata
        const fallbackRoadmap = generateCuratedFallbackRoadmap(validatedInput);
        return NextResponse.json(
          {
            ...fallbackRoadmap,
            isFallback: true,
            fallbackNotice:
              "AI provider returned an authentication or rate limit notice (401/429). A curated, domain-specific roadmap has been generated dynamically for your inputs.",
          },
          {
            status: 200,
            headers: {
              "X-PathPilot-Provider": "curated-domain-fallback",
              "X-PathPilot-Notice": "Anthropic auth failed, serving curated roadmap",
            },
          }
        );
      }
    }

    // 3. If no Anthropic API key is provided, serve curated domain roadmap
    const fallbackRoadmap = generateCuratedFallbackRoadmap(validatedInput);
    return NextResponse.json(
      {
        ...fallbackRoadmap,
        isFallback: true,
        fallbackNotice:
          "Demo / Offline mode: ANTHROPIC_API_KEY is not set. A high-fidelity curated roadmap matching your exact inputs has been generated.",
      },
      {
        status: 200,
        headers: {
          "X-PathPilot-Provider": "curated-domain-fallback",
        },
      }
    );
  } catch (serverError: unknown) {
    console.error("Unhandled error in /api/roadmap:", serverError);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: "An unexpected error occurred while generating the roadmap.",
      },
      { status: 500 }
    );
  }
}
