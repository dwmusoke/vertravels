"use client";

import {
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  CreditCard,
  Ticket,
  Upload,
  RefreshCw,
  UserPlus,
  type LucideIcon,
} from "lucide-react";

interface Activity {
  id: string;
  type: "booking" | "payment" | "ticket" | "pnr" | "refund" | "user" | "system" | "reconciliation";
  title: string;
  description: string;
  amount?: string;
  time: string;
  status?: "success" | "warning" | "error" | "info";
}

const typeConfig: Record<string, { icon: LucideIcon; color: string; bg: string }> = {
  booking: { icon: FileText, color: "text-sky-600", bg: "bg-sky-50" },
  payment: { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
  ticket: { icon: Ticket, color: "text-violet-600", bg: "bg-violet-50" },
  pnr: { icon: Upload, color: "text-amber-600", bg: "bg-amber-50" },
  refund: { icon: RefreshCw, color: "text-rose-600", bg: "bg-rose-50" },
  user: { icon: UserPlus, color: "text-indigo-600", bg: "bg-indigo-50" },
  system: { icon: Clock, color: "text-gray-600", bg: "bg-gray-50" },
  reconciliation: { icon: RefreshCw, color: "text-teal-600", bg: "bg-teal-50" },
};

interface ActivityFeedProps {
  activities: Activity[];
  loading?: boolean;
  maxItems?: number;
}

export function ActivityFeed({ activities, loading, maxItems = 10 }: ActivityFeedProps) {
  const items = activities.slice(0, maxItems);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-muted shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-4 w-48 rounded bg-muted" />
              <div className="h-3 w-32 rounded bg-muted" />
            </div>
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-muted-foreground">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        No recent activity
      </div>
    );
  }

  return (
    <div className="divide-y divide-border/60">
      {items.map((activity) => {
        const config = typeConfig[activity.type] || typeConfig.system;
        const StatusIcon = config.icon;
        return (
          <div key={activity.id} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.color} shrink-0`}>
              <StatusIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{activity.title}</p>
              <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
            </div>
            <div className="text-right shrink-0">
              {activity.amount && (
                <p className="text-sm font-semibold text-foreground">{activity.amount}</p>
              )}
              <p className="text-[10px] text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
