"use client";
import { apiFetch } from "@/lib/api";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate, getSeverityColor } from "@/lib/utils";
import type { SecurityEvent } from "@/types";

export default function EventsPage() {
  const params = useParams();
  const guildId = params.guildId as string;
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchEvents = (p: number = 1) => {
    setLoading(true);
    apiFetch(`/api/guilds/${guildId}/events?page=${p}&limit=20`)
      .then((r) => r.json())
      .then((data) => {
        setEvents(data.events || []);
        setTotalPages(data.totalPages || 1);
        setPage(p);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guildId]);

  const typeIcons: Record<string, string> = {
    spam: "🚫",
    raid: "⚔️",
    nuke: "🔒",
    automod: "🤖",
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Security Events</h1>
        <p className="text-gray-400 mt-1">View all security incidents detected by Sentinel.</p>
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : events.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h2 className="text-xl font-semibold text-white mb-2">No security events</h2>
            <p className="text-gray-400">Your server is secure. Events will appear here when detected.</p>
          </Card>
        ) : (
          events.map((event) => (
            <Card key={event.id} className="hover:border-indigo-500/20 transition-all">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <span className="text-2xl mt-1">{typeIcons[event.type] || "⚠️"}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Badge className={getSeverityColor(event.severity)} variant="outline">
                        {event.severity}
                      </Badge>
                      <Badge variant="secondary" className="capitalize">{event.type}</Badge>
                      {event.targetUsername && (
                        <span className="text-xs text-gray-500">Target: {event.targetUsername}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-200">{event.description}</p>
                    {event.actionTaken && (
                      <p className="text-xs text-green-400 mt-1">Action: {event.actionTaken}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">{formatDate(event.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => fetchEvents(page - 1)} disabled={page <= 1}>
            Previous
          </Button>
          <span className="text-sm text-gray-400">Page {page} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => fetchEvents(page + 1)} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
