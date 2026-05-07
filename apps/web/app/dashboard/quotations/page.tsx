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
  Copy,
} from "lucide-react";

interface Quotation {
  id: string;
  number: string;
  customer: string;
  email: string;
  destination: string;
  pax: string;
  days: string;
  amount: string;
  date: string;
  validUntil: string;
  status: "Draft" | "Sent" | "Accepted" | "Rejected" | "Expired";
  notes?: string;
}

const quotations: Quotation[] = [
  {
    id: "QT-001",
    number: "VTQ-2026-001",
    customer: "John Smith",
    email: "john@example.com",
    destination: "London, UK",
    pax: "2",
    days: "7",
    amount: "$2,400",
    date: "May 18, 2026",
    validUntil: "May 25, 2026",
    status: "Sent",
    notes: "Business class flights + hotel",
  },
  {
    id: "QT-002",
    number: "VTQ-2026-002",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    destination: "Dubai",
    pax: "1",
    days: "5",
    amount: "$1,200",
    date: "May 17, 2026",
    validUntil: "May 24, 2026",
    status: "Draft",
  },
  {
    id: "QT-003",
    number: "VTQ-2026-003",
    customer: "Mike Wilson",
    email: "mike@example.com",
    destination: "Masai Mara Safari",
    pax: "4",
    days: "5",
    amount: "$4,500",
    date: "May 16, 2026",
    validUntil: "May 23, 2026",
    status: "Accepted",
  },
  {
    id: "QT-004",
    number: "VTQ-2026-004",
    customer: "Emma Davis",
    email: "emma@example.com",
    destination: "Kigali",
    pax: "2",
    days: "3",
    amount: "$980",
    date: "May 15, 2026",
    validUntil: "May 22, 2026",
    status: "Rejected",
    notes: "Budget too high",
  },
  {
    id: "QT-005",
    number: "VTQ-2026-005",
    customer: "Robert Brown",
    email: "robert@example.com",
    destination: "Addis Ababa",
    pax: "3",
    days: "10",
    amount: "$5,600",
    date: "May 19, 2026",
    validUntil: "May 26, 2026",
    status: "Sent",
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

export default function QuotationsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewQuote, setViewQuote] = useState<Quotation | null>(null);
  const [form, setForm] = useState({
    customer: "",
    email: "",
    destination: "",
    pax: "1",
    days: "1",
    amount: "",
    notes: "",
  });

  const stats = {
    total: quotations.length,
    drafts: quotations.filter((q) => q.status === "Draft").length,
    sent: quotations.filter((q) => q.status === "Sent").length,
    accepted: quotations.filter((q) => q.status === "Accepted").length,
  };

  const handleCreateQuote = () => {
    setModalOpen(false);
    setForm({
      customer: "",
      email: "",
      destination: "",
      pax: "1",
      days: "1",
      amount: "",
      notes: "",
    });
  };

  const filtered = quotations.filter((q) => {
    const matches =
      q.customer.toLowerCase().includes(search.toLowerCase()) ||
      q.number.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || q.status === filter;
    return matches && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Quotations Management
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" /> Create Quotation
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Quotes</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-gray-600">{stats.drafts}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Sent</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.sent}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Accepted</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.accepted}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search quotations..."
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
              <option value="Draft">Draft</option>
              <option value="Sent">Sent</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
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
                  Pax/Days
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
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
              {filtered.map((q) => (
                <tr key={q.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {q.number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {q.customer}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {q.destination}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {q.pax} Pax / {q.days} Days
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {q.amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {q.validUntil}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${q.status === "Accepted" ? "bg-green-100 text-green-700" : q.status === "Sent" ? "bg-yellow-100 text-yellow-700" : q.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {q.status === "Draft" && (
                        <FileText className="w-3 h-3 inline mr-1" />
                      )}
                      {q.status === "Sent" && (
                        <Send className="w-3 h-3 inline mr-1" />
                      )}
                      {q.status === "Accepted" && (
                        <CheckCircle className="w-3 h-3 inline mr-1" />
                      )}
                      {q.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewQuote(q)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Copy"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                        title="Send"
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
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create New Quotation"
        onSave={handleCreateQuote}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              value={form.destination}
              onChange={(e) =>
                setForm({ ...form, destination: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Pax
              </label>
              <input
                type="text"
                value={form.pax}
                onChange={(e) => setForm({ ...form, pax: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Days
              </label>
              <input
                type="text"
                value={form.days}
                onChange={(e) => setForm({ ...form, days: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quoted Amount
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
              Notes
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!viewQuote}
        onClose={() => setViewQuote(null)}
        title={`Quotation ${viewQuote?.number}`}
      >
        {viewQuote && (
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <h3 className="text-xl font-bold">Quotation</h3>
                <p className="text-sm text-gray-500">VerTravels</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{viewQuote.number}</p>
                <p className="text-sm text-gray-500">Date: {viewQuote.date}</p>
                <p className="text-sm text-gray-500">
                  Valid Until: {viewQuote.validUntil}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{viewQuote.customer}</p>
                <p className="text-sm">{viewQuote.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Destination</p>
                <p className="font-medium">{viewQuote.destination}</p>
                <p className="text-sm">
                  {viewQuote.pax} Pax, {viewQuote.days} Days
                </p>
              </div>
            </div>
            {viewQuote.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="p-3 bg-gray-50 rounded-lg">{viewQuote.notes}</p>
              </div>
            )}
            <div className="border-t pt-4 flex justify-between">
              <p className="font-bold text-lg">Total Quote</p>
              <p className="font-bold text-lg">{viewQuote.amount}</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2">
                <Download className="w-4 h-4" /> Export PDF
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <Copy className="w-4 h-4" /> Duplicate
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <Send className="w-4 h-4" /> Send to Customer
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
