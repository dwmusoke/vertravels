"use client";

import { useState, useRef } from "react";
import {
  Car,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Upload,
} from "lucide-react";

interface CarData {
  id: string;
  model: string;
  location: string;
  price: string;
  status: "Active" | "Pending";
  bookings: string;
  image?: string;
  features?: string;
}

const initialCars: CarData[] = [
  {
    id: "VT-C001",
    model: "Toyota Prado",
    location: "Kampala, Uganda",
    price: "$80/day",
    status: "Active",
    bookings: "15",
    features: "4x4, A/C, Auto",
  },
  {
    id: "VT-C002",
    model: "Toyota Land Cruiser",
    location: "Nairobi, Kenya",
    price: "$100/day",
    status: "Active",
    bookings: "22",
    features: "4x4, Leather, Auto",
  },
  {
    id: "VT-C003",
    model: "Mercedes S-Class",
    location: "Dubai, UAE",
    price: "$150/day",
    status: "Active",
    bookings: "18",
    features: "Luxury, WiFi, Auto",
  },
  {
    id: "VT-C004",
    model: "Nissan X-Trail",
    location: "Kigali, Rwanda",
    price: "$60/day",
    status: "Pending",
    bookings: "0",
    features: "SUV, A/C, Manual",
  },
  {
    id: "VT-C005",
    model: "Ford Explorer",
    location: "Addis Ababa, Ethiopia",
    price: "$75/day",
    status: "Active",
    bookings: "12",
    features: "SUV, 4x4, Auto",
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

export default function CarsPage() {
  const [cars, setCars] = useState<CarData[]>(initialCars);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editCar, setEditCar] = useState<CarData | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [form, setForm] = useState({
    model: "",
    location: "",
    price: "",
    status: "Active" as "Active" | "Pending",
    image: "",
    features: "",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({
      model: "",
      location: "",
      price: "",
      status: "Active",
      image: "",
      features: "",
    });
    setModalOpen(true);
  };
  const openEdit = (c: CarData) => {
    setIsNew(false);
    setEditCar(c);
    setForm({
      model: c.model,
      location: c.location,
      price: c.price,
      status: c.status,
      image: c.image || "",
      features: c.features || "",
    });
    setModalOpen(true);
  };
  const handleSave = () => {
    if (isNew)
      setCars([
        ...cars,
        { id: `VT-C00${cars.length + 1}`, ...form, bookings: "0" },
      ]);
    else
      setCars(cars.map((c) => (c.id === editCar?.id ? { ...c, ...form } : c)));
    setModalOpen(false);
  };
  const handleDelete = (id: string) => {
    if (confirm("Delete this car?")) setCars(cars.filter((c) => c.id !== id));
  };
  const filtered = cars.filter(
    (c) =>
      c.model.toLowerCase().includes(search.toLowerCase()) ||
      c.location.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Cars Management</h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Car
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
                placeholder="Search cars..."
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
                  Model
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Price/Day
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
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {c.image ? (
                      <img
                        src={c.image}
                        alt={c.model}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Car className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.model}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.location}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {c.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {c.bookings}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${c.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}
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
        title={isNew ? "Add Car" : "Edit Car"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Car Model
            </label>
            <input
              type="text"
              value={form.model}
              onChange={(e) => setForm({ ...form, model: e.target.value })}
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
              Price/Day
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
              Features
            </label>
            <input
              type="text"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., 4x4, A/C, Auto"
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
