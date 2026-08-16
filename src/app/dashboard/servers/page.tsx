"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatNumber } from "@/lib/utils";

interface Guild {
  id: number;
  guildId: string;
  name: string;
  icon: string | null;
  memberCount: number;
  premium: boolean;
}

export default function ServersPage() {
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/api/guilds", { credentials: "include" })
      .then((r) => r.json())
      .then(setGuilds)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading servers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Servers</h1>
        <p className="text-gray-400 mt-1">Select a server to manage its settings.</p>
      </div>

      {guilds.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">🏠</div>
          <h2 className="text-xl font-semibold text-white mb-2">No servers found</h2>
          <p className="text-gray-400 mb-6">The bot hasn&apos;t been added to any servers yet, or demo data hasn&apos;t been seeded.</p>
          <Button onClick={() => apiFetch("/api/seed", { method: "POST" }).then(() => window.location.reload())}>
            Load Demo Data
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {guilds.map((guild) => (
            <Link key={guild.guildId} href={`/dashboard/servers/${guild.guildId}`}>
              <Card className="p-6 hover:border-indigo-500/30 transition-all duration-300 group cursor-pointer h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold shrink-0 group-hover:shadow-lg group-hover:shadow-indigo-500/30 transition-shadow">
                    {guild.name[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-semibold truncate group-hover:text-indigo-300 transition-colors">
                      {guild.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-400">
                        👥 {formatNumber(guild.memberCount ?? 0)} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      {guild.premium && (
                        <Badge variant="warning">⭐ Premium</Badge>
                      )}
                      <Badge variant="success">Protected</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

