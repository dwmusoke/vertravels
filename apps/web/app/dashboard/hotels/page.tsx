"use client";

import { useState, useRef } from "react";
import {
  Hotel,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Upload,
} from "lucide-react";

interface HotelData {
  id: string;
  name: string;
  location: string;
  rooms: number;
  price: string;
  status: "Active" | "Pending";
  bookings: string;
  image?: string;
}

const initialHotels: HotelData[] = [
  {
    id: "VT-H001",
    name: "Serena Hotel Kampala",
    location: "Kampala, Uganda",
    rooms: 120,
    price: "$150",
    status: "Active",
    bookings: "34",
  },
  {
    id: "VT-H002",
    name: "Mövenpick Dubai",
    location: "Dubai, UAE",
    rooms: 250,
    price: "$280",
    status: "Active",
    bookings: "56",
  },
  {
    id: "VT-H003",
    name: "Safari Lodge Kenya",
    location: "Masai Mara, Kenya",
    rooms: 30,
    price: "$200",
    status: "Active",
    bookings: "28",
  },
  {
    id: "VT-H004",
    name: "Kigali Marriott",
    location: "Kigali, Rwanda",
    rooms: 180,
    price: "$220",
    status: "Pending",
    bookings: "0",
  },
  {
    id: "VT-H005",
    name: "Addis Ababa Hilton",
    location: "Addis Ababa, Ethiopia",
    rooms: 200,
    price: "$180",
    status: "Active",
    bookings: "45",
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

export default function HotelsPage() {
  const [hotels, setHotels] = useState<HotelData[]>(initialHotels);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editHotel, setEditHotel] = useState<HotelData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useForm({
    name: "",
    location: "",
    rooms: 0,
    price: "",
    status: "Active" as "Active" | "Pending",
    image: "",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({
      name: "",
      location: "",
      rooms: 0,
      price: "",
      status: "Active",
      image: "",
    });
    setModalOpen(true);
  };
  const openEdit = (h: HotelData) => {
    setIsNew(false);
    setEditHotel(h);
    setForm({
      name: h.name,
      location: h.location,
      rooms: h.rooms,
      price: h.price,
      status: h.status,
      image: h.image || "",
    });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (isNew)
      setHotels([
        ...hotels,
        { id: `VT-H00${hotels.length + 1}`, ...form, bookings: "0" },
      ]);
    else
      setHotels(
        hotels.map((h) => (h.id === editHotel?.id ? { ...h, ...form } : h)),
      );
    setModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this hotel?"))
      setHotels(hotels.filter((h) => h.id !== id));
  };
  const filtered = hotels.filter(
    (h) =>
      h.name.toLowerCase().includes(search.toLowerCase()) ||
      h.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Hotels Management</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Hotel
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
                placeholder="Search hotels..."
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
                  Hotel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Rooms
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
              {filtered.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {h.image ? (
                      <img
                        src={h.image}
                        alt={h.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Hotel className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {h.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {h.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{h.rooms}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {h.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {h.bookings}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${h.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
                    >
                      {h.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(h)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(h.id)}
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
        title={isNew ? "Add Hotel" : "Edit Hotel"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hotel Name
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
              Rooms
            </label>
            <input
              type="number"
              value={form.rooms}
              onChange={(e) =>
                setForm({ ...form, rooms: parseInt(e.target.value) })
              }
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price/Night
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

function useForm<T extends Record<string, any>>(initial: T) {
  const [form, setForm] = useState<T>(initial);
  return [form, setForm] as const;
}
