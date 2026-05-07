"use client";

import { useState, useRef } from "react";
import {
  Plane,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

interface Flight {
  id: string;
  airline: string;
  route: string;
  price: string;
  status: "Active" | "Pending";
  bookings: string;
  image?: string;
}

const initialFlights: Flight[] = [
  {
    id: "VT-F001",
    airline: "Uganda Airlines",
    route: "EBB → LON",
    price: "$1,234",
    status: "Active",
    bookings: "45",
  },
  {
    id: "VT-F002",
    airline: "Kenya Airways",
    route: "NBO → JFK",
    price: "$1,567",
    status: "Active",
    bookings: "32",
  },
  {
    id: "VT-F003",
    airline: "Ethiopian Airlines",
    route: "ADD → CDG",
    price: "$890",
    status: "Active",
    bookings: "28",
  },
  {
    id: "VT-F004",
    airline: "Rwanda Air",
    route: "KGL → DXB",
    price: "$756",
    status: "Pending",
    bookings: "0",
  },
  {
    id: "VT-F005",
    airline: "Emirates",
    route: "DXB → LHR",
    price: "$2,100",
    status: "Active",
    bookings: "67",
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
    const url = URL.createObjectURL(file);
    onChange(url);
    setUploading(false);
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
              className="text-sky-600 hover:underline"
            >
              <Upload className="w-8 h-8 mx-auto mb-2" />
              Click to upload image
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function FlightsPage() {
  const [flights, setFlights] = useState<Flight[]>(initialFlights);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editFlight, setEditFlight] = useState<Flight | null>(null);
  const [isNew, setIsNew] = useState(false);

  const [form, setForm] = useState({
    airline: "",
    route: "",
    price: "",
    status: "Active" as "Active" | "Pending",
    image: "",
  });

  const openAdd = () => {
    setIsNew(true);
    setForm({ airline: "", route: "", price: "", status: "Active", image: "" });
    setModalOpen(true);
  };

  const openEdit = (flight: Flight) => {
    setIsNew(false);
    setEditFlight(flight);
    setForm({
      airline: flight.airline,
      route: flight.route,
      price: flight.price,
      status: flight.status,
      image: flight.image || "",
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (isNew) {
      const newFlight: Flight = {
        id: `VT-F00${flights.length + 1}`,
        ...form,
        bookings: "0",
      };
      setFlights([...flights, newFlight]);
    } else if (editFlight) {
      setFlights(
        flights.map((f) => (f.id === editFlight.id ? { ...f, ...form } : f)),
      );
    }
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this flight?")) {
      setFlights(flights.filter((f) => f.id !== id));
    }
  };

  const filtered = flights.filter(
    (f) =>
      f.airline.toLowerCase().includes(search.toLowerCase()) ||
      f.route.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Flights Management
          </h1>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            Add Flight
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
                placeholder="Search flights..."
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
                  Airline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
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
              {filtered.map((flight) => (
                <tr key={flight.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {flight.image ? (
                      <img
                        src={flight.image}
                        alt={flight.airline}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <Plane className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {flight.airline}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {flight.route}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {flight.price}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {flight.bookings}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        flight.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {flight.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(flight)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(flight.id)}
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
        title={isNew ? "Add Flight" : "Edit Flight"}
        onSave={handleSave}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Airline Name
            </label>
            <input
              type="text"
              value={form.airline}
              onChange={(e) => setForm({ ...form, airline: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., Uganda Airlines"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route
            </label>
            <input
              type="text"
              value={form.route}
              onChange={(e) => setForm({ ...form, route: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="e.g., EBB → LON"
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
              placeholder="e.g., $1,234"
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
