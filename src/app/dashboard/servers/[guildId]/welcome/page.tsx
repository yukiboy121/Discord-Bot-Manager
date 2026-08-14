"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WelcomePage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/welcome`)
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

  const previewMessage = String(config.embedDescription || config.message || "")
    .replace("{user}", "@NewUser")
    .replace("{username}", "NewUser")
    .replace("{server}", "Ocean Drive RP")
    .replace("{member_count}", "1,248")
    .replace("{user_id}", "123456789");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome System</h1>
        <p className="text-gray-400 mt-1">Configure welcome messages for new members.</p>
      </div>

      <ConfigSection
        title="Welcome Configuration"
        description="Customize how new members are greeted."
        icon="👋"
        fields={[
          { key: "enabled", label: "Enable Welcome Messages", description: "Send a message when new members join.", type: "switch" },
          { key: "channelId", label: "Welcome Channel ID", description: "Channel where welcome messages are sent.", type: "text", placeholder: "Channel ID" },
          { key: "mentionUser", label: "Mention User", description: "Mention the new user in the welcome message.", type: "switch" },
          { key: "embedEnabled", label: "Use Embed", description: "Send welcome as a rich embed.", type: "switch" },
          { key: "embedTitle", label: "Embed Title", description: "Title of the welcome embed.", type: "text", placeholder: "Welcome!" },
          { key: "embedDescription", label: "Embed Description", description: "Use {user}, {username}, {server}, {member_count}, {user_id} as variables.", type: "textarea", placeholder: "Welcome {user} to **{server}**!" },
          { key: "embedColor", label: "Embed Color", description: "Color of the embed sidebar.", type: "color" },
          { key: "embedThumbnail", label: "Show User Avatar", description: "Display user avatar as embed thumbnail.", type: "switch" },
          { key: "message", label: "Plain Text Message", description: "Fallback message when embed is disabled.", type: "textarea", placeholder: "Welcome {user} to **{server}**!" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await fetch(`/api/guilds/${guildId}/welcome`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const updated = await res.json();
          setConfig(updated);
        }}
      />

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>👁️</span> Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md bg-[#2f3136] rounded-lg overflow-hidden">
            <div className="flex items-start gap-3 p-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold shrink-0">
                S
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-white">Sentinel</span>
                  <span className="text-xs bg-indigo-600 text-white px-1.5 py-0.5 rounded">BOT</span>
                  <span className="text-xs text-gray-500">Today at 12:00 PM</span>
                </div>
                {config.embedEnabled ? (
                  <div
                    className="rounded-md overflow-hidden border-l-4 bg-[#2f3136] mt-2"
                    style={{ borderColor: String(config.embedColor || "#5865F2") }}
                  >
                    <div className="p-3">
                      <div className="text-sm font-semibold text-white mb-1">
                        {String(config.embedTitle || "Welcome!")}
                      </div>
                      <div className="text-sm text-gray-300">
                        {previewMessage}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-300">{previewMessage}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
