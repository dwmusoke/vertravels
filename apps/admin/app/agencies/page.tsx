"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Mail,
  RefreshCw,
  Square,
  CheckSquare,
  Globe,
  MapPin,
  Percent,
} from "lucide-react";
import { exportToExcel, getTemplateColumns } from "@/lib/excel-utils";

interface Agency {
  id: string;
  agency_code: string;
  agency_name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  status: "active" | "inactive";
  commission_rate?: number;
  parent_agency_id?: string;
  created_at: string;
  updated_at: string;
}

export default function AgenciesPage() {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingAgency, setEditingAgency] = useState<Agency | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const [formData, setFormData] = useState({
    agency_code: "",
    agency_name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postal_code: "",
    status: "active" as "active" | "inactive",
    commission_rate: "",
    parent_agency_id: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchAgencies();
  }, []);

  async function fetchAgencies() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("agencies")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgencies(data || []);
    } catch (error: any) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const commissionRate = parseFloat(formData.commission_rate) || 0;
      const parentId = formData.parent_agency_id || null;

      if (editingAgency) {
        const { error } = await supabase
          .from("agencies")
          .update({
            agency_code: formData.agency_code,
            agency_name: formData.agency_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postal_code,
            status: formData.status,
            commission_rate: commissionRate,
            parent_agency_id: parentId,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAgency.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("agencies").insert([
          {
            agency_code: formData.agency_code,
            agency_name: formData.agency_name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            country: formData.country,
            postal_code: formData.postal_code,
            status: formData.status,
            commission_rate: commissionRate,
            parent_agency_id: parentId,
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingAgency(null);
      resetForm();
      fetchAgencies();
    } catch (error: any) {
      console.error("Error saving agency:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this agency?")) return;

    try {
      const { error } = await supabase.from("agencies").delete().eq("id", id);
      if (error) throw error;
      fetchAgencies();
    } catch (error: any) {
      console.error("Error deleting agency:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} agencies? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("agencies")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchAgencies();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selected = agencies.filter((a) => selectedIds.has(a.id));
    const columns = getTemplateColumns("agencies");
    await exportToExcel(selected, "agencies-export", {
      columns,
      branded: true,
    });
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("agencies")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchAgencies();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  function resetForm() {
    setFormData({
      agency_code: "",
      agency_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postal_code: "",
      status: "active",
      commission_rate: "",
      parent_agency_id: "",
    });
  }

  function handleEdit(agency: Agency) {
    setEditingAgency(agency);
    setFormData({
      agency_code: agency.agency_code || "",
      agency_name: agency.agency_name,
      email: agency.email || "",
      phone: agency.phone || "",
      address: agency.address || "",
      city: agency.city || "",
      country: agency.country || "",
      postal_code: agency.postal_code || "",
      status: agency.status,
      commission_rate: agency.commission_rate?.toString() || "",
      parent_agency_id: agency.parent_agency_id || "",
    });
    setExpandedRowId(agency.id);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === agencies.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(agencies.map((a) => a.id)));
    }
  }

  function getAgencyName(id: string | undefined): string {
    if (!id) return "";
    const agency = agencies.find((a) => a.id === id);
    return agency ? agency.agency_name : "";
  }

  const stats = {
    total: agencies.length,
    active: agencies.filter((a) => a.status === "active").length,
    inactive: agencies.filter((a) => a.status === "inactive").length,
    branches: agencies.filter((a) => a.parent_agency_id).length,
    avgCommission:
      agencies.length > 0
        ? agencies.reduce((sum, a) => sum + (a.commission_rate || 0), 0) /
          agencies.length
        : 0,
  };

  const filtered = agencies.filter((agency) => {
    const matchesSearch =
      agency.agency_name.toLowerCase().includes(search.toLowerCase()) ||
      agency.agency_code?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || agency.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusStyles: Record<string, string> = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Agencies</h1>
          <p className="text-gray-600">
            Manage travel agencies, branches, and commission structures
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={async () => {
              const columns = getTemplateColumns("agencies");
              await exportToExcel(filtered, "agencies", {
                columns,
                branded: true,
              });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingAgency(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Agency
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Agencies</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Branches</p>
          <p className="text-2xl font-bold text-sky-600">{stats.branches}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Avg Commission</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.avgCommission.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      {(selectedIds.size > 0) && (
        <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {selectedIds.size} selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkExport}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50 flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-sm hover:bg-red-50 flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                Delete
              </button>
              <button
                onClick={() => setSelectedIds(new Set())}
                className="px-3 py-1.5 border rounded-lg text-sm hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by agency name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button
            onClick={fetchAgencies}
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
          <p className="text-gray-600">Loading agencies...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === agencies.length && agencies.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Agency Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Agency Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  City
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Country
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Parent Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((agency) => {
                const parentName = getAgencyName(agency.parent_agency_id);
                return (
                  <>
                    <tr key={agency.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleSelect(agency.id)}
                          className="p-1 hover:bg-gray-200 rounded"
                        >
                          {selectedIds.has(agency.id) ? (
                            <CheckSquare className="w-4 h-4 text-sky-600" />
                          ) : (
                            <Square className="w-4 h-4 text-gray-400" />
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-500">
                          {agency.agency_code || "—"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-sky-600" />
                          <span className="font-medium">{agency.agency_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {agency.city || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {agency.country || "—"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {parentName ? (
                          <span className="text-gray-500">
                            <span className="text-gray-300 mr-1">→</span>
                            {parentName}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusStyles[agency.status] || "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {agency.status.charAt(0).toUpperCase() + agency.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {agency.commission_rate !== null && agency.commission_rate !== undefined ? (
                          <span className="font-medium text-green-600 flex items-center gap-1">
                            <Percent className="w-3 h-3" />
                            {agency.commission_rate}%
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(agency)}
                            className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusChange(
                              agency.id,
                              agency.status === "active" ? "inactive" : "active"
                            )}
                            className="p-1.5 text-orange-600 hover:bg-orange-50 rounded"
                            title="Toggle Status"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(agency.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedRowId === agency.id && (
                      <tr>
                        <td colSpan={9} className="p-0">
                          <div className="bg-sky-50 border-t">
                            <form onSubmit={handleSubmit} className="p-6">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="col-span-2">
                                  <h3 className="font-semibold mb-3">
                                    {editingAgency ? "Edit Agency" : "New Agency"}
                                  </h3>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Agency Code *
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.agency_code}
                                    onChange={(e) =>
                                      setFormData({ ...formData, agency_code: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="e.g., AG-001"
                                    required
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Agency Name *
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.agency_name}
                                    onChange={(e) =>
                                      setFormData({ ...formData, agency_name: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Full agency name"
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
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="agency@example.com"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                  </label>
                                  <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                      setFormData({ ...formData, phone: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="+1 234 567 890"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    City
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) =>
                                      setFormData({ ...formData, city: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="City"
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
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Country"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Postal Code
                                  </label>
                                  <input
                                    type="text"
                                    value={formData.postal_code}
                                    onChange={(e) =>
                                      setFormData({ ...formData, postal_code: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="Postal code"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Parent Agency
                                  </label>
                                  <select
                                    value={formData.parent_agency_id}
                                    onChange={(e) =>
                                      setFormData({ ...formData, parent_agency_id: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                  >
                                    <option value="">None (Head Office)</option>
                                    {agencies
                                      .filter((a) => a.id !== editingAgency?.id)
                                      .map((a) => (
                                        <option key={a.id} value={a.id}>
                                          {a.agency_name}
                                        </option>
                                      ))}
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
                                        status: e.target.value as "active" | "inactive",
                                      })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                  >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Commission Rate (%)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={formData.commission_rate}
                                    onChange={(e) =>
                                      setFormData({ ...formData, commission_rate: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    placeholder="10"
                                  />
                                </div>

                                <div className="col-span-2">
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                  </label>
                                  <textarea
                                    value={formData.address}
                                    onChange={(e) =>
                                      setFormData({ ...formData, address: e.target.value })
                                    }
                                    className="w-full px-3 py-2 border rounded-lg"
                                    rows={3}
                                    placeholder="Full address..."
                                  />
                                </div>
                              </div>

                              <div className="flex gap-3 pt-4 border-t">
                                <button
                                  type="submit"
                                  className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                                >
                                  <Building2 className="w-4 h-4" />
                                  {editingAgency ? "Update" : "Create"} Agency
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedRowId(null);
                                    setEditingAgency(null);
                                  }}
                                  className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {expandedRowId === "new" && (
        <div className="bg-sky-50 border rounded-lg mt-4">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <h3 className="font-semibold mb-3">New Agency</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Code *
                </label>
                <input
                  type="text"
                  value={formData.agency_code}
                  onChange={(e) =>
                    setFormData({ ...formData, agency_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., AG-001"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Agency Name *
                </label>
                <input
                  type="text"
                  value={formData.agency_name}
                  onChange={(e) =>
                    setFormData({ ...formData, agency_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Full agency name"
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
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="agency@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="City"
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
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Country"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) =>
                    setFormData({ ...formData, postal_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Postal code"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Agency
                </label>
                <select
                  value={formData.parent_agency_id}
                  onChange={(e) =>
                    setFormData({ ...formData, parent_agency_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">None (Head Office)</option>
                  {agencies.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.agency_name}
                    </option>
                  ))}
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
                      status: e.target.value as "active" | "inactive",
                    })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.commission_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_rate: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="10"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Full address..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Create Agency
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingAgency(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
