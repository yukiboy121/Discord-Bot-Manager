import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { moderationCases } from "@/db/schema";
import { eq, desc, sql, and, or, ilike } from "drizzle-orm";

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
  const search = searchParams.get("search");
  const action = searchParams.get("action");
  const offset = (page - 1) * limit;

  const baseCondition = eq(moderationCases.guildId, guildId);

  const whereConditions = [];
  whereConditions.push(baseCondition);

  if (action) {
    whereConditions.push(eq(moderationCases.action, action));
  }

  if (search) {
    whereConditions.push(
      or(
        ilike(moderationCases.targetUsername, `%${search}%`),
        ilike(moderationCases.moderatorUsername, `%${search}%`),
        ilike(moderationCases.reason, `%${search}%`),
        eq(moderationCases.targetId, search)
      )!
    );
  }

  const cases = await db
    .select()
    .from(moderationCases)
    .where(and(...whereConditions))
    .orderBy(desc(moderationCases.createdAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(moderationCases)
    .where(eq(moderationCases.guildId, guildId));

  return NextResponse.json({
    cases,
    total: Number(countResult[0].count),
    page,
    totalPages: Math.ceil(Number(countResult[0].count) / limit),
  });
}
