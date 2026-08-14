import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  serial,
  varchar,
  bigint,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// ─── Guild Configuration ───
export const guilds = pgTable("guilds", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  name: text("name").notNull().default("Unknown"),
  icon: text("icon"),
  ownerId: varchar("owner_id", { length: 32 }),
  memberCount: integer("member_count").default(0),
  premium: boolean("premium").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  uniqueIndex("guilds_guild_id_idx").on(table.guildId),
]);

// ─── Security Configuration ───
export const securityConfig = pgTable("security_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  antiSpamEnabled: boolean("anti_spam_enabled").default(true),
  antiRaidEnabled: boolean("anti_raid_enabled").default(true),
  antiNukeEnabled: boolean("anti_nuke_enabled").default(true),
  autoModEnabled: boolean("auto_mod_enabled").default(true),
  raidModeActive: boolean("raid_mode_active").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Anti-Spam Configuration ───
export const antiSpamConfig = pgTable("anti_spam_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(true),
  messageThreshold: integer("message_threshold").default(5),
  messageInterval: integer("message_interval").default(3),
  duplicateThreshold: integer("duplicate_threshold").default(4),
  mentionLimit: integer("mention_limit").default(5),
  linkSpamEnabled: boolean("link_spam_enabled").default(true),
  inviteSpamEnabled: boolean("invite_spam_enabled").default(true),
  emojiSpamLimit: integer("emoji_spam_limit").default(10),
  capsPercentLimit: integer("caps_percent_limit").default(80),
  attachmentSpamThreshold: integer("attachment_spam_threshold").default(5),
  characterSpamEnabled: boolean("character_spam_enabled").default(true),
  escalationLevels: jsonb("escalation_levels").default([
    { level: 1, action: "warn", duration: null },
    { level: 2, action: "delete", duration: null },
    { level: 3, action: "timeout", duration: 60 },
    { level: 4, action: "timeout", duration: 600 },
    { level: 5, action: "timeout", duration: 3600 },
    { level: 6, action: "kick", duration: null },
    { level: 7, action: "ban", duration: null },
  ]),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Anti-Raid Configuration ───
export const antiRaidConfig = pgTable("anti_raid_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(true),
  joinThreshold: integer("join_threshold").default(15),
  joinInterval: integer("join_interval").default(10),
  minAccountAge: integer("min_account_age").default(7),
  avatarlessAction: varchar("avatarless_action", { length: 20 }).default("flag"),
  lockChannels: boolean("lock_channels").default(true),
  autoTimeout: boolean("auto_timeout").default(true),
  alertChannel: varchar("alert_channel", { length: 32 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Anti-Nuke Configuration ───
export const antiNukeConfig = pgTable("anti_nuke_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(true),
  channelDeleteThreshold: integer("channel_delete_threshold").default(3),
  channelDeleteInterval: integer("channel_delete_interval").default(10),
  roleDeleteThreshold: integer("role_delete_threshold").default(3),
  roleDeleteInterval: integer("role_delete_interval").default(10),
  banThreshold: integer("ban_threshold").default(5),
  banInterval: integer("ban_interval").default(10),
  kickThreshold: integer("kick_threshold").default(5),
  kickInterval: integer("kick_interval").default(10),
  webhookThreshold: integer("webhook_threshold").default(3),
  webhookInterval: integer("webhook_interval").default(10),
  action: varchar("action", { length: 20 }).default("remove_permissions"),
  alertChannel: varchar("alert_channel", { length: 32 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Auto Moderation Rules ───
export const autoModRules = pgTable("auto_mod_rules", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  name: text("name").notNull(),
  type: varchar("type", { length: 30 }).notNull(), // badword, regex, link, invite, mention, caps, emoji, attachment, advertisement
  enabled: boolean("enabled").default(true),
  config: jsonb("config").default({}),
  action: varchar("action", { length: 20 }).default("delete"), // delete, warn, timeout, kick, ban
  exemptRoles: jsonb("exempt_roles").default([]),
  exemptChannels: jsonb("exempt_channels").default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("auto_mod_rules_guild_idx").on(table.guildId),
]);

// ─── Welcome Configuration ───
export const welcomeConfig = pgTable("welcome_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(false),
  channelId: varchar("channel_id", { length: 32 }),
  message: text("message").default("Welcome {user} to **{server}**! You are member #{member_count}!"),
  embedEnabled: boolean("embed_enabled").default(true),
  embedTitle: text("embed_title").default("Welcome!"),
  embedDescription: text("embed_description").default("Welcome {user} to **{server}**!"),
  embedColor: varchar("embed_color", { length: 7 }).default("#5865F2"),
  embedThumbnail: boolean("embed_thumbnail").default(true),
  embedImage: text("embed_image"),
  mentionUser: boolean("mention_user").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Leave Configuration ───
export const leaveConfig = pgTable("leave_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(false),
  channelId: varchar("channel_id", { length: 32 }),
  message: text("message").default("{username} has left **{server}**. We now have {member_count} members."),
  embedEnabled: boolean("embed_enabled").default(false),
  embedColor: varchar("embed_color", { length: 7 }).default("#ED4245"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Logging Configuration ───
export const loggingConfig = pgTable("logging_config", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull().unique(),
  enabled: boolean("enabled").default(true),
  modLogChannel: varchar("mod_log_channel", { length: 32 }),
  securityLogChannel: varchar("security_log_channel", { length: 32 }),
  memberLogChannel: varchar("member_log_channel", { length: 32 }),
  messageLogChannel: varchar("message_log_channel", { length: 32 }),
  logMemberJoin: boolean("log_member_join").default(true),
  logMemberLeave: boolean("log_member_leave").default(true),
  logMessageDelete: boolean("log_message_delete").default(true),
  logMessageEdit: boolean("log_message_edit").default(true),
  logBans: boolean("log_bans").default(true),
  logKicks: boolean("log_kicks").default(true),
  logTimeouts: boolean("log_timeouts").default(true),
  logRoleChanges: boolean("log_role_changes").default(true),
  logChannelChanges: boolean("log_channel_changes").default(true),
  logNicknameChanges: boolean("log_nickname_changes").default(true),
  logSecurityEvents: boolean("log_security_events").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── Moderation Cases ───
export const moderationCases = pgTable("moderation_cases", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  caseNumber: integer("case_number").notNull(),
  targetId: varchar("target_id", { length: 32 }).notNull(),
  targetUsername: text("target_username"),
  moderatorId: varchar("moderator_id", { length: 32 }).notNull(),
  moderatorUsername: text("moderator_username"),
  action: varchar("action", { length: 20 }).notNull(), // warn, timeout, untimeout, kick, ban, unban, softban, purge, lock, unlock
  reason: text("reason"),
  duration: integer("duration"),
  channelId: varchar("channel_id", { length: 32 }),
  messagesDeleted: integer("messages_deleted"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("mod_cases_guild_idx").on(table.guildId),
  index("mod_cases_target_idx").on(table.targetId),
]);

// ─── Whitelist ───
export const whitelists = pgTable("whitelists", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  type: varchar("type", { length: 20 }).notNull(), // user, role, bot, channel
  targetId: varchar("target_id", { length: 32 }).notNull(),
  targetName: text("target_name"),
  addedBy: varchar("added_by", { length: 32 }),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("whitelists_guild_idx").on(table.guildId),
]);

// ─── Dashboard Users ───
export const dashboardUsers = pgTable("dashboard_users", {
  id: serial("id").primaryKey(),
  discordId: varchar("discord_id", { length: 32 }).notNull().unique(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  avatar: text("avatar"),
  email: text("email"),
  passwordHash: text("password_hash"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  tokenExpiry: timestamp("token_expiry"),
  lastLogin: timestamp("last_login").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Dashboard Permissions ───
export const dashboardPermissions = pgTable("dashboard_permissions", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  userId: varchar("user_id", { length: 32 }).notNull(),
  role: varchar("role", { length: 20 }).notNull().default("viewer"), // owner, administrator, moderator, viewer
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("dash_perms_guild_idx").on(table.guildId),
]);

// ─── Bot Configurations ───
export const botConfigs = pgTable("bot_configs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 32 }).notNull(),
  botToken: text("bot_token").notNull(),
  botId: varchar("bot_id", { length: 32 }).notNull(),
  name: text("name").notNull(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("bot_configs_user_idx").on(table.userId),
]);

// ─── Bot Status Rotation ───
export const botStatuses = pgTable("bot_statuses", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 20 }).notNull(), // playing, watching, listening, streaming
  text: text("text").notNull(),
  interval: integer("interval").default(10),
  enabled: boolean("enabled").default(true),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// ─── Webhook Configurations ───
export const webhookConfigs = pgTable("webhook_configs", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  webhookId: varchar("webhook_id", { length: 32 }),
  webhookUrl: text("webhook_url"),
  name: text("name").notNull(),
  channelId: varchar("channel_id", { length: 32 }),
  avatar: text("avatar"),
  createdBy: varchar("created_by", { length: 32 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("webhook_configs_guild_idx").on(table.guildId),
]);

// ─── DM Campaigns ───
export const dmCampaigns = pgTable("dm_campaigns", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  createdBy: varchar("created_by", { length: 32 }).notNull(),
  target: varchar("target", { length: 30 }).notNull(), // all, role, online, offline
  targetRoleId: varchar("target_role_id", { length: 32 }),
  message: text("message").notNull(),
  embedEnabled: boolean("embed_enabled").default(false),
  embedConfig: jsonb("embed_config"),
  status: varchar("status", { length: 20 }).default("pending"), // pending, confirmed, running, completed, cancelled
  totalUsers: integer("total_users").default(0),
  sent: integer("sent").default(0),
  failed: integer("failed").default(0),
  skipped: integer("skipped").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
}, (table) => [
  index("dm_campaigns_guild_idx").on(table.guildId),
]);

// ─── Audit Logs ───
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }),
  userId: varchar("user_id", { length: 32 }).notNull(),
  username: text("username"),
  action: text("action").notNull(),
  details: jsonb("details"),
  category: varchar("category", { length: 30 }).default("general"), // security, moderation, config, webhook, role, dm, general
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("audit_logs_guild_idx").on(table.guildId),
  index("audit_logs_created_idx").on(table.createdAt),
]);

// ─── Security Events ───
export const securityEvents = pgTable("security_events", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  type: varchar("type", { length: 30 }).notNull(), // spam, raid, nuke, automod
  severity: varchar("severity", { length: 10 }).notNull().default("medium"), // low, medium, high, critical
  description: text("description").notNull(),
  targetId: varchar("target_id", { length: 32 }),
  targetUsername: text("target_username"),
  actionTaken: text("action_taken"),
  details: jsonb("details"),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("security_events_guild_idx").on(table.guildId),
  index("security_events_created_idx").on(table.createdAt),
]);

// ─── Command Permissions ───
export const commandPermissions = pgTable("command_permissions", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  command: varchar("command", { length: 50 }).notNull(),
  requiredLevel: varchar("required_level", { length: 20 }).default("moderator"), // owner, administrator, moderator, everyone
  allowedRoles: jsonb("allowed_roles").default([]),
  deniedRoles: jsonb("denied_roles").default([]),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("cmd_perms_guild_idx").on(table.guildId),
]);

// ─── Server Statistics ───
export const serverStats = pgTable("server_stats", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  date: timestamp("date").notNull(),
  memberCount: integer("member_count").default(0),
  messagesCount: integer("messages_count").default(0),
  securityEvents: integer("security_events_count").default(0),
  moderationActions: integer("moderation_actions").default(0),
  commandsExecuted: integer("commands_executed").default(0),
}, (table) => [
  index("server_stats_guild_idx").on(table.guildId),
  index("server_stats_date_idx").on(table.date),
]);

// ─── Bot Global Stats ───
export const botGlobalStats = pgTable("bot_global_stats", {
  id: serial("id").primaryKey(),
  totalGuilds: integer("total_guilds").default(0),
  totalUsers: integer("total_users").default(0),
  messagesProcessed: bigint("messages_processed", { mode: "number" }).default(0),
  securityIncidents: integer("security_incidents").default(0),
  moderationActions: integer("moderation_actions").default(0),
  commandsExecuted: integer("commands_executed").default(0),
  botLatency: integer("bot_latency").default(0),
  apiLatency: integer("api_latency").default(0),
  isOnline: boolean("is_online").default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ─── User Strikes (for escalation) ───
export const userStrikes = pgTable("user_strikes", {
  id: serial("id").primaryKey(),
  guildId: varchar("guild_id", { length: 32 }).notNull(),
  userId: varchar("user_id", { length: 32 }).notNull(),
  strikes: integer("strikes").default(0),
  lastStrikeAt: timestamp("last_strike_at").defaultNow(),
  resetAt: timestamp("reset_at"),
}, (table) => [
  index("user_strikes_guild_user_idx").on(table.guildId, table.userId),
]);
