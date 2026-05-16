"use client";

import React, { useState, useEffect } from "react";
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
        .select("*");
      const { data: userRoles } = await supabase
        .from("user_roles")
        .select("*");

      const { data: agenciesData } = await supabase.from("agencies").select("id, agency_name");

      const usersWithDetails = authData?.map((user: any) => {
        const profile = profiles?.find((p: any) => p.user_id === user.id);
        const roleAssignment = roleAssignments?.find((r: any) => r.user_id === user.id);
        const userRole = userRoles?.find((r: any) => r.id === roleAssignment?.role_id);
        const agency = agenciesData?.find((a: any) => a.id === profile?.agency_id);

        return {
          id: user.id,
          email: user.email,
          fname: profile?.fname,
          lname: profile?.lname,
          phone: profile?.phone || user.phone,
          status: user.status,
          role_name: userRole?.role_name,
          role_slug: userRole?.role_slug,
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
    try {
      if (editingUser) {
        const { error } = await supabase
          .from("auth_users")
          .update({
            fname: formData.fname,
            lname: formData.lname,
            phone: formData.phone,
            status: formData.status,
            department: formData.department,
            employee_id: formData.employee_id,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingUser.id);

        if (error) throw error;

        if (formData.agency_id) {
          await supabase.from("user_agency_assignments").upsert({
            user_id: editingUser.id,
            agency_id: formData.agency_id,
            role_in_agency: formData.role_id || "agent",
          });
        }
      } else {
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password || "TempPass123!",
          options: { data: { fname: formData.fname, lname: formData.lname } },
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error("Failed to create user");

        if (formData.role_id) {
          await supabase.from("user_role_assignments").insert({
            user_id: authData.user.id,
            role_id: parseInt(formData.role_id),
          });
        }
        if (formData.agency_id) {
          await supabase.from("user_agency_assignments").insert({
            user_id: authData.user.id,
            agency_id: formData.agency_id,
            role_in_agency: formData.role_id || "agent",
          });
        }
        await supabase.from("user_profiles").insert({
          user_id: authData.user.id,
          fname: formData.fname,
          lname: formData.lname,
          phone: formData.phone,
          agency_id: formData.agency_id || null,
          department: formData.department,
          employee_id: formData.employee_id,
        });
      }
      setExpandedUserId(null);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      alert("Failed to save user: " + error.message);
    }
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

  function handleEdit(user: User) {
    setEditingUser(user);
    setFormData({
      email: user.email,
      password: "",
      fname: user.fname || "",
      lname: user.lname || "",
      phone: user.phone || "",
      role_id: roles.find(r => r.role_slug === user.role_slug)?.id?.toString() || "",
      agency_id: agencies.find(a => a.agency_name === user.agency_name)?.id || "",
      department: user.department || "",
      employee_id: user.employee_id || "",
      status: user.status,
    });
    setExpandedUserId(user.id);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await supabase.from("auth_users").delete().eq("id", id);
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleToggleStatus(user: User) {
    const newStatus = user.status === "active" ? "suspended" : "active";
    await supabase.from("auth_users").update({ status: newStatus }).eq("id", user.id);
    fetchUsers();
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
                <React.Fragment key={user.id}>
                <tr className="hover:bg-gray-50">
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
                      <button onClick={() => handleEdit(user)} className="p-1.5 text-sky-600 hover:bg-sky-50 rounded" title="Edit"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleToggleStatus(user)} className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded" title={user.status === "active" ? "Suspend" : "Activate"}>
                        {user.status === "active" ? <Clock className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <button onClick={() => handleDelete(user.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
                {expandedUserId === user.id && (
                  <tr><td colSpan={6} className="p-0">
                    <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm m-4">
                      <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                          <div className="col-span-full border-b pb-3 mb-4">
                            <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                              <Edit2 className="w-4 h-4 text-sky-600" /> {editingUser ? "Edit User" : "New User"}
                            </h4>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">First Name</label>
                            <input type="text" value={formData.fname} onChange={e => setFormData({...formData, fname: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="John" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Last Name</label>
                            <input type="text" value={formData.lname} onChange={e => setFormData({...formData, lname: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Doe" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Email *</label>
                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="user@example.com" required />
                          </div>
                          {!editingUser && (
                            <div>
                              <label className="block text-sm font-medium mb-1">Password</label>
                              <input type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Leave blank for temp" />
                            </div>
                          )}
                          <div>
                            <label className="block text-sm font-medium mb-1">Phone</label>
                            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="+256 700 123456" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none">
                              <option value="">Select role</option>
                              {roles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Agency</label>
                            <select value={formData.agency_id} onChange={e => setFormData({...formData, agency_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none">
                              <option value="">No agency</option>
                              {agencies.map(a => <option key={a.id} value={a.id}>{a.agency_name}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Department</label>
                            <input type="text" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="Sales" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Employee ID</label>
                            <input type="text" value={formData.employee_id} onChange={e => setFormData({...formData, employee_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="EMP001" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-1">Status</label>
                            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none">
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="banned">Banned</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
                          <button type="submit" className="flex-1 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 font-medium flex items-center justify-center gap-2 shadow-sm">
                            <Plus className="w-4 h-4" /> {editingUser ? "Update User" : "Create User"}
                          </button>
                          <button type="button" onClick={() => { setExpandedUserId(null); setEditingUser(null); resetForm(); }} className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">Cancel</button>
                        </div>
                      </form>
                    </div>
                  </td></tr>
                )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {expandedUserId === null && (
        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm mt-6 no-print">
          <form onSubmit={(e) => { setEditingUser(null); handleSubmit(e); }} className="p-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-full border-b pb-3 mb-4">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-sky-600" /> Quick Add User
                </h4>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="user@example.com" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <input type="text" value={formData.fname} onChange={e => setFormData({...formData, fname: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" placeholder="John" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select value={formData.role_id} onChange={e => setFormData({...formData, role_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none">
                  <option value="">Select</option>
                  {roles.map(r => <option key={r.id} value={r.id}>{r.role_name}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" className="mt-4 px-4 py-2.5 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-lg hover:from-sky-700 hover:to-blue-700 font-medium shadow-sm">Create User</button>
          </form>
        </div>
      )}
    </div>
  );
}
