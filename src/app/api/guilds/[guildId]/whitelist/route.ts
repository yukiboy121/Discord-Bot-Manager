import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { whitelists, auditLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;

  const entries = await db.select().from(whitelists).where(eq(whitelists.guildId, guildId));
  return NextResponse.json(entries);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;
  const body = await request.json();

  const result = await db.insert(whitelists).values({
    guildId,
    type: body.type,
    targetId: body.targetId,
    targetName: body.targetName,
    addedBy: session.sub,
  }).returning();

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: `Added ${body.type} whitelist entry: ${body.targetName || body.targetId}`,
    details: body,
    category: "security",
  });

  return NextResponse.json(result[0]);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;
  const body = await request.json();

  await db.delete(whitelists).where(
    and(eq(whitelists.id, body.id), eq(whitelists.guildId, guildId))
  );

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: `Removed whitelist entry ID: ${body.id}`,
    category: "security",
  });

  return NextResponse.json({ success: true });
}
