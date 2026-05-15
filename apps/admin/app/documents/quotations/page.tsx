"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileCheck,
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
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  Eye,
  Printer,
  Plane,
  Share2,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";

interface Quotation {
  id: string;
  quote_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  destination?: string;
  travel_date?: string;
  duration_days?: number;
  passengers?: number;
  total: number;
  subtotal?: number;
  tax_amount?: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  valid_until: string;
  notes?: string;
  email_sent: boolean;
  converted_to_booking_id?: string;
  created_at: string;
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);
  const [viewingQuotation, setViewingQuotation] = useState<Quotation | null>(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    destination: "",
    travel_date: "",
    duration_days: "",
    passengers: "1",
    total: "",
    valid_until: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchQuotations();
  }, []);

  async function fetchQuotations() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("quotations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setQuotations(data || []);
    } catch (error: any) {
      console.error("Error fetching quotations:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const total = parseFloat(formData.total) || 0;
      const duration = parseInt(formData.duration_days) || 0;
      const passengers = parseInt(formData.passengers) || 1;

      if (editingQuotation) {
        const { error } = await supabase
          .from("quotations")
          .update({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            destination: formData.destination,
            travel_date: formData.travel_date,
            duration_days: duration,
            passengers,
            total,
            valid_until: formData.valid_until,
            notes: formData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingQuotation.id);

        if (error) throw error;
      } else {
        const quoteNumber = `QT-${Date.now()}`;

        const { error } = await supabase.from("quotations").insert([
          {
            quote_number: quoteNumber,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            destination: formData.destination,
            travel_date: formData.travel_date,
            duration_days: duration,
            passengers,
            total,
            valid_until: formData.valid_until,
            notes: formData.notes,
            status: "draft",
            email_sent: false,
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingQuotation(null);
      resetForm();
      fetchQuotations();
    } catch (error: any) {
      console.error("Error saving quotation:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this quotation?")) return;

    try {
      const { error } = await supabase.from("quotations").delete().eq("id", id);
      if (error) throw error;
      fetchQuotations();
    } catch (error: any) {
      console.error("Error deleting quotation:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} quotations? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("quotations")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchQuotations();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selectedQuotations = quotations.filter((q) => selectedIds.has(q.id));
    const columns = getTemplateColumns("quotations");

    await exportToExcel(selectedQuotations, "quotations-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selectedQuotations = quotations.filter((q) => selectedIds.has(q.id));
    if (!confirm(`Send ${selectedQuotations.length} quotations via email?`)) return;

    try {
      for (const quotation of selectedQuotations) {
        await supabase
          .from("quotations")
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq("id", quotation.id);
      }
      alert(`Sent ${selectedQuotations.length} quotations via email`);
      fetchQuotations();
    } catch (error: any) {
      console.error("Error sending emails:", error);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("quotations")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchQuotations();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleAccept(id: string) {
    try {
      const { error } = await supabase
        .from("quotations")
        .update({ status: "accepted" })
        .eq("id", id);

      if (error) throw error;
      alert("Quotation accepted! You can now convert it to a booking.");
      fetchQuotations();
    } catch (error: any) {
      console.error("Error accepting quotation:", error);
    }
  }

  async function handleReject(id: string) {
    try {
      const { error } = await supabase
        .from("quotations")
        .update({ status: "rejected" })
        .eq("id", id);

      if (error) throw error;
      fetchQuotations();
    } catch (error: any) {
      console.error("Error rejecting quotation:", error);
    }
  }

  async function handleConvertToBooking(quotation: Quotation) {
    if (!confirm("Convert this quotation to a booking?")) return;

    try {
      const { data: bookingData, error: bookingError } = await supabase
        .from("bookings")
        .insert([
          {
            customer_name: quotation.customer_name,
            customer_email: quotation.customer_email,
            customer_phone: quotation.customer_phone,
            destination: quotation.destination,
            travel_date: quotation.travel_date,
            duration_days: quotation.duration_days,
            passengers: quotation.passengers,
            total_amount: quotation.total,
            status: "inquiry",
            source: "quotation",
            quotation_id: quotation.id,
          },
        ])
        .select("id")
        .single();

      if (bookingError) throw bookingError;

      const { error: updateError } = await supabase
        .from("quotations")
        .update({
          status: "accepted",
          converted_to_booking_id: bookingData.id,
        })
        .eq("id", quotation.id);

      if (updateError) throw updateError;

      alert("Quotation converted to booking successfully!");
      fetchQuotations();
    } catch (error: any) {
      console.error("Error converting to booking:", error);
      alert("Failed to convert: " + error.message);
    }
  }

  async function handleSendEmail(quotation: Quotation) {
    try {
      await supabase
        .from("quotations")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", quotation.id);

      alert(`Quotation ${quotation.quote_number} sent to ${quotation.customer_email}`);
      fetchQuotations();
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  }

  async function handleShareDocument(quotation: Quotation) {
    try {
      const shareToken = `share_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { error } = await supabase.from("document_shares").insert([{
        document_type: "quotation",
        document_id: quotation.id,
        share_token: shareToken,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }]);

      if (error) throw error;

      const shareUrl = `${window.location.origin}/documents/share/${shareToken}`;
      navigator.clipboard.writeText(shareUrl);
      alert(`Share link copied to clipboard!\n\n${shareUrl}`);
    } catch (error: any) {
      console.error("Error creating share link:", error);
      alert("Failed to create share link");
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleDownloadPDF() {
    window.print();
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("quotations").insert(data);
      if (error) throw error;
      fetchQuotations();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      destination: "",
      travel_date: "",
      duration_days: "",
      passengers: "1",
      total: "",
      valid_until: "",
      notes: "",
    });
  }

  function handleEdit(quotation: Quotation) {
    setEditingQuotation(quotation);
    setFormData({
      customer_name: quotation.customer_name,
      customer_email: quotation.customer_email,
      customer_phone: quotation.customer_phone || "",
      destination: quotation.destination || "",
      travel_date: quotation.travel_date || "",
      duration_days: quotation.duration_days?.toString() || "",
      passengers: quotation.passengers?.toString() || "1",
      total: quotation.total.toString(),
      valid_until: quotation.valid_until,
      notes: quotation.notes || "",
    });
    setExpandedRowId(quotation.id);
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
    if (selectedIds.size === quotations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(quotations.map((q) => q.id)));
    }
  }

  const stats = {
    total: quotations.length,
    draft: quotations.filter((q) => q.status === "draft").length,
    sent: quotations.filter((q) => q.status === "sent").length,
    accepted: quotations.filter((q) => q.status === "accepted").length,
    rejected: quotations.filter((q) => q.status === "rejected").length,
    totalValue: quotations
      .filter((q) => q.status === "accepted")
      .reduce((sum, q) => sum + (q.total || 0), 0),
  };

  const filtered = quotations.filter((quotation) => {
    const matchesSearch =
      quotation.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      quotation.quote_number.toLowerCase().includes(search.toLowerCase()) ||
      quotation.destination?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || quotation.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusMap = {
    draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
    sent: { label: "Sent", color: "bg-blue-100 text-blue-700" },
    accepted: { label: "Accepted", color: "bg-green-100 text-green-700" },
    rejected: { label: "Rejected", color: "bg-red-100 text-red-700" },
    expired: { label: "Expired", color: "bg-gray-100 text-gray-700" },
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Quotations
          </h1>
          <p className="text-gray-600">
            Create and manage travel quotations for customers
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
              const columns = getTemplateColumns("quotations");
              await exportToExcel(filtered, "quotations", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingQuotation(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Quotation
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Quotations</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Draft</p>
          <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Sent</p>
          <p className="text-2xl font-bold text-blue-600">{stats.sent}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{stats.accepted}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === quotations.length && quotations.length > 0}
        entityType="quotations"
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
              placeholder="Search by customer, quote #, or destination..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
          </select>
          <button
            onClick={fetchQuotations}
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
          <p className="text-gray-600">Loading quotations...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === quotations.length && quotations.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Quote #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Travel Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Valid Until
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
              {filtered.map((quotation) => (
                <>
                  <tr key={quotation.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(quotation.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedIds.has(quotation.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {quotation.quote_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{quotation.customer_name}</p>
                        <p className="text-xs text-gray-500">{quotation.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {quotation.destination || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {quotation.travel_date
                        ? new Date(quotation.travel_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${quotation.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(quotation.valid_until).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={quotation.status}
                        type="select"
                        options={Object.entries(statusMap).map(([key, config]) => ({
                          label: config.label,
                          value: key,
                        }))}
                        onSave={(value) => handleStatusChange(quotation.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingQuotation(quotation)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(quotation)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendEmail(quotation)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        {quotation.status === "sent" && (
                          <>
                            <button
                              onClick={() => handleAccept(quotation.id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                              title="Accept"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(quotation.id)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {quotation.status === "accepted" && !quotation.converted_to_booking_id && (
                          <button
                            onClick={() => handleConvertToBooking(quotation)}
                            className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                            title="Convert to Booking"
                          >
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(quotation.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === quotation.id && (
                    <tr>
                      <td colSpan={9} className="p-0">
                        <div className="bg-sky-50 border-t">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="col-span-2">
                                <h3 className="font-semibold mb-3">
                                  {editingQuotation ? "Edit Quotation" : "New Quotation"}
                                </h3>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.customer_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Customer name"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Email *
                                </label>
                                <input
                                  type="email"
                                  value={formData.customer_email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_email: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="customer@example.com"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Phone
                                </label>
                                <input
                                  type="tel"
                                  value={formData.customer_phone}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_phone: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="+256 700 123456"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Destination
                                </label>
                                <input
                                  type="text"
                                  value={formData.destination}
                                  onChange={(e) =>
                                    setFormData({ ...formData, destination: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="e.g., Dubai, Paris"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Travel Date
                                </label>
                                <input
                                  type="date"
                                  value={formData.travel_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, travel_date: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration (Days)
                                </label>
                                <input
                                  type="number"
                                  value={formData.duration_days}
                                  onChange={(e) =>
                                    setFormData({ ...formData, duration_days: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="7"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Passengers
                                </label>
                                <input
                                  type="number"
                                  value={formData.passengers}
                                  onChange={(e) =>
                                    setFormData({ ...formData, passengers: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="1"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Total Price *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={formData.total}
                                  onChange={(e) =>
                                    setFormData({ ...formData, total: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="0.00"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Valid Until *
                                </label>
                                <input
                                  type="date"
                                  value={formData.valid_until}
                                  onChange={(e) =>
                                    setFormData({ ...formData, valid_until: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  required
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  rows={3}
                                  placeholder="Additional notes, inclusions, exclusions..."
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                              >
                                <FileCheck className="w-4 h-4" />
                                {editingQuotation ? "Update" : "Create"} Quotation
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingQuotation(null);
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
              ))}
            </tbody>
          </table>
        </div>
      )}

      {expandedRowId === "new" && (
        <div className="bg-sky-50 border rounded-lg mt-4">
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="col-span-2">
                <h3 className="font-semibold mb-3">New Quotation</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="Customer name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Email *
                </label>
                <input
                  type="email"
                  value={formData.customer_email}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_email: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="customer@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Phone
                </label>
                <input
                  type="tel"
                  value={formData.customer_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="+256 700 123456"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) =>
                    setFormData({ ...formData, destination: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="e.g., Dubai, Paris"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Travel Date
                </label>
                <input
                  type="date"
                  value={formData.travel_date}
                  onChange={(e) =>
                    setFormData({ ...formData, travel_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (Days)
                </label>
                <input
                  type="number"
                  value={formData.duration_days}
                  onChange={(e) =>
                    setFormData({ ...formData, duration_days: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="7"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Passengers
                </label>
                <input
                  type="number"
                  value={formData.passengers}
                  onChange={(e) =>
                    setFormData({ ...formData, passengers: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Total Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total}
                  onChange={(e) =>
                    setFormData({ ...formData, total: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Valid Until *
                </label>
                <input
                  type="date"
                  value={formData.valid_until}
                  onChange={(e) =>
                    setFormData({ ...formData, valid_until: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                  placeholder="Additional notes, inclusions, exclusions..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                Create Quotation
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingQuotation(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showImporter && (
        <ExcelImporter
          entityType="quotations"
          onImport={handleImport}
          validationRules={getValidationRules("quotations")}
          onClose={() => setShowImporter(false)}
        />
      )}

      {viewingQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 print:bg-white print:static print:inset-auto print:items-start" onClick={() => setViewingQuotation(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-h-none print:overflow-visible" onClick={(e) => e.stopPropagation()}>

            <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-sky-600" />
                Quotation Preview
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Printer className="w-4 h-4" /> Print</button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Download className="w-4 h-4" /> PDF</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); }} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Share2 className="w-4 h-4" /> Share</button>
                <button onClick={() => setViewingQuotation(null)} className="p-1.5 hover:bg-white rounded-lg">✕</button>
              </div>
            </div>

            <div className="p-8 print:p-4">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">VerTravels</h1>
                  <p className="text-sm text-gray-500">Premium Travel Services</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">{viewingQuotation.quote_number}</h2>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                    viewingQuotation.status === "accepted" ? "bg-green-100 text-green-700" :
                    viewingQuotation.status === "sent" ? "bg-blue-100 text-blue-700" :
                    viewingQuotation.status === "rejected" ? "bg-red-100 text-red-700" :
                    viewingQuotation.status === "expired" ? "bg-gray-100 text-gray-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {viewingQuotation.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="w-20 h-20 border rounded-lg p-1">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(viewingQuotation.quote_number)}`} alt="QR" className="w-full h-full" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">From</p>
                  <p className="font-semibold">VerTravels Ltd</p>
                  <p className="text-sm text-gray-600">Plot 123, Kampala Road</p>
                  <p className="text-sm text-gray-600">Kampala, Uganda</p>
                  <p className="text-sm text-gray-600">admin@vertravels.com</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Bill To</p>
                  <p className="font-semibold">{viewingQuotation.customer_name}</p>
                  <p className="text-sm text-gray-600">{viewingQuotation.customer_email}</p>
                  {viewingQuotation.customer_phone && <p className="text-sm text-gray-600">{viewingQuotation.customer_phone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Issue Date</p>
                  <p className="font-semibold">{viewingQuotation.created_at ? new Date(viewingQuotation.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Expiry Date</p>
                  <p className="font-semibold">{viewingQuotation.valid_until ? new Date(viewingQuotation.valid_until).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Travel Details</p>
                  <p className="font-semibold">{viewingQuotation.destination || "—"} {viewingQuotation.travel_date ? `· ${new Date(viewingQuotation.travel_date).toLocaleDateString()}` : ""}</p>
                </div>
              </div>

              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 text-sm">{viewingQuotation.destination ? `Trip to ${viewingQuotation.destination}` : "Travel Services"} ({viewingQuotation.passengers || 1} passenger{viewingQuotation.passengers !== 1 ? "s" : ""}, {viewingQuotation.duration_days || 0} day{viewingQuotation.duration_days !== 1 ? "s" : ""})</td>
                      <td className="py-3 text-sm text-right">${(viewingQuotation.subtotal || viewingQuotation.total || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td className="py-4 text-base font-bold">Total</td>
                      <td className="py-4 text-base font-bold text-right">${(viewingQuotation.total || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {viewingQuotation.notes && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{viewingQuotation.notes}</p>
                </div>
              )}

              <div className="text-center text-xs text-gray-400 pt-8 border-t">
                <p>Thank you for considering VerTravels!</p>
                <p className="mt-1">VerTravels Ltd | Kampala, Uganda | admin@vertravels.com</p>
              </div>
            </div>

            <div className="print:hidden p-4 border-t flex gap-3 sticky bottom-0 bg-white">
              {viewingQuotation.status === "accepted" && !viewingQuotation.converted_to_booking_id && (
                <button onClick={() => { handleConvertToBooking(viewingQuotation); setViewingQuotation(null); }} className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2">
                  <ArrowRight className="w-4 h-4" /> Convert to Booking
                </button>
              )}
              <button onClick={() => handleSendEmail(viewingQuotation)} className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button onClick={() => setViewingQuotation(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
