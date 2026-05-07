"use client";

import { useState } from "react";
import {
  MapPin,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Upload,
} from "lucide-react";

interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: string;
  status: "Active" | "Pending";
  bookings: string;
  image?: string;
  description?: string;
}

const initialTours: Tour[] = [
  {
    id: "VT-T001",
    name: "Safari Adventure",
    location: "Masai Mara, Kenya",
    duration: "5 Days",
    price: "$1,500",
    status: "Active",
    bookings: "23",
    description: "Experience the great migration",
  },
  {
    id: "VT-T002",
    name: "Gorilla Trekking",
    location: "Bwindi, Uganda",
    duration: "3 Days",
    price: "$890",
    status: "Active",
    bookings: "18",
    description: "Trek with mountain gorillas",
  },
  {
    id: "VT-T003",
    name: "Dubai City Tour",
    location: "Dubai, UAE",
    duration: "1 Day",
    price: "$200",
    status: "Active",
    bookings: "45",
    description: "City highlights tour",
  },
  {
    id: "VT-T004",
    name: "Volcano Hike",
    location: "Rwanda",
    duration: "2 Days",
    price: "$350",
    status: "Pending",
    bookings: "0",
    description: "Hike the Virunga volcanoes",
  },
  {
    id: "VT-T005",
    name: "Historical Ethiopia",
    location: "Addis Ababa, Ethiopia",
    duration: "7 Days",
    price: "$1,200",
    status: "Active",
    bookings: "12",
    description: "Explore ancient history",
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

function ImageUpload({
  value,
  onChange,
  label = "Image",
}: {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleUpload = async (file: File) => {
    setUploading(true);
    await new Promise((r) => setTimeout(r, 1000));
    onChange(URL.createObjectURL(file));
    setUploading(false);
  };
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {value ? (
        <div className="relative border rounded-lg overflow-hidden">
          <img src={value} alt="" className="w-full h-48 object-cover" />
          <button
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
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
              className="text-sky-600"
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              Click to upload
            </button>
          )}
        </div>
      )}
    </div>
  );
}

import { useRef } from "react";

export default function ToursPage() {
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editTour, setEditTour] = useState<Tour | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    name: "",
    location: "",
    duration: "",
    price: "",
    status: "Active" as "Active" | "Pending",
    image: "",
    description: "",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({
      name: "",
      location: "",
      duration: "",
      price: "",
      status: "Active",
      image: "",
      description: "",
    });
    setModalOpen(true);
  };
  const openEdit = (t: Tour) => {
    setIsNew(false);
    setEditTour(t);
    setForm({
      name: t.name,
      location: t.location,
      duration: t.duration,
      price: t.price,
      status: t.status,
      image: t.image || "",
      description: t.description || "",
    });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (isNew)
      setTours([
        ...tours,
        { id: `VT-T00${tours.length + 1}`, ...form, bookings: "0" },
      ]);
    else
      setTours(
        tours.map((t) => (t.id === editTour?.id ? { ...t, ...form } : t)),
      );
    setModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this tour?"))
      setTours(tours.filter((t) => t.id !== id));
  };
  const filtered = tours.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Tours Management</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Tour
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
                placeholder="Search tours..."
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
                  Image
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tour Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Bookings
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
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {t.image ? (
                      <img
                        src={t.image}
                        alt={t.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.duration}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {t.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {t.bookings}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${t.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(t)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id)}
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
        title={isNew ? "Add Tour" : "Edit Tour"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tour Name
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
              Duration
            </label>
            <input
              type="text"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="text"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
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
          <ImageUpload
            value={form.image}
            onChange={(image) => setForm({ ...form, image })}
          />
        </div>
      </Modal>
    </div>
  );
}
