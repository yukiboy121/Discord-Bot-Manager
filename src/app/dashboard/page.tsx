"use client";
import { useEffect, useState } from "react";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@/types";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bot/stats")
      .then((r) => r.json())
      .then((data) => {
        setStats({
          totalGuilds: data.totalGuilds ?? 0,
          totalUsers: data.totalUsers ?? 0,
          messagesProcessed: Number(data.messagesProcessed ?? 0),
          securityIncidents: data.securityIncidents ?? 0,
          moderationActions: data.moderationActions ?? 0,
          commandsExecuted: data.commandsExecuted ?? 0,
          botLatency: data.botLatency ?? 0,
          apiLatency: data.apiLatency ?? 0,
          isOnline: data.isOnline ?? false,
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back! Here&apos;s your bot overview.</p>
        </div>
        <Badge variant={stats?.isOnline ? "success" : "destructive"} className="text-sm px-4 py-1.5">
          <span className={`w-2 h-2 rounded-full mr-2 inline-block ${stats?.isOnline ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
          {stats?.isOnline ? "Online" : "Offline"}
        </Badge>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Servers"
          value={stats?.totalGuilds ?? 0}
          icon="🏠"
          gradient="from-indigo-500 to-blue-500"
          trend={12}
        />
        <StatCard
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          icon="👥"
          gradient="from-green-500 to-emerald-500"
          trend={8}
        />
        <StatCard
          label="Security Incidents"
          value={stats?.securityIncidents ?? 0}
          icon="🛡️"
          gradient="from-red-500 to-orange-500"
          trend={-5}
        />
        <StatCard
          label="Moderation Actions"
          value={stats?.moderationActions ?? 0}
          icon="⚖️"
          gradient="from-purple-500 to-pink-500"
          trend={3}
        />
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Messages Processed"
          value={stats?.messagesProcessed ?? 0}
          icon="💬"
          gradient="from-cyan-500 to-blue-500"
        />
        <StatCard
          label="Bot Latency"
          value={`${stats?.botLatency ?? 0}ms`}
          icon="⚡"
          gradient="from-yellow-500 to-orange-500"
        />
        <StatCard
          label="Commands Executed"
          value={stats?.commandsExecuted ?? 0}
          icon="🎮"
          gradient="from-violet-500 to-purple-500"
        />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🚀</span> Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🏠", label: "Manage Servers", href: "/dashboard/servers" },
                { icon: "🎭", label: "Bot Status", href: "/dashboard/bot-status" },
                { icon: "🛡️", label: "Security Settings", href: "/dashboard/servers" },
                { icon: "📊", label: "View Analytics", href: "/dashboard/servers" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-4 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 border border-gray-700/50 hover:border-indigo-500/30 transition-all duration-200 group"
                >
                  <span className="text-xl">{action.icon}</span>
                  <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{action.label}</span>
                </a>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📋</span> System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: "Discord Gateway", status: "Operational", color: "bg-green-400" },
                { label: "Database", status: "Operational", color: "bg-green-400" },
                { label: "API Server", status: "Operational", color: "bg-green-400" },
                { label: "Anti-Spam Engine", status: "Active", color: "bg-green-400" },
                { label: "Anti-Raid Monitor", status: "Active", color: "bg-green-400" },
                { label: "Anti-Nuke Shield", status: "Active", color: "bg-green-400" },
              ].map((service) => (
                <div key={service.label} className="flex items-center justify-between py-2 border-b border-gray-700/50 last:border-0">
                  <span className="text-sm text-gray-300">{service.label}</span>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${service.color}`} />
                    <span className="text-xs text-gray-400">{service.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
