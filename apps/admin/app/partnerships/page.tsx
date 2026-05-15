"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Mail,
  RefreshCw,
  Square,
  CheckSquare,
  Upload,
  Globe,
  Star,
  TrendingUp,
  User,
  DollarSign,
  FileText,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";

interface Partner {
  id: string;
  company_name: string;
  type: string;
  contact_name?: string;
  email: string;
  phone?: string;
  website?: string;
  status: string;
  commission_rate?: number;
  commission_type: string;
  tier: string;
  referral_code: string;
  total_bookings?: number;
  total_revenue?: number;
  total_commission?: number;
  pending_commission?: number;
  paid_commission?: number;
  joined_date?: string;
  created_at: string;
}

export default function PartnershipsPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    type: "affiliate",
    contact_name: "",
    email: "",
    phone: "",
    website: "",
    commission_rate: "5",
    commission_type: "percentage",
    tier: "bronze",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("partners")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error: any) {
      console.error("Error fetching partners:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const commissionRate = parseFloat(formData.commission_rate) || 5;
      const referralCode = `PRT-${Date.now().toString(36).toUpperCase()}`;

      if (editingPartner) {
        const { error } = await supabase
          .from("partners")
          .update({
            company_name: formData.company_name,
            type: formData.type,
            contact_name: formData.contact_name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            commission_rate: commissionRate,
            commission_type: formData.commission_type,
            tier: formData.tier,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingPartner.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("partners").insert([
          {
            company_name: formData.company_name,
            type: formData.type,
            contact_name: formData.contact_name,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            commission_rate: commissionRate,
            commission_type: formData.commission_type,
            tier: formData.tier,
            referral_code: referralCode,
            status: "pending",
            joined_date: new Date().toISOString().split("T")[0],
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingPartner(null);
      resetForm();
      fetchPartners();
    } catch (error: any) {
      console.error("Error saving partner:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this partner?")) return;

    try {
      const { error } = await supabase.from("partners").delete().eq("id", id);
      if (error) throw error;
      fetchPartners();
    } catch (error: any) {
      console.error("Error deleting partner:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} partners? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("partners")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchPartners();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selected = partners.filter((p) => selectedIds.has(p.id));
    const columns = getTemplateColumns("partners");

    await exportToExcel(selected, "partners-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selected = partners.filter((p) => selectedIds.has(p.id));
    if (!confirm(`Send emails to ${selected.length} partners?`)) return;
    alert(`Would send emails to ${selected.length} partners`);
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("partners")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchPartners();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("partners").insert(data);
      if (error) throw error;
      fetchPartners();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      company_name: "",
      type: "affiliate",
      contact_name: "",
      email: "",
      phone: "",
      website: "",
      commission_rate: "5",
      commission_type: "percentage",
      tier: "bronze",
    });
  }

  function handleEdit(partner: Partner) {
    setEditingPartner(partner);
    setFormData({
      company_name: partner.company_name,
      type: partner.type,
      contact_name: partner.contact_name || "",
      email: partner.email,
      phone: partner.phone || "",
      website: partner.website || "",
      commission_rate: partner.commission_rate?.toString() || "5",
      commission_type: partner.commission_type,
      tier: partner.tier,
    });
    setExpandedRowId(partner.id);
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
    if (selectedIds.size === partners.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(partners.map((p) => p.id)));
    }
  }

  const stats = {
    total: partners.length,
    active: partners.filter((p) => p.status === "active").length,
    pending: partners.filter((p) => p.status === "pending").length,
    totalRevenue: partners.reduce((sum, p) => sum + (p.total_revenue || 0), 0),
    totalCommission: partners.reduce((sum, p) => sum + (p.total_commission || 0), 0),
    pendingCommission: partners.reduce((sum, p) => sum + (p.pending_commission || 0), 0),
  };

  const filtered = partners.filter((partner) => {
    const matchesSearch =
      partner.company_name.toLowerCase().includes(search.toLowerCase()) ||
      partner.email.toLowerCase().includes(search.toLowerCase()) ||
      partner.referral_code.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || partner.status === filter;
    return matchesSearch && matchesFilter;
  });

  const typeLabels: Record<string, string> = {
    affiliate: "Affiliate",
    sub_agent: "Sub Agent",
    b2b: "B2B",
    corporate: "Corporate",
    wholesaler: "Wholesaler",
  };

  const tierMap: Record<string, { label: string; color: string }> = {
    bronze: { label: "Bronze", color: "bg-amber-100 text-amber-700" },
    silver: { label: "Silver", color: "bg-gray-100 text-gray-700" },
    gold: { label: "Gold", color: "bg-yellow-100 text-yellow-700" },
    platinum: { label: "Platinum", color: "bg-purple-100 text-purple-700" },
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    active: { label: "Active", color: "bg-green-100 text-green-700" },
    suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Partnerships</h1>
          <p className="text-gray-600">
            Manage B2B partners, sub-agents, and affiliates
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button
            onClick={async () => {
              const columns = getTemplateColumns("partners");
              await exportToExcel(filtered, "partners", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingPartner(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Partner
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Partners</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending Commission</p>
          <p className="text-2xl font-bold text-purple-600">
            ${stats.pendingCommission.toLocaleString()}
          </p>
        </div>
      </div>

      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === partners.length && partners.length > 0}
        entityType="partners"
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onEmail={handleBulkEmail}
        disabledActions={["edit"]}
      />

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by company, email, or referral code..."
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
            <option value="pending">Pending</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={fetchPartners}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading partners...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === partners.length && partners.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((partner) => (
                <>
                  <tr key={partner.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button onClick={() => toggleSelect(partner.id)} className="p-1 hover:bg-gray-200 rounded">
                        {selectedIds.has(partner.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{partner.company_name}</p>
                        <p className="text-xs text-gray-500">Ref: {partner.referral_code}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                        {typeLabels[partner.type] || partner.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm">{partner.contact_name || "—"}</p>
                        <p className="text-xs text-gray-500">{partner.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${tierMap[partner.tier]?.color || "bg-gray-100 text-gray-700"}`}>
                        {tierMap[partner.tier]?.label || partner.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{partner.commission_rate}%</td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={partner.status}
                        type="select"
                        options={[
                          { label: "Pending", value: "pending" },
                          { label: "Active", value: "active" },
                          { label: "Suspended", value: "suspended" },
                        ]}
                        onSave={(value) => handleStatusChange(partner.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(partner)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(partner.email);
                            alert("Email copied to clipboard");
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Copy Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(partner.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === partner.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-4">

                              <div className="col-span-full border-b border-sky-200 pb-2 mb-2">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <Users className="w-4 h-4 text-sky-600" /> {editingPartner ? "Edit" : "New"} Partner
                                </h3>
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-sky-500" /> Company Information
                                </h4>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Company Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.company_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, company_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Company name"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Type *
                                </label>
                                <select
                                  value={formData.type}
                                  onChange={(e) =>
                                    setFormData({ ...formData, type: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                >
                                  <option value="affiliate">Affiliate</option>
                                  <option value="sub_agent">Sub Agent</option>
                                  <option value="b2b">B2B</option>
                                  <option value="corporate">Corporate</option>
                                  <option value="wholesaler">Wholesaler</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Contact Person
                                </label>
                                <input
                                  type="text"
                                  value={formData.contact_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, contact_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Contact name"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Email *
                                </label>
                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="partner@example.com"
                                  required
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="+1 234 567 890"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Website
                                </label>
                                <input
                                  type="url"
                                  value={formData.website}
                                  onChange={(e) =>
                                    setFormData({ ...formData, website: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="https://example.com"
                                />
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Commission & Tier
                                </h4>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Commission Rate (%)
                                </label>
                                <input
                                  type="number"
                                  step="0.1"
                                  value={formData.commission_rate}
                                  onChange={(e) =>
                                    setFormData({ ...formData, commission_rate: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="5"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Commission Type
                                </label>
                                <select
                                  value={formData.commission_type}
                                  onChange={(e) =>
                                    setFormData({ ...formData, commission_type: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                >
                                  <option value="percentage">Percentage</option>
                                  <option value="fixed">Fixed</option>
                                  <option value="tiered">Tiered</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Tier
                                </label>
                                <select
                                  value={formData.tier}
                                  onChange={(e) =>
                                    setFormData({ ...formData, tier: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                >
                                  <option value="bronze">Bronze</option>
                                  <option value="silver">Silver</option>
                                  <option value="gold">Gold</option>
                                  <option value="platinum">Platinum</option>
                                </select>
                              </div>
                            </div>

                            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                              >
                                <Users className="w-4 h-4" />
                                {editingPartner ? "Update" : "Create"} Partner
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingPartner(null);
                                }}
                                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expandedRowId === "new" && (
        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm mt-4">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-4">

              <div className="col-span-full border-b border-sky-200 pb-2 mb-2">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" /> New Partner
                </h3>
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-sky-500" /> Company Information
                </h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  value={formData.company_name}
                  onChange={(e) =>
                    setFormData({ ...formData, company_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                >
                  <option value="affiliate">Affiliate</option>
                  <option value="sub_agent">Sub Agent</option>
                  <option value="b2b">B2B</option>
                  <option value="corporate">Corporate</option>
                  <option value="wholesaler">Wholesaler</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Contact name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="partner@example.com"
                  required
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="+1 234 567 890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="https://example.com"
                />
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Commission & Tier
                </h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.commission_rate}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_rate: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Commission Type
                </label>
                <select
                  value={formData.commission_type}
                  onChange={(e) =>
                    setFormData({ ...formData, commission_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                  <option value="tiered">Tiered</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tier
                </label>
                <select
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                >
                  <option value="bronze">Bronze</option>
                  <option value="silver">Silver</option>
                  <option value="gold">Gold</option>
                  <option value="platinum">Platinum</option>
                </select>
              </div>
            </div>

            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Users className="w-4 h-4" />
                Create Partner
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingPartner(null);
                }}
                className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showImporter && (
        <ExcelImporter
          entityType="partners"
          onImport={handleImport}
          validationRules={getValidationRules("partners")}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
