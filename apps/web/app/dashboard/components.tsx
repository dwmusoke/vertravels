"use client";

import { useState, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
} from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  onSave?: () => void;
  saveLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  onSave,
  saveLabel = "Save",
}: ModalProps) {
  if (!isOpen) return null;
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

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}

export function ImageUpload({
  value,
  onChange,
  label = "Image",
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1000));
    const url = URL.createObjectURL(file);
    onChange(url);
    setUploading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {value ? (
        <div className="relative border rounded-lg overflow-hidden">
          <img
            src={value}
            alt="Uploaded"
            className="w-full h-48 object-cover"
          />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
            dragActive ? "border-sky-500 bg-sky-50" : "border-gray-300"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={handleDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleUpload(e.target.files[0])
            }
          />
          {uploading ? (
            <div className="text-sky-600">Uploading...</div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="text-sky-600 hover:underline"
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              Click or drag image to upload
            </button>
          )}
        </div>
      )}
    </div>
  );
}

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
    message: "I want to book a flight to London...",
    status: "New",
    date: "May 20, 2026",
  },
  {
    id: "CNT-002",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    subject: "Refund Request",
    message: "Please process my refund...",
    status: "Replied",
    date: "May 19, 2026",
  },
  {
    id: "CNT-003",
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    subject: "Support",
    message: "Need help with my booking...",
    status: "Read",
    date: "May 18, 2026",
  },
];

export function ContactsPage() {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Contact | null>(null);

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Contacts / Messages
          </h1>
        </div>
      </header>
      <div className="p-6">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
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
              {contacts.map((contact) => (
                <tr
                  key={contact.id}
                  onClick={() => setSelected(contact)}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contact.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contact.subject}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
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
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title="Contact Details"
        saveLabel="Reply"
      >
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="text-gray-900">{selected.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="text-gray-900">{selected.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="text-gray-900">{selected.phone}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Date
                </label>
                <p className="text-gray-900">{selected.date}</p>
              </div>
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
              <label className="block text-sm font-medium text-gray-500 mb-2">
                Reply
              </label>
              <textarea
                rows={4}
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
