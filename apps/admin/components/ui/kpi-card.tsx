"use client";

import { ArrowUpRight, ArrowDownRight, type LucideIcon } from "lucide-react";

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: LucideIcon;
  color?: string;
  chart?: number[];
  loading?: boolean;
}

export function KpiCard({
  label,
  value,
  change,
  trend,
  icon: Icon,
  color = "text-primary bg-primary/10",
  chart,
  loading,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="stat-card animate-pulse">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8 h-8 rounded-lg bg-muted" />
          <div className="w-16 h-5 rounded bg-muted" />
        </div>
        <div className="h-7 w-24 rounded bg-muted mb-1" />
        <div className="h-4 w-20 rounded bg-muted" />
        {chart && <div className="h-8 mt-3 rounded bg-muted" />}
      </div>
    );
  }

  return (
    <div className="stat-card group cursor-default">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        {change && trend && (
          <span className={`stat-trend ${
            trend === "up" ? "stat-trend-up" : trend === "down" ? "stat-trend-down" : "stat-trend"
          }`}>
            {trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {change}
          </span>
        )}
      </div>
      <p className="kpi-value">{value}</p>
      <p className="kpi-label">{label}</p>
      {chart && chart.length > 0 && (
        <div className="mini-chart mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
          {chart.map((h, i) => (
            <div
              key={i}
              className={`bar ${i === chart.length - 1 ? "active" : ""}`}
              style={{ height: `${Math.max(4, (h / 100) * 32)}px` }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
