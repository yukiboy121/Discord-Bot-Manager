export interface DiscordUser {
  id: string;
  username: string;
  global_name?: string;
  avatar: string | null;
  email?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

export interface GuildConfig {
  id: number;
  guildId: string;
  name: string;
  icon: string | null;
  ownerId: string | null;
  memberCount: number;
  premium: boolean;
}

export interface SecuritySettings {
  antiSpamEnabled: boolean;
  antiRaidEnabled: boolean;
  antiNukeEnabled: boolean;
  autoModEnabled: boolean;
  raidModeActive: boolean;
}

export interface AntiSpamSettings {
  enabled: boolean;
  messageThreshold: number;
  messageInterval: number;
  duplicateThreshold: number;
  mentionLimit: number;
  linkSpamEnabled: boolean;
  inviteSpamEnabled: boolean;
  emojiSpamLimit: number;
  capsPercentLimit: number;
  attachmentSpamThreshold: number;
  characterSpamEnabled: boolean;
  escalationLevels: EscalationLevel[];
}

export interface EscalationLevel {
  level: number;
  action: string;
  duration: number | null;
}

export interface AntiRaidSettings {
  enabled: boolean;
  joinThreshold: number;
  joinInterval: number;
  minAccountAge: number;
  avatarlessAction: string;
  lockChannels: boolean;
  autoTimeout: boolean;
  alertChannel: string | null;
}

export interface AntiNukeSettings {
  enabled: boolean;
  channelDeleteThreshold: number;
  channelDeleteInterval: number;
  roleDeleteThreshold: number;
  roleDeleteInterval: number;
  banThreshold: number;
  banInterval: number;
  kickThreshold: number;
  kickInterval: number;
  webhookThreshold: number;
  webhookInterval: number;
  action: string;
  alertChannel: string | null;
}

export interface WelcomeSettings {
  enabled: boolean;
  channelId: string | null;
  message: string;
  embedEnabled: boolean;
  embedTitle: string;
  embedDescription: string;
  embedColor: string;
  embedThumbnail: boolean;
  embedImage: string | null;
  mentionUser: boolean;
}

export interface LeaveSettings {
  enabled: boolean;
  channelId: string | null;
  message: string;
  embedEnabled: boolean;
  embedColor: string;
}

export interface LoggingSettings {
  enabled: boolean;
  modLogChannel: string | null;
  securityLogChannel: string | null;
  memberLogChannel: string | null;
  messageLogChannel: string | null;
  logMemberJoin: boolean;
  logMemberLeave: boolean;
  logMessageDelete: boolean;
  logMessageEdit: boolean;
  logBans: boolean;
  logKicks: boolean;
  logTimeouts: boolean;
  logRoleChanges: boolean;
  logChannelChanges: boolean;
  logNicknameChanges: boolean;
  logSecurityEvents: boolean;
}

export interface ModerationCase {
  id: number;
  caseNumber: number;
  guildId: string;
  targetId: string;
  targetUsername: string | null;
  moderatorId: string;
  moderatorUsername: string | null;
  action: string;
  reason: string | null;
  duration: number | null;
  channelId: string | null;
  messagesDeleted: number | null;
  active: boolean;
  createdAt: string;
}

export interface WhitelistEntry {
  id: number;
  guildId: string;
  type: string;
  targetId: string;
  targetName: string | null;
  addedBy: string | null;
  createdAt: string;
}

export interface AutoModRule {
  id: number;
  guildId: string;
  name: string;
  type: string;
  enabled: boolean;
  config: Record<string, unknown>;
  action: string;
  exemptRoles: string[];
  exemptChannels: string[];
}

export interface SecurityEvent {
  id: number;
  guildId: string;
  type: string;
  severity: string;
  description: string;
  targetId: string | null;
  targetUsername: string | null;
  actionTaken: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
}

export interface AuditLogEntry {
  id: number;
  guildId: string | null;
  userId: string;
  username: string | null;
  action: string;
  details: Record<string, unknown> | null;
  category: string;
  createdAt: string;
}

export interface BotStatus {
  id: number;
  type: string;
  text: string;
  interval: number;
  enabled: boolean;
  sortOrder: number;
}

export interface WebhookEntry {
  id: number;
  guildId: string;
  webhookId: string | null;
  webhookUrl: string | null;
  name: string;
  channelId: string | null;
  avatar: string | null;
  createdBy: string | null;
  createdAt: string;
}

export interface DMCampaign {
  id: number;
  guildId: string;
  createdBy: string;
  target: string;
  targetRoleId: string | null;
  message: string;
  embedEnabled: boolean;
  status: string;
  totalUsers: number;
  sent: number;
  failed: number;
  skipped: number;
  createdAt: string;
  completedAt: string | null;
}

export interface DashboardStats {
  totalGuilds: number;
  totalUsers: number;
  messagesProcessed: number;
  securityIncidents: number;
  moderationActions: number;
  commandsExecuted: number;
  botLatency: number;
  apiLatency: number;
  isOnline: boolean;
}

export interface GuildStats {
  memberCount: number;
  messagesCount: number;
  securityEventsCount: number;
  moderationActions: number;
  commandsExecuted: number;
  recentEvents: SecurityEvent[];
  recentCases: ModerationCase[];
  dailyStats: DailyStats[];
}

export interface DailyStats {
  date: string;
  members: number;
  messages: number;
  security: number;
  moderation: number;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
  badge?: number;
};
