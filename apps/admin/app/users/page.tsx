"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Shield,
  Building2,
  Mail,
  Phone,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface User {
  id: string;
  email: string;
  fname?: string;
  lname?: string;
  phone?: string;
  status: "active" | "suspended" | "banned";
  role_name?: string;
  role_slug?: string;
  agency_name?: string;
  department?: string;
  employee_id?: string;
  email_verified: boolean;
  created_at: string;
  last_login?: string;
}

interface Role {
  id: number;
  role_name: string;
  role_slug: string;
}

interface Agency {
  id: string;
  agency_name: string;
  agency_code: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRole, setFilterRole] = useState("all");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fname: "",
    lname: "",
    phone: "",
    role_id: "",
    agency_id: "",
    department: "",
    employee_id: "",
    status: "active",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
    fetchAgencies();
  }, []);

  async function fetchUsers() {
    try {
      setLoading(true);
      const { data: authData, error: authError } = await supabase
        .from("auth_users")
        .select("*")
        .order("created_at", { ascending: false });

      if (authError) throw authError;

      const { data: profiles } = await supabase
        .from("user_profiles")
        .select("user_id, fname, lname, phone, agency_id, department, employee_id");

      const { data: roleAssignments } = await supabase
        .from("user_role_assignments")
        .select("user_id, role_id")
        .join("user_roles", "role_id=id");

      const { data: agenciesData } = await supabase.from("agencies").select("id, agency_name");

      const usersWithDetails = authData?.map((user: any) => {
        const profile = profiles?.find((p: any) => p.user_id === user.id);
        const role = roleAssignments?.find((r: any) => r.user_id === user.id);
        const agency = agenciesData?.find((a: any) => a.id === profile?.agency_id);

        return {
          id: user.id,
          email: user.email,
          fname: profile?.fname,
          lname: profile?.lname,
          phone: profile?.phone || user.phone,
          status: user.status,
          role_name: role?.user_roles?.role_name,
          role_slug: role?.user_roles?.role_slug,
          agency_name: agency?.agency_name,
          department: profile?.department,
          employee_id: profile?.employee_id,
          email_verified: user.email_verified,
          created_at: user.created_at,
          last_login: user.last_login,
        };
      }) || [];

      setUsers(usersWithDetails);
    } catch (error: any) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchRoles() {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("*")
        .order("role_name");

      if (!error && data) setRoles(data);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  }

  async function fetchAgencies() {
    try {
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .eq("status", "active")
        .order("agency_name");

      if (!error && data) setAgencies(data);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Implementation would go here
    console.log("Form submitted", formData);
  }

  function resetForm() {
    setFormData({
      email: "",
      password: "",
      fname: "",
      lname: "",
      phone: "",
      role_id: "",
      agency_id: "",
      department: "",
      employee_id: "",
      status: "active",
    });
  }

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    verified: users.filter((u) => u.email_verified).length,
  };

  const roleColors: Record<string, string> = {
    super_admin: "bg-purple-100 text-purple-700",
    agency_admin: "bg-red-100 text-red-700",
    manager: "bg-blue-100 text-blue-700",
    agent: "bg-sky-100 text-sky-700",
    accountant: "bg-green-100 text-green-700",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingUser(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
        >
          <Plus className="w-4 h-4" />
          New User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Users</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Suspended</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.suspended}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Email Verified</p>
          <p className="text-2xl font-bold text-blue-600">{stats.verified}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Roles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.role_slug}>
                {role.role_name}
              </option>
            ))}
          </select>
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email Verified</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium">{user.fname && user.lname ? `${user.fname} ${user.lname}` : "—"}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.phone && <p className="text-xs text-gray-500">{user.phone}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role_name ? (
                      <span className={`px-2 py-1 text-xs rounded-full ${roleColors[user.role_slug!] || "bg-gray-100 text-gray-700"}`}>
                        {user.role_name}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">No role</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{user.agency_name || "—"}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.status === "active" ? "bg-green-100 text-green-700" :
                      user.status === "suspended" ? "bg-yellow-100 text-yellow-700" :
                      "bg-red-100 text-red-700"
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`p-1.5 rounded ${user.email_verified ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}>
                      {user.email_verified ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-1.5 text-sky-600 hover:bg-sky-50 rounded" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded">
                        {user.status === "active" ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button className="p-1.5 text-red-600 hover:bg-red-50 rounded">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
