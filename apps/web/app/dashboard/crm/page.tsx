"use client";

import { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
  Star,
  Clock,
  FileText,
  DollarSign,
  Calendar,
} from "lucide-react";

interface CustomerCRM {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalBookings: number;
  totalSpent: string;
  lastBooking: string;
  status: "Active" | "Inactive" | "VIP";
  source: string;
  notes: string;
  tags: string[];
}

const crmData: CustomerCRM[] = [
  {
    id: "C001",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    location: "London, UK",
    totalBookings: 5,
    totalSpent: "$4,500",
    lastBooking: "May 15, 2026",
    status: "VIP",
    source: "Website",
    notes: "Frequent business traveler",
    tags: ["business", "flight"],
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    location: "New York, USA",
    totalBookings: 3,
    totalSpent: "$2,100",
    lastBooking: "May 18, 2026",
    status: "Active",
    source: "Agent",
    notes: "Prefers luxury hotels",
    tags: ["luxury", "hotel"],
  },
  {
    id: "C003",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    location: "Dubai, UAE",
    totalBookings: 2,
    totalSpent: "$1,800",
    lastBooking: "May 20, 2026",
    status: "Active",
    source: "Website",
    notes: "",
    tags: ["tour"],
  },
  {
    id: "C004",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 893",
    location: "Sydney, Australia",
    totalBookings: 1,
    totalSpent: "$890",
    lastBooking: "Apr 10, 2026",
    status: "Inactive",
    source: "Website",
    notes: "Hasn't booked recently",
    tags: [],
  },
  {
    id: "C005",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 234 567 894",
    location: "Toronto, Canada",
    totalBookings: 8,
    totalSpent: "$6,200",
    lastBooking: "May 22, 2026",
    status: "VIP",
    source: "Referral",
    notes: "High value repeat customer",
    tags: ["business", "flight", "hotel"],
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

export default function CRMPage() {
  const [customers, setCustomers] = useState<CustomerCRM[]>(crmData);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewCustomer, setViewCustomer] = useState<CustomerCRM | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Active" as "Active" | "Inactive" | "VIP",
    source: "",
    notes: "",
    tags: "",
  });

  const stats = {
    total: customers.length,
    vip: customers.filter((c) => c.status === "VIP").length,
    active: customers.filter((c) => c.status === "Active").length,
    revenue: customers.reduce(
      (sum, c) =>
        sum + parseInt(c.totalSpent.replace("$", "").replace(",", "")),
      0,
    ),
  };

  const handleAdd = () => {
    const newCust: CustomerCRM = {
      id: `C00${customers.length + 1}`,
      ...form,
      totalBookings: 0,
      totalSpent: "$0",
      lastBooking: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
    };
    setCustomers([newCust, ...customers]);
    setModalOpen(false);
    setForm({
      name: "",
      email: "",
      phone: "",
      location: "",
      status: "Active",
      source: "",
      notes: "",
      tags: "",
    });
  };

  const filtered = customers.filter((c) => {
    const matches =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || c.status === filter;
    return matches && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            CRM - Customer Management
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">VIP Customers</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.vip}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Active Customers</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Revenue</p>
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
                placeholder="Search customers..."
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
              <option value="VIP">VIP</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Spent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Last Booking
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
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => setViewCustomer(c)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.totalBookings}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${c.totalSpent}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {c.lastBooking}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${c.status === "VIP" ? "bg-yellow-100 text-yellow-700" : c.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {c.status === "VIP" && (
                        <Star className="w-3 h-3 inline mr-1" />
                      )}
                      {c.status}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-sky-600 hover:bg-sky-50 rounded">
                        <Mail className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-sky-600 hover:bg-sky-50 rounded">
                        <FileText className="w-4 h-4" />
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
        title="Add Customer"
        onSave={handleAdd}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
                <option>VIP</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <input
                type="text"
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Website, Agent, Referral"
              />
            </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="business, flight, hotel"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={!!viewCustomer}
        onClose={() => setViewCustomer(null)}
        title="Customer Details"
      >
        {viewCustomer && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">{viewCustomer.name}</h3>
                <p className="text-gray-500">{viewCustomer.email}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full ${viewCustomer.status === "VIP" ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}
              >
                {viewCustomer.status}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{viewCustomer.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="font-medium">{viewCustomer.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Bookings</p>
                <p className="font-medium">{viewCustomer.totalBookings}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="font-medium text-green-600">
                  ${viewCustomer.totalSpent}
                </p>
              </div>
            </div>
            {viewCustomer.notes && (
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="p-3 bg-gray-50 rounded-lg">
                  {viewCustomer.notes}
                </p>
              </div>
            )}
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-sky-600 text-white rounded-lg flex items-center gap-2">
                <Mail className="w-4 h-4" /> Send Email
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <FileText className="w-4 h-4" /> Create Quotation
              </button>
              <button className="px-4 py-2 border rounded-lg flex items-center gap-2">
                <DollarSign className="w-4 h-4" /> Check Invoices
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
