"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  { icon: "🛡️", title: "Anti-Spam Engine", desc: "Multi-layer spam detection: message, duplicate, mention, link, invite, emoji, caps, and attachment spam with configurable escalation." },
  { icon: "⚔️", title: "Anti-Raid Protection", desc: "Detect mass joins, suspicious accounts, avatarless users, and username patterns. Automatic raid mode with channel lockdown." },
  { icon: "🔒", title: "Anti-Nuke Shield", desc: "Monitor channel/role deletion, mass bans/kicks, webhook abuse, and permission changes with instant response." },
  { icon: "⚖️", title: "Smart Moderation", desc: "Warn, timeout, kick, ban, softban, purge, lock/unlock, slowmode — all with audit logging and case tracking." },
  { icon: "👋", title: "Welcome System", desc: "Customizable welcome & leave messages with embeds, variables, member count, and avatar support." },
  { icon: "🤖", title: "Auto Moderation", desc: "Bad word, regex, link, invite, mention, caps, emoji filters — each with custom actions and exemptions." },
  { icon: "📊", title: "Web Dashboard", desc: "Professional dark-themed dashboard with real-time updates, charts, and complete server management." },
  { icon: "📝", title: "Detailed Logging", desc: "Separate log channels for moderation, security, members, and messages. Every action is tracked." },
  { icon: "🔑", title: "Role Management", desc: "Create, delete, rename, clone roles. Edit permissions. Full role hierarchy respect." },
  { icon: "🪝", title: "Webhook Manager", desc: "Create, manage, test webhooks. Embed builder with preview. Full webhook audit logging." },
  { icon: "📨", title: "Server DM System", desc: "Controlled mass DM with role targeting, progress tracking, rate limiting, and confirmation." },
  { icon: "🎭", title: "Bot Status Rotation", desc: "Unlimited rotating statuses: playing, watching, listening, streaming with custom intervals." },
];

