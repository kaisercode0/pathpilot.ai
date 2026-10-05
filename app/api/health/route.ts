import { NextResponse } from "next/server";
import { safeDbCall } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const isAiConfigured = Boolean(
    apiKey &&
      apiKey.trim() !== "" &&
      !apiKey.includes("your_anthropic_api_key_here") &&
      !apiKey.includes("your-api-key-here") &&
      !apiKey.includes("placeholder")
  );

  let isDbConnected = false;
  const dbTest = await safeDbCall(async (prisma) => {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  });

  if (dbTest === true) {
    isDbConnected = true;
  }

  return NextResponse.json(
    {
      status: "ok",
      database: isDbConnected ? "connected" : "disconnected",
      ai: isAiConfigured ? "available" : "fallback",
    },
    { status: 200 }
  );
}
