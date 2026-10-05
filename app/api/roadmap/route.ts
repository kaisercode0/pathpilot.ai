import { NextRequest, NextResponse } from "next/server";
import { RoadmapRequestSchema } from "@/lib/schemas";
import { generateRoadmapWithClaude } from "@/lib/anthropic";
import { generateCuratedFallbackRoadmap } from "@/lib/fallback-roadmaps";
import { saveRoadmapToDatabase } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    let bodyJson: Record<string, unknown> = {};
    try {
      bodyJson = (await req.json()) as Record<string, unknown>;
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "The request body must be valid JSON format.",
          },
        },
        { status: 400 }
      );
    }

    // 1. Validate incoming request payload with Zod
    const validationResult = RoadmapRequestSchema.safeParse(bodyJson);
    if (!validationResult.success) {
      const issues = validationResult.error.issues;
      const firstIssue = issues[0]?.message || "Please check your input values and try again.";
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: firstIssue,
          },
          fieldErrors: validationResult.error.format(),
        },
        { status: 400 }
      );
    }

    const validatedInput = validationResult.data;
    const apiKey = process.env.ANTHROPIC_API_KEY;

    const isKeyConfigured = Boolean(
      apiKey &&
      apiKey.trim() !== "" &&
      !apiKey.includes("your_anthropic_api_key_here") &&
      !apiKey.includes("your-api-key-here") &&
      !apiKey.includes("placeholder")
    );

    // 2. If Anthropic API key is properly configured, attempt live Claude generation
    if (isKeyConfigured) {
      try {
        const liveRoadmap = await generateRoadmapWithClaude(validatedInput);

        // Asynchronously persist roadmap to PostgreSQL database
        await saveRoadmapToDatabase(liveRoadmap, "anthropic-claude");

        return NextResponse.json(liveRoadmap, {
          status: 200,
          headers: {
            "X-PathPilot-Provider": "anthropic-claude",
          },
        });
      } catch (aiError: unknown) {
        const errorMessage =
          aiError instanceof Error ? aiError.message : String(aiError);
        console.warn("Live Anthropic generation failed, serving curated domain fallback:", errorMessage);

        // Fall back seamlessly to curated career-specific roadmap if live API fails
        try {
          const fallbackRoadmap = generateCuratedFallbackRoadmap(validatedInput);

          await saveRoadmapToDatabase(fallbackRoadmap, "curated-domain-fallback", errorMessage);

          return NextResponse.json(
            {
              ...fallbackRoadmap,
              isFallback: true,
              fallbackNotice: `AI Generation Notice: (${errorMessage}). Served a high-fidelity curated roadmap tailored to your career goal.`,
            },
            {
              status: 200,
              headers: {
                "X-PathPilot-Provider": "curated-domain-fallback",
                "X-PathPilot-Notice": errorMessage,
              },
            }
          );
        } catch (fallbackErr: unknown) {
          const msg = fallbackErr instanceof Error ? fallbackErr.message : String(fallbackErr);
          return NextResponse.json(
            {
              success: false,
              error: {
                code: "NOT_FOUND",
                message: msg,
              },
            },
            { status: 404 }
          );
        }
      }
    }

    // 3. If ANTHROPIC_API_KEY is unconfigured/missing/placeholder, seamlessly generate curated domain roadmap
    try {
      const fallbackRoadmap = generateCuratedFallbackRoadmap(validatedInput);

      await saveRoadmapToDatabase(fallbackRoadmap, "curated-domain-fallback", "ANTHROPIC_API_KEY missing");

      return NextResponse.json(
        {
          ...fallbackRoadmap,
          isFallback: true,
          fallbackNotice:
            "Offline Curated Mode: Generated a domain-specific career blueprint tailored to your inputs.",
        },
        {
          status: 200,
          headers: {
            "X-PathPilot-Provider": "curated-domain-fallback",
          },
        }
      );
    } catch (fallbackError: unknown) {
      const msg = fallbackError instanceof Error ? fallbackError.message : String(fallbackError);
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: msg,
          },
        },
        { status: 404 }
      );
    }
  } catch (serverError: unknown) {
    console.error("Unhandled error in /api/roadmap:", serverError);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An unexpected error occurred while generating the roadmap.",
        },
      },
      { status: 500 }
    );
  }
}
