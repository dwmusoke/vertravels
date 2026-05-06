"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  DollarSign,
  Users,
  Calendar,
  Activity,
  RefreshCcw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    totalBookings: number;
    totalRevenue: number;
    totalUsers: number;
    activeModules: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      setLoading(true);
      const supabase = createClient();

      const { data: bookings } = await supabase
        .from("bookings")
        .select("*")
        .limit(100);

      const { count: userCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

      const totalBookings = bookings?.length || 0;
      const totalRevenue =
        bookings
          ?.filter((b: any) => b.payment_status === "paid")
          .reduce((sum: number, b: any) => sum + (b.total_amount || 0), 0) || 0;

      setStats({
        totalBookings,
        totalRevenue,
        totalUsers: userCount || 0,
        activeModules: 5,
      });
    } catch (err: any) {
      console.error("Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCcw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 w-64 bg-white border-r h-full">
        <div className="h-16 flex items-center px-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-teal-500 rounded-lg flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">VerTravels Admin</span>
          </div>
        </div>
        <nav className="p-4 space-y-1">
          <a
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg bg-sky-50 text-sky-600"
          >
            <Activity className="w-4 h-4" />
            Dashboard
          </a>
          <a
            href="/bookings"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Calendar className="w-4 h-4" />
            Bookings
          </a>
          <a
            href="/users"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-gray-100"
          >
            <Users className="w-4 h-4" />
            Users
          </a>
        </nav>
      </aside>

      <main className="ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">Overview of your travel business</p>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalBookings || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-sky-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">
                  ${stats?.totalRevenue?.toLocaleString() || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.totalUsers || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Modules</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.activeModules || 5}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">Active Modules</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="p-4 bg-sky-50 rounded-lg text-center">
              <Plane className="w-6 h-6 text-sky-600 mx-auto mb-2" />
              <p className="font-medium">Flights</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-lg text-center">
              <Hotel className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
              <p className="font-medium">Hotels</p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg text-center">
              <MapPin className="w-6 h-6 text-amber-600 mx-auto mb-2" />
              <p className="font-medium">Tours</p>
            </div>
            <div className="p-4 bg-violet-50 rounded-lg text-center">
              <Car className="w-6 h-6 text-violet-600 mx-auto mb-2" />
              <p className="font-medium">Cars</p>
            </div>
            <div className="p-4 bg-pink-50 rounded-lg text-center">
              <FileText className="w-6 h-6 text-pink-600 mx-auto mb-2" />
              <p className="font-medium">Visa</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
