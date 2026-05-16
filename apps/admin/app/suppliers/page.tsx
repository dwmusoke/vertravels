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
  Upload,
  Phone,
  MapPin,
  DollarSign,
  TrendingUp,
  User,
  FileText,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";

interface Supplier {
  id: string;
  supplier_code?: string;
  supplier_name: string;
  supplier_type: string;
  contact_person?: string;
  email: string;
  phone?: string;
  address?: string;
  payment_terms?: string;
  credit_limit?: number;
  currency: string;
  commission_rate?: number;
  status: "active" | "inactive" | "suspended";
  created_at: string;
  updated_at: string;
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);

  const [formData, setFormData] = useState({
    supplier_name: "",
    supplier_type: "airline",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
    payment_terms: "NET 30",
    credit_limit: "",
    commission_rate: "",
    currency: "USD",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchSuppliers();
  }, []);

  async function fetchSuppliers() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("suppliers")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuppliers(data || []);
    } catch (error: any) {
      console.error("Error fetching suppliers:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const creditLimit = parseFloat(formData.credit_limit) || 0;
      const commissionRate = parseFloat(formData.commission_rate) || 0;

      if (editingSupplier) {
        const { error } = await supabase
          .from("suppliers")
          .update({
            supplier_name: formData.supplier_name,
            supplier_type: formData.supplier_type,
            contact_person: formData.contact_person,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            payment_terms: formData.payment_terms,
            credit_limit: creditLimit,
            commission_rate: commissionRate,
            currency: formData.currency,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingSupplier.id);

        if (error) throw error;
      } else {
        const supplierCode = `SUP-${Date.now()}`;

        const { error } = await supabase.from("suppliers").insert([
          {
            supplier_code: supplierCode,
            supplier_name: formData.supplier_name,
            supplier_type: formData.supplier_type,
            contact_person: formData.contact_person,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            payment_terms: formData.payment_terms,
            credit_limit: creditLimit,
            commission_rate: commissionRate,
            currency: formData.currency,
            status: "active",
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingSupplier(null);
      resetForm();
      fetchSuppliers();
    } catch (error: any) {
      console.error("Error saving supplier:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this supplier?")) return;

    try {
      const { error } = await supabase.from("suppliers").delete().eq("id", id);
      if (error) throw error;
      fetchSuppliers();
    } catch (error: any) {
      console.error("Error deleting supplier:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} suppliers? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("suppliers")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchSuppliers();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selectedSuppliers = suppliers.filter((s) => selectedIds.has(s.id));
    const columns = getTemplateColumns("suppliers");

    await exportToExcel(selectedSuppliers, "suppliers-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selectedSuppliers = suppliers.filter((s) => selectedIds.has(s.id));
    if (!confirm(`Send email to ${selectedSuppliers.length} suppliers?`)) return;

    try {
      const emails = selectedSuppliers.map((s) => s.email).join(", ");
      navigator.clipboard.writeText(emails);
      alert(`Supplier emails copied to clipboard:\n\n${emails}`);
    } catch (error: any) {
      console.error("Error copying emails:", error);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("suppliers")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchSuppliers();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("suppliers").insert(data);
      if (error) throw error;
      fetchSuppliers();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      supplier_name: "",
      supplier_type: "airline",
      contact_person: "",
      email: "",
      phone: "",
      address: "",
      payment_terms: "NET 30",
      credit_limit: "",
      commission_rate: "",
      currency: "USD",
    });
  }

  function handleEdit(supplier: Supplier) {
    setEditingSupplier(supplier);
    setFormData({
      supplier_name: supplier.supplier_name,
      supplier_type: supplier.supplier_type,
      contact_person: supplier.contact_person || "",
      email: supplier.email,
      phone: supplier.phone || "",
      address: supplier.address || "",
      payment_terms: supplier.payment_terms || "NET 30",
      credit_limit: supplier.credit_limit?.toString() || "",
      commission_rate: supplier.commission_rate?.toString() || "",
      currency: supplier.currency || "USD",
    });
    setExpandedRowId(supplier.id);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === suppliers.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(suppliers.map((s) => s.id)));
    }
  }

  const stats = {
    total: suppliers.length,
    active: suppliers.filter((s) => s.status === "active").length,
    inactive: suppliers.filter((s) => s.status === "inactive").length,
    suspended: suppliers.filter((s) => s.status === "suspended").length,
    totalCredit: suppliers.reduce((sum, s) => sum + (s.credit_limit || 0), 0),
    avgCommission: suppliers.length > 0
      ? suppliers.reduce((sum, s) => sum + (s.commission_rate || 0), 0) / suppliers.length
      : 0,
  };

  const filtered = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
      supplier.supplier_code?.toLowerCase().includes(search.toLowerCase()) ||
      supplier.contact_person?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || supplier.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusMap = {
    active: { label: "Active", color: "bg-green-100 text-green-700" },
    inactive: { label: "Inactive", color: "bg-gray-100 text-gray-700" },
    suspended: { label: "Suspended", color: "bg-red-100 text-red-700" },
  };

  const supplierTypes = [
    { label: "Airline", value: "airline" },
    { label: "Hotel", value: "hotel" },
    { label: "Tour Operator", value: "tour_operator" },
    { label: "Car Rental", value: "car_rental" },
    { label: "Insurance", value: "insurance" },
    { label: "Visa Services", value: "visa_services" },
    { label: "Other", value: "other" },
  ];

  const paymentTermsOptions = [
    { label: "Immediate", value: "IMMEDIATE" },
    { label: "NET 7", value: "NET 7" },
    { label: "NET 15", value: "NET 15" },
    { label: "NET 30", value: "NET 30" },
    { label: "NET 60", value: "NET 60" },
    { label: "NET 90", value: "NET 90" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Suppliers
          </h1>
          <p className="text-gray-600">
            Manage supplier relationships, commissions, and payment terms
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </button>
          <button
            onClick={async () => {
              const columns = getTemplateColumns("suppliers");
              await exportToExcel(filtered, "suppliers", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingSupplier(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Supplier
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Suppliers</p>
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
          <p className="text-sm text-gray-600">Suspended</p>
          <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Credit Limit</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalCredit.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Avg Commission</p>
          <p className="text-2xl font-bold text-green-600">
            {stats.avgCommission.toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === suppliers.length && suppliers.length > 0}
        entityType="suppliers"
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onEmail={handleBulkEmail}
        disabledActions={["edit"]}
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by supplier name, code, or contact..."
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
            <option value="suspended">Suspended</option>
          </select>
          <button
            onClick={fetchSuppliers}
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
          <p className="text-gray-600">Loading suppliers...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === suppliers.length && suppliers.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Supplier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Terms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Commission
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Credit Limit
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
              {filtered.map((supplier) => (
                <>
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(supplier.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedIds.has(supplier.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{supplier.supplier_name}</p>
                        {supplier.supplier_code && (
                          <p className="text-xs text-gray-500 font-mono">
                            {supplier.supplier_code}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                        {supplier.supplier_type.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        {supplier.contact_person && (
                          <p className="font-medium">{supplier.contact_person}</p>
                        )}
                        <p className="text-gray-600">{supplier.email}</p>
                        {supplier.phone && (
                          <p className="text-gray-500 text-xs">{supplier.phone}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {supplier.payment_terms || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {supplier.commission_rate !== null && supplier.commission_rate !== undefined ? (
                        <span className="text-green-600 font-medium">
                          {supplier.commission_rate}%
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {supplier.credit_limit ? (
                        <span className="font-medium">
                          ${supplier.credit_limit.toLocaleString()}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={supplier.status}
                        type="select"
                        options={Object.entries(statusMap).map(([key, config]) => ({
                          label: config.label,
                          value: key,
                        }))}
                        onSave={(value) => handleStatusChange(supplier.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(supplier)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(supplier.email);
                            alert("Email copied to clipboard");
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Copy Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === supplier.id && (
                    <tr>
                      <td colSpan={9} className="p-0 block">
                        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-4">

                              <div className="col-span-full border-b border-sky-200 pb-2 mb-2">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <Building2 className="w-4 h-4 text-sky-600" /> {editingSupplier ? "Edit" : "New"} Supplier
                                </h3>
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-sky-500" /> Company Information
                                </h4>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Supplier Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.supplier_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, supplier_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Company name"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Supplier Type *
                                </label>
                                <select
                                  value={formData.supplier_type}
                                  onChange={(e) =>
                                    setFormData({ ...formData, supplier_type: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                >
                                  {supplierTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Contact Person
                                </label>
                                <input
                                  type="text"
                                  value={formData.contact_person}
                                  onChange={(e) =>
                                    setFormData({ ...formData, contact_person: e.target.value })
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
                                  placeholder="email@company.com"
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
                                  placeholder="+256 700 123456"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Currency
                                </label>
                                <select
                                  value={formData.currency}
                                  onChange={(e) =>
                                    setFormData({ ...formData, currency: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                >
                                  <option value="USD">USD</option>
                                  <option value="EUR">EUR</option>
                                  <option value="GBP">GBP</option>
                                  <option value="UGX">UGX</option>
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Payment Terms
                                </label>
                                <select
                                  value={formData.payment_terms}
                                  onChange={(e) =>
                                    setFormData({ ...formData, payment_terms: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                >
                                  {paymentTermsOptions.map((term) => (
                                    <option key={term.value} value={term.value}>
                                      {term.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Financial Details
                                </h4>
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="10"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Credit Limit
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={formData.credit_limit}
                                  onChange={(e) =>
                                    setFormData({ ...formData, credit_limit: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="10000"
                                />
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <MapPin className="w-3.5 h-3.5 text-sky-500" /> Address
                                </h4>
                              </div>

                              <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Address
                                </label>
                                <textarea
                                  value={formData.address}
                                  onChange={(e) =>
                                    setFormData({ ...formData, address: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  rows={3}
                                  placeholder="Full address..."
                                />
                              </div>
                            </div>

                            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                              >
                                <Building2 className="w-4 h-4" />
                                {editingSupplier ? "Update" : "Create"} Supplier
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingSupplier(null);
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
                  <Building2 className="w-4 h-4 text-sky-600" /> New Supplier
                </h3>
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-sky-500" /> Company Information
                </h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  value={formData.supplier_name}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Company name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Type *
                </label>
                <select
                  value={formData.supplier_type}
                  onChange={(e) =>
                    setFormData({ ...formData, supplier_type: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                >
                  {supplierTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Person
                </label>
                <input
                  type="text"
                  value={formData.contact_person}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_person: e.target.value })
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
                  placeholder="email@company.com"
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
                  placeholder="+256 700 123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) =>
                    setFormData({ ...formData, currency: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="UGX">UGX</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Terms
                </label>
                <select
                  value={formData.payment_terms}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_terms: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                >
                  {paymentTermsOptions.map((term) => (
                    <option key={term.value} value={term.value}>
                      {term.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Financial Details
                </h4>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Limit
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.credit_limit}
                  onChange={(e) =>
                    setFormData({ ...formData, credit_limit: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="10000"
                />
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-sky-500" /> Address
                </h4>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  rows={3}
                  placeholder="Full address..."
                />
              </div>
            </div>

            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <Building2 className="w-4 h-4" />
                Create Supplier
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingSupplier(null);
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
          entityType="suppliers"
          onImport={handleImport}
          validationRules={getValidationRules("suppliers")}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
