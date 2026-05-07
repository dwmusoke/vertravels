"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Plane,
  Hotel,
  MapPin,
  Car,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
} from "lucide-react";

interface Booking {
  id: string;
  type: "Flight" | "Hotel" | "Tour" | "Car";
  customer: string;
  email: string;
  phone: string;
  route: string;
  date: string;
  returnDate?: string;
  guests?: string;
  amount: string;
  status: "Confirmed" | "Pending" | "Cancelled";
  payment: "Paid" | "Pending" | "Refunded";
  source: "Website" | "Agent" | "Manual";
  createdAt: string;
}

const initialBookings: Booking[] = [
  {
    id: "VT-001",
    type: "Flight",
    customer: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    route: "EBB → LON",
    date: "May 15, 2026",
    returnDate: "May 25, 2026",
    guests: "2",
    amount: "$1,234",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "May 10, 2026",
  },
  {
    id: "VT-002",
    type: "Hotel",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    route: "Dubai - Serena Hotel",
    date: "May 18, 2026",
    returnDate: "May 22, 2026",
    guests: "1",
    amount: "$567",
    status: "Pending",
    payment: "Pending",
    source: "Agent",
    createdAt: "May 11, 2026",
  },
  {
    id: "VT-003",
    type: "Tour",
    customer: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    route: "Safari Adventure",
    date: "May 20, 2026",
    guests: "4",
    amount: "$890",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "May 12, 2026",
  },
  {
    id: "VT-004",
    type: "Car",
    customer: "Emily Davis",
    email: "emily@example.com",
    phone: "+1 234 567 893",
    route: "Toyota Prado - Kampala",
    date: "May 22, 2026",
    returnDate: "May 25, 2026",
    amount: "$240",
    status: "Confirmed",
    payment: "Paid",
    source: "Manual",
    createdAt: "May 13, 2026",
  },
  {
    id: "VT-005",
    type: "Flight",
    customer: "David Wilson",
    email: "david@example.com",
    phone: "+1 234 567 894",
    route: "NBO → JFK",
    date: "May 25, 2026",
    returnDate: "Jun 05, 2026",
    guests: "1",
    amount: "$1,567",
    status: "Cancelled",
    payment: "Refunded",
    source: "Website",
    createdAt: "May 14, 2026",
  },
  {
    id: "VT-006",
    type: "Hotel",
    customer: "Lisa Anderson",
    email: "lisa@example.com",
    phone: "+1 234 567 895",
    route: "Mövenpick Dubai",
    date: "Jun 01, 2026",
    returnDate: "Jun 07, 2026",
    guests: "2",
    amount: "$1,680",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "May 15, 2026",
  },
  {
    id: "VT-007",
    type: "Tour",
    customer: "James Wilson",
    email: "james@example.com",
    phone: "+1 234 567 896",
    route: "Gorilla Trekking",
    date: "Jun 10, 2026",
    guests: "2",
    amount: "$1,780",
    status: "Pending",
    payment: "Pending",
    source: "Agent",
    createdAt: "May 16, 2026",
  },
  {
    id: "VT-008",
    type: "Flight",
    customer: "Robert Brown",
    email: "robert@example.com",
    phone: "+1 234 567 897",
    route: "ADD → CDG",
    date: "Jun 15, 2026",
    returnDate: "Jun 25, 2026",
    guests: "3",
    amount: "$2,670",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "May 17, 2026",
  },
];

const typeIcons: Record<string, any> = {
  Flight: Plane,
  Hotel: Hotel,
  Tour: MapPin,
  Car: Car,
};

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

