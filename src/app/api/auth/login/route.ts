import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.DISCORD_CLIENT_ID;
  const baseUrl = process.env.WEB_APP_URL || request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/callback`;
  
  if (!clientId) {
    // Demo mode: redirect to demo login
    return NextResponse.redirect(new URL("/api/auth/demo", baseUrl));
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "identify email guilds",
  });

  return NextResponse.redirect(`https://discord.com/api/oauth2/authorize?${params}`);
}
