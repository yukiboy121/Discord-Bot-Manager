"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { Switch } from "@/components/ui/switch";
import type { AutoModRule } from "@/types";

const ruleTypes = [
  { value: "badword", label: "Bad Word Filter", icon: "🤬" },
  { value: "regex", label: "Regex Filter", icon: "📝" },
  { value: "link", label: "Link Filter", icon: "🔗" },
  { value: "invite", label: "Invite Filter", icon: "📨" },
  { value: "mention", label: "Mention Spam", icon: "📢" },
  { value: "caps", label: "Caps Filter", icon: "🔠" },
  { value: "emoji", label: "Emoji Spam", icon: "😀" },
  { value: "attachment", label: "Attachment Filter", icon: "📎" },
  { value: "advertisement", label: "Advertisement Filter", icon: "📺" },
];

export default function AutoModPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [rules, setRules] = useState<AutoModRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newRule, setNewRule] = useState({ name: "", type: "badword", action: "delete" });

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/automod`)
      .then((r) => r.json())
      .then(setRules)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [guildId]);

  const createRule = async () => {
    const res = await fetch(`/api/guilds/${guildId}/automod`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRule),
    });
    const rule = await res.json();
    setRules([...rules, rule]);
    setShowCreate(false);
    setNewRule({ name: "", type: "badword", action: "delete" });
  };

  const toggleRule = async (rule: AutoModRule) => {
    const res = await fetch(`/api/guilds/${guildId}/automod`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rule.id, enabled: !rule.enabled }),
    });
    const updated = await res.json();
    setRules(rules.map((r) => (r.id === rule.id ? { ...r, ...updated } : r)));
  };

  const deleteRule = async (id: number) => {
    await fetch(`/api/guilds/${guildId}/automod`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setRules(rules.filter((r) => r.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Auto Moderation</h1>
          <p className="text-gray-400 mt-1">Create custom auto-moderation rules.</p>
        </div>
        <Button onClick={() => setShowCreate(!showCreate)}>
          {showCreate ? "Cancel" : "+ Create Rule"}
        </Button>
      </div>

      {showCreate && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Rule</CardTitle>
            <CardDescription>Add a new auto-moderation rule to this server.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                placeholder="Rule Name"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
              <Select value={newRule.type} onChange={(e) => setNewRule({ ...newRule, type: e.target.value })}>
                {ruleTypes.map((t) => (
                  <option key={t.value} value={t.value}>{t.icon} {t.label}</option>
                ))}
              </Select>
              <Select value={newRule.action} onChange={(e) => setNewRule({ ...newRule, action: e.target.value })}>
                <option value="delete">🗑️ Delete</option>
                <option value="warn">⚠️ Warn</option>
                <option value="timeout">⏱️ Timeout</option>
                <option value="kick">👢 Kick</option>
                <option value="ban">🔨 Ban</option>
              </Select>
            </div>
            <Button onClick={createRule} disabled={!newRule.name}>Create Rule</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {rules.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🤖</div>
            <h2 className="text-xl font-semibold text-white mb-2">No auto-mod rules</h2>
            <p className="text-gray-400">Create your first auto-moderation rule to get started.</p>
          </Card>
        ) : (
          rules.map((rule) => {
            const ruleType = ruleTypes.find((t) => t.value === rule.type);
            return (
              <Card key={rule.id} className="hover:border-indigo-500/30 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <span className="text-2xl">{ruleType?.icon || "📋"}</span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-semibold truncate">{rule.name}</h3>
                          <Badge variant={rule.enabled ? "success" : "secondary"}>
                            {rule.enabled ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-gray-500">Type: {ruleType?.label}</span>
                          <span className="text-xs text-gray-500">Action: {rule.action}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <Switch checked={rule.enabled} onCheckedChange={() => toggleRule(rule)} />
                      <button onClick={() => deleteRule(rule.id)} className="text-gray-500 hover:text-red-400 transition-colors text-sm">
                        🗑️
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
