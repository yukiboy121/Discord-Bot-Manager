import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(date: Date | string | null): string {
  if (!date) return "N/A";
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 30) return `${diffDay}d ago`;
  return formatDate(date);
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case "critical": return "text-red-400 bg-red-500/10 border-red-500/20";
    case "high": return "text-orange-400 bg-orange-500/10 border-orange-500/20";
    case "medium": return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20";
    case "low": return "text-blue-400 bg-blue-500/10 border-blue-500/20";
    default: return "text-gray-400 bg-gray-500/10 border-gray-500/20";
  }
}

export function getActionColor(action: string): string {
  switch (action) {
    case "ban": return "text-red-400";
    case "kick": return "text-orange-400";
    case "timeout": return "text-yellow-400";
    case "warn": return "text-blue-400";
    case "delete": return "text-purple-400";
    case "unban":
    case "untimeout": return "text-green-400";
    default: return "text-gray-400";
  }
}
