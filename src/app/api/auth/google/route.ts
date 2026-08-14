import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.WEB_APP_URL || request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;
  
  if (!clientId) {
    return NextResponse.redirect(new URL("/api/auth/demo", baseUrl));
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
