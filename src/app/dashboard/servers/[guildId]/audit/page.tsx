"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { AuditLogEntry } from "@/types";

export default function AuditPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchLogs = (p: number = 1) => {
    setLoading(true);
    apiFetch(`/api/guilds/${guildId}/audit?page=${p}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setLogs(data.logs || []);
        setTotalPages(data.totalPages || 1);
        setPage(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const categoryColors: Record<string, "default" | "destructive" | "warning" | "success" | "secondary"> = {
    security: "destructive",
    moderation: "warning",
    config: "default",
    webhook: "secondary",
    role: "success",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Audit Log</h1>
        <p className="text-gray-400 mt-1">Track all dashboard actions and configuration changes.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-white mb-2">No audit logs</h2>
            <p className="text-gray-400">Dashboard actions will appear here.</p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="hover:border-indigo-500/20 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <Badge variant={categoryColors[log.category] || "secondary"} className="capitalize">
                      {log.category}
                    </Badge>
                    <div>
                      <p className="text-sm text-gray-200">{log.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">by {log.username || log.userId}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(log.createdAt)}</span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchLogs(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => fetchLogs(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
