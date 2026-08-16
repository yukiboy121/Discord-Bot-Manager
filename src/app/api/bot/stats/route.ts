import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { botGlobalStats, guilds, securityEvents, moderationCases } from "@/db/schema";
import { sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  let session = await getSession(request);
  if (!session) {
    if (process.env.NODE_ENV === "development") {
      session = { sub: "local_dev_user", username: "Local Dev", avatar: null };
    } else {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

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
      isOnline: false,
      totalUsers: 0,
      messagesProcessed: 0,
      commandsExecuted: 0,
      botLatency: 0,
      apiLatency: 0,
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
