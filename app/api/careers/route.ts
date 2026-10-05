import { NextResponse } from "next/server";
import { CAREER_ROLES } from "@/lib/career-roles";
import { safeDbCall } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dbRoles = await safeDbCall(async (prisma) => {
      return await prisma.careerRole.findMany({
        orderBy: { title: "asc" },
      });
    });

    if (dbRoles && dbRoles.length > 0) {
      return NextResponse.json({
        success: true,
        count: dbRoles.length,
        careers: dbRoles,
      });
    }

    // Fallback to in-memory CAREER_ROLES dataset
    const localRoles = Object.values(CAREER_ROLES).map((role) => ({
      id: role.id,
      title: role.title,
      category: role.category,
      filterCategory: role.filterCategory,
      description: role.description,
      skills: role.skills,
      tools: role.tools,
      technologies: role.technologies,
      degree: "Bachelor's in CS / IT or equivalent self-taught portfolio",
    }));

    return NextResponse.json({
      success: true,
      count: localRoles.length,
      careers: localRoles,
    });
  } catch (error) {
    console.error("Error in GET /api/careers:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch career roles.",
        },
      },
      { status: 500 }
    );
  }
}
