import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { autoModRules, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;

  const rules = await db.select().from(autoModRules).where(eq(autoModRules.guildId, guildId));
  return NextResponse.json(rules);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;
  const body = await request.json();

  const result = await db.insert(autoModRules).values({
    guildId,
    name: body.name,
    type: body.type,
    enabled: body.enabled ?? true,
    config: body.config ?? {},
    action: body.action ?? "delete",
    exemptRoles: body.exemptRoles ?? [],
    exemptChannels: body.exemptChannels ?? [],
  }).returning();

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: `Created auto-mod rule: ${body.name}`,
    details: body,
    category: "config",
  });

  return NextResponse.json(result[0]);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ guildId: string }> }
) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { guildId } = await params;
  const body = await request.json();

  if (!body.id) return NextResponse.json({ error: "Rule ID required" }, { status: 400 });

  const result = await db.update(autoModRules)
    .set({ ...body, updatedAt: new Date() })
    .where(eq(autoModRules.id, body.id))
    .returning();

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: `Updated auto-mod rule: ${body.name || body.id}`,
    details: body,
    category: "config",
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

  await db.delete(autoModRules).where(eq(autoModRules.id, body.id));

  await db.insert(auditLogs).values({
    guildId,
    userId: session.sub,
    username: session.username,
    action: `Deleted auto-mod rule ID: ${body.id}`,
    category: "config",
  });

  return NextResponse.json({ success: true });
}
