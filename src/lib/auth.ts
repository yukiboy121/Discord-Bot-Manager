import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "sentinel-bot-super-secret-jwt-key-change-in-production"
);

export interface JWTPayload {
  sub: string;
  username: string;
  avatar: string | null;
  exp?: number;
}

export async function createToken(payload: Omit<JWTPayload, "exp">): Promise<string> {
  return new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

import type { NextRequest } from "next/server";

export async function getSession(request?: NextRequest): Promise<JWTPayload | null> {
  let token: string | undefined;
  if (request) {
    token = request.cookies.get("sentinel_token")?.value;
  } else {
    const cookieStore = await cookies();
    token = cookieStore.get("sentinel_token")?.value;
  }
  if (!token) return null;
  return verifyToken(token);
}

export function getDiscordAvatarUrl(userId: string, avatar: string | null): string {
  if (!avatar) {
    try {
      if (/^\d+$/.test(userId)) {
        const defaultIndex = Number(BigInt(userId) >> BigInt(22)) % 6;
        return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
      }
    } catch {
      // Fallback below
    }
    return `https://cdn.discordapp.com/embed/avatars/0.png`;
  }
  // If avatar is a URL (e.g. from Google login), just return it directly
  if (avatar.startsWith("http")) {
    return avatar;
  }
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png`;
}

export function getGuildIconUrl(guildId: string, icon: string | null): string | null {
  if (!icon) return null;
  return `https://cdn.discordapp.com/icons/${guildId}/${icon}.png`;
}
