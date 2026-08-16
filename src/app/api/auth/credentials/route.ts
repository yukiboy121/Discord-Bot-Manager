import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dashboardUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const users = await db.select().from(dashboardUsers).where(eq(dashboardUsers.email, email)).limit(1);
    if (users.length === 0) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const user = users[0];
    if (!user.passwordHash) {
      return NextResponse.json({ error: "Please login with Discord or Google" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await db.update(dashboardUsers).set({ lastLogin: new Date() }).where(eq(dashboardUsers.id, user.id));

    const token = await createToken({
      sub: user.discordId,
      username: user.username,
      avatar: user.avatar,
    });

    const response = NextResponse.json({ success: true });
    response.cookies.set("sentinel_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
  }
}

