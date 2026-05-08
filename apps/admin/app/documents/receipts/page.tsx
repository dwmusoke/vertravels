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
                        <div className="bg-sky-50 border-t">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="col-span-2">
                                <h3 className="font-semibold mb-3">
                                  {editingReceipt ? "Edit Receipt" : "New Payment Receipt"}
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
                                  Amount *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={formData.amount}
                                  onChange={(e) =>
                                    setFormData({ ...formData, amount: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
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
                                  className="w-full px-3 py-2 border rounded-lg"
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
                                  className="w-full px-3 py-2 border rounded-lg"
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
                                  className="w-full px-3 py-2 border rounded-lg"
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
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Payment reference"
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
                                <CreditCard className="w-4 h-4" />
                                {editingReceipt ? "Update" : "Create"} Receipt
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingReceipt(null);
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

      {showImporter && (
        <ExcelImporter
          entityType="payment_receipts"
          onImport={handleImport}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
