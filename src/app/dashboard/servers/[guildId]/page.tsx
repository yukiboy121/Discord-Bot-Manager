"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, getSeverityColor, getActionColor } from "@/lib/utils";

interface GuildData {
  guild: { name: string; memberCount: number; guildId: string };
  security: { antiSpamEnabled: boolean; antiRaidEnabled: boolean; antiNukeEnabled: boolean; raidModeActive: boolean } | null;
  recentEvents: Array<{ id: number; type: string; severity: string; description: string; createdAt: string }>;
  recentCases: Array<{ id: number; caseNumber: number; action: string; targetUsername: string | null; reason: string | null; createdAt: string }>;
  dailyStats: Array<{ date: string; memberCount: number; messagesCount: number; securityEvents: number; moderationActions: number }>;
}

export default function GuildOverviewPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [data, setData] = useState<GuildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/guilds/${guildId}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [guildId]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">{data.guild.name}</h1>
          <p className="text-gray-400 mt-1">Server overview and statistics</p>
        </div>
        {data.security?.raidModeActive && (
          <Badge variant="destructive" className="text-sm px-4 py-1.5 animate-pulse">
            🚨 RAID MODE ACTIVE
          </Badge>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Members" value={data.guild.memberCount ?? 0} icon="👥" gradient="from-green-500 to-emerald-500" />
        <StatCard label="Security Events" value={data.recentEvents?.length ?? 0} icon="🛡️" gradient="from-red-500 to-orange-500" />
        <StatCard label="Mod Actions" value={data.recentCases?.length ?? 0} icon="⚖️" gradient="from-purple-500 to-pink-500" />
        <StatCard
          label="Messages Today"
          value={data.dailyStats?.[0]?.messagesCount ?? 0}
          icon="💬"
          gradient="from-cyan-500 to-blue-500"
        />
      </div>

      {/* Security Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>🛡️</span> Security Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Anti-Spam", enabled: data.security?.antiSpamEnabled },
              { label: "Anti-Raid", enabled: data.security?.antiRaidEnabled },
              { label: "Anti-Nuke", enabled: data.security?.antiNukeEnabled },
              { label: "Raid Mode", enabled: data.security?.raidModeActive, isAlert: true },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-700/30 border border-gray-700/50">
                <span className="text-sm text-gray-300">{item.label}</span>
                <div className={`w-3 h-3 rounded-full ${
                  item.isAlert
                    ? item.enabled ? "bg-red-400 animate-pulse" : "bg-gray-500"
                    : item.enabled ? "bg-green-400" : "bg-gray-500"
                }`} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activity Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>📊</span> Server Activity (30 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between h-40 gap-1">
            {(data.dailyStats || []).reverse().map((stat, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t hover:opacity-100 opacity-70 transition-opacity relative group"
                style={{ height: `${Math.max(5, (stat.messagesCount / Math.max(...(data.dailyStats || []).map(s => s.messagesCount || 1))) * 100)}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {stat.messagesCount} msgs
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚨</span> Recent Security Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!data.recentEvents || data.recentEvents.length === 0) ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent security events</p>
            ) : (
              <div className="space-y-3">
                {data.recentEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-700/20 border border-gray-700/50">
                    <Badge className={getSeverityColor(event.severity)} variant="outline">
                      {event.severity}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-200 truncate">{event.description}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(event.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Moderation Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>⚖️</span> Recent Moderation Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(!data.recentCases || data.recentCases.length === 0) ? (
              <p className="text-gray-500 text-sm text-center py-8">No recent moderation actions</p>
            ) : (
              <div className="space-y-3">
                {data.recentCases.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/20 border border-gray-700/50">
                    <span className={`text-sm font-medium capitalize ${getActionColor(c.action)}`}>
                      {c.action}
                    </span>
                    <span className="text-sm text-gray-300 flex-1 truncate">
                      {c.targetUsername || "Unknown"}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
