import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const baseUrl = process.env.WEB_APP_URL || request.nextUrl.origin;
  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set("sentinel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function GET(request: NextRequest) {
  const baseUrl = process.env.WEB_APP_URL || request.nextUrl.origin;
  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set("sentinel_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 0,
    path: "/",
  });
  return response;
}

