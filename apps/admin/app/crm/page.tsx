"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  RefreshCw,
  Mail,
  Phone,
  MapPin,
  Building2,
  Briefcase,
  Tag,
  Star,
  Globe,
  User,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface Client {
  id: string;
  client_code: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  job_title: string;
  location: string;
  country: string;
  source: string;
  status: string;
  tags: string[];
  notes: string;
  total_bookings: number;
  total_spent: number;
  last_booking_date: string;
  created_at: string;
}

export default function CRMPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    job_title: "",
    location: "",
    country: "",
    source: "direct",
    status: "active",
    tags: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error: any) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      job_title: "",
      location: "",
      country: "",
      source: "direct",
      status: "active",
      tags: "",
      notes: "",
    });
  }

  function editClient(client: Client) {
    setEditingClient(client);
    setFormData({
      first_name: client.first_name,
      last_name: client.last_name,
      email: client.email || "",
      phone: client.phone || "",
      company: client.company || "",
      job_title: client.job_title || "",
      location: client.location || "",
      country: client.country || "",
      source: client.source || "direct",
      status: client.status || "active",
      tags: (client.tags || []).join(", "),
      notes: client.notes || "",
    });
    setExpandedRowId(client.id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (editingClient) {
        const { error } = await supabase
          .from("clients")
          .update({
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email || null,
            phone: formData.phone || null,
            company: formData.company || null,
            job_title: formData.job_title || null,
            location: formData.location || null,
            country: formData.country || null,
            source: formData.source,
            status: formData.status,
            tags,
            notes: formData.notes || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingClient.id);

        if (error) throw error;
      } else {
        const code = `CL-${Date.now().toString(36).toUpperCase()}`;
        const { error } = await supabase.from("clients").insert([
          {
            client_code: code,
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email || null,
            phone: formData.phone || null,
            company: formData.company || null,
            job_title: formData.job_title || null,
            location: formData.location || null,
            country: formData.country || null,
            source: formData.source,
            status: formData.status,
            tags,
            notes: formData.notes || null,
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingClient(null);
      resetForm();
      fetchClients();
    } catch (error: any) {
      console.error("Error saving client:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    try {
      const { error } = await supabase.from("clients").delete().eq("id", id);
      if (error) throw error;
      setClients(clients.filter((c) => c.id !== id));
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    }
  }

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    if (filter === "all" && !q) return true;
    const matchesSearch =
      !q ||
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.company?.toLowerCase().includes(q) ||
      c.phone?.includes(q);
    const matchesFilter =
      filter === "all" || c.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusColor: Record<string, string> = {
    active: "badge-success",
    inactive: "badge-danger",
    vip: "badge-warning",
    lead: "badge-info",
  };

  return (
    <div className="p-8">
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Client CRM
          </h1>
          <p className="text-gray-600">
            Manage your clients and contacts
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingClient(null);
            setExpandedRowId("new");
          }}
          className="btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Client
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
            <option value="lead">Lead</option>
          </select>
          <div className="flex gap-2">
            <button onClick={fetchClients} className="btn-secondary flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* New Client Inline Form (bottom) */}
      {expandedRowId === "new" && (
        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm mb-6">
          <div className="p-5 border-b border-sky-100 flex items-center gap-2">
            <User className="w-5 h-5 text-sky-600" />
            <h3 className="font-semibold text-gray-900">New Client</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Title
                </label>
                <input
                  type="text"
                  value={formData.job_title}
                  onChange={(e) =>
                    setFormData({ ...formData, job_title: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) =>
                    setFormData({ ...formData, country: e.target.value })
                  }
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="direct">Direct</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social Media</option>
                  <option value="email">Email Campaign</option>
                  <option value="partner">Partner</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="input-field"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="vip">VIP</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  className="input-field"
                  placeholder="business, vip, frequent"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="input-field"
                rows={2}
              />
            </div>
            <div className="flex gap-3 pt-4 border-t">
              <button type="submit" className="btn-primary">
                {editingClient ? "Update" : "Create"} Client
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingClient(null);
                  resetForm();
                }}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase w-8">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedIds(new Set(filtered.map((c) => c.id)));
                    } else {
                      setSelectedIds(new Set());
                    }
                  }}
                  checked={
                    selectedIds.size === filtered.length &&
                    filtered.length > 0
                  }
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Client
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Contact
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Company
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Tags
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(client.id)}
                    onChange={(e) => {
                      const next = new Set(selectedIds);
                      e.target.checked
                        ? next.add(client.id)
                        : next.delete(client.id);
                      setSelectedIds(next);
                    }}
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center text-white text-sm font-medium">
                      {client.first_name?.[0]}{client.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm">
                        {client.first_name} {client.last_name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {client.client_code}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-sm space-y-1">
                    {client.email && (
                      <p className="flex items-center gap-1 text-gray-600">
                        <Mail className="w-3 h-3" />
                        {client.email}
                      </p>
                    )}
                    {client.phone && (
                      <p className="flex items-center gap-1 text-gray-600">
                        <Phone className="w-3 h-3" />
                        {client.phone}
                      </p>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium">
                    {client.company || "—"}
                  </p>
                  {client.job_title && (
                    <p className="text-xs text-gray-500">
                      {client.job_title}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(client.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                    {(!client.tags || client.tags.length === 0) && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      statusColor[client.status] || "badge-neutral"
                    }
                  >
                    {client.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setExpandedRowId(
                          expandedRowId === client.id ? null : client.id
                        );
                        if (expandedRowId !== client.id) {
                          editClient(client);
                        } else {
                          setEditingClient(null);
                        }
                      }}
                      className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() =>
                        setExpandedRowId(
                          expandedRowId === client.id ? null : client.id
                        )
                      }
                      className="p-1.5 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      {expandedRowId === client.id ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {expandedRowId &&
              expandedRowId !== "new" &&
              filtered.map(
                (client) =>
                  client.id === expandedRowId && (
                    <tr key={`${client.id}-form`}>
                      <td colSpan={7} className="p-0 block">
                        <div className="bg-gradient-to-br from-sky-50 to-white border-t border-sky-100 p-5">
                          <div className="flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-sky-600" />
                            <h3 className="font-semibold text-gray-900">
                              Edit Client: {client.first_name} {client.last_name}
                            </h3>
                          </div>
                          <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  First Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.first_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      first_name: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Last Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.last_name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      last_name: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                  required
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      email: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Phone
                                </label>
                                <input
                                  type="text"
                                  value={formData.phone}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      phone: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Company
                                </label>
                                <input
                                  type="text"
                                  value={formData.company}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      company: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Job Title
                                </label>
                                <input
                                  type="text"
                                  value={formData.job_title}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      job_title: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Location
                                </label>
                                <input
                                  type="text"
                                  value={formData.location}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      location: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Country
                                </label>
                                <input
                                  type="text"
                                  value={formData.country}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      country: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Source
                                </label>
                                <select
                                  value={formData.source}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      source: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                >
                                  <option value="direct">Direct</option>
                                  <option value="website">Website</option>
                                  <option value="referral">Referral</option>
                                  <option value="social">Social Media</option>
                                  <option value="email">Email Campaign</option>
                                  <option value="partner">Partner</option>
                                </select>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={formData.status}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      status: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                >
                                  <option value="active">Active</option>
                                  <option value="inactive">Inactive</option>
                                  <option value="vip">VIP</option>
                                  <option value="lead">Lead</option>
                                </select>
                              </div>
                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tags (comma separated)
                                </label>
                                <input
                                  type="text"
                                  value={formData.tags}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      tags: e.target.value,
                                    })
                                  }
                                  className="input-field"
                                  placeholder="business, vip, frequent"
                                />
                              </div>
                            </div>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notes
                              </label>
                              <textarea
                                value={formData.notes}
                                onChange={(e) =>
                                  setFormData({
                                    ...formData,
                                    notes: e.target.value,
                                  })
                                }
                                className="input-field"
                                rows={2}
                              />
                            </div>
                            <div className="flex gap-3 pt-4 border-t">
                              <button type="submit" className="btn-primary">
                                Update Client
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingClient(null);
                                  resetForm();
                                }}
                                className="btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )
              )}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No clients found</p>
          </div>
        )}
      </div>
    </div>
  );
}
