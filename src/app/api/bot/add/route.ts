import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { botConfigs } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    let session = await getSession(request);
    if (!session) {
      if (process.env.NODE_ENV === "development") {
        // Bypass auth for local development
        session = { sub: "local_dev_user", username: "Local Dev", avatar: null };
      } else {
        const token = request.cookies.get("sentinel_token")?.value;
        return NextResponse.json({ error: `Unauthorized. Token exists: ${!!token}` }, { status: 401 });
      }
    }

    const { botToken } = await request.json();
    if (!botToken) {
      return NextResponse.json({ error: "Bot token is required" }, { status: 400 });
    }

    const discordRes = await fetch("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bot ${botToken}` },
    });

    if (!discordRes.ok) {
      return NextResponse.json({ error: "Invalid bot token" }, { status: 400 });
    }

    const botData = await discordRes.json();

    await db.insert(botConfigs).values({
      userId: session.sub,
      botToken,
      botId: botData.id,
      name: botData.username,
      avatar: botData.avatar,
    });

    return NextResponse.json({ success: true, bot: botData });
  } catch (error) {
    console.error("Add bot error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
