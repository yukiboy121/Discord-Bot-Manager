"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SidebarProps {
  guildId?: string;
  guildName?: string;
  user?: { username: string; avatarUrl: string };
}

const mainNavItems = [
  { icon: "📊", label: "Overview", href: "/dashboard" },
  { icon: "🏠", label: "Servers", href: "/dashboard/servers" },
  { icon: "🎭", label: "Bot Status", href: "/dashboard/bot-status" },
];

const guildNavItems = [
  { icon: "📊", label: "Overview", href: "" },
  { icon: "🛡️", label: "Security", href: "/security" },
  { icon: "🚫", label: "Anti-Spam", href: "/antispam" },
  { icon: "⚔️", label: "Anti-Raid", href: "/antiraid" },
  { icon: "🔒", label: "Anti-Nuke", href: "/antinuke" },
  { icon: "🤖", label: "Auto Mod", href: "/automod" },
  { icon: "⚖️", label: "Moderation", href: "/moderation" },
  { icon: "👋", label: "Welcome", href: "/welcome" },
  { icon: "👋", label: "Leave", href: "/leave" },
  { icon: "📝", label: "Logging", href: "/logging" },
  { icon: "✅", label: "Whitelist", href: "/whitelist" },
  { icon: "🔍", label: "Audit Log", href: "/audit" },
  { icon: "📡", label: "Events", href: "/events" },
];

export function Sidebar({ guildId, guildName, user }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = guildId
    ? guildNavItems.map((item) => ({
        ...item,
        href: `/dashboard/servers/${guildId}${item.href}`,
      }))
    : mainNavItems;

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-800 border border-gray-700 text-white"
      >
        {mobileOpen ? "✕" : "☰"}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 bottom-0 z-40 w-64 bg-[#111318] border-r border-gray-800/50 flex flex-col transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-4 border-b border-gray-800/50">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/30">
              S
            </div>
            <div>
              <div className="font-bold text-white text-sm">Sentinel</div>
              <div className="text-xs text-gray-500">Security Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Guild Name */}
        {guildId && guildName && (
          <div className="p-4 border-b border-gray-800/50">
            <Link href="/dashboard/servers" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
              ← Back to Servers
            </Link>
            <div className="mt-2 text-sm font-semibold text-white truncate">{guildName}</div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {!guildId && (
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 font-semibold">
              Dashboard
            </div>
          )}
          {guildId && (
            <div className="text-xs text-gray-500 uppercase tracking-wider px-3 py-2 font-semibold">
              Server Settings
            </div>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/20"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        {user && (
          <div className="p-4 border-t border-gray-800/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-sm">
                {user.username[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{user.username}</div>
                <div className="text-xs text-gray-500">Administrator</div>
              </div>
              <Link href="/api/auth/logout" className="text-gray-500 hover:text-white transition-colors text-sm">
                ⏻
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
