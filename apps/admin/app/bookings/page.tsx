"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card } from "@vertravels/ui";
import { Button } from "@vertravels/ui";
import { Input } from "@vertravels/ui";
import { Select } from "@vertravels/ui";
import { Badge } from "@vertravels/ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Calendar,
  DollarSign,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Filter,
  Search,
  RefreshCcw,
  Mail,
  CreditCard,
  AlertTriangle,
  Plus,
} from "lucide-react";

interface Booking {
  id: string;
  booking_ref: string;
  module_type: string;
  status: string;
  total_amount: number;
  currency: string;
  booking_date: string;
  travel_date: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  payment_method?: string;
  payment_status?: string;
  passenger_name?: string;
  hotel_name?: string;
  tour_name?: string;
  car_name?: string;
  visa_type?: string;
  destination?: string;
}

const moduleIcons: Record<string, React.ReactNode> = {
  flights: <Plane className="w-4 h-4" />,
  hotels: <Hotel className="w-4 h-4" />,
  tours: <MapPin className="w-4 h-4" />,
  cars: <Car className="w-4 h-4" />,
  visa: <FileText className="w-4 h-4" />,
};

const moduleLabels: Record<string, string> = {
  flights: "Flight",
  hotels: "Hotel",
  tours: "Tour",
  cars: "Car",
  visa: "Visa",
};

const statusConfig: Record<
  string,
  { label: string; variant: "success" | "warning" | "error" | "info" }
> = {
  confirmed: { label: "Confirmed", variant: "success" },
  pending: { label: "Pending", variant: "warning" },
  cancelled: { label: "Cancelled", variant: "error" },
  completed: { label: "Completed", variant: "info" },
  refunded: { label: "Refunded", variant: "info" },
};

