import { Client, GatewayIntentBits } from "discord.js";
import { db } from "../db";
import { botConfigs, botGlobalStats, guilds } from "../db/schema";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

const activeClients = new Map<string, Client>();

async function startBot(token: string, botId: string) {
  if (activeClients.has(botId)) {
    return; // Already running
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.GuildMembers,
    ],
  });

  client.once("ready", async (c) => {
    console.log(`[Bot Manager] Bot is ready: ${c.user.tag}`);
    activeClients.set(botId, client);
    await updateGlobalStats();
  });

  client.on("guildCreate", async (guild) => {
    console.log(`[Bot Manager] Joined guild: ${guild.name}`);
    await updateGlobalStats();
  });

  client.on("guildDelete", async (guild) => {
    console.log(`[Bot Manager] Left guild: ${guild.name}`);
    await updateGlobalStats();
  });

  try {
    await client.login(token);
  } catch (err) {
    console.error(`[Bot Manager] Failed to login bot ${botId}:`, err);
  }
}

async function updateGlobalStats() {
  let totalGuilds = 0;
  let totalUsers = 0;
  let isOnline = activeClients.size > 0;

  for (const client of activeClients.values()) {
    totalGuilds += client.guilds.cache.size;
    totalUsers += client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
  }

  const stats = await db.select().from(botGlobalStats).limit(1);
  if (stats.length === 0) {
    await db.insert(botGlobalStats).values({
      totalGuilds,
      totalUsers,
      isOnline,
      messagesProcessed: 0,
      securityIncidents: 0,
      moderationActions: 0,
      commandsExecuted: 0,
      botLatency: Array.from(activeClients.values())[0]?.ws.ping || 0,
      apiLatency: 0,
    });
  } else {
    await db.update(botGlobalStats).set({
      totalGuilds,
      totalUsers,
      isOnline,
      botLatency: Array.from(activeClients.values())[0]?.ws.ping || 0,
      updatedAt: new Date(),
    });
  }
}

async function syncBots() {
  try {
    const configs = await db.select().from(botConfigs);
    for (const config of configs) {
      if (!activeClients.has(config.botId)) {
        console.log(`[Bot Manager] Starting bot ${config.name} (${config.botId})...`);
        await startBot(config.botToken, config.botId);
      }
    }
  } catch (error) {
    console.error("[Bot Manager] Error syncing bots:", error);
  }
}

async function init() {
  console.log("[Bot Manager] Starting...");
  await syncBots();
  // Poll for new bots every 10 seconds
  setInterval(syncBots, 10000);
}

init();
