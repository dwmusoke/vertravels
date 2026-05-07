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
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bookings: string;
  totalSpent: string;
  status: "Active" | "Inactive";
  image?: string;
}

const initialCustomers: Customer[] = [
  {
    id: "C001",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    bookings: "5",
    totalSpent: "$4,500",
    status: "Active",
  },
  {
    id: "C002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    bookings: "3",
    totalSpent: "$2,100",
    status: "Active",
  },
  {
    id: "C003",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    bookings: "2",
    totalSpent: "$1,800",
    status: "Active",
  },
  {
    id: "C004",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 893",
    bookings: "1",
    totalSpent: "$890",
    status: "Inactive",
  },
  {
    id: "C005",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 234 567 894",
    bookings: "8",
    totalSpent: "$6,200",
    status: "Active",
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

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    status: "Active" as "Active" | "Inactive",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({ name: "", email: "", phone: "", status: "Active" });
    setModalOpen(true);
  };
  const openEdit = (c: Customer) => {
    setIsNew(false);
    setEditCustomer(c);
    setForm({ name: c.name, email: c.email, phone: c.phone, status: c.status });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (isNew)
      setCustomers([
        ...customers,
        {
          id: `C00${customers.length + 1}`,
          ...form,
          bookings: "0",
          totalSpent: "$0",
        },
      ]);
    else
      setCustomers(
        customers.map((c) =>
          c.id === editCustomer?.id ? { ...c, ...form } : c,
        ),
      );
    setModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this customer?"))
      setCustomers(customers.filter((c) => c.id !== id));
  };
  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Customers Management
          </h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Customer
          </button>
        </div>
      </header>
      <div className="p-6">
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
            <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Total Spent
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
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.bookings}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${c.totalSpent}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
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
        title={isNew ? "Add Customer" : "Edit Customer"}
        onSave={handleSave}
      >
        <div className="space-y-4">
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
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm({
                  ...form,
                  status: e.target.value as "Active" | "Inactive",
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
