"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  Download,
  Mail,
  RefreshCw,
  Square,
  CheckSquare,
  Upload,
  Calendar,
  User,
  DollarSign,
  Plane,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { exportToExcel, getTemplateColumns, getValidationRules } from "@/lib/excel-utils";
import { ExcelImporter } from "@/components/ui/excel-importer";
import { BulkToolbar } from "@/components/ui/bulk-toolbar";
import { EditableCell } from "@/components/ui/editable-cell";

interface Booking {
  id: string;
  booking_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  destination?: string;
  travel_date?: string;
  module_type: string;
  status: string;
  total_amount: number;
  adults?: number;
  children?: number;
  infants?: number;
  duration?: number;
  notes?: string;
  created_at: string;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showImporter, setShowImporter] = useState(false);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    destination: "",
    travel_date: "",
    adults: "1",
    children: "0",
    infants: "0",
    duration: "",
    module_type: "flights",
    total_amount: "",
    notes: "",
  });

  const supabase = createClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error: any) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const totalAmount = parseFloat(formData.total_amount) || 0;
      const duration = parseInt(formData.duration) || 0;
      const adults = parseInt(formData.adults) || 1;
      const children = parseInt(formData.children) || 0;
      const infants = parseInt(formData.infants) || 0;

      if (editingBooking) {
        const { error } = await supabase
          .from("bookings")
          .update({
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            destination: formData.destination,
            travel_date: formData.travel_date,
            adults,
            children,
            infants,
            duration,
            module_type: formData.module_type,
            total_amount: totalAmount,
            notes: formData.notes,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingBooking.id);

        if (error) throw error;
      } else {
        const bookingRef = `BKG-${Date.now()}`;

        const { error } = await supabase.from("bookings").insert([
          {
            booking_ref: bookingRef,
            customer_name: formData.customer_name,
            customer_email: formData.customer_email,
            customer_phone: formData.customer_phone,
            destination: formData.destination,
            travel_date: formData.travel_date,
            adults,
            children,
            infants,
            duration,
            module_type: formData.module_type,
            total_amount: totalAmount,
            notes: formData.notes,
            status: "inquiry",
          },
        ]);

        if (error) throw error;
      }

      setExpandedRowId(null);
      setEditingBooking(null);
      resetForm();
      fetchBookings();
    } catch (error: any) {
      console.error("Error saving booking:", error);
      alert("Failed to save: " + error.message);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      const { error } = await supabase.from("bookings").delete().eq("id", id);
      if (error) throw error;
      fetchBookings();
    } catch (error: any) {
      console.error("Error deleting booking:", error);
    }
  }

  async function handleBulkDelete() {
    if (!confirm(`Delete ${selectedIds.size} bookings? This cannot be undone.`)) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      setSelectedIds(new Set());
      fetchBookings();
    } catch (error: any) {
      console.error("Error bulk deleting:", error);
    }
  }

  async function handleBulkExport() {
    const selectedBookings = bookings.filter((b) => selectedIds.has(b.id));
    const columns = getTemplateColumns("bookings");

    await exportToExcel(selectedBookings, "bookings-export", {
      columns,
      branded: true,
    });
  }

  async function handleBulkEmail() {
    const selectedBookings = bookings.filter((b) => selectedIds.has(b.id));
    if (!confirm(`Send confirmation emails to ${selectedBookings.length} bookings?`)) return;

    try {
      for (const booking of selectedBookings) {
        await supabase
          .from("bookings")
          .update({ email_sent: true, email_sent_at: new Date().toISOString() })
          .eq("id", booking.id);
      }
      alert(`Sent confirmation emails to ${selectedBookings.length} bookings`);
      fetchBookings();
    } catch (error: any) {
      console.error("Error sending emails:", error);
    }
  }

  async function handleBulkStatusUpdate(newStatus: string) {
    if (!confirm(`Update status to "${newStatus}" for ${selectedIds.size} bookings?`)) return;

    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .in("id", Array.from(selectedIds));

      if (error) throw error;
      alert(`Updated ${selectedIds.size} bookings to "${newStatus}"`);
      setSelectedIds(new Set());
      fetchBookings();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;
      fetchBookings();
    } catch (error: any) {
      console.error("Error updating status:", error);
    }
  }

  async function handleImport(data: any[]) {
    try {
      const { error } = await supabase.from("bookings").insert(data);
      if (error) throw error;
      fetchBookings();
    } catch (error: any) {
      throw error;
    }
  }

  function resetForm() {
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      destination: "",
      travel_date: "",
      adults: "1",
      children: "0",
      infants: "0",
      duration: "",
      module_type: "flights",
      total_amount: "",
      notes: "",
    });
  }

  function handleEdit(booking: Booking) {
    setEditingBooking(booking);
    setFormData({
      customer_name: booking.customer_name,
      customer_email: booking.customer_email,
      customer_phone: booking.customer_phone || "",
      destination: booking.destination || "",
      travel_date: booking.travel_date || "",
      adults: booking.adults?.toString() || "1",
      children: booking.children?.toString() || "0",
      infants: booking.infants?.toString() || "0",
      duration: booking.duration?.toString() || "",
      module_type: booking.module_type,
      total_amount: booking.total_amount.toString(),
      notes: booking.notes || "",
    });
    setExpandedRowId(booking.id);
  }

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleSelectAll() {
    if (selectedIds.size === bookings.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(bookings.map((b) => b.id)));
    }
  }

  const stats = {
    total: bookings.length,
    inquiry: bookings.filter((b) => b.status === "inquiry").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending_payment").length,
    travelled: bookings.filter((b) => b.status === "travelled").length,
    totalRevenue: bookings
      .filter((b) => b.status === "confirmed" || b.status === "travelled")
      .reduce((sum, b) => sum + (b.total_amount || 0), 0),
  };

  const filtered = bookings.filter((booking) => {
    const matchesSearch =
      booking.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      booking.booking_ref.toLowerCase().includes(search.toLowerCase()) ||
      booking.destination?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || booking.status === filter;
    return matchesSearch && matchesFilter;
  });

  const statusMap = {
    inquiry: { label: "Inquiry", color: "bg-gray-100 text-gray-700" },
    quoted: { label: "Quoted", color: "bg-blue-100 text-blue-700" },
    booked: { label: "Booked", color: "bg-sky-100 text-sky-700" },
    pending_payment: { label: "Pending Payment", color: "bg-yellow-100 text-yellow-700" },
    paid: { label: "Paid", color: "bg-green-100 text-green-700" },
    ticketed: { label: "Ticketed", color: "bg-purple-100 text-purple-700" },
    confirmed: { label: "Confirmed", color: "bg-green-100 text-green-700" },
    travelled: { label: "Travelled", color: "bg-gray-100 text-gray-700" },
    completed: { label: "Completed", color: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700" },
  };

  const serviceTypes = [
    { label: "Flight", value: "flights" },
    { label: "Hotel", value: "hotels" },
    { label: "Tour", value: "tours" },
    { label: "Car", value: "cars" },
    { label: "Visa", value: "visa" },
    { label: "Package", value: "package" },
  ];

  const priorityMap = {
    low: { label: "Low", color: "bg-gray-100 text-gray-700" },
    normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
    high: { label: "High", color: "bg-orange-100 text-orange-700" },
    urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Bookings
          </h1>
          <p className="text-gray-600">
            Manage all customer bookings and reservations
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImporter(true)}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Upload className="w-4 h-4" />
            Import Excel
          </button>
          <button
            onClick={async () => {
              const columns = getTemplateColumns("bookings");
              await exportToExcel(filtered, "bookings", { columns, branded: true });
            }}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <Download className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={() => {
              resetForm();
              setEditingBooking(null);
              setExpandedRowId("new");
            }}
            className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
          >
            <Plus className="w-4 h-4" />
            New Booking
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Bookings</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Inquiry</p>
          <p className="text-2xl font-bold text-gray-600">{stats.inquiry}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Confirmed</p>
          <p className="text-2xl font-bold text-green-600">{stats.confirmed}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Pending Payment</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Travelled</p>
          <p className="text-2xl font-bold text-blue-600">{stats.travelled}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border">
          <p className="text-sm text-gray-600">Total Revenue</p>
          <p className="text-2xl font-bold text-sky-600">
            ${stats.totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bulk Toolbar */}
      <BulkToolbar
        selectedCount={selectedIds.size}
        onSelectAll={toggleSelectAll}
        allSelected={selectedIds.size === bookings.length && bookings.length > 0}
        entityType="bookings"
        onDelete={handleBulkDelete}
        onExport={handleBulkExport}
        onEmail={handleBulkEmail}
        disabledActions={["edit"]}
      />

      {/* Bulk Status Update */}
      {selectedIds.size > 0 && (
        <div className="bg-white border rounded-lg p-3 mb-6 flex items-center gap-4">
          <span className="text-sm font-medium text-gray-700">Bulk Status Update:</span>
          <div className="flex gap-2 flex-wrap">
            {["confirmed", "pending_payment", "paid", "ticketed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => handleBulkStatusUpdate(status)}
                className="px-3 py-1.5 text-sm bg-sky-50 text-sky-700 border border-sky-200 rounded hover:bg-sky-100"
              >
                {statusMap[status as keyof typeof statusMap]?.label || status}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer, booking ref, or destination..."
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
            <option value="inquiry">Inquiry</option>
            <option value="quoted">Quoted</option>
            <option value="booked">Booked</option>
            <option value="pending_payment">Pending Payment</option>
            <option value="paid">Paid</option>
            <option value="ticketed">Ticketed</option>
            <option value="confirmed">Confirmed</option>
            <option value="travelled">Travelled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchBookings}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-12">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
          <p className="text-gray-600">Loading bookings...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">
                  <button onClick={toggleSelectAll} className="p-1 hover:bg-gray-200 rounded">
                    {selectedIds.size === bookings.length && bookings.length > 0 ? (
                      <CheckSquare className="w-4 h-4 text-sky-600" />
                    ) : (
                      <Square className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Booking Ref
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Travel Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Amount
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
              {filtered.map((booking) => (
                <>
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <button
                        onClick={() => toggleSelect(booking.id)}
                        className="p-1 hover:bg-gray-200 rounded"
                      >
                        {selectedIds.has(booking.id) ? (
                          <CheckSquare className="w-4 h-4 text-sky-600" />
                        ) : (
                          <Square className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm">
                      {booking.booking_ref}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{booking.customer_name}</p>
                        <p className="text-xs text-gray-500">{booking.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.destination || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {booking.travel_date
                        ? new Date(booking.travel_date).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${booking.total_amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <EditableCell
                        value={booking.status}
                        type="select"
                        options={Object.entries(statusMap).map(([key, config]) => ({
                          label: config.label,
                          value: key,
                        }))}
                        onSave={(value) => handleStatusChange(booking.id, value)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(booking)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(booking.customer_email);
                            alert("Email copied to clipboard");
                          }}
                          className="p-1.5 text-green-600 hover:bg-green-50 rounded"
                          title="Copy Email"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedRowId === booking.id && (
                    <tr>
                      <td colSpan={8} className="p-0">
                        <div className="bg-sky-50 border-t">
                          <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div className="col-span-2">
                                <h3 className="font-semibold mb-3">
                                  {editingBooking ? "Edit Booking" : "New Booking"}
                                </h3>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Name *
                                </label>
                                <input
                                  type="text"
                                  value={formData.customer_name}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_name: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="Customer name"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Email *
                                </label>
                                <input
                                  type="email"
                                  value={formData.customer_email}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_email: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="customer@example.com"
                                  required
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Customer Phone
                                </label>
                                <input
                                  type="tel"
                                  value={formData.customer_phone}
                                  onChange={(e) =>
                                    setFormData({ ...formData, customer_phone: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="+256 700 123456"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Destination
                                </label>
                                <input
                                  type="text"
                                  value={formData.destination}
                                  onChange={(e) =>
                                    setFormData({ ...formData, destination: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="e.g., Dubai, Paris"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Module Type *
                                </label>
                                <select
                                  value={formData.module_type}
                                  onChange={(e) =>
                                    setFormData({ ...formData, module_type: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  required
                                >
                                  {serviceTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                      {type.label}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Travel Date
                                </label>
                                <input
                                  type="date"
                                  value={formData.travel_date}
                                  onChange={(e) =>
                                    setFormData({ ...formData, travel_date: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Duration (Days)
                                </label>
                                <input
                                  type="number"
                                  value={formData.duration}
                                  onChange={(e) =>
                                    setFormData({ ...formData, duration: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="7"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Adults
                                </label>
                                <input
                                  type="number"
                                  value={formData.adults}
                                  onChange={(e) =>
                                    setFormData({ ...formData, adults: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="1"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Children
                                </label>
                                <input
                                  type="number"
                                  value={formData.children}
                                  onChange={(e) =>
                                    setFormData({ ...formData, children: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Infants
                                </label>
                                <input
                                  type="number"
                                  value={formData.infants}
                                  onChange={(e) =>
                                    setFormData({ ...formData, infants: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="0"
                                />
                              </div>

                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Total Amount *
                                </label>
                                <input
                                  type="number"
                                  step="0.01"
                                  value={formData.total_amount}
                                  onChange={(e) =>
                                    setFormData({ ...formData, total_amount: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  placeholder="0.00"
                                  required
                                />
                              </div>

                              <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Notes
                                </label>
                                <textarea
                                  value={formData.notes}
                                  onChange={(e) =>
                                    setFormData({ ...formData, notes: e.target.value })
                                  }
                                  className="w-full px-3 py-2 border rounded-lg"
                                  rows={3}
                                  placeholder="Additional notes, special requests, preferences..."
                                />
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4 border-t">
                              <button
                                type="submit"
                                className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
                              >
                                <FileText className="w-4 h-4" />
                                {editingBooking ? "Update" : "Create"} Booking
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRowId(null);
                                  setEditingBooking(null);
                                }}
                                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showImporter && (
        <ExcelImporter
          entityType="bookings"
          onImport={handleImport}
          validationRules={getValidationRules("bookings")}
          onClose={() => setShowImporter(false)}
        />
      )}
    </div>
  );
}
