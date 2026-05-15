"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  CreditCard,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  RefreshCw,
  Square,
  CheckSquare,
  Upload,
  DollarSign,
  Calendar,
  Tag,
  User,
  FileText,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";

interface Expense {
  id: string;
  expense_number: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
  expense_date: string;
  vendor_name?: string;
  payment_method?: string;
  status: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);

  const [formData, setFormData] = useState({
    description: "",
    category: "other",
    amount: "",
    expense_date: "",
    vendor_name: "",
    payment_method: "bank_transfer",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchExpenses();
  }, []);

  async function fetchExpenses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("expenses")
        .select("*")
        .order("expense_date", { ascending: false });

      if (error) throw error;
      setExpenses(data || []);
    } catch (error: any) {
      console.error("Error fetching expenses:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const amount = parseFloat(formData.amount) || 0;

      if (editingExpense) {
        const { error } = await supabase
          .from("expenses")
          .update({
            description: formData.description,
            category: formData.category,
            amount,
            expense_date: formData.expense_date,
            vendor_name: formData.vendor_name,
            payment_method: formData.payment_method,
            notes: formData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingExpense.id);

        if (error) throw error;
      } else {
        const expenseNumber = `EXP-${Date.now()}`;

        const { error } = await supabase.from("expenses").insert([
          {
            expense_number: expenseNumber,
            description: formData.description,
            category: formData.category,
            amount,
            expense_date: formData.expense_date,
            vendor_name: formData.vendor_name,
            payment_method: formData.payment_method,
            notes: formData.notes,
            status: "pending",
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingExpense(null);
      resetForm();
      fetchExpenses();
    } catch (error: any) {
      console.error("Error saving expense:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id);
      if (error) throw error;
      fetchExpenses();
    } catch (error: any) {
      console.error("Error deleting expense:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} expenses? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("expenses")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchExpenses();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selected = expenses.filter((e) => selectedIds.has(e.id));
    const columns = getTemplateColumns("expenses");

    await exportToExcel(selected, "expenses-export", {
      columns,
      branded: true,
    });
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const update: any = { status: newStatus };
      if (newStatus === "paid") {
        update.paid_date = new Date().toISOString().split("T")[0];
      }
      const { error } = await supabase
        .from("expenses")
        .update(update)
        .eq("id", id);

      if (error) throw error;
      fetchExpenses();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("expenses").insert(data);
      if (error) throw error;
      fetchExpenses();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      description: "",
      category: "other",
      amount: "",
      expense_date: "",
      vendor_name: "",
      payment_method: "bank_transfer",
      notes: "",
    });
  }

  function handleEdit(expense: Expense) {
    setEditingExpense(expense);
    setFormData({
      description: expense.description,
      category: expense.category,
      amount: expense.amount.toString(),
      expense_date: expense.expense_date,
      vendor_name: expense.vendor_name || "",
      payment_method: expense.payment_method || "bank_transfer",
      notes: expense.notes || "",
    });
    setExpandedRowId(expense.id);
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
    if (selectedIds.size === expenses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(expenses.map((e) => e.id)));
    }
  }

  const stats = {
    total: expenses.length,
    pending: expenses.filter((e) => e.status === "pending").length,
    approved: expenses.filter((e) => e.status === "approved").length,
    paid: expenses.filter((e) => e.status === "paid").length,
    totalAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
    pendingAmount: expenses
      .filter((e) => e.status === "pending" || e.status === "approved")
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const filtered = expenses.filter((expense) => {
    const matchesSearch =
      expense.description.toLowerCase().includes(search.toLowerCase()) ||
      expense.expense_number.toLowerCase().includes(search.toLowerCase()) ||
      (expense.vendor_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || expense.status === filter;
    return matchesSearch && matchesFilter;
  });

  const categoryLabels: Record<string, string> = {
    office_supplies: "Office Supplies",
    travel: "Travel",
    utilities: "Utilities",
    software: "Software",
    marketing: "Marketing",
    payroll: "Payroll",
    maintenance: "Maintenance",
    other: "Other",
  };

  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
    approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Expenses</h1>
          <p className="text-gray-600">Track and manage company expenses</p>
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
              const columns = getTemplateColumns("expenses");
              await exportToExcel(filtered, "expenses", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingExpense(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Expense
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Expenses</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Approved</p>
          <p className="text-2xl font-bold text-blue-600">{stats.approved}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Paid</p>
          <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Amount</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalAmount.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending Amount</p>
          <p className="text-2xl font-bold text-orange-600">
            ${stats.pendingAmount.toLocaleString()}
          </p>
        </div>
      </div>

      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === expenses.length && expenses.length > 0}
        entityType="expenses"
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        disabledActions={["edit", "email"]}
      />

      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by description, expense number, or vendor..."
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
            <option value="approved">Approved</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchExpenses}
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
          <p className="text-gray-600">Loading expenses...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === expenses.length && expenses.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Expense #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
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
              {filtered.map((expense) => (
                <>
                  <tr key={expense.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button onClick={() => toggleSelect(expense.id)} className="p-1 hover:bg-gray-200 rounded">
                        {selectedIds.has(expense.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {expense.expense_number}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        {expense.vendor_name && (
                          <p className="text-xs text-gray-500">{expense.vendor_name}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                        {categoryLabels[expense.category] || expense.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(expense.expense_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={expense.status}
                        type="select"
                        options={[
                          { label: "Pending", value: "pending" },
                          { label: "Approved", value: "approved" },
                          { label: "Paid", value: "paid" },
                          { label: "Cancelled", value: "cancelled" },
                        ]}
                        onSave={(value) => handleStatusChange(expense.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(expense)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === expense.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-100 rounded-xl shadow-sm">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-3 gap-4 mb-4">

                              <div className="col-span-full border-b border-sky-200 pb-2 mb-2">
                                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-sky-600" /> {editingExpense ? "Edit" : "New"} Expense
                                </h3>
                              </div>

                              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                  <FileText className="w-3.5 h-3.5 text-sky-500" /> Expense Details
                                </h4>
                              </div>

                              <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Description *
                                </label>
                                <input
                                  type="text"
                                  value={formData.description}
                                  onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="What is this expense for?"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Category *
                                </label>
                                <select
                                  value={formData.category}
                                  onChange={(e) =>
                                    setFormData({ ...formData, category: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                >
                                  <option value="office_supplies">Office Supplies</option>
                                  <option value="travel">Travel</option>
                                  <option value="utilities">Utilities</option>
                                  <option value="software">Software</option>
                                  <option value="marketing">Marketing</option>
                                  <option value="payroll">Payroll</option>
                                  <option value="maintenance">Maintenance</option>
                                  <option value="other">Other</option>
                                </select>
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
                                  Expense Date *
                                </label>
                                <input
                                  type="date"
                                  value={formData.expense_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, expense_date: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Vendor
                                </label>
                                <input
                                  type="text"
                                  value={formData.vendor_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, vendor_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                  placeholder="Vendor or payee name"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Payment Method
                                </label>
                                <select
                                  value={formData.payment_method}
                                  onChange={(e) =>
                                    setFormData({ ...formData, payment_method: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                                >
                                  <option value="bank_transfer">Bank Transfer</option>
                                  <option value="credit_card">Credit Card</option>
                                  <option value="debit_card">Debit Card</option>
                                  <option value="cash">Cash</option>
                                  <option value="mobile_money">Mobile Money</option>
                                  <option value="other">Other</option>
                                </select>
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
                                  placeholder="Additional details about this expense..."
                                />
                              </div>
                            </div>

                            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
                              >
                                <DollarSign className="w-4 h-4" />
                                {editingExpense ? "Update" : "Create"} Expense
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingExpense(null);
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
                  <DollarSign className="w-4 h-4 text-sky-600" /> New Expense
                </h3>
              </div>

              <div className="col-span-full border-b border-sky-100 pb-2 mb-2">
                <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-sky-500" /> Expense Details
                </h4>
              </div>

              <div className="col-span-full">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="What is this expense for?"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                >
                  <option value="office_supplies">Office Supplies</option>
                  <option value="travel">Travel</option>
                  <option value="utilities">Utilities</option>
                  <option value="software">Software</option>
                  <option value="marketing">Marketing</option>
                  <option value="payroll">Payroll</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
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
                  Expense Date *
                </label>
                <input
                  type="date"
                  value={formData.expense_date}
                  onChange={(e) =>
                    setFormData({ ...formData, expense_date: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor
                </label>
                <input
                  type="text"
                  value={formData.vendor_name}
                  onChange={(e) =>
                    setFormData({ ...formData, vendor_name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                  placeholder="Vendor or payee name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.payment_method}
                  onChange={(e) =>
                    setFormData({ ...formData, payment_method: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-shadow"
                >
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="credit_card">Credit Card</option>
                  <option value="debit_card">Debit Card</option>
                  <option value="cash">Cash</option>
                  <option value="mobile_money">Mobile Money</option>
                  <option value="other">Other</option>
                </select>
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
                  placeholder="Additional details about this expense..."
                />
              </div>
            </div>

            <div className="col-span-full flex gap-3 pt-4 border-t border-sky-100 mt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2.5 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <DollarSign className="w-4 h-4" />
                Create Expense
              </button>
              <button
                type="button"
                onClick={() => {
                  setExpandedRowId(null);
                  setEditingExpense(null);
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
          entityType="expenses"
          onImport={handleImport}
          validationRules={getValidationRules("expenses")}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
