import { redirect } from "next/navigation";
import { getSession, getDiscordAvatarUrl } from "@/lib/auth";
import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Sidebar
        user={{
          username: session.username,
          avatarUrl: getDiscordAvatarUrl(session.sub, session.avatar),
        }}
      />
      <main className="lg:pl-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
