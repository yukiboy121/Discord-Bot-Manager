import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/db";
import { botStatuses, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const statuses = await db.select().from(botStatuses);
  return NextResponse.json(statuses);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const result = await db.insert(botStatuses).values({
    type: body.type,
    text: body.text,
    interval: body.interval ?? 10,
    enabled: body.enabled ?? true,
    sortOrder: body.sortOrder ?? 0,
  }).returning();

  await db.insert(auditLogs).values({
    userId: session.sub,
    username: session.username,
    action: `Added bot status: ${body.text}`,
    details: body,
    category: "config",
  });

  return NextResponse.json(result[0]);
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  if (!body.id) return NextResponse.json({ error: "Status ID required" }, { status: 400 });

  const result = await db.update(botStatuses)
    .set({
      type: body.type,
      text: body.text,
      interval: body.interval,
      enabled: body.enabled,
      sortOrder: body.sortOrder,
    })
    .where(eq(botStatuses.id, body.id))
    .returning();

  return NextResponse.json(result[0]);
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  await db.delete(botStatuses).where(eq(botStatuses.id, body.id));

  return NextResponse.json({ success: true });
}
