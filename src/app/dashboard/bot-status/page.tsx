"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { Switch } from "@/components/ui/switch";
import type { BotStatus } from "@/types";

const statusTypeIcons: Record<string, string> = {
  playing: "🎮",
  watching: "👁️",
  listening: "🎵",
  streaming: "📡",
};

export default function BotStatusPage() {
  const [statuses, setStatuses] = useState<BotStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newStatus, setNewStatus] = useState({ type: "watching", text: "", interval: 10 });

  useEffect(() => {
    apiFetch("/api/bot/statuses", { credentials: "include" })
      .then((r) => r.json())
      .then(setStatuses)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addStatus = async () => {
    const res = await apiFetch("/api/bot/statuses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newStatus),
    });
    const status = await res.json();
    setStatuses([...statuses, status]);
    setShowAdd(false);
    setNewStatus({ type: "watching", text: "", interval: 10 });
  };

  const toggleStatus = async (status: BotStatus) => {
    const res = await apiFetch("/api/bot/statuses", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: status.id, enabled: !status.enabled }),
    });
    const updated = await res.json();
    setStatuses(statuses.map((s) => (s.id === status.id ? { ...s, ...updated } : s)));
  };

  const deleteStatus = async (id: number) => {
    await apiFetch("/api/bot/statuses", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setStatuses(statuses.filter((s) => s.id !== id));
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
          <h1 className="text-3xl font-bold text-white">Bot Status Rotation</h1>
          <p className="text-gray-400 mt-1">Manage rotating bot presence statuses.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : "+ Add Status"}
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Status</CardTitle>
            <CardDescription>Create a new rotating status entry.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Select value={newStatus.type} onChange={(e) => setNewStatus({ ...newStatus, type: e.target.value })}>
                <option value="playing">🎮 Playing</option>
                <option value="watching">👁️ Watching</option>
                <option value="listening">🎵 Listening</option>
                <option value="streaming">📡 Streaming</option>
              </Select>
              <Input
                placeholder="Status text..."
                value={newStatus.text}
                onChange={(e) => setNewStatus({ ...newStatus, text: e.target.value })}
                className="sm:col-span-2"
              />
              <Input
                type="number"
                placeholder="Interval (s)"
                value={newStatus.interval}
                onChange={(e) => setNewStatus({ ...newStatus, interval: parseInt(e.target.value) || 10 })}
                min={5}
              />
            </div>
            <Button onClick={addStatus} disabled={!newStatus.text}>Add Status</Button>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>👁️</span> Status Rotation Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-[#2f3136]">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold">
                S
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-400 border-2 border-[#2f3136]" />
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Sentinel</div>
              <div className="text-xs text-gray-400">
                {statuses.filter((s) => s.enabled).length > 0
                  ? `${statusTypeIcons[statuses.filter((s) => s.enabled)[0]?.type] || ""} ${statuses.filter((s) => s.enabled)[0]?.type === "playing" ? "Playing" : statuses.filter((s) => s.enabled)[0]?.type === "watching" ? "Watching" : statuses.filter((s) => s.enabled)[0]?.type === "listening" ? "Listening to" : "Streaming"} ${statuses.filter((s) => s.enabled)[0]?.text}`
                  : "No active statuses"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status List */}
      <div className="space-y-3">
        {statuses.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🎭</div>
            <h2 className="text-xl font-semibold text-white mb-2">No statuses configured</h2>
            <p className="text-gray-400">Add rotating status entries for the bot.</p>
          </Card>
        ) : (
          statuses.map((status) => (
            <Card key={status.id} className="hover:border-indigo-500/20 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0">
                    <span className="text-2xl">{statusTypeIcons[status.type] || "📋"}</span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{status.text}</span>
                        <Badge variant={status.enabled ? "success" : "secondary"}>
                          {status.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="capitalize">{status.type}</span> • Every {status.interval}s
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Switch checked={status.enabled} onCheckedChange={() => toggleStatus(status)} />
                    <button onClick={() => deleteStatus(status.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                      🗑️
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