export default function AdminBookingsPage() {
  const supabase = createClientComponentClient();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterModule, setFilterModule] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchBookings();
  }, [filterModule, filterStatus, filterPaymentStatus, dateFrom, dateTo]);

  async function fetchBookings() {
    try {
      setLoading(true);

      let query = supabase
        .from("bookings")
        .select(
          `
          *,
          profiles:user_id (full_name, email)
        `,
        )
        .order("booking_date", { ascending: false });

      if (filterModule !== "all") {
        query = query.eq("module_type", filterModule);
      }

      if (filterStatus !== "all") {
        query = query.eq("status", filterStatus);
      }

      if (filterPaymentStatus !== "all") {
        query = query.eq("payment_status", filterPaymentStatus);
      }

      if (dateFrom) {
        query = query.gte("booking_date", dateFrom);
      }

      if (dateTo) {
        query = query.lte("booking_date", dateTo);
      }

      const { data, error } = await query;

      if (error) throw error;

      const formattedBookings: Booking[] = (data || []).map((booking: any) => ({
        id: booking.id,
        booking_ref: booking.booking_ref,
        module_type: booking.module_type,
        status: booking.status,
        total_amount: booking.total_amount,
        currency: booking.currency || "USD",
        booking_date: booking.booking_date,
        travel_date:
          booking.travel_date ||
          booking.check_in_date ||
          booking.start_date ||
          booking.departure_date,
        customer_name: booking.profiles?.full_name || booking.customer_name,
        customer_email: booking.profiles?.email || booking.customer_email,
        customer_phone: booking.customer_phone,
        payment_method: booking.payment_method,
        payment_status: booking.payment_status,
        passenger_name: booking.passenger_name,
        hotel_name: booking.hotel_name,
        tour_name: booking.tour_name,
        car_name: booking.car_name,
        visa_type: booking.visa_type,
        destination: booking.destination,
      }));

      setBookings(formattedBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  }

  function getBookingTitle(booking: Booking): string {
    switch (booking.module_type) {
      case "flights":
        return booking.passenger_name || `Flight ${booking.booking_ref}`;
      case "hotels":
        return booking.hotel_name || `Hotel ${booking.booking_ref}`;
      case "tours":
        return booking.tour_name || `Tour ${booking.booking_ref}`;
      case "cars":
        return booking.car_name || `Car ${booking.booking_ref}`;
      case "visa":
        return (
          `${booking.visa_type} - ${booking.destination}` ||
          `Visa ${booking.booking_ref}`
        );
      default:
        return booking.booking_ref;
    }
  }

  function filteredBookings() {
    if (!searchQuery) return bookings;

    const query = searchQuery.toLowerCase();
    return bookings.filter(
      (booking) =>
        booking.booking_ref.toLowerCase().includes(query) ||
        getBookingTitle(booking).toLowerCase().includes(query) ||
        booking.customer_name?.toLowerCase().includes(query) ||
        booking.customer_email?.toLowerCase().includes(query) ||
        booking.destination?.toLowerCase().includes(query),
    );
  }

  async function updateBookingStatus(bookingId: string, status: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      fetchBookings();
      setShowStatusModal(false);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update booking status");
    }
  }

  async function updatePaymentStatus(bookingId: string, paymentStatus: string) {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ payment_status: paymentStatus })
        .eq("id", bookingId);

      if (error) throw error;

      fetchBookings();
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Failed to update payment status");
    }
  }

  async function handleRefund(bookingId: string) {
    if (
      !confirm("Are you sure you want to process a refund for this booking?")
    ) {
      return;
    }

    try {
      // In production, this would call the payment gateway API to process refund
      const { error } = await supabase
        .from("bookings")
        .update({
          status: "refunded",
          payment_status: "refunded",
        })
        .eq("id", bookingId);

      if (error) throw error;

      fetchBookings();
      alert("Refund processed successfully");
    } catch (error) {
      console.error("Error processing refund:", error);
      alert("Failed to process refund. Please try again.");
    }
  }

  async function sendBookingEmail(booking: Booking) {
    const email = prompt(
      "Enter email address (or leave blank for customer email):",
      booking.customer_email,
    );
    if (!email) return;

    try {
      // In production, this would call an API endpoint to send the booking details
      alert(`Booking confirmation sent to ${email}`);
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Bookings Management
          </h1>
          <p className="text-gray-600 mt-1">
            View and manage all customer bookings
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/bookings/new")}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Booking
          </Button>
          <Button onClick={fetchBookings} disabled={loading}>
            <RefreshCcw
              className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
          <div className="text-2xl font-bold text-gray-900">
            {bookings.length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Confirmed</div>
          <div className="text-2xl font-bold text-green-600">
            {bookings.filter((b) => b.status === "confirmed").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Pending</div>
          <div className="text-2xl font-bold text-yellow-600">
            {bookings.filter((b) => b.status === "pending").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Paid</div>
          <div className="text-2xl font-bold text-sky-600">
            {bookings.filter((b) => b.payment_status === "paid").length}
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(
              bookings
                .filter((b) => b.payment_status === "paid")
                .reduce((sum, b) => sum + b.total_amount, 0),
              "USD",
            )}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="w-[150px]">
            <Select
              value={filterModule}
              onChange={(e) => setFilterModule(e.target.value)}
              className="w-full"
            >
              <option value="all">All Modules</option>
              <option value="flights">Flights</option>
              <option value="hotels">Hotels</option>
              <option value="tours">Tours</option>
              <option value="cars">Cars</option>
              <option value="visa">Visa</option>
            </Select>
          </div>

          <div className="w-[150px]">
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full"
            >
              <option value="all">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>

          <div className="w-[150px]">
            <Select
              value={filterPaymentStatus}
              onChange={(e) => setFilterPaymentStatus(e.target.value)}
              className="w-full"
            >
              <option value="all">All Payment</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </Select>
          </div>

          <div className="w-[140px]">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              placeholder="From"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          <div className="w-[140px]">
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              placeholder="To"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {(filterModule !== "all" ||
            filterStatus !== "all" ||
            filterPaymentStatus !== "all" ||
            dateFrom ||
            dateTo ||
            searchQuery) && (
            <Button
              variant="outline"
              onClick={() => {
                setFilterModule("all");
                setFilterStatus("all");
                setFilterPaymentStatus("all");
                setDateFrom("");
                setDateTo("");
                setSearchQuery("");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* Bookings Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Booking Ref
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Travel Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="w-6 h-6 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredBookings().length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings().map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-sky-600">
                        #{booking.booking_ref}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            booking.module_type === "flights"
                              ? "bg-sky-100 text-sky-600"
                              : booking.module_type === "hotels"
                                ? "bg-green-100 text-green-600"
                                : booking.module_type === "tours"
                                  ? "bg-yellow-100 text-yellow-600"
                                  : booking.module_type === "cars"
                                    ? "bg-purple-100 text-purple-600"
                                    : "bg-pink-100 text-pink-600"
                          }`}
                        >
                          {moduleIcons[booking.module_type]}
                        </div>
                        <span className="text-sm capitalize">
                          {moduleLabels[booking.module_type]}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">
                          {booking.customer_name}
                        </div>
                        <div className="text-gray-500">
                          {booking.customer_email}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {formatDate(booking.travel_date)}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {formatCurrency(booking.total_amount, booking.currency)}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {booking.payment_method}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          statusConfig[booking.status]?.variant || "info"
                        }
                      >
                        {statusConfig[booking.status]?.label || booking.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          booking.payment_status === "paid"
                            ? "success"
                            : booking.payment_status === "failed"
                              ? "error"
                              : booking.payment_status === "refunded"
                                ? "info"
                                : "warning"
                        }
                      >
                        {booking.payment_status || "Pending"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/invoice/${booking.booking_ref}`,
                              "_blank",
                            )
                          }
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            window.open(
                              `/${booking.module_type}/${booking.id}`,
                              "_blank",
                            )
                          }
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => sendBookingEmail(booking)}
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                        <select
                          value={booking.status}
                          onChange={(e) =>
                            updateBookingStatus(booking.id, e.target.value)
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        {booking.payment_status === "paid" &&
                          booking.status !== "cancelled" &&
                          booking.status !== "refunded" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleRefund(booking.id)}
                            >
                              <RefreshCcw className="w-4 h-4" />
                            </Button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
