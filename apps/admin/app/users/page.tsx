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
  const [showCreateModal, setShowCreateModal] = useState(false);

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

      const usersWithDetails = authData?.map((user) => {
        const profile = profiles?.find((p) => p.user_id === user.id);
        const role = roleAssignments?.find((r) => r.user_id === user.id);
        const agency = agenciesData?.find((a) => a.id === profile?.agency_id);

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

    try {
      if (editingUser) {
        const { error } = await supabase
          .from("auth_users")
          .update({ status: formData.status, updated_at: new Date().toISOString() })
          .eq("id", editingUser.id);

        if (error) throw error;

        await supabase
          .from("user_profiles")
          .upsert({
            user_id: editingUser.id,
            fname: formData.fname,
            lname: formData.lname,
            phone: formData.phone,
            department: formData.department,
            employee_id: formData.employee_id,
            agency_id: formData.agency_id || null,
          })
          .eq("user_id", editingUser.id);

        if (formData.role_id) {
          await supabase
            .from("user_role_assignments")
            .upsert({ user_id: editingUser.id, role_id: parseInt(formData.role_id) });
        }
      }
      setShowCreateModal(false);
      setEditingUser(null);
      resetForm();
      fetchUsers();
    } catch (error: any) {
      console.error("Error saving user:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const { error } = await supabase.from("auth_users").delete().eq("id", id);
      if (error) throw error;
      fetchUsers();
    } catch (error: any) {
      console.error("Error deleting user:", error);
    }
  }

  async function handleToggleEmailVerified(id: string, current: boolean) {
    try {
      const { error } = await supabase
        .from("auth_users")
        .update({ email_verified: !current })
        .eq("id", id);
      if (error) throw error;
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating email verification:", error);
    }
  }

  async function handleSuspendUser(id: string, currentStatus: string) {
    try {
      const newStatus = currentStatus === "active" ? "suspended" : "active";
      const { error } = await supabase
        .from("auth_users")
        .update({ status: newStatus })
        .eq("id", id);
      if (error) throw error;
      fetchUsers();
    } catch (error: any) {
      console.error("Error updating user status:", error);
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
      role_id: user.role_slug ? (roles.find((r) => r.role_slug === user.role_slug)?.id.toString() || "") : "",
      agency_id: user.agency_name ? (agencies.find((a) => a.agency_name === user.agency_name)?.id || "") : "",
      department: user.department || "",
      employee_id: user.employee_id || "",
      status: user.status,
    });
    setExpandedUserId(user.id);
  }

  const filtered = users.filter((user) => {
    const matchesSearch =
      user.email.toLowerCase().includes(search.toLowerCase()) ||
      user.fname?.toLowerCase().includes(search.toLowerCase()) ||
      user.lname?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    const matchesRole = filterRole === "all" || user.role_slug === filterRole;
    return matchesSearch && matchesStatus && matchesRole;
  });

  const stats = {
    total: users.length,
    active: users.filter((u) => u.status === "active").length,
    suspended: users.filter((u) => u.status === "suspended").length,
    verified: users.filter((u) => u.email_verified).length,
  };

  const roleColors: Record<string, st
