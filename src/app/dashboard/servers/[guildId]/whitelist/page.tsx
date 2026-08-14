"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { formatDate } from "@/lib/utils";
import type { WhitelistEntry } from "@/types";

export default function WhitelistPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [entries, setEntries] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newEntry, setNewEntry] = useState({ type: "user", targetId: "", targetName: "" });

  useEffect(() => {
    fetch(`/api/guilds/${guildId}/whitelist`)
      .then((r) => r.json())
      .then(setEntries)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [guildId]);

  const addEntry = async () => {
    const res = await fetch(`/api/guilds/${guildId}/whitelist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });
    const entry = await res.json();
    setEntries([...entries, entry]);
    setShowAdd(false);
    setNewEntry({ type: "user", targetId: "", targetName: "" });
  };

  const removeEntry = async (id: number) => {
    await fetch(`/api/guilds/${guildId}/whitelist`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setEntries(entries.filter((e) => e.id !== id));
  };

  const typeIcons: Record<string, string> = {
    user: "👤",
    role: "🏷️",
    bot: "🤖",
    channel: "📝",
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
          <h1 className="text-3xl font-bold text-white">Whitelist</h1>
          <p className="text-gray-400 mt-1">Manage users, roles, bots, and channels exempt from security checks.</p>
        </div>
        <Button onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? "Cancel" : "+ Add Entry"}
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardHeader>
            <CardTitle>Add Whitelist Entry</CardTitle>
            <CardDescription>Exempt a user, role, bot, or channel from security checks.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={newEntry.type} onChange={(e) => setNewEntry({ ...newEntry, type: e.target.value })}>
                <option value="user">👤 User</option>
                <option value="role">🏷️ Role</option>
                <option value="bot">🤖 Bot</option>
                <option value="channel">📝 Channel</option>
              </Select>
              <Input
                placeholder="ID"
                value={newEntry.targetId}
                onChange={(e) => setNewEntry({ ...newEntry, targetId: e.target.value })}
              />
              <Input
                placeholder="Name (optional)"
                value={newEntry.targetName}
                onChange={(e) => setNewEntry({ ...newEntry, targetName: e.target.value })}
              />
            </div>
            <Button onClick={addEntry} disabled={!newEntry.targetId}>Add to Whitelist</Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {entries.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-xl font-semibold text-white mb-2">No whitelist entries</h2>
            <p className="text-gray-400">Add users, roles, or bots to exempt them from security checks.</p>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="hover:border-indigo-500/20 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{typeIcons[entry.type] || "📋"}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{entry.targetName || entry.targetId}</span>
                        <Badge variant="secondary" className="capitalize">{entry.type}</Badge>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ID: {entry.targetId} • Added {formatDate(entry.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeEntry(entry.id)} className="text-red-400 hover:text-red-300">
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
