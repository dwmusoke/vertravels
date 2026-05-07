"use client";

import { useState } from "react";
import {
  DollarSign,
  Download,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  CreditCard,
} from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  description: string;
  amount: string;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  method?: string;
}

const initialTransactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "Booking Payment",
    description: "Flight VT-001 - John Smith",
    amount: "$1,234",
    status: "Completed",
    date: "May 20, 2026",
    method: "Stripe",
  },
  {
    id: "TXN-002",
    type: "Refund",
    description: "Hotel VT-002 - Sarah Johnson",
    amount: "-$567",
    status: "Completed",
    date: "May 19, 2026",
    method: "Stripe",
  },
  {
    id: "TXN-003",
    type: "Booking Payment",
    description: "Tour VT-003 - Michael Brown",
    amount: "$890",
    status: "Completed",
    date: "May 18, 2026",
    method: "PayPal",
  },
  {
    id: "TXN-004",
    type: "Agent Commission",
    description: "Travel Hub Uganda",
    amount: "-$123",
    status: "Completed",
    date: "May 17, 2026",
    method: "Bank Transfer",
  },
  {
    id: "TXN-005",
    type: "Booking Payment",
    description: "Car VT-005 - Emily Davis",
    amount: "$2,100",
    status: "Pending",
    date: "May 16, 2026",
    method: "Stripe",
  },
  {
    id: "TXN-006",
    type: "Booking Payment",
    description: "Flight VT-006 - David Wilson",
    amount: "$1,567",
    status: "Completed",
    date: "May 15, 2026",
    method: "Stripe",
  },
  {
    id: "TXN-007",
    type: "Withdrawal",
    description: "Admin Payout",
    amount: "-$5,000",
    status: "Completed",
    date: "May 14, 2026",
    method: "Bank Transfer",
  },
  {
    id: "TXN-008",
    type: "Booking Payment",
    description: "Hotel VT-008 - Lisa Anderson",
    amount: "$780",
    status: "Failed",
    date: "May 13, 2026",
    method: "Credit Card",
  },
];

function Modal({
  open,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Save",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {children}
        </div>
        <div className="px-6 py-4 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {onSave && (
            <button
              onClick={onSave}
              className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              {saveLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function FinancePage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    type: "Booking Payment",
    description: "",
    amount: "",
    status: "Pending" as "Completed" | "Pending" | "Failed",
  });

  const totalRevenue = transactions
    .filter((t) => t.status === "Completed" && !t.amount.startsWith("-"))
    .reduce(
      (sum, t) => sum + parseInt(t.amount.replace("$", "").replace(",", "")),
      0,
    );
  const totalExpenses = transactions
    .filter((t) => t.amount.startsWith("-"))
    .reduce(
      (sum, t) =>
        sum +
        parseInt(t.amount.replace("-", "").replace("$", "").replace(",", "")),
      0,
    );
  const pendingPayments = transactions
    .filter((t) => t.status === "Pending")
    .reduce(
      (sum, t) => sum + parseInt(t.amount.replace("$", "").replace(",", "")),
      0,
    );
  const netRevenue = totalRevenue - totalExpenses;

  const handleAddTransaction = () => {
    const newTxn: Transaction = {
      id: `TXN-00${transactions.length + 1}`,
      ...form,
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      method: "Bank Transfer",
    };
    setTransactions([newTxn, ...transactions]);
    setModalOpen(false);
    setForm({
      type: "Booking Payment",
      description: "",
      amount: "",
      status: "Pending",
    });
  };

  const handleExport = () => {
    const csv = transactions
      .map(
        (t) =>
          `${t.id},${t.type},${t.description},${t.amount},${t.status},${t.date},${t.method}`,
      )
      .join("\n");
    const blob = new Blob(
      ["ID,Type,Description,Amount,Status,Date,Method\n" + csv],
      { type: "text/csv" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      (filter === "income" && !t.amount.startsWith("-")) ||
      (filter === "expense" && t.amount.startsWith("-")) ||
      filter === t.status.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Finance Management
          </h1>
          <div className="flex gap-2">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              <Plus className="w-4 h-4" />
              Add Transaction
            </button>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">
              ${totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Payments</p>
            <p className="text-2xl font-bold text-yellow-600">
              ${pendingPayments.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Net Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              ${netRevenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
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
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {txn.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {txn.type}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {txn.description}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm font-medium ${txn.amount.startsWith("-") ? "text-red-600" : "text-green-600"}`}
                  >
                    {txn.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {txn.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {txn.method}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        txn.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : txn.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Transaction"
        onSave={handleAddTransaction}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Booking Payment</option>
              <option>Refund</option>
              <option>Agent Commission</option>
              <option>Withdrawal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="$0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as any })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option>Completed</option>
              <option>Pending</option>
              <option>Failed</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
