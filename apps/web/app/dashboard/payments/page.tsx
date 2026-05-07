"use client";

import { useState } from "react";
import {
  DollarSign,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Upload,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  Eye,
} from "lucide-react";

interface Payment {
  id: string;
  bookingId: string;
  customer: string;
  amount: string;
  method: "Stripe" | "PayPal" | "Bank Transfer" | "Credit Card" | "Cash";
  status: "Completed" | "Pending" | "Failed" | "Refunded";
  date: string;
  transactionId?: string;
  pnrNumber?: string;
  pnrFile?: string;
  reference: string;
}

const payments: Payment[] = [
  {
    id: "PAY-001",
    bookingId: "VT-001",
    customer: "John Smith",
    amount: "$1,234",
    method: "Stripe",
    status: "Completed",
    date: "May 12, 2026",
    transactionId: "txn_abc123",
    pnrNumber: "UG123",
    reference: "VT2026-001",
  },
  {
    id: "PAY-002",
    bookingId: "VT-002",
    customer: "Sarah Johnson",
    amount: "$567",
    method: "PayPal",
    status: "Pending",
    date: "May 13, 2026",
    reference: "VT2026-002",
  },
  {
    id: "PAY-003",
    bookingId: "VT-003",
    customer: "Michael Brown",
    amount: "$890",
    method: "Credit Card",
    status: "Completed",
    date: "May 14, 2026",
    transactionId: "txn_def456",
    pnrNumber: "UG456",
    reference: "VT2026-003",
  },
  {
    id: "PAY-004",
    bookingId: "VT-004",
    customer: "Emily Davis",
    amount: "$240",
    method: "Bank Transfer",
    status: "Completed",
    date: "May 15, 2026",
    transactionId: "bnk_ghi789",
    reference: "VT2026-004",
  },
  {
    id: "PAY-005",
    bookingId: "VT-005",
    customer: "David Wilson",
    amount: "$1,567",
    method: "Stripe",
    status: "Refunded",
    date: "May 10, 2026",
    transactionId: "txn_jkl012",
    pnrNumber: "UG789",
    reference: "VT2026-005",
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

export default function PaymentsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  const [form, setForm] = useState({
    bookingId: "",
    customer: "",
    amount: "",
    method: "Stripe" as
      | "Stripe"
      | "PayPal"
      | "Bank Transfer"
      | "Credit Card"
      | "Cash",
    pnrNumber: "",
  });
  const [uploadingPnr, setUploadingPnr] = useState<string | null>(null);

  const stats = {
    total: payments.length,
    completed: payments.filter((p) => p.status === "Completed").length,
    pending: payments.filter((p) => p.status === "Pending").length,
    revenue: payments
      .filter((p) => p.status === "Completed")
      .reduce(
        (sum, p) => sum + parseInt(p.amount.replace("$", "").replace(",", "")),
        0,
      ),
  };

  const handleProcessPayment = () => {
    setModalOpen(false);
    setForm({
      bookingId: "",
      customer: "",
      amount: "",
      method: "Stripe",
      pnrNumber: "",
    });
  };

  const filtered = payments.filter((p) => {
    const matches =
      p.customer.toLowerCase().includes(search.toLowerCase()) ||
      p.bookingId.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || p.status === filter;
    return matches && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Payments & PNR Management
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" /> Record Payment
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Processed</p>
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
                placeholder="Search payments..."
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
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  PNR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
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
              {filtered.map((pay) => (
                <tr key={pay.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pay.bookingId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pay.customer}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {pay.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {pay.method}
                  </td>
                  <td className="px-6 py-4">
                    {pay.pnrNumber ? (
                      <span className="px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded flex items-center gap-1 w-fit">
                        <FileText className="w-3 h-3" /> {pay.pnrNumber}
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        Not uploaded
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {pay.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${pay.status === "Completed" ? "bg-green-100 text-green-700" : pay.status === "Pending" ? "bg-yellow-100 text-yellow-700" : pay.status === "Refunded" ? "bg-gray-100 text-gray-700" : "bg-red-100 text-red-700"}`}
                    >
                      {pay.status === "Completed" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {pay.status === "Pending" && (
                        <Clock className="w-3 h-3 inline mr-1" />
                      )}
                      {pay.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewPayment(pay)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!pay.pnrNumber && (
                        <button
                          className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                          title="Upload PNR"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Process Refund"
                      >
                        <RefreshCw className="w-4 h-4" />
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record New Payment"
        onSave={handleProcessPayment}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking ID
              </label>
              <input
                type="text"
                value={form.bookingId}
                onChange={(e) =>
                  setForm({ ...form, bookingId: e.target.value })
                }
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer Name
              </label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                Payment Method
              </label>
              <select
                value={form.method}
                onChange={(e) =>
                  setForm({ ...form, method: e.target.value as any })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option>Stripe</option>
                <option>PayPal</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Cash</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              PNR Number (optional)
            </label>
            <input
              type="text"
              value={form.pnrNumber}
              onChange={(e) => setForm({ ...form, pnrNumber: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., UG123ABC"
            />
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-500">
              Drag & drop PNR document here or
            </p>
            <button className="text-sky-600 text-sm hover:underline mt-1">
              Browse files
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!viewPayment}
        onClose={() => setViewPayment(null)}
        title="Payment Details"
      >
        {viewPayment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Booking ID</p>
                <p className="font-medium">{viewPayment.bookingId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Reference</p>
                <p className="font-medium">{viewPayment.reference}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{viewPayment.customer}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium text-lg text-green-600">
                  {viewPayment.amount}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <p className="font-medium">{viewPayment.method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-medium">{viewPayment.date}</p>
              </div>
              {viewPayment.transactionId && (
                <div>
                  <p className="text-sm text-gray-500">Transaction ID</p>
                  <p className="font-mono text-sm">
                    {viewPayment.transactionId}
                  </p>
                </div>
              )}
            </div>
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">PNR Information</p>
              {viewPayment.pnrNumber ? (
                <div className="flex items-center gap-2 p-3 bg-sky-50 rounded-lg">
                  <FileText className="w-5 h-5 text-sky-600" />
                  <span className="font-medium text-sky-700">
                    {viewPayment.pnrNumber}
                  </span>
                </div>
              ) : (
                <div className="text-center p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500">PNR not uploaded</p>
                  <button className="text-sky-600 text-sm hover:underline mt-2">
                    Upload PNR Document
                  </button>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2">
                <CreditCard className="w-4 h-4" /> Process Payment
              </button>
              {viewPayment.status === "Completed" && (
                <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Issue Refund
                </button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
