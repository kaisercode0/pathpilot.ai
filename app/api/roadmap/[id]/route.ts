import { NextRequest, NextResponse } from "next/server";
import { safeDbCall } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "Roadmap ID is required.",
          },
        },
        { status: 400 }
      );
    }

    const dbRoadmap = await safeDbCall(async (prisma) => {
      return await prisma.roadmap.findUnique({
        where: { id },
        include: { steps: true },
      });
    });

    if (dbRoadmap) {
      const parsedData = typeof dbRoadmap.roadmapData === "string"
        ? JSON.parse(dbRoadmap.roadmapData)
        : dbRoadmap.roadmapData;

      return NextResponse.json({
        success: true,
        roadmap: {
          ...parsedData,
          id: dbRoadmap.id,
          createdAt: dbRoadmap.createdAt,
          isFallback: dbRoadmap.isFallback,
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "NOT_FOUND",
          message: `Roadmap with ID '${id}' was not found.`,
        },
      },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error in GET /api/roadmap/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred while retrieving the roadmap.",
        },
      },
      { status: 500 }
    );
  }
}
