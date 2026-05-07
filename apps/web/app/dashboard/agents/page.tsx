"use client";

import { useState } from "react";
import {
  UserCheck,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  location: string;
  phone: string;
  bookings: string;
  revenue: string;
  status: "Active" | "Pending";
}

const initialAgents: Agent[] = [
  {
    id: "A001",
    name: "Travel Hub Uganda",
    email: "info@travelhub.ug",
    location: "Kampala",
    phone: "+256 789 123 456",
    bookings: "45",
    revenue: "$12,500",
    status: "Active",
  },
  {
    id: "A002",
    name: "Kenya Tours Ltd",
    email: "bookings@kenyatours.co.ke",
    location: "Nairobi",
    phone: "+254 789 123 456",
    bookings: "38",
    revenue: "$9,800",
    status: "Active",
  },
  {
    id: "A003",
    name: "Dubai Travel",
    email: "admin@dubaitravel.ae",
    location: "Dubai",
    phone: "+971 789 123 456",
    bookings: "52",
    revenue: "$15,200",
    status: "Active",
  },
  {
    id: "A004",
    name: "Rwanda Express",
    email: "sales@rwandexpress.rw",
    location: "Kigali",
    phone: "+250 789 123 456",
    bookings: "0",
    revenue: "$0",
    status: "Pending",
  },
  {
    id: "A005",
    name: "Ethiopia Safaris",
    email: "info@ethiopiasafaris.et",
    location: "Addis Ababa",
    phone: "+251 789 123 456",
    bookings: "21",
    revenue: "$5,600",
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

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editAgent, setEditAgent] = useState<Agent | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    location: "",
    phone: "",
    status: "Active" as "Active" | "Pending",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({ name: "", email: "", location: "", phone: "", status: "Active" });
    setModalOpen(true);
  };
  const openEdit = (a: Agent) => {
    setIsNew(false);
    setEditAgent(a);
    setForm({
      name: a.name,
      email: a.email,
      location: a.location,
      phone: a.phone,
      status: a.status,
    });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (isNew)
      setAgents([
        ...agents,
        {
          id: `A00${agents.length + 1}`,
          ...form,
          bookings: "0",
          revenue: "$0",
        },
      ]);
    else
      setAgents(
        agents.map((a) => (a.id === editAgent?.id ? { ...a, ...form } : a)),
      );
    setModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this agent?"))
      setAgents(agents.filter((a) => a.id !== id));
  };
  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Agents Management</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Agent
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
                placeholder="Search agents..."
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
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bookings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Revenue
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
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {a.id}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {a.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{a.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {a.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {a.bookings}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    ${a.revenue}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${a.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(a)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
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
        title={isNew ? "Add Agent" : "Edit Agent"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Agency Name
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
              Location
            </label>
            <input
              type="text"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
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
                  status: e.target.value as "Active" | "Pending",
                })
              }
              className="w-full px-4 py-2 border rounded-lg"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
