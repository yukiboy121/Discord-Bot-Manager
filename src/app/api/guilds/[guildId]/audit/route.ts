import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { auditLogs } from "@/db/schema";
import { eq, desc, sql } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;

  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "20");
  const offset = (page - 1) * limit;

  const logs = await db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.guildId, guildId))
    .orderBy(desc(auditLogs.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(auditLogs)
    .where(eq(auditLogs.guildId, guildId));

  return NextResponse.json({
    logs,
    total: Number(countResult[0].count),
    page,
    totalPages: Math.ceil(Number(countResult[0].count) / limit),
  });
}
