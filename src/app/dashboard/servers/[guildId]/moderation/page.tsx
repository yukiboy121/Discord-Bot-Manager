"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select-native";
import { formatDate, getActionColor } from "@/lib/utils";
import type { ModerationCase } from "@/types";

export default function ModerationPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [cases, setCases] = useState<ModerationCase[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCases = (p: number = 1) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(p), limit: "15" });
    if (search) params.set("search", search);
    if (filter) params.set("action", filter);
    
    fetch(`/api/guilds/${guildId}/moderation?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setCases(data.cases || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setPage(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const getActionBadge = (action: string) => {
    const variants: Record<string, "destructive" | "warning" | "default" | "success" | "secondary"> = {
      ban: "destructive",
      kick: "warning",
      timeout: "warning",
      warn: "default",
      unban: "success",
      untimeout: "success",
    };
    return <Badge variant={variants[action] || "secondary"} className="capitalize">{action}</Badge>;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Moderation History</h1>
        <p className="text-gray-400 mt-1">View and search moderation cases. Total: {total} cases.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search user, moderator, or reason..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={filter} onChange={(e) => setFilter(e.target.value)} className="sm:w-48">
          <option value="">All Actions</option>
          <option value="warn">Warns</option>
          <option value="timeout">Timeouts</option>
          <option value="kick">Kicks</option>
          <option value="ban">Bans</option>
          <option value="unban">Unbans</option>
        </Select>
        <Button onClick={() => fetchCases(1)} variant="secondary">Search</Button>
      </div>

      {/* Cases */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : cases.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">⚖️</div>
            <h2 className="text-xl font-semibold text-white mb-2">No moderation cases found</h2>
            <p className="text-gray-400">No cases match your search criteria.</p>
          </Card>
        ) : (
          cases.map((c) => (
            <Card key={c.id} className="hover:border-indigo-500/20 transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-700/50 flex items-center justify-center text-sm font-mono text-gray-400 shrink-0">
                      #{c.caseNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {getActionBadge(c.action)}
                        <span className={`text-sm font-medium ${getActionColor(c.action)}`}>
                          {c.targetUsername || c.targetId}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        by {c.moderatorUsername || c.moderatorId} • {c.reason || "No reason provided"}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(c.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchCases(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-400">
            Page {page} of {totalPages}
          </span>
          <Button variant="outline" size="sm" onClick={() => fetchCases(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
