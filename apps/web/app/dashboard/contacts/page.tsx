"use client";

import { useState } from "react";
import { Mail, Phone, Search, User, X, Send } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: "New" | "Read" | "Replied";
  date: string;
}

const contacts: Contact[] = [
  {
    id: "CNT-001",
    name: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    subject: "Booking Inquiry",
    message:
      "I want to book a flight to London for my family. Can you help with the options?",
    status: "New",
    date: "May 20, 2026",
  },
  {
    id: "CNT-002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    subject: "Refund Request",
    message:
      "I had to cancel my trip due to emergency. Please process my refund within 14 days.",
    status: "Replied",
    date: "May 19, 2026",
  },
  {
    id: "CNT-003",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    subject: "Support",
    message: "Need help with my booking VT-005. The payment didn't go through.",
    status: "Read",
    date: "May 18, 2026",
  },
  {
    id: "CNT-004",
    name: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 893",
    subject: "Partnership",
    message:
      "We are a travel agency looking to partner with VerTravels. Let's discuss.",
    status: "New",
    date: "May 17, 2026",
  },
  {
    id: "CNT-005",
    name: "David Wilson",
    email: "david@example.com",
    phone: "+1 234 567 894",
    subject: "Visa Assistance",
    message: "Do you provide visa assistance for UK tourist visa?",
    status: "Read",
    date: "May 16, 2026",
  },
];

function Modal({
  open,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Send Reply",
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

export default function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);
  const [reply, setReply] = useState("");

  const handleReply = () => {
    if (selected && reply.trim()) {
      alert("Reply sent successfully!");
      setReply("");
      setSelected(null);
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Contacts / Messages
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {contacts.filter((c) => c.status === "New").length} unread
            </span>
          </div>
        </div>
      </header>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
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
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelected(contact)}
                  className={`hover:bg-gray-50 cursor-pointer ${contact.status === "New" ? "bg-red-50" : ""}`}
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.id}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                        <span className="text-xs font-medium text-sky-600">
                          {contact.name[0]}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{contact.name}</p>
                        <p className="text-xs text-gray-500">{contact.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contact.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {contact.date}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        contact.status === "New"
                          ? "bg-red-100 text-red-700"
                          : contact.status === "Replied"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title="Message Details"
        onSave={handleReply}
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900 font-medium">{selected.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-gray-900">{selected.date}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {selected.email}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {selected.phone}
                </p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Subject
              </label>
              <p className="text-gray-900 font-medium">{selected.subject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Message
              </label>
              <p className="text-gray-900 p-4 bg-gray-50 rounded-lg">
                {selected.message}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reply
              </label>
              <textarea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type your reply..."
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
