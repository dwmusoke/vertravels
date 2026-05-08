"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User, LogOut, Shield, Building2 } from "lucide-react";
import { ActivityDashboard } from "@/components/ui/activity-dashboard";

interface UserInfo {
  id: string;
  email: string;
  fname?: string;
  lname?: string;
  role_name?: string;
  role_slug?: string;
  agency_name?: string;
}

export default function AdminDashboardPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserInfo();
  }, []);

  async function fetchUserInfo() {
    try {
      const supabase = createClient();

      // Get current auth user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) return;

      // Get user details with role
      const { data } = await supabase
        .from("auth_users")
        .select(`
          id,
          email,
          user_profiles (fname, lname, agency_id),
          user_role_assignments (
            user_roles (role_name, role_slug)
          ),
          agencies (agency_name)
        `)
        .eq("supabase_user_id", authUser.id)
        .single();

      if (data) {
        setUser({
          id: data.id,
          email: data.email,
          fname: data.user_profiles?.[0]?.fname,
          lname: data.user_profiles?.[0]?.lname,
          role_name: data.user_role_assignments?.[0]?.user_roles?.role_name,
          role_slug: data.user_role_assignments?.[0]?.user_roles?.role_slug,
          agency_name: data.agencies?.[0]?.agency_name,
        });
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="p-8">
      {/* User Welcome Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back{user?.fname ? `, ${user.fname}` : ""}!
            </h1>
            <p className="text-gray-600">
              Manage your travel agency operations from one place
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* User Info Cards */}
        {!loading && user && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
              <div className="p-3 bg-sky-100 rounded-lg">
                <User className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-medium text-gray-900">{user.email}</p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Your Role</p>
                <p className="font-medium text-gray-900">
                  {user.role_name || "No role assigned"}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Building2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Agency</p>
                <p className="font-medium text-gray-900">
                  {user.agency_name || "No agency"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Activity Dashboard */}
      <ActivityDashboard />
    </div>
  );
}
