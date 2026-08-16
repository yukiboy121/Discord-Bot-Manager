import { getClientToken } from "@/app/actions";

export async function apiFetch(url: string, options: RequestInit = {}) {
  let token;
  try {
    token = await getClientToken();
  } catch (e) {
    console.error("Failed to fetch client token", e);
  }

  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return fetch(url, {
    ...options,
    credentials: "include",
    headers,
  });
}
