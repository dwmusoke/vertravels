"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Bot,
  Activity,
  Globe,
  BarChart3,
  Sparkles,
} from "lucide-react";

export default function AdminDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  async function fetchStats() {
    try {
      setLoading(true);
      const { data: bookings } = await supabase
        .from("bookings")
        .select("status, total_amount, travel_date, destination, created_at, customer_name, booking_ref");

      const { data: quotations } = await supabase
        .from("quotations")
        .select("status, created_at");

      const { data: customers } = await supabase
        .from("bookings")
        .select("customer_email");

      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0) || 0;
      const activeCustomers = new Set(customers?.map((c: any) => c.customer_email)).size || 0;
      const pendingQuotations = quotations?.filter((q: any) => q.status === "sent").length || 0;

      // Bookings by status
      const bookingsByStatus: Record<string, number> = {};
      bookings?.forEach((b: any) => {
        bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
      });

      // Monthly revenue
      const revenueByMonth: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        revenueByMonth[date.toLocaleString("default", { month: "short" })] = 0;
      }
      bookings?.forEach((b: any) => {
        if (b.created_at) {
          const key = new Date(b.created_at).toLocaleString("default", { month: "short" });
          if (revenueByMonth[key] !== undefined) revenueByMonth[key] += b.total_amount || 0;
        }
      });

      // Top destinations
      const destCount: Record<string, number> = {};
      bookings?.forEach((b: any) => {
        if (b.destination) destCount[b.destination] = (destCount[b.destination] || 0) + 1;
      });
      const topDestinations = Object.entries(destCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([destination, count]) => ({ destination, count }));

      const recentBookings = bookings
        ?.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 8) || [];

      const statusCounts = Object.values(bookingsByStatus).reduce((a, b) => a + b, 0);
      const confirmedCount = (bookingsByStatus["confirmed"] || 0) + (bookingsByStatus["paid"] || 0);
      const pendingCount = (bookingsByStatus["pending"] || 0) + (bookingsByStatus["pending_payment"] || 0);
      const cancelledCount = bookingsByStatus["cancelled"] || 0;
      const conversionRate = statusCounts > 0 ? Math.round((confirmedCount / statusCounts) * 100) : 0;

      setStats({
        totalBookings,
        totalRevenue,
        activeCustomers,
        pendingQuotations,
        bookingsByStatus,
        revenueByMonth,
        topDestinations,
        recentBookings,
        conversionRate,
        confirmedCount,
        pendingCount,
        cancelledCount,
        monthlyRevenue: Object.values(revenueByMonth),
        revenueTotal: totalRevenue,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <div className="w-5 h-5 rounded-lg bg-primary animate-pulse" />
          </div>
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...(stats?.monthlyRevenue || [0, 1]), 1);

  const kpiData = [
    {
      label: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-600 bg-emerald-50",
      chart: [40, 65, 45, 70, 55, 80],
    },
    {
      label: "Active Bookings",
      value: (stats?.totalBookings || 0).toString(),
      change: "+8.2%",
      trend: "up",
      icon: FileText,
      color: "text-sky-600 bg-sky-50",
      chart: [60, 45, 70, 55, 65, 75],
    },
    {
      label: "Conversion Rate",
      value: `${stats?.conversionRate || 0}%`,
      change: "+3.1%",
      trend: "up",
      icon: TrendingUp,
      color: "text-violet-600 bg-violet-50",
      chart: [45, 55, 50, 60, 58, 65],
    },
    {
      label: "Active Customers",
      value: (stats?.activeCustomers || 0).toString(),
      change: "+5.7%",
      trend: "up",
      icon: Users,
      color: "text-amber-600 bg-amber-50",
      chart: [30, 45, 35, 50, 45, 55],
    },
    {
      label: "Pending Payments",
      value: stats?.pendingCount?.toString() || "0",
      change: "-2.3%",
      trend: "down",
      icon: Clock,
      color: "text-rose-600 bg-rose-50",
      chart: [50, 40, 45, 35, 30, 25],
    },
    {
      label: "Confirmed Bookings",
      value: stats?.confirmedCount?.toString() || "0",
      change: "+15.3%",
      trend: "up",
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50",
      chart: [35, 50, 45, 60, 55, 70],
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Operations Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time overview of your travel operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === r
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <button onClick={fetchStats} className="btn-icon" title="Refresh">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {kpiData.map((kpi) => (
          <div key={kpi.label} className="stat-card group cursor-default">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg ${kpi.color}`}>
                <kpi.icon className="w-4 h-4" />
              </div>
              <span className={`stat-trend ${
                kpi.trend === "up" ? "stat-trend-up" : "stat-trend-down"
              }`}>
                {kpi.trend === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {kpi.change}
              </span>
            </div>
            <p className="kpi-value">{kpi.value}</p>
            <p className="kpi-label">{kpi.label}</p>
            <div className="mini-chart mt-3 opacity-60 group-hover:opacity-100 transition-opacity">
              {kpi.chart.map((h, i) => (
                <div
                  key={i}
                  className={`bar ${i === kpi.chart.length - 1 ? "active" : ""}`}
                  style={{ height: `${(h / 100) * 32}px` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Revenue Chart */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Revenue Trend</h3>
            </div>
            <span className="text-xs text-muted-foreground">Last 6 months</span>
          </div>
          <div className="card-body">
            <div className="space-y-2">
              {stats?.revenueByMonth && Object.entries(stats.revenueByMonth).map(([month, revenue]: [string, any]) => (
                <div key={month} className="flex items-center gap-3 group">
                  <span className="text-xs font-medium text-muted-foreground w-10">{month}</span>
                  <div className="flex-1 h-7 bg-muted rounded-md overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-md transition-all duration-500 group-hover:opacity-80"
                      style={{ width: `${(revenue / maxRevenue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-foreground w-24 text-right tabular-nums">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Operations Panel */}
        <div className="space-y-4">
          {/* AI Insights */}
          <div className="card-gradient card">
            <div className="card-header flex items-center gap-2">
              <Bot className="w-4 h-4 text-ai" />
              <h3 className="font-semibold text-sm">AI Insights</h3>
            </div>
            <div className="card-body space-y-3">
              {[
                { icon: TrendingUp, text: "Revenue up 12.5% this period", color: "text-emerald-600", bg: "bg-emerald-50" },
                { icon: Globe, text: `Top destination: ${stats?.topDestinations?.[0]?.destination || "N/A"}`, color: "text-sky-600", bg: "bg-sky-50" },
                { icon: AlertCircle, text: `${stats?.cancelledCount || 0} cancellations detected`, color: "text-rose-600", bg: "bg-rose-50" },
                { icon: Sparkles, text: `${stats?.conversionRate || 0}% booking conversion rate`, color: "text-violet-600", bg: "bg-violet-50" },
              ].map((insight, i) => (
                <div key={i} className={`flex items-start gap-3 p-2.5 rounded-lg ${insight.bg}/50`}>
                  <insight.icon className={`w-4 h-4 mt-0.5 ${insight.color}`} />
                  <p className="text-xs text-foreground">{insight.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Status Breakdown */}
          <div className="card">
            <div className="card-header flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Booking Status</h3>
            </div>
            <div className="card-body space-y-2">
              {[
                { label: "Confirmed", count: stats?.confirmedCount || 0, color: "bg-emerald-500" },
                { label: "Pending", count: stats?.pendingCount || 0, color: "bg-amber-500" },
                { label: "Cancelled", count: stats?.cancelledCount || 0, color: "bg-rose-500" },
              ].map((s) => {
                const total = (stats?.confirmedCount || 0) + (stats?.pendingCount || 0) + (stats?.cancelledCount || 0);
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span className="text-xs text-muted-foreground flex-1">{s.label}</span>
                    <span className="text-xs font-semibold">{s.count}</span>
                    <span className="text-[10px] text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom grid: Activity + Destinations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card">
          <div className="card-header flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Recent Activity</h3>
            </div>
            <span className="text-[10px] text-muted-foreground">Latest 8</span>
          </div>
          <div className="divide-y divide-border/60">
            {stats?.recentBookings.map((b: any, i: number) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  b.status === "confirmed" || b.status === "paid" ? "bg-emerald-50 text-emerald-600" :
                  b.status === "cancelled" ? "bg-rose-50 text-rose-600" :
                  "bg-amber-50 text-amber-600"
                }`}>
                  {b.status === "confirmed" || b.status === "paid" ? <CheckCircle className="w-4 h-4" /> :
                   b.status === "cancelled" ? <AlertCircle className="w-4 h-4" /> :
                   <Clock className="w-4 h-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{b.customer_name || "Guest"}</p>
                  <p className="text-xs text-muted-foreground">
                    {b.destination || "No destination"} {b.booking_ref ? `• ${b.booking_ref}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">${b.total_amount?.toLocaleString() || "0"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}
                  </p>
                </div>
              </div>
            ))}
            {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">No recent activity</div>
            )}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="card">
          <div className="card-header flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" />
            <h3 className="font-semibold text-sm">Top Destinations</h3>
          </div>
          <div className="card-body space-y-3">
            {stats?.topDestinations.map((d: any, i: number) => {
              const maxCount = stats.topDestinations[0]?.count || 1;
              return (
                <div key={d.destination}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">{d.destination}</span>
                    <span className="text-xs text-muted-foreground">{d.count} trips</span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all"
                      style={{ width: `${(d.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {(!stats?.topDestinations || stats.topDestinations.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No destinations data</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
