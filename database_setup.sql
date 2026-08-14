CREATE TABLE IF NOT EXISTS "guilds" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"name" text DEFAULT 'Unknown' NOT NULL,
	"icon" text,
	"owner_id" varchar(32),
	"member_count" integer DEFAULT 0,
	"premium" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guilds_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "security_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"anti_spam_enabled" boolean DEFAULT true,
	"anti_raid_enabled" boolean DEFAULT true,
	"anti_nuke_enabled" boolean DEFAULT true,
	"auto_mod_enabled" boolean DEFAULT true,
	"raid_mode_active" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "security_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "anti_spam_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT true,
	"message_threshold" integer DEFAULT 5,
	"message_interval" integer DEFAULT 3,
	"duplicate_threshold" integer DEFAULT 4,
	"mention_limit" integer DEFAULT 5,
	"link_spam_enabled" boolean DEFAULT true,
	"invite_spam_enabled" boolean DEFAULT true,
	"emoji_spam_limit" integer DEFAULT 10,
	"caps_percent_limit" integer DEFAULT 80,
	"attachment_spam_threshold" integer DEFAULT 5,
	"character_spam_enabled" boolean DEFAULT true,
	"escalation_levels" jsonb DEFAULT '[{"level": 1, "action": "warn", "duration": null}, {"level": 2, "action": "delete", "duration": null}, {"level": 3, "action": "timeout", "duration": 60}, {"level": 4, "action": "timeout", "duration": 600}, {"level": 5, "action": "timeout", "duration": 3600}, {"level": 6, "action": "kick", "duration": null}, {"level": 7, "action": "ban", "duration": null}]',
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "anti_spam_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "anti_raid_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT true,
	"join_threshold" integer DEFAULT 15,
	"join_interval" integer DEFAULT 10,
	"min_account_age" integer DEFAULT 7,
	"avatarless_action" varchar(20) DEFAULT 'flag',
	"lock_channels" boolean DEFAULT true,
	"auto_timeout" boolean DEFAULT true,
	"alert_channel" varchar(32),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "anti_raid_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "anti_nuke_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT true,
	"channel_delete_threshold" integer DEFAULT 3,
	"channel_delete_interval" integer DEFAULT 10,
	"role_delete_threshold" integer DEFAULT 3,
	"role_delete_interval" integer DEFAULT 10,
	"ban_threshold" integer DEFAULT 5,
	"ban_interval" integer DEFAULT 10,
	"kick_threshold" integer DEFAULT 5,
	"kick_interval" integer DEFAULT 10,
	"webhook_threshold" integer DEFAULT 3,
	"webhook_interval" integer DEFAULT 10,
	"action" varchar(20) DEFAULT 'remove_permissions',
	"alert_channel" varchar(32),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "anti_nuke_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "auto_mod_rules" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"name" text NOT NULL,
	"type" varchar(30) NOT NULL,
	"enabled" boolean DEFAULT true,
	"config" jsonb DEFAULT '{}',
	"action" varchar(20) DEFAULT 'delete',
	"exempt_roles" jsonb DEFAULT '[]',
	"exempt_channels" jsonb DEFAULT '[]',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "welcome_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT false,
	"channel_id" varchar(32),
	"message" text DEFAULT 'Welcome {user} to **{server}**! You are member #{member_count}!',
	"embed_enabled" boolean DEFAULT true,
	"embed_title" text DEFAULT 'Welcome!',
	"embed_description" text DEFAULT 'Welcome {user} to **{server}**!',
	"embed_color" varchar(7) DEFAULT '#5865F2',
	"embed_thumbnail" boolean DEFAULT true,
	"embed_image" text,
	"mention_user" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "welcome_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "leave_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT false,
	"channel_id" varchar(32),
	"message" text DEFAULT '{username} has left **{server}**. We now have {member_count} members.',
	"embed_enabled" boolean DEFAULT false,
	"embed_color" varchar(7) DEFAULT '#ED4245',
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "leave_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "logging_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"enabled" boolean DEFAULT true,
	"mod_log_channel" varchar(32),
	"security_log_channel" varchar(32),
	"member_log_channel" varchar(32),
	"message_log_channel" varchar(32),
	"log_member_join" boolean DEFAULT true,
	"log_member_leave" boolean DEFAULT true,
	"log_message_delete" boolean DEFAULT true,
	"log_message_edit" boolean DEFAULT true,
	"log_bans" boolean DEFAULT true,
	"log_kicks" boolean DEFAULT true,
	"log_timeouts" boolean DEFAULT true,
	"log_role_changes" boolean DEFAULT true,
	"log_channel_changes" boolean DEFAULT true,
	"log_nickname_changes" boolean DEFAULT true,
	"log_security_events" boolean DEFAULT true,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "logging_config_guild_id_unique" UNIQUE("guild_id")
);

