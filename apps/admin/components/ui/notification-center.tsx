"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, X, CheckCircle, AlertCircle, Clock, Info, ExternalLink } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "success" | "warning" | "error" | "info";
  time: string;
  read: boolean;
  link?: string;
}

const sampleNotifications: Notification[] = [
  { id: "1", title: "PNR Batch Processed", message: "Batch PNR-001 processed: 15 success, 2 errors", type: "success", time: "2 min ago", read: false },
  { id: "2", title: "Payment Received", message: "$1,200 payment from John Smith for booking VT-1001", type: "success", time: "15 min ago", read: false },
  { id: "3", title: "Ticket Time Limit", message: "Booking VT-1003 expires in 2 hours", type: "warning", time: "1 hour ago", read: false },
  { id: "4", title: "Reconciliation Alert", message: "BSP report mismatch detected for period Mar 2026", type: "error", time: "3 hours ago", read: true },
  { id: "5", title: "New Booking", message: "Jane Doe booked JFK→LHR, May 20-25", type: "info", time: "5 hours ago", read: true },
];

const typeStyles = {
  success: { icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50" },
  warning: { icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
  error: { icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  info: { icon: Info, color: "text-sky-600", bg: "bg-sky-50" },
};

interface NotificationCenterProps {
  notifications?: Notification[];
  onMarkRead?: (id: string) => void;
  onMarkAllRead?: () => void;
  onClear?: (id: string) => void;
}

export function NotificationCenter({
  notifications = sampleNotifications,
  onMarkRead,
  onMarkAllRead,
  onClear,
}: NotificationCenterProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const unread = notifications.filter((n) => !n.read).length;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)} className="btn-icon relative group">
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold text-white bg-danger rounded-full">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-96 bg-surface border border-border rounded-xl shadow-modal animate-scale-in z-50">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="font-semibold text-sm text-foreground">Notifications</h3>
              <p className="text-[10px] text-muted-foreground">{unread} unread</p>
            </div>
            {unread > 0 && (
              <button
                onClick={() => { onMarkAllRead?.(); }}
                className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-border/60">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
                No notifications
              </div>
            ) : (
              notifications.map((n) => {
                const { icon: Icon, color, bg } = typeStyles[n.type];
                return (
                  <div
                    key={n.id}
                    className={`flex gap-3 px-4 py-3 transition-colors ${
                      !n.read ? `${bg}/30` : ""
                    } hover:bg-muted/50 cursor-pointer`}
                    onClick={() => onMarkRead?.(n.id)}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg ${bg} ${color} shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{n.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] text-muted-foreground">{n.time}</span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); onClear?.(n.id); }}
                      className="p-0.5 text-muted-foreground/40 hover:text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="border-t border-border px-4 py-2.5">
            <button className="w-full text-center text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
