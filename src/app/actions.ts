"use server";
import { cookies } from "next/headers";

export async function getClientToken() {
  const cookieStore = await cookies();
  return cookieStore.get("sentinel_token")?.value;
}
