import { NextResponse } from "next/server";
import { getSession, getDiscordAvatarUrl } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: session.sub,
    username: session.username,
    avatar: session.avatar,
    avatarUrl: getDiscordAvatarUrl(session.sub, session.avatar),
  });
}