CREATE TABLE IF NOT EXISTS "moderation_cases" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"case_number" integer NOT NULL,
	"target_id" varchar(32) NOT NULL,
	"target_username" text,
	"moderator_id" varchar(32) NOT NULL,
	"moderator_username" text,
	"action" varchar(20) NOT NULL,
	"reason" text,
	"duration" integer,
	"channel_id" varchar(32),
	"messages_deleted" integer,
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "whitelists" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"type" varchar(20) NOT NULL,
	"target_id" varchar(32) NOT NULL,
	"target_name" text,
	"added_by" varchar(32),
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "dashboard_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"discord_id" varchar(32) NOT NULL,
	"username" text NOT NULL,
	"display_name" text,
	"avatar" text,
	"email" text,
	"access_token" text,
	"refresh_token" text,
	"token_expiry" timestamp,
	"last_login" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "dashboard_users_discord_id_unique" UNIQUE("discord_id")
);

CREATE TABLE IF NOT EXISTS "dashboard_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"role" varchar(20) DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "bot_statuses" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar(20) NOT NULL,
	"text" text NOT NULL,
	"interval" integer DEFAULT 10,
	"enabled" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "webhook_configs" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"webhook_id" varchar(32),
	"webhook_url" text,
	"name" text NOT NULL,
	"channel_id" varchar(32),
	"avatar" text,
	"created_by" varchar(32),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "dm_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"created_by" varchar(32) NOT NULL,
	"target" varchar(30) NOT NULL,
	"target_role_id" varchar(32),
	"message" text NOT NULL,
	"embed_enabled" boolean DEFAULT false,
	"embed_config" jsonb,
	"status" varchar(20) DEFAULT 'pending',
	"total_users" integer DEFAULT 0,
	"sent" integer DEFAULT 0,
	"failed" integer DEFAULT 0,
	"skipped" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now(),
	"completed_at" timestamp
);

CREATE TABLE IF NOT EXISTS "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32),
	"user_id" varchar(32) NOT NULL,
	"username" text,
	"action" text NOT NULL,
	"details" jsonb,
	"category" varchar(30) DEFAULT 'general',
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "security_events" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"type" varchar(30) NOT NULL,
	"severity" varchar(10) DEFAULT 'medium' NOT NULL,
	"description" text NOT NULL,
	"target_id" varchar(32),
	"target_username" text,
	"action_taken" text,
	"details" jsonb,
	"created_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "command_permissions" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"command" varchar(50) NOT NULL,
	"required_level" varchar(20) DEFAULT 'moderator',
	"allowed_roles" jsonb DEFAULT '[]',
	"denied_roles" jsonb DEFAULT '[]',
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "server_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"date" timestamp NOT NULL,
	"member_count" integer DEFAULT 0,
	"messages_count" integer DEFAULT 0,
	"security_events_count" integer DEFAULT 0,
	"moderation_actions" integer DEFAULT 0,
	"commands_executed" integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS "bot_global_stats" (
	"id" serial PRIMARY KEY NOT NULL,
	"total_guilds" integer DEFAULT 0,
	"total_users" integer DEFAULT 0,
	"messages_processed" bigint DEFAULT 0,
	"security_incidents" integer DEFAULT 0,
	"moderation_actions" integer DEFAULT 0,
	"commands_executed" integer DEFAULT 0,
	"bot_latency" integer DEFAULT 0,
	"api_latency" integer DEFAULT 0,
	"is_online" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "user_strikes" (
	"id" serial PRIMARY KEY NOT NULL,
	"guild_id" varchar(32) NOT NULL,
	"user_id" varchar(32) NOT NULL,
	"strikes" integer DEFAULT 0,
	"last_strike_at" timestamp DEFAULT now(),
	"reset_at" timestamp
);

CREATE UNIQUE INDEX IF NOT EXISTS "guilds_guild_id_idx" ON "guilds" ("guild_id");
CREATE INDEX IF NOT EXISTS "auto_mod_rules_guild_idx" ON "auto_mod_rules" ("guild_id");
CREATE INDEX IF NOT EXISTS "mod_cases_guild_idx" ON "moderation_cases" ("guild_id");
CREATE INDEX IF NOT EXISTS "mod_cases_target_idx" ON "moderation_cases" ("target_id");
CREATE INDEX IF NOT EXISTS "whitelists_guild_idx" ON "whitelists" ("guild_id");
CREATE INDEX IF NOT EXISTS "dash_perms_guild_idx" ON "dashboard_permissions" ("guild_id");
CREATE INDEX IF NOT EXISTS "webhook_configs_guild_idx" ON "webhook_configs" ("guild_id");
CREATE INDEX IF NOT EXISTS "dm_campaigns_guild_idx" ON "dm_campaigns" ("guild_id");
CREATE INDEX IF NOT EXISTS "audit_logs_guild_idx" ON "audit_logs" ("guild_id");
CREATE INDEX IF NOT EXISTS "audit_logs_created_idx" ON "audit_logs" ("created_at");
CREATE INDEX IF NOT EXISTS "security_events_guild_idx" ON "security_events" ("guild_id");
CREATE INDEX IF NOT EXISTS "security_events_created_idx" ON "security_events" ("created_at");
CREATE INDEX IF NOT EXISTS "cmd_perms_guild_idx" ON "command_permissions" ("guild_id");
CREATE INDEX IF NOT EXISTS "server_stats_guild_idx" ON "server_stats" ("guild_id");
CREATE INDEX IF NOT EXISTS "server_stats_date_idx" ON "server_stats" ("date");
CREATE INDEX IF NOT EXISTS "user_strikes_guild_user_idx" ON "user_strikes" ("guild_id", "user_id");
