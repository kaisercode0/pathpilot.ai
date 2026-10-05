import { NextRequest, NextResponse } from "next/server";
import { findMatchingRole } from "@/lib/validation";
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
            message: "Career role ID parameter is required.",
          },
        },
        { status: 400 }
      );
    }

    const dbRole = await safeDbCall(async (prisma) => {
      return await prisma.careerRole.findUnique({
        where: { id },
      });
    });

    const localRole = findMatchingRole(id);

    if (!dbRole && !localRole) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "NOT_FOUND",
            message: `Career role '${id}' not found.`,
          },
        },
        { status: 404 }
      );
    }

    const responseRole = localRole || {
      id: dbRole!.id,
      title: dbRole!.title,
      category: dbRole!.category,
      description: dbRole!.description,
      skills: Array.isArray(dbRole!.skills) ? dbRole!.skills : [],
    };

    return NextResponse.json({
      success: true,
      career: responseRole,
    });
  } catch (error) {
    console.error("Error in GET /api/careers/[id]:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch career role details.",
        },
      },
      { status: 500 }
    );
  }
}