function ViewModal({
  booking,
  onClose,
}: {
  booking: Booking;
  onClose: () => void;
}) {
  const Icon = typeIcons[booking.type];
  return (
    <Modal
      open={true}
      onClose={onClose}
      title={`Booking Details - ${booking.id}`}
      saveLabel="Update Status"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-sky-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-5 h-5 text-sky-600" />
              <span className="font-semibold text-sky-600">
                {booking.type} Booking
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{booking.id}</p>
            <p className="text-sm text-gray-500">
              Created: {booking.createdAt}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <span
              className={`px-3 py-1 text-sm rounded-full inline-block w-fit ${
                booking.status === "Confirmed"
                  ? "bg-green-100 text-green-700"
                  : booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {booking.status === "Confirmed" && (
                <CheckCircle className="w-4 h-4 inline mr-1" />
              )}
              {booking.status === "Pending" && (
                <Clock className="w-4 h-4 inline mr-1" />
              )}
              {booking.status === "Cancelled" && (
                <XCircle className="w-4 h-4 inline mr-1" />
              )}
              {booking.status}
            </span>
            <span
              className={`px-3 py-1 text-sm rounded-full inline-block w-fit ${
                booking.payment === "Paid"
                  ? "bg-green-100 text-green-700"
                  : booking.payment === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              {booking.payment}
            </span>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Customer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{booking.customer}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{booking.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium">{booking.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Source</p>
              <p className="font-medium">{booking.source}</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Booking Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Route/Location</p>
              <p className="font-medium">{booking.route}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Check-in Date</p>
              <p className="font-medium">{booking.date}</p>
            </div>
            {booking.returnDate && (
              <div>
                <p className="text-sm text-gray-500">Check-out Date</p>
                <p className="font-medium">{booking.returnDate}</p>
              </div>
            )}
            {booking.guests && (
              <div>
                <p className="text-sm text-gray-500">Guests</p>
                <p className="font-medium">{booking.guests}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-lg text-green-600">
                {booking.amount}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-900 mb-3">Update Status</h3>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> Confirm
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Mark Pending
            </button>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2">
              <XCircle className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [form, setForm] = useState({
    type: "Flight" as "Flight" | "Hotel" | "Tour" | "Car",
    customer: "",
    email: "",
    phone: "",
    route: "",
    date: "",
    returnDate: "",
    guests: "1",
    amount: "",
    source: "Manual" as "Website" | "Agent" | "Manual",
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "Confirmed").length,
    pending: bookings.filter((b) => b.status === "Pending").length,
    revenue: bookings
      .filter((b) => b.status === "Confirmed" && b.payment === "Paid")
      .reduce(
        (sum, b) => sum + parseInt(b.amount.replace("$", "").replace(",", "")),
        0,
      ),
  };

  const handleAddBooking = () => {
    const newBooking: Booking = {
      id: `VT-00${bookings.length + 1}`,
      ...form,
      status: "Pending",
      payment: "Pending",
      createdAt: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    };
    setBookings([newBooking, ...bookings]);
    setModalOpen(false);
    setForm({
      type: "Flight",
      customer: "",
      email: "",
      phone: "",
      route: "",
      date: "",
      returnDate: "",
      guests: "1",
      amount: "",
      source: "Manual",
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Delete this booking?"))
      setBookings(bookings.filter((b) => b.id !== id));
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.route.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === "all" ||
      b.status.toLowerCase() === filter ||
      b.payment.toLowerCase() === filter;
    const matchesType = typeFilter === "all" || b.type === typeFilter;
    return matchesSearch && matchesFilter && matchesType;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" /> New Booking
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.confirmed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </p>
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
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border rounded-lg"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Types</option>
              <option value="Flight">Flights</option>
              <option value="Hotel">Hotels</option>
              <option value="Tour">Tours</option>
              <option value="Car">Cars</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Route
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Source
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
              {filtered.map((booking) => {
                const Icon = typeIcons[booking.type];
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {booking.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.customer}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {booking.route}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {booking.date}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {booking.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          booking.source === "Website"
                            ? "bg-sky-100 text-sky-700"
                            : booking.source === "Agent"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {booking.source}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : booking.status === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            booking.payment === "Paid"
                              ? "bg-green-100 text-green-700"
                              : booking.payment === "Pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {booking.payment}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setViewBooking(booking)}
                          className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New Booking"
        onSave={handleAddBooking}
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Type
              </label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value as any })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Flight">Flight</option>
                <option value="Hotel">Hotel</option>
                <option value="Tour">Tour</option>
                <option value="Car">Car</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Source
              </label>
              <select
                value={form.source}
                onChange={(e) =>
                  setForm({ ...form, source: e.target.value as any })
                }
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="Manual">Manual</option>
                <option value="Website">Website</option>
                <option value="Agent">Agent</option>
              </select>
            </div>
          </div>
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
                Guests
              </label>
              <input
                type="text"
                value={form.guests}
                onChange={(e) => setForm({ ...form, guests: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Route / Location
            </label>
            <input
              type="text"
              value={form.route}
              onChange={(e) => setForm({ ...form, route: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder={
                form.type === "Flight"
                  ? "e.g., EBB → LON"
                  : form.type === "Hotel"
                    ? "e.g., Serena Hotel Kampala"
                    : "e.g., Safari Adventure"
              }
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {form.type === "Hotel" ? "Check-in" : "Travel"} Date
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            {form.type === "Hotel" || form.type === "Car" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {form.type === "Hotel" ? "Check-out" : "Return"} Date
                </label>
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) =>
                    setForm({ ...form, returnDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) =>
                    setForm({ ...form, returnDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="text"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg"
              placeholder="$0.00"
            />
          </div>
        </div>
      </Modal>

      {viewBooking && (
        <ViewModal booking={viewBooking} onClose={() => setViewBooking(null)} />
      )}
    </div>
  );
}
