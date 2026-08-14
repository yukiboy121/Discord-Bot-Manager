import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const redirectUri = `${process.env.WEB_APP_URL || "http://localhost:3000"}/api/auth/callback`;
  
  if (!clientId) {
    // Demo mode: redirect to demo login
    return NextResponse.redirect(new URL("/api/auth/demo", process.env.WEB_APP_URL || "http://localhost:3000"));
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email guilds",
  });

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}
