import { NextResponse } from "next/server";
import { db } from "@/db";
import {
  guilds,
  securityConfig,
  antiSpamConfig,
  antiRaidConfig,
  antiNukeConfig,
  welcomeConfig,
  leaveConfig,
  loggingConfig,
  moderationCases,
  securityEvents,
  botStatuses,
  botGlobalStats,
  autoModRules,
  whitelists,
  serverStats,
  auditLogs,
} from "@/db/schema";
import { sql } from "drizzle-orm";

export async function POST() {
  try {
    // Check if already seeded
    const existingGuilds = await db.select().from(guilds);
    if (existingGuilds.length > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    // Create demo guilds
    const demoGuilds = [
      { guildId: "1001", name: "Ocean Drive RP", icon: null, ownerId: "000000000000000001", memberCount: 1247 },
      { guildId: "1002", name: "Sentinel HQ", icon: null, ownerId: "000000000000000001", memberCount: 523 },
      { guildId: "1003", name: "Gaming Community", icon: null, ownerId: "000000000000000001", memberCount: 3891 },
      { guildId: "1004", name: "Development Hub", icon: null, ownerId: "000000000000000001", memberCount: 892 },
      { guildId: "1005", name: "Music Lounge", icon: null, ownerId: "000000000000000001", memberCount: 456 },
    ];

    await db.insert(guilds).values(demoGuilds);

    // Create configs for each guild
    for (const g of demoGuilds) {
      await db.insert(securityConfig).values({ guildId: g.guildId });
      await db.insert(antiSpamConfig).values({ guildId: g.guildId });
      await db.insert(antiRaidConfig).values({ guildId: g.guildId });
      await db.insert(antiNukeConfig).values({ guildId: g.guildId });
      await db.insert(welcomeConfig).values({ guildId: g.guildId, enabled: true, channelId: "ch_welcome" });
      await db.insert(leaveConfig).values({ guildId: g.guildId });
      await db.insert(loggingConfig).values({ guildId: g.guildId });
    }

    // Create auto-mod rules for first guild
    await db.insert(autoModRules).values([
      { guildId: "1001", name: "Bad Word Filter", type: "badword", enabled: true, config: { words: ["badword1", "badword2"] }, action: "delete" },
      { guildId: "1001", name: "Discord Invite Filter", type: "invite", enabled: true, config: {}, action: "delete" },
      { guildId: "1001", name: "Link Filter", type: "link", enabled: false, config: { allowedDomains: ["youtube.com", "twitch.tv"] }, action: "warn" },
      { guildId: "1001", name: "Caps Lock Filter", type: "caps", enabled: true, config: { threshold: 80 }, action: "delete" },
      { guildId: "1001", name: "Mention Spam Filter", type: "mention", enabled: true, config: { limit: 5 }, action: "timeout" },
    ]);

    // Whitelist entries
    await db.insert(whitelists).values([
      { guildId: "1001", type: "user", targetId: "000000000000000001", targetName: "DemoAdmin", addedBy: "000000000000000001" },
      { guildId: "1001", type: "role", targetId: "role_admin", targetName: "Administrator", addedBy: "000000000000000001" },
      { guildId: "1001", type: "bot", targetId: "bot_music", targetName: "Music Bot", addedBy: "000000000000000001" },
    ]);

    // Create moderation cases
    const actions = ["warn", "timeout", "kick", "ban", "unban", "warn", "timeout", "warn"];
    const targets = [
      { id: "user_1", name: "SpammerUser" },
      { id: "user_2", name: "ToxicPlayer" },
      { id: "user_3", name: "RaidBot" },
      { id: "user_4", name: "RuleBreaker" },
    ];
    const reasons = [
      "Repeated spamming in chat",
      "Toxic behavior towards members",
      "Suspected raid account",
      "Breaking server rules",
      "Advertising without permission",
      "Excessive caps usage",
      "Mention spam",
      "NSFW content in wrong channel",
    ];

    for (let i = 0; i < 20; i++) {
      const target = targets[i % targets.length];
      await db.insert(moderationCases).values({
        guildId: demoGuilds[i % 3].guildId,
        caseNumber: i + 1,
        targetId: target.id,
        targetUsername: target.name,
        moderatorId: "000000000000000001",
        moderatorUsername: "DemoAdmin",
        action: actions[i % actions.length],
        reason: reasons[i % reasons.length],
        duration: actions[i % actions.length] === "timeout" ? 300 : null,
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    // Security events
    const eventTypes = ["spam", "raid", "nuke", "automod"];
    const severities = ["low", "medium", "high", "critical"];
    const descriptions = [
      "Message spam detected - 8 messages in 2 seconds",
      "Potential raid detected - 12 joins in 5 seconds",
      "Mass channel deletion attempt blocked",
      "Auto-mod triggered: Bad word detected",
      "Invite link spam detected and removed",
      "Suspicious mass ban attempt detected",
      "Duplicate message spam detected",
      "Mention spam: 15 mentions in single message",
    ];

    for (let i = 0; i < 30; i++) {
      await db.insert(securityEvents).values({
        guildId: demoGuilds[i % 3].guildId,
        type: eventTypes[i % eventTypes.length],
        severity: severities[i % severities.length],
        description: descriptions[i % descriptions.length],
        targetId: targets[i % targets.length].id,
        targetUsername: targets[i % targets.length].name,
        actionTaken: actions[i % actions.length],
        createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      });
    }

    // Bot statuses
    await db.insert(botStatuses).values([
      { type: "watching", text: "1,247 Members", interval: 10, enabled: true, sortOrder: 0 },
      { type: "playing", text: "Protecting 5 Servers", interval: 10, enabled: true, sortOrder: 1 },
      { type: "listening", text: "/help", interval: 10, enabled: true, sortOrder: 2 },
      { type: "watching", text: "for threats 🛡️", interval: 10, enabled: true, sortOrder: 3 },
    ]);

    // Global stats
    await db.insert(botGlobalStats).values({
      totalGuilds: 5,
      totalUsers: 7009,
      messagesProcessed: 158432,
      securityIncidents: 30,
      moderationActions: 20,
      commandsExecuted: 4521,
      botLatency: 42,
      apiLatency: 38,
      isOnline: true,
    });

    // Server daily stats
    for (const g of demoGuilds.slice(0, 3)) {
      for (let d = 0; d < 30; d++) {
        const date = new Date();
        date.setDate(date.getDate() - d);
        await db.insert(serverStats).values({
          guildId: g.guildId,
          date,
          memberCount: g.memberCount - Math.floor(Math.random() * 50),
          messagesCount: Math.floor(Math.random() * 500) + 100,
          securityEvents: Math.floor(Math.random() * 5),
          moderationActions: Math.floor(Math.random() * 3),
          commandsExecuted: Math.floor(Math.random() * 30) + 5,
        });
      }
    }

    // Audit logs
    const auditActions = [
      "Updated anti-spam configuration",
      "Updated anti-raid configuration",
      "Added whitelist entry",
      "Updated welcome message",
      "Changed logging channels",
      "Created auto-mod rule",
      "Updated security settings",
    ];
    for (let i = 0; i < 15; i++) {
      await db.insert(auditLogs).values({
        guildId: demoGuilds[i % 3].guildId,
        userId: "000000000000000001",
        username: "DemoAdmin",
        action: auditActions[i % auditActions.length],
        category: "config",
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      });
    }

    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
