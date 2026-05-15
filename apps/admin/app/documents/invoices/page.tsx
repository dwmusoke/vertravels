"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  Share2,
  Square,
  CheckSquare,
  Upload,
  DollarSign,
  Printer,
  Plane,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";
import { AuditTrailInline } from "@/components/ui/audit-trail";

interface Invoice {
  id: string;
  invoice_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  booking_id?: string;
  total: number;
  subtotal?: number;
  tax_amount?: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issue_date: string;
  due_date: string;
  paid_date?: string;
  payment_method?: string;
  email_sent: boolean;
  notes?: string;
}

export default function AdminInvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);
  const [showAuditTrail, setShowAuditTrail] = useState<string | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [paymentModal, setPaymentModal] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: "", method: "credit_card", reference: "", notes: "" });

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    total: "",
    issue_date: "",
    due_date: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchInvoices();
  }, []);

  async function fetchInvoices() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("invoices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvoices(data || []);
    } catch (error: any) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const total = parseFloat(formData.total) || 0;

      if (editingInvoice) {
        const { error } = await supabase
          .from("invoices")
          .update({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            total,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            notes: formData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingInvoice.id);

        if (error) throw error;
      } else {
        const invoiceNumber = `INV-${Date.now()}`;

        const { error } = await supabase.from("invoices").insert([
          {
            invoice_number: invoiceNumber,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            total,
            issue_date: formData.issue_date,
            due_date: formData.due_date,
            notes: formData.notes,
            status: "draft",
            email_sent: false,
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingInvoice(null);
      resetForm();
      fetchInvoices();
    } catch (error: any) {
      console.error("Error saving invoice:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const { error } = await supabase.from("invoices").delete().eq("id", id);
      if (error) throw error;
      fetchInvoices();
    } catch (error: any) {
      console.error("Error deleting invoice:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} invoices? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("invoices")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchInvoices();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selectedInvoices = invoices.filter((i) => selectedIds.has(i.id));
    const columns = getTemplateColumns("invoices");

    await exportToExcel(selectedInvoices, "invoices-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selectedInvoices = invoices.filter((i) => selectedIds.has(i.id));
    if (!confirm(`Send ${selectedInvoices.length} invoices via email?`)) return;

    try {
      for (const invoice of selectedInvoices) {
        await supabase
          .from("invoices")
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq("id", invoice.id);
      }
      alert(`Sent ${selectedInvoices.length} invoices via email`);
      fetchInvoices();
    } catch (error: any) {
      console.error("Error sending emails:", error);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const updates: Record<string, any> = { status: newStatus };
      if (newStatus === "paid") {
        updates.paid_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from("invoices")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
      fetchInvoices();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleSendEmail(invoice: Invoice) {
    try {
      await supabase
        .from("invoices")
        .update({ email_sent: true, email_sent_at: new Date().toISOString() })
        .eq("id", invoice.id);

      alert(`Invoice ${invoice.invoice_number} sent to ${invoice.customer_email}`);
      fetchInvoices();
    } catch (error: any) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
  }

  async function handleShareDocument(invoice: Invoice) {
    try {
      const shareToken = `share_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { error } = await supabase.from("document_shares").insert([{
        document_type: "invoice",
        document_id: invoice.id,
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

  async function handleRecordPayment(invoice: Invoice) {
    try {
      const amount = parseFloat(paymentData.amount) || invoice.total;
      const { error } = await supabase.from("payments").insert([{
        invoice_id: invoice.id,
        invoice_number: invoice.invoice_number,
        customer_name: invoice.customer_name,
        customer_email: invoice.customer_email,
        amount,
        payment_method: paymentData.method,
        reference: paymentData.reference || `PAY-${Date.now()}`,
        notes: paymentData.notes,
        status: "completed",
        payment_date: new Date().toISOString(),
      }]);
      if (error) throw error;
      await supabase.from("invoices").update({ status: "paid", paid_date: new Date().toISOString() }).eq("id", invoice.id);
      setPaymentModal(null);
      fetchInvoices();
      alert("Payment recorded successfully");
    } catch (err: any) {
      alert("Failed to record payment: " + err.message);
    }
  }

  function handlePrint() {
    window.print();
  }

  function handleDownloadPDF(invoice: Invoice) {
    window.print();
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("invoices").insert(data);
      if (error) throw error;
      fetchInvoices();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      total: "",
      issue_date: "",
      due_date: "",
      notes: "",
    });
  }

  function handleEdit(invoice: Invoice) {
    setEditingInvoice(invoice);
    setFormData({
      customer_name: invoice.customer_name,
      customer_email: invoice.customer_email,
      customer_phone: invoice.customer_phone || "",
      total: invoice.total.toString(),
      issue_date: invoice.issue_date,
      due_date: invoice.due_date,
      notes: invoice.notes || "",
    });
    setExpandedRowId(invoice.id);
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
    if (selectedIds.size === invoices.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(invoices.map((i) => i.id)));
    }
  }

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "paid").length,
    pending: invoices.filter((i) => i.status === "sent" || i.status === "draft").length,
    overdue: invoices.filter((i) => i.status === "overdue").length,
    revenue: invoices
      .filter((i) => i.status === "paid")
      .reduce((sum, i) => sum + (i.total || 0), 0),
  };

  const filtered = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      invoice.invoice_number.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || invoice.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusMap = {
    draft: { label: "Draft", color: "bg-gray-100 text-gray-700" },
    sent: { label: "Sent", color: "bg-blue-100 text-blue-700" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700" },
    overdue: { label: "Overdue", color: "bg-red-100 text-red-700" },
    cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-700" },
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invoices Management
          </h1>
          <p className="text-gray-600">
            Create, manage, and send professional invoices
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
              const columns = getTemplateColumns("invoices");
              await exportToExcel(filtered, "invoices", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingInvoice(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Invoices</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.revenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === invoices.length && invoices.length > 0}
        entityType="invoices"
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
              placeholder="Search by customer or invoice number..."
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
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchInvoices}
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
          <p className="text-gray-600">Loading invoices...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === invoices.length && invoices.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Issue Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
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
              {filtered.map((invoice) => (
                <>
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(invoice.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedIds.has(invoice.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{invoice.customer_name}</p>
                        <p className="text-xs text-gray-500">{invoice.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(invoice.issue_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(invoice.due_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${invoice.total.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={invoice.status}
                        type="select"
                        options={Object.entries(statusMap).map(([key, config]) => ({
                          label: config.label,
                          value: key,
                        }))}
                        onSave={(value) => handleStatusChange(invoice.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingInvoice(invoice)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleSendEmail(invoice)}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Send Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleShareDocument(invoice)}
                          className="p-1.5 text-purple-600 hover:bg-purple-50 rounded"
                          title="Share"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setPaymentModal(invoice)} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded" title="Record Payment">
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === invoice.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-sky-50 border-t">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="col-span-2">
                                <h3 className="font-semibold mb-3">
                                  {editingInvoice ? "Edit Invoice" : "New Invoice"}
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
                                  Total Amount *
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
                                  Issue Date *
                                </label>
                                <input
                                  type="date"
                                  value={formData.issue_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, issue_date: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Due Date *
                                </label>
                                <input
                                  type="date"
                                  value={formData.due_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, due_date: e.target.value })
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
                                  placeholder="Additional notes..."
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                {editingInvoice ? "Update" : "Create"} Invoice
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingInvoice(null);
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
                <h3 className="font-semibold mb-3">New Invoice</h3>
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
                  Total Amount *
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
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) =>
                    setFormData({ ...formData, issue_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date *
                </label>
                <input
                  type="date"
                  value={formData.due_date}
                  onChange={(e) =>
                    setFormData({ ...formData, due_date: e.target.value })
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
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Create Invoice
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingInvoice(null);
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {showAuditTrail && (
        <div className="mt-6">
          <AuditTrailInline recordId={showAuditTrail} tableName="invoices" />
        </div>
      )}

      {showImporter && (
        <ExcelImporter
          entityType="invoices"
          onImport={handleImport}
          validationRules={getValidationRules("invoices")}
          onClose={() => setShowImporter(false)}
        />
      )}

      {viewingInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 print:bg-white print:static print:inset-auto print:items-start" onClick={() => setViewingInvoice(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-h-none print:overflow-visible" onClick={(e) => e.stopPropagation()}>

            {/* Toolbar - hidden when printing */}
            <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-sky-600" />
                Invoice Preview
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Printer className="w-4 h-4" /> Print</button>
                <button onClick={() => handleDownloadPDF(viewingInvoice)} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Download className="w-4 h-4" /> PDF</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); }} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Share2 className="w-4 h-4" /> Share</button>
                <button onClick={() => setViewingInvoice(null)} className="p-1.5 hover:bg-white rounded-lg">✕</button>
              </div>
            </div>

            {/* Invoice Content */}
            <div className="p-8 print:p-4">
              {/* Header with Logo */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="w-14 h-14 bg-gradient-to-br from-sky-500 to-teal-500 rounded-xl flex items-center justify-center mb-3">
                    <Plane className="w-8 h-8 text-white" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">VerTravels</h1>
                  <p className="text-sm text-gray-500">Premium Travel Services</p>
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-gray-900">{viewingInvoice.invoice_number}</h2>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                    viewingInvoice.status === "paid" ? "bg-green-100 text-green-700" :
                    viewingInvoice.status === "sent" ? "bg-blue-100 text-blue-700" :
                    viewingInvoice.status === "overdue" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {viewingInvoice.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex justify-end mb-6">
                <div className="w-20 h-20 border rounded-lg p-1">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(viewingInvoice.invoice_number)}`} alt="QR" className="w-full h-full" />
                </div>
              </div>

              {/* Company & Bill To */}
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
                  <p className="font-semibold">{viewingInvoice.customer_name}</p>
                  <p className="text-sm text-gray-600">{viewingInvoice.customer_email}</p>
                  {viewingInvoice.customer_phone && <p className="text-sm text-gray-600">{viewingInvoice.customer_phone}</p>}
                </div>
              </div>

              {/* Invoice Details */}
              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Issue Date</p>
                  <p className="font-semibold">{viewingInvoice.issue_date ? new Date(viewingInvoice.issue_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Due Date</p>
                  <p className="font-semibold">{viewingInvoice.due_date ? new Date(viewingInvoice.due_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Terms</p>
                  <p className="font-semibold">Due on Receipt</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray((viewingInvoice as any).items) ? (viewingInvoice as any).items.map((item: any, i: number) => (
                      <tr key={i} className="border-b border-gray-100">
                        <td className="py-3 text-sm">{item.description}</td>
                        <td className="py-3 text-sm text-right">${item.amount?.toFixed(2)}</td>
                      </tr>
                    )) : (
                      <tr className="border-b border-gray-100">
                        <td className="py-3 text-sm">Travel Services</td>
                        <td className="py-3 text-sm text-right">${(viewingInvoice.subtotal || viewingInvoice.total || 0).toFixed(2)}</td>
                      </tr>
                    )}
                    {/* Tax Row */}
                    <tr>
                      <td className="py-3 text-sm font-medium">Subtotal</td>
                      <td className="py-3 text-sm text-right font-medium">${(viewingInvoice.subtotal || viewingInvoice.total || 0).toFixed(2)}</td>
                    </tr>
                    {(viewingInvoice as any).tax_amount > 0 && (
                      <tr>
                        <td className="py-3 text-sm text-gray-500">Tax ({((viewingInvoice as any).tax_rate || 0)}%)</td>
                        <td className="py-3 text-sm text-right text-gray-500">${(viewingInvoice as any).tax_amount?.toFixed(2)}</td>
                      </tr>
                    )}
                    {(viewingInvoice as any).discount > 0 && (
                      <tr>
                        <td className="py-3 text-sm text-gray-500">Discount</td>
                        <td className="py-3 text-sm text-right text-red-500">-${(viewingInvoice as any).discount?.toFixed(2)}</td>
                      </tr>
                    )}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td className="py-4 text-base font-bold">Total</td>
                      <td className="py-4 text-base font-bold text-right">${(viewingInvoice.total || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              {/* Notes */}
              {viewingInvoice.notes && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{viewingInvoice.notes}</p>
                </div>
              )}

              {/* Footer */}
              <div className="text-center text-xs text-gray-400 pt-8 border-t">
                <p>Thank you for your business!</p>
                <p className="mt-1">VerTravels Ltd | Kampala, Uganda | admin@vertravels.com</p>
              </div>
            </div>

            {/* Bottom toolbar */}
            <div className="print:hidden p-4 border-t flex gap-3 sticky bottom-0 bg-white">
              {viewingInvoice.status !== "paid" && (
                <button onClick={() => { setPaymentModal(viewingInvoice); setViewingInvoice(null); }} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2">
                  <DollarSign className="w-4 h-4" /> Record Payment
                </button>
              )}
              <button onClick={() => handleSendEmail(viewingInvoice)} className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button onClick={() => setViewingInvoice(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {paymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setPaymentModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Record Payment</h2>
            <p className="text-sm text-gray-500 mb-4">Invoice: {paymentModal.invoice_number} — ${paymentModal.total?.toLocaleString()}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" step="0.01" value={paymentData.amount || paymentModal.total} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <select value={paymentData.method} onChange={e => setPaymentData({...paymentData, method: e.target.value})} className="w-full px-3 py-2 border rounded-lg">
                  <option value="credit_card">Credit Card</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cash">Cash</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reference</label>
                <input type="text" value={paymentData.reference} onChange={e => setPaymentData({...paymentData, reference: e.target.value})} className="w-full px-3 py-2 border rounded-lg" placeholder="Transaction ref..." />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes</label>
                <textarea value={paymentData.notes} onChange={e => setPaymentData({...paymentData, notes: e.target.value})} className="w-full px-3 py-2 border rounded-lg" rows={2} />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => handleRecordPayment(paymentModal)} className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">Record Payment</button>
              <button onClick={() => setPaymentModal(null)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
