"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  ArrowUp,
  ArrowDown,
  Plane,
  Hotel,
  Users,
  CreditCard,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  value: string;
  change?: number;
  icon: any;
  trend?: "up" | "down" | "neutral";
}

export function KpiCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
}: KpiCardProps) {
  return (
    <Card className="widget-compact hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          {change !== undefined && (
            <span
              className={cn(
                "text-xs font-medium flex items-center gap-1",
                trend === "up" && "text-green-600",
                trend === "down" && "text-red-600",
                trend === "neutral" && "text-gray-600",
              )}
            >
              {trend === "up" && <ArrowUp className="h-3 w-3" />}
              {trend === "down" && <ArrowDown className="h-3 w-3" />}
              {change}%
            </span>
          )}
        </div>
        <div className="mt-3">
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground mt-1">{title}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardGrid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {children}
    </div>
  );
}

interface ChartWidgetProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function ChartWidget({ title, subtitle, children }: ChartWidgetProps) {
  return (
    <Card className="widget-compact">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold">{title}</CardTitle>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  time: string;
  icon?: any;
}

export function ActivityItem({
  title,
  description,
  time,
  icon: Icon,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      {Icon && (
        <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0 mt-0.5">
          <Icon className="h-4 w-4 text-accent" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
        <p className="text-xs text-gray-400 mt-1">{time}</p>
      </div>
    </div>
  );
}

export function QuickActions({ children }: { children: React.ReactNode }) {
  return (
    <Card className="widget-compact">
      <CardHeader>
        <CardTitle className="text-base">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">{children}</CardContent>
    </Card>
  );
}
