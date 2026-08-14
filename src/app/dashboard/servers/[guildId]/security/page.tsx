"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";

export default function SecurityPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/security`)
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
        <h1 className="text-3xl font-bold text-white">Security Settings</h1>
        <p className="text-gray-400 mt-1">Configure your server&apos;s security features.</p>
      </div>

      <ConfigSection
        title="Security Modules"
        description="Enable or disable security features for this server."
        icon="🛡️"
        fields={[
          { key: "antiSpamEnabled", label: "Anti-Spam Protection", description: "Detect and prevent message spam, duplicate spam, mention spam, and more.", type: "switch" },
          { key: "antiRaidEnabled", label: "Anti-Raid Protection", description: "Detect mass joins, suspicious accounts, and coordinated raids.", type: "switch" },
          { key: "antiNukeEnabled", label: "Anti-Nuke Protection", description: "Protect against mass channel/role deletion, mass bans, and permission abuse.", type: "switch" },
          { key: "autoModEnabled", label: "Auto Moderation", description: "Automated content filtering with custom rules.", type: "switch" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await fetch(`/api/guilds/${guildId}/security`, {
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
