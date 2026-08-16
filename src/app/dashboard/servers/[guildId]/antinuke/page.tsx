"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";

export default function AntiNukePage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch(`/api/guilds/${guildId}/antinuke`)
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
        <h1 className="text-3xl font-bold text-white">Anti-Nuke Configuration</h1>
        <p className="text-gray-400 mt-1">Protect against destructive actions like mass channel/role deletion.</p>
      </div>

      <ConfigSection
        title="Nuke Detection Thresholds"
        description="Configure limits for destructive actions before triggering protection."
        icon="🔒"
        fields={[
          { key: "enabled", label: "Enable Anti-Nuke", description: "Master toggle for anti-nuke protection.", type: "switch" },
          { key: "channelDeleteThreshold", label: "Channel Delete Threshold", description: "Max channels deleted before trigger.", type: "number", min: 1, max: 20 },
          { key: "channelDeleteInterval", label: "Channel Delete Interval (s)", description: "Time window for channel deletion.", type: "number", min: 5, max: 60 },
          { key: "roleDeleteThreshold", label: "Role Delete Threshold", description: "Max roles deleted before trigger.", type: "number", min: 1, max: 20 },
          { key: "roleDeleteInterval", label: "Role Delete Interval (s)", description: "Time window for role deletion.", type: "number", min: 5, max: 60 },
          { key: "banThreshold", label: "Mass Ban Threshold", description: "Max bans before trigger.", type: "number", min: 2, max: 30 },
          { key: "banInterval", label: "Mass Ban Interval (s)", description: "Time window for mass bans.", type: "number", min: 5, max: 60 },
          { key: "kickThreshold", label: "Mass Kick Threshold", description: "Max kicks before trigger.", type: "number", min: 2, max: 30 },
          { key: "kickInterval", label: "Mass Kick Interval (s)", description: "Time window for mass kicks.", type: "number", min: 5, max: 60 },
          { key: "webhookThreshold", label: "Webhook Threshold", description: "Max webhook operations before trigger.", type: "number", min: 1, max: 10 },
          { key: "webhookInterval", label: "Webhook Interval (s)", description: "Time window for webhook operations.", type: "number", min: 5, max: 60 },
          { key: "action", label: "Response Action", description: "Action taken against the perpetrator.",
            type: "select",
            options: [
              { value: "remove_permissions", label: "Remove Permissions" },
              { value: "timeout", label: "Timeout" },
              { value: "kick", label: "Kick" },
              { value: "ban", label: "Ban" },
            ]
          },
          { key: "alertChannel", label: "Alert Channel ID", description: "Channel for nuke alerts.", type: "text", placeholder: "Channel ID" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await apiFetch(`/api/guilds/${guildId}/antinuke`, {
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