const stats = [
  { label: "Servers Protected", value: "5,000+" },
  { label: "Messages Scanned", value: "15M+" },
  { label: "Threats Blocked", value: "250K+" },
  { label: "Uptime", value: "99.9%" },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Auto-seed on first load
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#0f1117]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f1117]/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-bold shadow-lg shadow-indigo-500/30">
                S
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Sentinel
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a>
              <a href="#security" className="text-gray-400 hover:text-white transition-colors text-sm">Security</a>
              <a href="#dashboard-preview" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</a>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" size="sm">Login</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Add to Discord
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className={`transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm mb-8">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              All systems operational
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Advanced Discord
              </span>
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Security Platform
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Enterprise-grade protection for your Discord server. Anti-spam, anti-raid, anti-nuke, 
              smart moderation, and a professional web dashboard — all in one bot.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-8 text-base shadow-xl shadow-indigo-500/25">
                  🚀 Open Dashboard
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg" className="px-8 text-base">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 transition-all duration-1000 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center p-4">
                <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Everything You Need
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Complete server protection and management in one powerful bot.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group p-6 rounded-xl bg-gray-800/30 border border-gray-700/50 hover:border-indigo-500/30 hover:bg-gray-800/50 transition-all duration-300"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/5 via-purple-900/5 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  Security Alert System
                </span>
              </h2>
              <p className="text-gray-400 text-lg mb-8">
                When threats are detected, Sentinel responds instantly with detailed alerts and automated actions.
              </p>
              <div className="space-y-4">
                {[
                  { color: "bg-red-500", label: "Critical", desc: "Mass nuke attempts, coordinated raids" },
                  { color: "bg-orange-500", label: "High", desc: "Permission escalation, mass bans" },
                  { color: "bg-yellow-500", label: "Medium", desc: "Spam detection, suspicious joins" },
                  { color: "bg-blue-500", label: "Low", desc: "Minor violations, soft warnings" },
                ].map((level) => (
                  <div key={level.label} className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/50 border border-gray-700/50">
                    <div className={`w-3 h-3 rounded-full ${level.color}`} />
                    <div>
                      <div className="text-sm font-semibold text-white">{level.label}</div>
                      <div className="text-xs text-gray-400">{level.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl border border-gray-700/50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-bold text-lg">
                🚨 RAID DETECTED
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-gray-400">Guild:</span><span className="text-white">Ocean Drive RP</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Type:</span><span className="text-red-400">Mass Join Raid</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Suspicious Joins:</span><span className="text-white">15 in 8 seconds</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Account Age:</span><span className="text-yellow-400">&lt; 24 hours</span></div>
                <div className="flex justify-between"><span className="text-gray-400">Avatarless:</span><span className="text-orange-400">12 of 15</span></div>
              </div>
              <div className="border-t border-gray-700 pt-3 space-y-2">
                <div className="text-green-400 text-sm font-medium">✅ Actions Taken:</div>
                <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
                  <li>Raid mode activated</li>
                  <li>All channels locked</li>
                  <li>15 accounts timed out</li>
                  <li>Verification level raised</li>
                  <li>Admin team alerted</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard-preview" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Professional Dashboard
            </span>
          </h2>
          <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
            Manage every aspect of your server security from a beautiful, responsive web dashboard.
          </p>
          <div className="bg-gray-800/30 rounded-2xl border border-gray-700/50 p-4 sm:p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: "Servers", value: "5", color: "from-indigo-500 to-blue-500" },
                { label: "Members", value: "7,009", color: "from-green-500 to-emerald-500" },
                { label: "Threats Blocked", value: "1,243", color: "from-red-500 to-orange-500" },
                { label: "Latency", value: "42ms", color: "from-purple-500 to-pink-500" },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-xl bg-gray-800/50 border border-gray-700/50">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                    {s.value}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="col-span-2 p-6 rounded-xl bg-gray-900/50 border border-gray-700/50 text-left">
                <div className="text-sm font-semibold text-gray-300 mb-4">Security Events (30 days)</div>
                <div className="flex items-end justify-between h-32 gap-1">
                  {[30, 45, 20, 60, 35, 55, 40, 70, 25, 50, 65, 45, 30, 80, 55, 40, 35, 60, 45, 70, 50, 40, 65, 55, 30, 45, 75, 60, 40, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t opacity-70 hover:opacity-100 transition-opacity" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-xl bg-gray-900/50 border border-gray-700/50 text-left">
                <div className="text-sm font-semibold text-gray-300 mb-4">Recent Actions</div>
                <div className="space-y-3">
                  {[
                    { action: "Ban", user: "SpamBot#1234", color: "text-red-400" },
                    { action: "Timeout", user: "ToxicUser#5678", color: "text-yellow-400" },
                    { action: "Warn", user: "NewMember#9012", color: "text-blue-400" },
                    { action: "Kick", user: "RaidAcc#3456", color: "text-orange-400" },
                  ].map((a, i) => (
                    <div key={i} className="flex items-center justify-between text-sm">
                      <span className={`font-medium ${a.color}`}>{a.action}</span>
                      <span className="text-gray-400 text-xs">{a.user}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Frequently Asked Questions
            </span>
          </h2>
          <div className="space-y-4">
            {[
              { q: "How does anti-raid protection work?", a: "Sentinel monitors join patterns, account ages, avatar status, and username similarities. When suspicious activity is detected, it automatically activates raid mode, locks channels, and alerts administrators." },
              { q: "Will the bot ban innocent users?", a: "No. Sentinel uses a progressive escalation system. First offenses receive warnings, then message deletion, then timeouts. Bans are only applied after multiple violations. All thresholds are configurable." },
              { q: "Can I configure settings per server?", a: "Yes. Every server has completely isolated configuration. Settings from one server never affect another. Each guild has its own anti-spam, anti-raid, anti-nuke, moderation, and welcome settings." },
              { q: "Is the dashboard secure?", a: "Yes. The dashboard uses Discord OAuth2 authentication. Only users with appropriate Discord permissions can access sensitive settings. All actions are audit logged." },
              { q: "Does the bot comply with Discord ToS?", a: "Absolutely. Sentinel follows all Discord API rules, respects rate limits, permission hierarchy, and never bypasses Discord safety systems." },
              { q: "Can I use a whitelist?", a: "Yes. You can whitelist users, roles, bots, and channels. Whitelisted entries are exempt from anti-spam, anti-raid, anti-nuke, and auto-moderation." },
            ].map((faq, i) => (
              <div key={i} className="p-6 rounded-xl bg-gray-800/30 border border-gray-700/50">
                <h3 className="text-white font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative p-12 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-500/20">
            <h2 className="text-4xl font-bold text-white mb-4">Ready to Protect Your Server?</h2>
            <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
              Join thousands of server owners who trust Sentinel to keep their communities safe.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 px-10 text-base">
                  🛡️ Get Started Free
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="px-10 text-base">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold">S</div>
                <span className="font-bold text-white">Sentinel</span>
              </div>
              <p className="text-gray-500 text-sm">Advanced Discord security & management platform.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Product</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#dashboard-preview" className="hover:text-white transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-sm">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800/50 text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Sentinel Bot. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
