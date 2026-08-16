"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";

export default function LoggingPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/guilds/${guildId}/logging`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [guildId]);

  if (loading || !config) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Logging Configuration</h1>
        <p className="text-gray-400 mt-1">Configure what events are logged and where.</p>
      </div>

      <ConfigSection
        title="Log Channels"
        description="Set up separate channels for different log categories."
        icon="📝"
        fields={[
          { key: "enabled", label: "Enable Logging", description: "Master toggle for the logging system.", type: "switch" },
          { key: "modLogChannel", label: "Moderation Log Channel", description: "Channel for moderation actions.", type: "text", placeholder: "#mod-logs channel ID" },
          { key: "securityLogChannel", label: "Security Log Channel", description: "Channel for security events.", type: "text", placeholder: "#security-logs channel ID" },
          { key: "memberLogChannel", label: "Member Log Channel", description: "Channel for member join/leave.", type: "text", placeholder: "#member-logs channel ID" },
          { key: "messageLogChannel", label: "Message Log Channel", description: "Channel for message edit/delete.", type: "text", placeholder: "#message-logs channel ID" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await apiFetch(`/api/guilds/${guildId}/logging`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const updated = await res.json();
          setConfig(updated);
        }}
      />

      <ConfigSection
        title="Event Types"
        description="Choose which events to log."
        icon="📋"
        fields={[
          { key: "logMemberJoin", label: "Member Join", description: "Log when members join.", type: "switch" },
          { key: "logMemberLeave", label: "Member Leave", description: "Log when members leave.", type: "switch" },
          { key: "logMessageDelete", label: "Message Delete", description: "Log deleted messages.", type: "switch" },
          { key: "logMessageEdit", label: "Message Edit", description: "Log edited messages.", type: "switch" },
          { key: "logBans", label: "Bans", description: "Log ban actions.", type: "switch" },
          { key: "logKicks", label: "Kicks", description: "Log kick actions.", type: "switch" },
          { key: "logTimeouts", label: "Timeouts", description: "Log timeout actions.", type: "switch" },
          { key: "logRoleChanges", label: "Role Changes", description: "Log role modifications.", type: "switch" },
          { key: "logChannelChanges", label: "Channel Changes", description: "Log channel modifications.", type: "switch" },
          { key: "logNicknameChanges", label: "Nickname Changes", description: "Log nickname updates.", type: "switch" },
          { key: "logSecurityEvents", label: "Security Events", description: "Log security incidents.", type: "switch" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await apiFetch(`/api/guilds/${guildId}/logging`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const updated = await res.json();
          setConfig(updated);
        }}
      />
    </div>
  );
}
