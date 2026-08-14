"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ConfigSection } from "@/components/dashboard/config-section";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { Button } from "@/components/ui/button";

interface EscalationLevel {
  level: number;
  action: string;
  duration: number | null;
}

export default function AntiSpamPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [config, setConfig] = useState<Record<string, unknown> | null>(null);
  const [escalation, setEscalation] = useState<EscalationLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/antispam`)
      .then((r) => r.json())
      .then((data) => {
        setConfig(data);
        setEscalation(
          (data.escalationLevels as EscalationLevel[]) || [
            { level: 1, action: "warn", duration: null },
            { level: 2, action: "delete", duration: null },
            { level: 3, action: "timeout", duration: 60 },
            { level: 4, action: "timeout", duration: 600 },
            { level: 5, action: "timeout", duration: 3600 },
            { level: 6, action: "kick", duration: null },
            { level: 7, action: "ban", duration: null },
          ]
        );
      })
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

  const saveEscalation = async () => {
    await fetch(`/api/guilds/${guildId}/antispam`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ escalationLevels: escalation }),
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Anti-Spam Configuration</h1>
        <p className="text-gray-400 mt-1">Configure spam detection thresholds and actions.</p>
      </div>

      <ConfigSection
        title="Spam Detection"
        description="Configure detection thresholds for various spam types."
        icon="🚫"
        fields={[
          { key: "enabled", label: "Enable Anti-Spam", description: "Master toggle for the anti-spam engine.", type: "switch" },
          { key: "messageThreshold", label: "Message Threshold", description: "Number of messages before triggering (e.g., 5 messages).", type: "number", min: 2, max: 20 },
          { key: "messageInterval", label: "Message Interval (seconds)", description: "Time window for message threshold (e.g., within 3 seconds).", type: "number", min: 1, max: 30 },
          { key: "duplicateThreshold", label: "Duplicate Threshold", description: "Number of identical messages before triggering.", type: "number", min: 2, max: 10 },
          { key: "mentionLimit", label: "Mention Limit", description: "Maximum mentions per message.", type: "number", min: 1, max: 30 },
          { key: "emojiSpamLimit", label: "Emoji Spam Limit", description: "Maximum emojis per message.", type: "number", min: 3, max: 50 },
          { key: "capsPercentLimit", label: "Caps Limit (%)", description: "Maximum percentage of uppercase characters.", type: "number", min: 50, max: 100 },
          { key: "attachmentSpamThreshold", label: "Attachment Spam Threshold", description: "Attachments within time window.", type: "number", min: 2, max: 20 },
          { key: "linkSpamEnabled", label: "Link Spam Detection", description: "Detect repeated URL posting.", type: "switch" },
          { key: "inviteSpamEnabled", label: "Invite Spam Detection", description: "Detect Discord invite link spam.", type: "switch" },
          { key: "characterSpamEnabled", label: "Character Spam Detection", description: "Detect repeated character patterns like !!!!! or AAAA.", type: "switch" },
        ]}
        values={config}
        onSave={async (values) => {
          const res = await fetch(`/api/guilds/${guildId}/antispam`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          });
          const updated = await res.json();
          setConfig(updated);
        }}
      />

      {/* Escalation System */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📈</span>
              <div>
                <CardTitle>Escalation System</CardTitle>
                <CardDescription>Configure progressive punishment for repeat offenders.</CardDescription>
              </div>
            </div>
            <Button onClick={saveEscalation} size="sm">Save Escalation</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {escalation.map((level, index) => (
              <div key={level.level} className="flex items-center gap-4 p-4 rounded-lg bg-gray-700/30 border border-gray-700/50">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-300 font-bold text-sm shrink-0">
                  #{level.level}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Select
                    value={level.action}
                    onChange={(e) => {
                      const updated = [...escalation];
                      updated[index] = { ...level, action: e.target.value };
                      setEscalation(updated);
                    }}
                  >
                    <option value="warn">⚠️ Warn</option>
                    <option value="delete">🗑️ Delete Messages</option>
                    <option value="timeout">⏱️ Timeout</option>
                    <option value="kick">👢 Kick</option>
                    <option value="ban">🔨 Ban</option>
                  </Select>
                  {level.action === "timeout" && (
                    <Input
                      type="number"
                      value={level.duration ?? 60}
                      onChange={(e) => {
                        const updated = [...escalation];
                        updated[index] = { ...level, duration: parseInt(e.target.value) || 60 };
                        setEscalation(updated);
                      }}
                      placeholder="Duration (seconds)"
                      min={10}
                    />
                  )}
                </div>
                <button
                  onClick={() => setEscalation(escalation.filter((_, i) => i !== index))}
                  className="text-gray-500 hover:text-red-400 transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEscalation([...escalation, { level: escalation.length + 1, action: "warn", duration: null }])}
              className="w-full"
            >
              + Add Level
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
