"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Building2, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";

export default function AgencyInsightsPage() {
  const [insights, setInsights] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeCustomers: 0,
    monthlyGrowth: 0,
    topRoutes: [] as { route: string; count: number }[],
    bookingByStatus: [] as { status: string; count: number }[],
  });
  const [period, setPeriod] = useState("month");

  const supabase = createClient();

  useEffect(() => {
    async function fetchInsights() {
      try {
        const { data: bookings } = await supabase.from("bookings").select("*");
        if (!bookings) return;

        const totalRevenue = bookings.reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0);
        const routeCounts: Record<string, number> = {};
        const statusCounts: Record<string, number> = {};
        bookings.forEach((b: any) => {
          const route = b.destination || "Unknown";
          routeCounts[route] = (routeCounts[route] || 0) + 1;
          statusCounts[b.status] = (statusCounts[b.status] || 0) + 1;
        });

        setInsights({
          totalBookings: bookings.length,
          totalRevenue,
          activeCustomers: new Set(bookings.map((b: any) => b.customer_email)).size,
          monthlyGrowth: 12,
          topRoutes: Object.entries(routeCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([route, count]) => ({ route, count })),
          bookingByStatus: Object.entries(statusCounts).map(([status, count]) => ({ status, count })),
        });
      } catch (e) { console.error(e); }
    }
    fetchInsights();
  }, [period]);

  const stats = [
    { label: "Total Bookings", value: insights.totalBookings.toLocaleString(), icon: Calendar, color: "text-blue-600" },
    { label: "Total Revenue", value: `$${insights.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600" },
    { label: "Active Customers", value: insights.activeCustomers.toLocaleString(), icon: Users, color: "text-purple-600" },
    { label: "Monthly Growth", value: `${insights.monthlyGrowth}%`, icon: TrendingUp, color: "text-sky-600" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Building2 className="w-6 h-6" /> Agency Insights</h1>
          <p className="text-sm text-gray-500 mt-1">Performance metrics and analytics for your agency</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="px-4 py-2 border rounded-lg">
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="quarter">This Quarter</option>
          <option value="year">This Year</option>
        </select>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
              <span className="text-sm text-gray-500">{stat.label}</span>
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold mb-4">Top Routes</h2>
          <div className="space-y-3">
            {insights.topRoutes.map((r, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="font-medium">{r.route}</span>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{r.count} bookings</span>
              </div>
            ))}
            {insights.topRoutes.length === 0 && <p className="text-sm text-gray-400">No route data yet</p>}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="font-semibold mb-4">Bookings by Status</h2>
          <div className="space-y-3">
            {insights.bookingByStatus.map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="capitalize">{s.status.replace("_", " ")}</span>
                <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">{s.count}</span>
              </div>
            ))}
            {insights.bookingByStatus.length === 0 && <p className="text-sm text-gray-400">No booking data yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
