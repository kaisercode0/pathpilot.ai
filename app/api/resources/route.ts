import { NextResponse } from "next/server";
import { CAREER_ROLES } from "@/lib/career-roles";
import { safeDbCall } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const dbResources = await safeDbCall(async (prisma) => {
      return await prisma.resource.findMany({
        where: { isFree: true },
        orderBy: { title: "asc" },
      });
    });

    if (dbResources && dbResources.length > 0) {
      return NextResponse.json({
        success: true,
        count: dbResources.length,
        resources: dbResources,
      });
    }

    // Extract all free learning resources from local career roles
    const resourceMap = new Map<string, { title: string; url: string; provider: string; type: string; isFree: boolean; skill?: string }>();

    for (const role of Object.values(CAREER_ROLES)) {
      for (const res of role.freeLearningResources || []) {
        if (!resourceMap.has(res.url)) {
          resourceMap.set(res.url, {
            title: res.title,
            url: res.url,
            provider: res.provider,
            type: res.type,
            isFree: res.status === "FREE",
            skill: role.skills[0] || role.title,
          });
        }
      }
    }

    const localResources = Array.from(resourceMap.values());

    return NextResponse.json({
      success: true,
      count: localResources.length,
      resources: localResources,
    });
  } catch (error) {
    console.error("Error in GET /api/resources:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch learning resources.",
        },
      },
      { status: 500 }
    );
  }
}
