import { redirect } from "next/navigation";
import { getSession, getDiscordAvatarUrl } from "@/lib/auth";
import { db } from "@/db";
import { guilds } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Sidebar } from "@/components/dashboard/sidebar";
import type { ReactNode } from "react";

export default async function GuildLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ guildId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");

  const { guildId } = await params;
  const guild = await db.select().from(guilds).where(eq(guilds.guildId, guildId)).limit(1);
  const guildName = guild[0]?.name ?? "Unknown Server";

  return (
    <div className="min-h-screen bg-[#0f1117]">
      <Sidebar
        guildId={guildId}
        guildName={guildName}
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
