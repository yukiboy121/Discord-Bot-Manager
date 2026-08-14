import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { botGlobalStats, guilds, securityEvents, moderationCases } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get or create global stats
  const stats = await db.select().from(botGlobalStats).limit(1);
  
  // Get live counts
  const guildCount = await db.select({ count: sql<number>`count(*)` }).from(guilds);
  const eventCount = await db.select({ count: sql<number>`count(*)` }).from(securityEvents);
  const caseCount = await db.select({ count: sql<number>`count(*)` }).from(moderationCases);

  const totalGuilds = Number(guildCount[0].count);
  const securityIncidents = Number(eventCount[0].count);
  const moderationActions = Number(caseCount[0].count);

  if (stats.length === 0) {
    const newStats = await db.insert(botGlobalStats).values({
      totalGuilds,
      securityIncidents,
      moderationActions,
      isOnline: true,
      totalUsers: totalGuilds * 150,
      messagesProcessed: 0,
      commandsExecuted: 0,
      botLatency: 42,
      apiLatency: 38,
    }).returning();
    return NextResponse.json(newStats[0]);
  }

  // Update with live data
  const updated = await db.update(botGlobalStats).set({
    totalGuilds,
    securityIncidents,
    moderationActions,
    updatedAt: new Date(),
  }).returning();

  return NextResponse.json(updated[0]);
}
