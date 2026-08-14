import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { db } from "@/db";
import { dashboardUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.WEB_APP_URL || request.nextUrl.origin;

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        code,
        grant_type: "authorization_code",
        redirect_uri: `${baseUrl}/api/auth/google/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/?error=token_failed`);
    }

    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();

    if (!userData.email) {
      return NextResponse.redirect(`${baseUrl}/?error=no_email`);
    }

    let userRecord = await db.select().from(dashboardUsers).where(eq(dashboardUsers.email, userData.email)).limit(1).then(res => res[0]);

    if (userRecord) {
      await db.update(dashboardUsers).set({
        lastLogin: new Date(),
        avatar: userRecord.avatar || userData.picture,
        displayName: userRecord.displayName || userData.name,
      }).where(eq(dashboardUsers.id, userRecord.id));
    } else {
      const discordId = crypto.randomUUID().replace(/-/g, "");
      await db.insert(dashboardUsers).values({
        discordId,
        username: userData.email.split("@")[0],
        displayName: userData.name,
        avatar: userData.picture,
        email: userData.email,
        lastLogin: new Date(),
      });
      userRecord = await db.select().from(dashboardUsers).where(eq(dashboardUsers.email, userData.email)).limit(1).then(res => res[0]);
    }

    const token = await createToken({
      sub: userRecord.discordId,
      username: userRecord.username,
      avatar: userRecord.avatar,
    });

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set("sentinel_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
