"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";

export default function LeavePage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/leave`)
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
        <h1 className="text-3xl font-bold text-white">Leave System</h1>
        <p className="text-gray-400 mt-1">Configure leave messages when members depart.</p>
      </div>

      <ConfigSection
        title="Leave Configuration"
        description="Customize leave messages. Use {user}, {username}, {server}, {member_count} as variables."
        icon="👋"
        fields={[
          { key: "enabled", label: "Enable Leave Messages", description: "Send a message when members leave.", type: "switch" },
          { key: "channelId", label: "Leave Channel ID", description: "Channel where leave messages are sent.", type: "text", placeholder: "Channel ID" },
          { key: "message", label: "Leave Message", description: "Customize the leave message text.", type: "textarea", placeholder: "{username} has left **{server}**." },
          { key: "embedEnabled", label: "Use Embed", description: "Send leave message as a rich embed.", type: "switch" },
          { key: "embedColor", label: "Embed Color", description: "Color of the embed sidebar.", type: "color" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await fetch(`/api/guilds/${guildId}/leave`, {
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
