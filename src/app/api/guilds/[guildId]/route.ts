import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { guilds, securityConfig, serverStats, securityEvents, moderationCases } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { guildId } = await params;

  const guild = await db.select().from(guilds).where(eq(guilds.guildId, guildId)).limit(1);
  if (guild.length === 0) {
    return NextResponse.json({ error: "Guild not found" }, { status: 404 });
  }

  const security = await db.select().from(securityConfig).where(eq(securityConfig.guildId, guildId)).limit(1);
  const recentEvents = await db.select().from(securityEvents).where(eq(securityEvents.guildId, guildId)).orderBy(desc(securityEvents.createdAt)).limit(10);
  const recentCases = await db.select().from(moderationCases).where(eq(moderationCases.guildId, guildId)).orderBy(desc(moderationCases.createdAt)).limit(10);
  const stats = await db.select().from(serverStats).where(eq(serverStats.guildId, guildId)).orderBy(desc(serverStats.date)).limit(30);

  return NextResponse.json({
    guild: guild[0],
    security: security[0] || null,
    recentEvents,
    recentCases,
    dailyStats: stats,
  });
}
