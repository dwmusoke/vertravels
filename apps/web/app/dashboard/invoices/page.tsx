"use client";

import { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Download,
  Send,
  Eye,
  CheckCircle,
  Clock,
  DollarSign,
} from "lucide-react";

interface Invoice {
  id: string;
  number: string;
  customer: string;
  email: string;
  bookingId: string;
  amount: string;
  tax: string;
  total: string;
  date: string;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue" | "Cancelled";
  paymentMethod?: string;
  paidDate?: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-001",
    number: "VT2026-001",
    customer: "John Smith",
    email: "john@example.com",
    bookingId: "VT-001",
    amount: "$1,100",
    tax: "$134",
    total: "$1,234",
    date: "May 10, 2026",
    dueDate: "May 25, 2026",
    status: "Paid",
    paymentMethod: "Stripe",
    paidDate: "May 12, 2026",
  },
  {
    id: "INV-002",
    number: "VT2026-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    bookingId: "VT-002",
    amount: "$500",
    tax: "$67",
    total: "$567",
    date: "May 11, 2026",
    dueDate: "May 26, 2026",
    status: "Pending",
  },
  {
    id: "INV-003",
    number: "VT2026-003",
    customer: "Michael Brown",
    email: "michael@example.com",
    bookingId: "VT-003",
    amount: "$780",
    tax: "$110",
    total: "$890",
    date: "May 12, 2026",
    dueDate: "May 27, 2026",
    status: "Paid",
    paymentMethod: "PayPal",
    paidDate: "May 14, 2026",
  },
  {
    id: "INV-004",
    number: "VT2026-004",
    customer: "David Wilson",
    email: "david@example.com",
    bookingId: "VT-005",
    amount: "$1,400",
    tax: "$167",
    total: "$1,567",
    date: "Apr 15, 2026",
    dueDate: "Apr 30, 2026",
    status: "Overdue",
    paymentMethod: "",
    paidDate: "",
  },
  {
    id: "INV-005",
    number: "VT2026-005",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    bookingId: "VT-006",
    amount: "$1,500",
    tax: "$180",
    total: "$1,680",
    date: "May 15, 2026",
    dueDate: "May 30, 2026",
    status: "Pending",
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
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-xl">
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
            Close
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

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((i) => i.status === "Paid").length,
    pending: invoices.filter((i) => i.status === "Pending").length,
    revenue: invoices
      .filter((i) => i.status === "Paid")
      .reduce(
        (sum, i) => sum + parseInt(i.total.replace("$", "").replace(",", "")),
        0,
      ),
  };

  const filtered = invoices.filter((i) => {
    const matches =
      i.customer.toLowerCase().includes(search.toLowerCase()) ||
      i.number.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || i.status === filter;
    return matches && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Invoices Management
          </h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700">
            <Plus className="w-4 h-4" /> Create Invoice
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Invoices</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-2xl font-bold text-green-600">{stats.paid}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Collected</p>
            <p className="text-2xl font-bold text-sky-600">
              ${stats.revenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search invoices..."
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
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Invoice #
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Due Date
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
              {filtered.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inv.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {inv.bookingId}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {inv.total}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inv.date}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {inv.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${inv.status === "Paid" ? "bg-green-100 text-green-700" : inv.status === "Pending" ? "bg-yellow-100 text-yellow-700" : inv.status === "Overdue" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {inv.status === "Paid" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {inv.status === "Pending" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewInvoice(inv)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Send Email"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!viewInvoice}
        onClose={() => setViewInvoice(null)}
        title={`Invoice ${viewInvoice?.number}`}
      >
        {viewInvoice && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-bold">VerTravels</h3>
                <p className="text-sm text-gray-500">Kampala, Uganda</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">{viewInvoice.number}</p>
                <p className="text-sm text-gray-500">
                  Date: {viewInvoice.date}
                </p>
                <p className="text-sm text-gray-500">
                  Due: {viewInvoice.dueDate}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Bill To</p>
                <p className="font-medium">{viewInvoice.customer}</p>
                <p className="text-sm">{viewInvoice.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Booking Reference</p>
                <p className="font-medium">{viewInvoice.bookingId}</p>
              </div>
            </div>
            <div className="border-t pt-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Description</th>
                    <th className="text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2">Booking Fee</td>
                    <td className="text-right">{viewInvoice.amount}</td>
                  </tr>
                  <tr>
                    <td className="py-2">Tax (12%)</td>
                    <td className="text-right">{viewInvoice.tax}</td>
                  </tr>
                  <tr className="border-t font-bold">
                    <td className="py-2">Total</td>
                    <td className="text-right">{viewInvoice.total}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <Send className="w-4 h-4" /> Send via Email
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
