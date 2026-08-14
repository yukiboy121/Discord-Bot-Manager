import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { antiNukeConfig, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;

  const config = await db.select().from(antiNukeConfig).where(eq(antiNukeConfig.guildId, guildId)).limit(1);
  if (config.length === 0) {
    const newConfig = await db.insert(antiNukeConfig).values({ guildId }).returning();
    return NextResponse.json(newConfig[0]);
  }
  return NextResponse.json(config[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;
  const body = await request.json();

  const existing = await db.select().from(antiNukeConfig).where(eq(antiNukeConfig.guildId, guildId)).limit(1);

  let result;
  if (existing.length === 0) {
    result = await db.insert(antiNukeConfig).values({ guildId, ...body }).returning();
  } else {
    result = await db.update(antiNukeConfig).set({ ...body, updatedAt: new Date() }).where(eq(antiNukeConfig.guildId, guildId)).returning();
  }

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: "Updated anti-nuke configuration",
    details: body,
    category: "security",
  });

  return NextResponse.json(result[0]);
}
