import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { safeDbCall } from "@/lib/db";

export const runtime = "nodejs";

const FeedbackSchema = z.object({
  rating: z
    .number()
    .int("Rating must be an integer")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
  feedback: z.string().optional().default(""),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: roadmapId } = await params;
    if (!roadmapId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Roadmap ID parameter is required.",
          },
        },
        { status: 400 }
      );
    }

    let bodyJson: unknown;
    try {
      bodyJson = await req.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Request body must be valid JSON.",
          },
        },
        { status: 400 }
      );
    }

    const validation = FeedbackSchema.safeParse(bodyJson);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Rating must be an integer between 1 and 5.",
          },
        },
        { status: 400 }
      );
    }

    const { rating, feedback } = validation.data;

    // Save feedback to PostgreSQL database if connected
    await safeDbCall(async (prisma) => {
      // Check if roadmap exists first (if not, we can still associate if ID matches or create feedback)
      const existingRoadmap = await prisma.roadmap.findUnique({
        where: { id: roadmapId },
      });

      if (existingRoadmap) {
        await prisma.roadmapFeedback.create({
          data: {
            roadmapId: existingRoadmap.id,
            rating,
            feedback,
          },
        });
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: "Feedback submitted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/roadmap/[id]/feedback:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to submit roadmap feedback.",
        },
      },
      { status: 500 }
    );
  }
}
