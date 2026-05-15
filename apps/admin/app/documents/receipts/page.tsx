"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CreditCard,
  Plus,
  Search,
  Download,
  Mail,
  RefreshCw,
  Square,
  CheckSquare,
  Upload,
  DollarSign,
  Calendar,
  CheckCircle,
  FileText,
  Edit2,
  Trash2,
  Eye,
  Printer,
  Plane,
  Share2,
  User,
} from "lucide-react";
import { exportToExcel } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";

interface Receipt {
  id: string;
  receipt_number: string;
  customer_name: string;
  customer_email: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status?: "completed" | "pending" | "failed";
  transaction_id?: string;
  reference_number?: string;
  invoice_id?: string;
  booking_id?: string;
  notes?: string;
  created_at: string;
}

export default function ReceiptsPage() {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<Receipt | null>(null);
  const [paymentModal, setPaymentModal] = useState<Receipt | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: "", method: "credit_card", reference: "", notes: "" });

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    amount: "",
    payment_method: "bank_transfer",
    transaction_id: "",
    reference_number: "",
    notes: "",
    payment_date: new Date().toISOString().split("T")[0],
  });

  const supabase = createClient();

  useEffect(() => {
    fetchReceipts();
  }, []);

  async function fetchReceipts() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("payment_receipts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReceipts(data || []);
    } catch (error: any) {
      console.error("Error fetching receipts:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const amount = parseFloat(formData.amount) || 0;

      if (editingReceipt) {
        const { error } = await supabase
          .from("payment_receipts")
          .update({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            amount,
            payment_method: formData.payment_method,
            transaction_id: formData.transaction_id,
            reference_number: formData.reference_number,
            notes: formData.notes,
            payment_date: formData.payment_date,
          })
          .eq("id", editingReceipt.id);

        if (error) throw error;
      } else {
        const receiptNumber = `RCP-${Date.now()}`;

        const { error } = await supabase.from("payment_receipts").insert([
          {
            receipt_number: receiptNumber,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            amount,
            payment_method: formData.payment_method,
            transaction_id: formData.transaction_id,
            reference_number: formData.reference_number,
            notes: formData.notes,
            payment_date: formData.payment_date,
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingReceipt(null);
      resetForm();
      fetchReceipts();
    } catch (error: any) {
      console.error("Error saving receipt:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this receipt?")) return;

    try {
      const { error } = await supabase.from("payment_receipts").delete().eq("id", id);
      if (error) throw error;
      fetchReceipts();
    } catch (error: any) {
      console.error("Error deleting receipt:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} receipts? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("payment_receipts")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchReceipts();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const columns = [
      { header: "Receipt Number", key: "receipt_number", width: 20 },
      { header: "Customer Name", key: "customer_name", width: 25 },
      { header: "Email", key: "customer_email", width: 30 },
      { header: "Amount", key: "amount", width: 15 },
      { header: "Payment Method", key: "payment_method", width: 20 },
      { header: "Payment Date", key: "payment_date", width: 15 },
      { header: "Transaction ID", key: "transaction_id", width: 25 },
      { header: "Reference", key: "reference_number", width: 20 },
    ];

    const selectedReceipts = receipts.filter((r) => selectedIds.has(r.id));
    await exportToExcel(selectedReceipts, "receipts-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selectedReceipts = receipts.filter((r) => selectedIds.has(r.id));
    if (!confirm(`Send ${selectedReceipts.length} receipts via email?`)) return;

    try {
      for (const receipt of selectedReceipts) {
        // TODO: Implement actual email sending
        console.log(`Sending receipt ${receipt.receipt_number} to ${receipt.customer_email}`);
      }
      alert(`Sent ${selectedReceipts.length} receipts via email`);
    } catch (error: any) {
      console.error("Error sending emails:", error);
    }
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("payment_receipts").insert(data);
      if (error) throw error;
      fetchReceipts();
    } catch (error: any) {
      throw error;
    }
  }

  async function handleShareDocument(receipt: Receipt) {
    try {
      const shareToken = `share_${Date.now()}_${Math.random().toString(36).substring(7)}`;

      const { error } = await supabase.from("document_shares").insert([{
        document_type: "receipt",
        document_id: receipt.id,
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

  async function handleSendEmail(receipt: Receipt) {
    try {
      navigator.clipboard.writeText(receipt.customer_email);
      alert(`Receipt ${receipt.receipt_number} — email address ${receipt.customer_email} copied to clipboard`);
    } catch (error: any) {
      console.error("Error:", error);
      alert("Failed to copy email");
    }
  }

  async function handleRecordPayment(receipt: Receipt) {
    try {
      const amount = parseFloat(paymentData.amount) || receipt.amount;
      const { error } = await supabase.from("payments").insert([{
        receipt_id: receipt.id,
        receipt_number: receipt.receipt_number,
        customer_name: receipt.customer_name,
        customer_email: receipt.customer_email,
        amount,
        payment_method: paymentData.method,
        reference: paymentData.reference || `PAY-${Date.now()}`,
        notes: paymentData.notes,
        status: "completed",
        payment_date: new Date().toISOString(),
      }]);
      if (error) throw error;
      await supabase.from("payment_receipts").update({ status: "completed" }).eq("id", receipt.id);
      setPaymentModal(null);
      fetchReceipts();
      alert("Payment recorded successfully");
    } catch (err: any) {
      alert("Failed to record payment: " + err.message);
    }
  }

  function resetForm() {
    setFormData({
      customer_name: "",
      customer_email: "",
      amount: "",
      payment_method: "bank_transfer",
      transaction_id: "",
      reference_number: "",
      notes: "",
      payment_date: new Date().toISOString().split("T")[0],
    });
  }

  function handleEdit(receipt: Receipt) {
    setEditingReceipt(receipt);
    setFormData({
      customer_name: receipt.customer_name,
      customer_email: receipt.customer_email,
      amount: receipt.amount.toString(),
      payment_method: receipt.payment_method,
      transaction_id: receipt.transaction_id || "",
      reference_number: receipt.reference_number || "",
      notes: receipt.notes || "",
      payment_date: receipt.payment_date,
    });
    setExpandedRowId(receipt.id);
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
    if (selectedIds.size === receipts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(receipts.map((r) => r.id)));
    }
  }

  const stats = {
    total: receipts.length,
    totalAmount: receipts.reduce((sum, r) => sum + (r.amount || 0), 0),
    today: receipts.filter((r) => {
      const today = new Date().toDateString();
      return new Date(r.payment_date).toDateString() === today;
    }).length,
    thisWeek: receipts.filter((r) => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(r.payment_date) >= weekAgo;
    }).length,
  };

  const filtered = receipts.filter((receipt) => {
    const matchesSearch =
      receipt.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      receipt.receipt_number.toLowerCase().includes(search.toLowerCase()) ||
      receipt.transaction_id?.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  const paymentMethods = [
    { label: "Bank Transfer", value: "bank_transfer" },
    { label: "Credit Card", value: "credit_card" },
    { label: "Debit Card", value: "debit_card" },
    { label: "Cash", value: "cash" },
    { label: "Mobile Money", value: "mobile_money" },
    { label: "Check", value: "check" },
    { label: "PayPal", value: "paypal" },
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Payment Receipts
          </h1>
          <p className="text-gray-600">
            Track and manage payment receipts for bookings and invoices
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
            onClick={handleBulkExport}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingReceipt(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Receipt
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Receipts</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-2xl font-bold text-blue-600">{stats.today}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-2xl font-bold text-sky-600">{stats.thisWeek}</p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === receipts.length && receipts.length > 0}
        entityType="receipts"
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
              placeholder="Search by customer, receipt #, or transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-lg"
            />
          </div>
          <button
            onClick={fetchReceipts}
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
          <p className="text-gray-600">Loading receipts...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === receipts.length && receipts.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Receipt #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Payment Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Transaction ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((receipt) => (
                <>
                  <tr key={receipt.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(receipt.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedIds.has(receipt.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {receipt.receipt_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{receipt.customer_name}</p>
                        <p className="text-xs text-gray-500">{receipt.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      ${receipt.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-sky-100 text-sky-700 rounded text-xs font-medium">
                        {receipt.payment_method.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(receipt.payment_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono">
                      {receipt.transaction_id || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewingReceipt(receipt)}
                          className="p-1.5 text-gray-600 hover:bg-gray-50 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(receipt)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(receipt.customer_email);
                            alert("Email copied to clipboard");
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Copy Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setPaymentModal(receipt)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Record Payment"
                        >
                          <DollarSign className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(receipt.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === receipt.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-4">

                              <div className="col-span-full border-b border-sky-200 pb-2 mb-2">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-sky-600" /> {editingReceipt ? "Edit" : "New"} Receipt
                                </h3>
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <User className="w-3.5 h-3.5 text-sky-500" /> Customer Information
                                </h4>
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
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
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="customer@example.com"
                                  required
                                />
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Payment Details
                                </h4>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Amount *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={formData.amount}
                                  onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="0.00"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Payment Method *
                                </label>
                                <select
                                  value={formData.payment_method}
                                  onChange={(e) =>
                                    setFormData({ ...formData, payment_method: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                >
                                  {paymentMethods.map((method) => (
                                    <option key={method.value} value={method.value}>
                                      {method.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Payment Date *
                                </label>
                                <input
                                  type="date"
                                  value={formData.payment_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, payment_date: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Transaction ID
                                </label>
                                <input
                                  type="text"
                                  value={formData.transaction_id}
                                  onChange={(e) =>
                                    setFormData({ ...formData, transaction_id: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Bank transaction ID"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Reference Number
                                </label>
                                <input
                                  type="text"
                                  value={formData.reference_number}
                                  onChange={(e) =>
                                    setFormData({ ...formData, reference_number: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Payment reference"
                                />
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-sky-500" /> Notes
                                </h4>
                              </div>

                              <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  rows={3}
                                  placeholder="Additional notes..."
                                />
                              </div>
                            </div>

                            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                              >
                                <CreditCard className="w-4 h-4" />
                                {editingReceipt ? "Update" : "Create"} Receipt
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingReceipt(null);
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
                  <CreditCard className="w-4 h-4 text-sky-600" /> New Receipt
                </h3>
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-sky-500" /> Customer Information
                </h4>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="customer@example.com"
                  required
                />
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-sky-500" /> Payment Details
                </h4>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method *
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_method: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                >
                  {paymentMethods.map((method) => (
                    <option key={method.value} value={method.value}>
                      {method.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Date *
                </label>
                <input
                  type="date"
                  value={formData.payment_date}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction ID
                </label>
                <input
                  type="text"
                  value={formData.transaction_id}
                  onChange={(e) =>
                    setFormData({ ...formData, transaction_id: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Bank transaction ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference Number
                </label>
                <input
                  type="text"
                  value={formData.reference_number}
                  onChange={(e) =>
                    setFormData({ ...formData, reference_number: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Payment reference"
                />
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2 mt-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-500" /> Notes
                </h4>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
            </div>

            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <CreditCard className="w-4 h-4" />
                Create Receipt
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingReceipt(null);
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
          entityType="payment_receipts"
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}

      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 print:bg-white print:static print:inset-auto print:items-start" onClick={() => setViewingReceipt(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto print:shadow-none print:rounded-none print:max-h-none print:overflow-visible" onClick={(e) => e.stopPropagation()}>

            <div className="print:hidden p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl sticky top-0 z-10">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-600" />
                Receipt Preview
              </h2>
              <div className="flex gap-2">
                <button onClick={handlePrint} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Printer className="w-4 h-4" /> Print</button>
                <button onClick={handleDownloadPDF} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Download className="w-4 h-4" /> PDF</button>
                <button onClick={() => { navigator.clipboard.writeText(window.location.href); alert("Link copied"); }} className="flex items-center gap-1.5 px-3 py-1.5 border rounded-lg hover:bg-white text-sm"><Share2 className="w-4 h-4" /> Share</button>
                <button onClick={() => setViewingReceipt(null)} className="p-1.5 hover:bg-white rounded-lg">✕</button>
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
                  <h2 className="text-xl font-bold text-gray-900">{viewingReceipt.receipt_number}</h2>
                  <span className={`inline-block mt-1 px-3 py-1 text-xs font-semibold rounded-full ${
                    viewingReceipt.status === "completed" ? "bg-green-100 text-green-700" :
                    viewingReceipt.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    viewingReceipt.status === "failed" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {viewingReceipt.status?.toUpperCase() || "COMPLETED"}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mb-6">
                <div className="w-20 h-20 border rounded-lg p-1">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(viewingReceipt.receipt_number)}`} alt="QR" className="w-full h-full" />
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
                  <p className="font-semibold">{viewingReceipt.customer_name}</p>
                  <p className="text-sm text-gray-600">{viewingReceipt.customer_email}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Date</p>
                  <p className="font-semibold">{viewingReceipt.payment_date ? new Date(viewingReceipt.payment_date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Payment Method</p>
                  <p className="font-semibold capitalize">{viewingReceipt.payment_method?.replace(/_/g, " ") || "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Transaction ID</p>
                  <p className="font-semibold font-mono text-sm">{viewingReceipt.transaction_id || "—"}</p>
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
                      <td className="py-3 text-sm">Payment Received{viewingReceipt.reference_number ? ` (Ref: ${viewingReceipt.reference_number})` : ""}</td>
                      <td className="py-3 text-sm text-right font-medium">${(viewingReceipt.amount || 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-gray-300">
                      <td className="py-4 text-base font-bold">Total Paid</td>
                      <td className="py-4 text-base font-bold text-right text-green-600">${(viewingReceipt.amount || 0).toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Payment Information</p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-500">Reference:</span>
                    <span className="ml-2 font-medium">{viewingReceipt.reference_number || "—"}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Method:</span>
                    <span className="ml-2 font-medium capitalize">{viewingReceipt.payment_method?.replace(/_/g, " ") || "—"}</span>
                  </div>
                </div>
              </div>

              {viewingReceipt.notes && (
                <div className="mb-8 p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Notes</p>
                  <p className="text-sm text-gray-700">{viewingReceipt.notes}</p>
                </div>
              )}

              <div className="text-center text-xs text-gray-400 pt-8 border-t">
                <p>Thank you for your payment!</p>
                <p className="mt-1">VerTravels Ltd | Kampala, Uganda | admin@vertravels.com</p>
              </div>
            </div>

            <div className="print:hidden p-4 border-t flex gap-3 sticky bottom-0 bg-white">
              <button onClick={() => handleSendEmail(viewingReceipt)} className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button onClick={() => setViewingReceipt(null)} className="px-4 py-2 border rounded-lg hover:bg-gray-50">Close</button>
            </div>
          </div>
        </div>
      )}

      {paymentModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={() => setPaymentModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Record Payment</h2>
            <p className="text-sm text-gray-500 mb-4">Receipt: {paymentModal.receipt_number} — ${paymentModal.amount?.toLocaleString()}</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input type="number" step="0.01" value={paymentData.amount || paymentModal.amount} onChange={e => setPaymentData({...paymentData, amount: e.target.value})} className="w-full px-3 py-2 border rounded-lg" />
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
