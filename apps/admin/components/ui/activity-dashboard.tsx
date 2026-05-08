"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  TrendingUp,
  Users,
  FileText,
  DollarSign,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  activeCustomers: number;
  pendingQuotations: number;
  bookingsByStatus: Record<string, number>;
  revenueByMonth: Record<string, number>;
  topDestinations: { destination: string; count: number }[];
  recentActivity: any[];
}

export function ActivityDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d" | "all">("30d");

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  async function fetchStats() {
    try {
      setLoading(true);
      const supabase = createClient();

      // Get bookings count and revenue
      const { data: bookings } = await supabase
        .from("bookings")
        .select("status, total_amount, travel_date, destination, created_at");

      // Get quotations count
      const { data: quotations } = await supabase
        .from("quotations")
        .select("status, created_at");

      // Get customers (unique emails from bookings)
      const { data: customers } = await supabase
        .from("bookings")
        .select("customer_email");

      // Calculate stats
      const totalBookings = bookings?.length || 0;
      const totalRevenue = bookings?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0;
      const activeCustomers = new Set(customers?.map((c) => c.customer_email)).size || 0;
      const pendingQuotations = quotations?.filter((q) => q.status === "sent").length || 0;

      // Bookings by status
      const bookingsByStatus: Record<string, number> = {};
      bookings?.forEach((b) => {
        bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
      });

      // Revenue by month (last 6 months)
      const revenueByMonth: Record<string, number> = {};
      const now = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
        revenueByMonth[key] = 0;
      }

      bookings?.forEach((b) => {
        if (b.created_at) {
          const date = new Date(b.created_at);
          const key = date.toLocaleString("default", { month: "short", year: "2-digit" });
          if (revenueByMonth[key] !== undefined) {
            revenueByMonth[key] += b.total_amount || 0;
          }
        }
      });

      // Top destinations
      const destinationCount: Record<string, number> = {};
      bookings?.forEach((b) => {
        if (b.destination) {
          destinationCount[b.destination] = (destinationCount[b.destination] || 0) + 1;
        }
      });

      const topDestinations = Object.entries(destinationCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([destination, count]) => ({ destination, count }));

      // Recent activity (last 10 bookings)
      const recentActivity = bookings
        ?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 10) || [];

      setStats({
        totalBookings,
        totalRevenue,
        activeCustomers,
        pendingQuotations,
        bookingsByStatus,
        revenueByMonth,
        topDestinations,
        recentActivity,
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Activity Dashboard</h2>
        <div className="flex gap-2">
          {(["7d", "30d", "90d", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-sm rounded-lg ${
                timeRange === range
                  ? "bg-sky-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {range === "all" ? "All Time" : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-sky-100 rounded-lg">
              <FileText className="w-6 h-6 text-sky-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              12%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              8%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-gray-900">
            ${(stats?.totalRevenue || 0).toLocaleString()}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center text-green-600 text-sm font-medium">
              <ArrowUpRight className="w-4 h-4" />
              5%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Active Customers</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.activeCustomers || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="flex items-center text-red-600 text-sm font-medium">
              <ArrowDownRight className="w-4 h-4" />
              3%
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Pending Quotes</p>
          <p className="text-3xl font-bold text-gray-900">{stats?.pendingQuotations || 0}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Revenue Trend</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats?.revenueByMonth &&
              Object.entries(stats.revenueByMonth).map(([month, revenue]) => (
                <div key={month} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 w-16">{month}</span>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-sky-500 to-sky-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (revenue / Math.max(...Object.values(stats.revenueByMonth))) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium w-20 text-right">
                    ${revenue.toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Top Destinations */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">Top Destinations</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {stats?.topDestinations.map((dest, index) => (
              <div key={dest.destination} className="flex items-center gap-3">
                <div className="flex items-center justify-center w-6 h-6 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{dest.destination}</p>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-sky-500 rounded-full"
                      style={{
                        width: `${(dest.count / (stats.topDestinations[0]?.count || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-600 w-12 text-right">
                  {dest.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings by Status */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Bookings by Status</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {stats?.bookingsByStatus &&
            Object.entries(stats.bookingsByStatus).map(([status, count]) => (
              <div
                key={status}
                className="text-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center justify-center mb-2">
                  {status === "confirmed" || status === "paid" || status === "completed" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : status === "pending_payment" || status === "pending" ? (
                    <Clock className="w-5 h-5 text-yellow-600" />
                  ) : status === "cancelled" ? (
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <FileText className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-xs text-gray-600 mt-1 capitalize">
                  {status.replace("_", " ")}
                </p>
              </div>
            ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Recent Activity</h3>
          <button
            onClick={fetchStats}
            className="text-sm text-sky-600 hover:text-sky-700 font-medium"
          >
            Refresh
          </button>
        </div>
        <div className="space-y-3">
          {stats?.recentActivity.slice(0, 5).map((activity, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-100 rounded-lg">
                  <FileText className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{activity.customer_name}</p>
                  <p className="text-sm text-gray-600">
                    {activity.destination || "No destination"} •{" "}
                    <span className="font-mono">{activity.booking_reference}</span>
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">
                  ${activity.total_amount?.toLocaleString() || "0"}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
