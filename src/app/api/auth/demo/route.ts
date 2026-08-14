import { NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { db } from "@/db";
import { dashboardUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const baseUrl = process.env.WEB_APP_URL || "http://localhost:3000";

  // Demo user for when Discord OAuth is not configured
  const demoUser = {
    id: "000000000000000001",
    username: "DemoAdmin",
    avatar: null,
  };

  const existing = await db
    .select()
    .from(dashboardUsers)
    .where(eq(dashboardUsers.discordId, demoUser.id))
    .limit(1);

  if (existing.length === 0) {
    await db.insert(dashboardUsers).values({
      discordId: demoUser.id,
      username: demoUser.username,
      displayName: "Demo Administrator",
      avatar: null,
      email: "demo@sentinel.bot",
    });
  }

  const token = await createToken({
    sub: demoUser.id,
    username: demoUser.username,
    avatar: null,
  });

  const response = NextResponse.redirect(`${baseUrl}/dashboard`);
  response.cookies.set("sentinel_token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });

  return response;
}
