"use client";

import { useState } from "react";
import {
  Plane,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  TrendingDown,
  Package,
  Shield,
  Utensils,
  Briefcase,
  MapPin,
  CreditCard,
  PlaneTakeoff,
  User,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";

interface MidOfficeBooking {
  id: string;
  pnr: string;
  bookingRef: string;
  type: "flight" | "hotel" | "tour" | "car";
  status: "confirmed" | "used" | "cancelled" | "expired" | "pending";
  passenger: string;
  email: string;
  phone: string;
  route: string;
  date: string;
  total: string;
  issuedAt: string;
  expirationDate: string;
  usedAt?: string;
  provider: string;
  fare: number;
  cost: number;
  margin: number;
  upselling: string[];
  segments: { from: string; to: string; flight: string }[];
}

const initialBookings: MidOfficeBooking[] = [
  {
    id: "VT-001",
    pnr: "ABC123",
    bookingRef: "VT-FLY-2026-001",
    type: "flight",
    status: "confirmed",
    passenger: "John Smith",
    email: "john@example.com",
    phone: "+256 701 234567",
    route: "EBB → LHR",
    date: "Jun 15, 2026",
    total: "$1,234",
    issuedAt: "May 01, 2026",
    expirationDate: "Jun 15, 2026",
    provider: "internal",
    fare: 1234,
    cost: 950,
    margin: 284,
    upselling: ["Insurance"],
    segments: [{ from: "EBB", to: "LHR", flight: "UA203" }],
  },
  {
    id: "VT-002",
    pnr: "DEF456",
    bookingRef: "VT-FLY-2026-002",
    type: "flight",
    status: "used",
    passenger: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+256 702 234567",
    route: "NBO → DXB",
    date: "May 20, 2026",
    total: "$567",
    issuedAt: "May 05, 2026",
    expirationDate: "May 20, 2026",
    usedAt: "May 20, 2026",
    provider: "duffel",
    fare: 567,
    cost: 420,
    margin: 147,
    upselling: ["Extra Baggage", "Transfer"],
    segments: [{ from: "NBO", to: "DXB", flight: "KQ302" }],
  },
  {
    id: "VT-003",
    pnr: "GHI789",
    bookingRef: "VT-FLY-2026-003",
    type: "flight",
    status: "expired",
    passenger: "Michael Brown",
    email: "michael@example.com",
    phone: "+256 703 234567",
    route: "EBB → JNB",
    date: "Mar 10, 2026",
    total: "$890",
    issuedAt: "Feb 01, 2026",
    expirationDate: "Mar 10, 2026",
    provider: "amadeus",
    fare: 890,
    cost: 720,
    margin: 170,
    upselling: [],
    segments: [{ from: "EBB", to: "JNB", flight: "SA120" }],
  },
  {
    id: "VT-004",
    pnr: "JKL012",
    bookingRef: "VT-HTL-2026-004",
    type: "hotel",
    status: "confirmed",
    passenger: "Emily Davis",
    email: "emily@example.com",
    phone: "+256 704 234567",
    route: "Serena Hotel Kampala",
    date: "Jun 18-22, 2026",
    total: "$680",
    issuedAt: "May 10, 2026",
    expirationDate: "Jun 18, 2026",
    provider: "internal",
    fare: 680,
    cost: 520,
    margin: 160,
    upselling: ["Breakfast"],
    segments: [],
  },
  {
    id: "VT-005",
    pnr: "MNO345",
    bookingRef: "VT-FLY-2026-005",
    type: "flight",
    status: "cancelled",
    passenger: "David Wilson",
    email: "david@example.com",
    phone: "+256 705 234567",
    route: "KGL → CDG",
    date: "Apr 15, 2026",
    total: "$1,456",
    issuedAt: "Mar 01, 2026",
    expirationDate: "Apr 15, 2026",
    provider: "travelport",
    fare: 1456,
    cost: 1200,
    margin: 256,
    upselling: ["Insurance", "Lounge"],
    segments: [
      { from: "KGL", to: "ADD", flight: "WB120" },
      { from: "ADD", to: "CDG", flight: "ET508" },
    ],
  },
];

const typeIcons: Record<string, any> = {
  flight: Plane,
  hotel: PlaneTakeoff,
  tour: MapPin,
  car: PlaneTakeoff,
};

const statusColors: Record<string, string> = {
  confirmed: "bg-green-100 text-green-700",
  used: "bg-blue-100 text-blue-700",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function MidOfficePage() {
  const [bookings, setBookings] = useState<MidOfficeBooking[]>(initialBookings);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewBooking, setViewBooking] = useState<MidOfficeBooking | null>(null);

  const stats = {
    totalBookings: bookings.length,
    active: bookings.filter((b) => b.status === "confirmed").length,
    used: bookings.filter((b) => b.status === "used").length,
    expired: bookings.filter((b) => b.status === "expired").length,
    revenue: bookings
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.margin, 0),
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.passenger.toLowerCase().includes(search.toLowerCase()) ||
      b.pnr.toLowerCase().includes(search.toLowerCase()) ||
      b.bookingRef.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || b.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <header className="bg-white shadow-sm sticky top-0">
        <div className="px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Mid-Office Operations
            </h1>
            <p className="text-sm text-gray-500">
              Booking tracking, PNR management & fare optimization
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg">
            <RefreshCw className="w-4 h-4" /> Sync Providers
          </button>
        </div>
      </header>

      <div className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="text-2xl font-bold">{stats.totalBookings}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Used</p>
            <p className="text-2xl font-bold text-blue-600">{stats.used}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Expired</p>
            <p className="text-2xl font-bold text-gray-600">{stats.expired}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">Revenue</p>
            <p className="text-2xl font-bold text-sky-600">${stats.revenue}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by passenger, PNR, or booking ref..."
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
              <option value="confirmed">Confirmed</option>
              <option value="used">Used</option>
              <option value="expired">Expired</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  PNR
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Passenger
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Route
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Margin
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((booking) => {
                const Icon = typeIcons[booking.type];
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <span className="font-mono font-medium">
                          {booking.pnr}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{booking.passenger}</p>
                      <p className="text-xs text-gray-500">{booking.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm">{booking.route}</td>
                    <td className="px-4 py-3 text-sm">{booking.date}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${statusColors[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={
                          booking.margin > 200
                            ? "text-green-600 font-medium"
                            : ""
                        }
                      >
                        ${booking.margin}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setViewBooking(booking)}
                        className="p-1 text-sky-600 hover:bg-sky-50 rounded"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {viewBooking && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-900">Booking Details</h2>
                <p className="text-sm text-gray-500">PNR: {viewBooking.pnr}</p>
              </div>
              <button
                onClick={() => setViewBooking(null)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Passenger</h3>
                  <p className="font-medium">{viewBooking.passenger}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> {viewBooking.email}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {viewBooking.phone}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking</h3>
                  <p className="text-sm">Ref: {viewBooking.bookingRef}</p>
                  <p className="text-sm">
                    Status:{" "}
                    <span className={statusColors[viewBooking.status]}>
                      {viewBooking.status}
                    </span>
                  </p>
                  <p className="text-sm">Provider: {viewBooking.provider}</p>
                  <p className="text-sm">Issued: {viewBooking.issuedAt}</p>
                </div>
              </div>

              {viewBooking.segments.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Segments</h3>
                  <div className="space-y-2">
                    {viewBooking.segments.map((seg, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                      >
                        <Plane className="w-5 h-5 text-sky-600" />
                        <span className="font-medium">
                          {seg.from} → {seg.to}
                        </span>
                        <span className="text-sm text-gray-500">
                          {seg.flight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <h3 className="font-semibold mb-2">Financial</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Fare</p>
                    <p className="font-medium">${viewBooking.fare}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Cost</p>
                    <p className="font-medium">${viewBooking.cost}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Margin</p>
                    <p className="font-medium text-green-600">
                      ${viewBooking.margin}
                    </p>
                  </div>
                </div>
              </div>

              {viewBooking.upselling.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Upselling Services</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewBooking.upselling.map((service, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
