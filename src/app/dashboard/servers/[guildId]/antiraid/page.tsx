"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";

export default function AntiRaidPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/antiraid`)
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
        <h1 className="text-3xl font-bold text-white">Anti-Raid Configuration</h1>
        <p className="text-gray-400 mt-1">Configure raid detection and automatic response.</p>
      </div>

      <ConfigSection
        title="Raid Detection"
        description="Configure thresholds for detecting coordinated raids."
        icon="⚔️"
        fields={[
          { key: "enabled", label: "Enable Anti-Raid", description: "Master toggle for anti-raid protection.", type: "switch" },
          { key: "joinThreshold", label: "Join Threshold", description: "Number of joins to trigger raid mode.", type: "number", min: 5, max: 50 },
          { key: "joinInterval", label: "Join Interval (seconds)", description: "Time window for join threshold.", type: "number", min: 5, max: 60 },
          { key: "minAccountAge", label: "Min Account Age (days)", description: "Flag accounts newer than this.", type: "number", min: 0, max: 365 },
          { key: "avatarlessAction", label: "Avatarless Account Action", description: "Action for accounts without avatars.",
            type: "select",
            options: [
              { value: "flag", label: "Flag Only" },
              { value: "timeout", label: "Timeout" },
              { value: "kick", label: "Kick" },
              { value: "ban", label: "Ban" },
            ]
          },
          { key: "lockChannels", label: "Lock Channels on Raid", description: "Automatically lock channels during raids.", type: "switch" },
          { key: "autoTimeout", label: "Auto-Timeout Suspicious", description: "Timeout suspicious accounts during raids.", type: "switch" },
          { key: "alertChannel", label: "Alert Channel ID", description: "Channel for raid alerts.", type: "text", placeholder: "Channel ID" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await fetch(`/api/guilds/${guildId}/antiraid`, {
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
