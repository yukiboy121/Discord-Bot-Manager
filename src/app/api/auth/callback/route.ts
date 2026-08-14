import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/lib/auth";
import { db } from "@/db";
import { dashboardUsers } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const baseUrl = process.env.WEB_APP_URL || "http://localhost:3000";

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/?error=no_code`);
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: process.env.DISCORD_CLIENT_ID || "",
        client_secret: process.env.DISCORD_CLIENT_SECRET || "",
        grant_type: "authorization_code",
        code,
        redirect_uri: `${baseUrl}/api/auth/callback`,
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/?error=token_failed`);
    }

    // Get user info
    const userResponse = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const userData = await userResponse.json();

    // Save user to database
    const existing = await db
      .select()
      .from(dashboardUsers)
      .where(eq(dashboardUsers.discordId, userData.id))
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(dashboardUsers)
        .set({
          username: userData.username,
          displayName: userData.global_name || userData.username,
          avatar: userData.avatar,
          email: userData.email,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
          lastLogin: new Date(),
        })
        .where(eq(dashboardUsers.discordId, userData.id));
    } else {
      await db.insert(dashboardUsers).values({
        discordId: userData.id,
        username: userData.username,
        displayName: userData.global_name || userData.username,
        avatar: userData.avatar,
        email: userData.email,
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        tokenExpiry: new Date(Date.now() + tokenData.expires_in * 1000),
        lastLogin: new Date(),
      });
    }

    // Create JWT
    const token = await createToken({
      sub: userData.id,
      username: userData.username,
      avatar: userData.avatar,
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
    console.error("OAuth callback error:", error);
    return NextResponse.redirect(`${baseUrl}/?error=auth_failed`);
  }
}
