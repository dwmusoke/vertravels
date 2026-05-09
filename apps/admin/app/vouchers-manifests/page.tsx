"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Download,
  Mail,
  Eye,
  CheckCircle,
  Clock,
  Users,
  Plane,
  Calendar,
  X,
} from "lucide-react";

interface Voucher {
  id: string;
  voucher_number: string;
  booking_id?: string;
  voucher_type: string;
  supplier_id?: string;
  passenger_name: string;
  service_description: string;
  service_date: string;
  status: "draft" | "sent" | "used" | "cancelled";
  pdf_url?: string;
  sent_at?: string;
  sent_to?: string;
  created_at: string;
}

interface Manifest {
  id: string;
  manifest_number: string;
  group_name: string;
  travel_date: string;
  destination: string;
  total_passengers: number;
  bookings: any[];
  status: "draft" | "finalized" | "travelled";
  created_at: string;
}

export default function VouchersManifestsPage() {
  const [activeTab, setActiveTab] = useState<"vouchers" | "manifests">("vouchers");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [manifests, setManifests] = useState<Manifest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVoucherForm, setShowVoucherForm] = useState(false);
  const [showManifestForm, setShowManifestForm] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === "vouchers") {
        const { data, error } = await supabase
          .from("vouchers")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setVouchers(data || []);
      } else {
        // Manifests would be a separate table (simplified here)
        setManifests([]);
      }
    } catch (error: any) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function generateVoucher(bookingId: string) {
    try {
      // Get booking details
      const { data: booking } = await supabase
        .from("bookings")
        .select("*")
        .eq("id", bookingId)
        .single();

      if (!booking) throw new Error("Booking not found");

      // Generate voucher number
      const voucherNumber = `VCH-${Date.now()}`;

      // Create voucher
      const { error } = await supabase.from("vouchers").insert([{
        voucher_number: voucherNumber,
        booking_id: bookingId,
        voucher_type: booking.module_type || "flight",
        passenger_name: booking.passenger_name,
        service_description: `${booking.module_type} - ${booking.destination}`,
        service_date: booking.travel_date,
        status: "draft",
      }]);

      if (error) throw error;

      fetchData();
      alert("Voucher generated: " + voucherNumber);
    } catch (error: any) {
      console.error("Error generating voucher:", error);
      alert("Failed to generate voucher: " + error.message);
    }
  }

  async function sendVoucher(voucher: Voucher, email: string) {
    try {
      // In production, generate PDF and send email
      const { error } = await supabase
        .from("vouchers")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          sent_to: email,
        })
        .eq("id", voucher.id);

      if (error) throw error;

      fetchData();
      alert(`Voucher sent to ${email}`);
    } catch (error: any) {
      console.error("Error sending voucher:", error);
      alert("Failed to send voucher: " + error.message);
    }
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Vouchers & Manifests
          </h1>
          <p className="text-gray-600">
            Generate service vouchers and group manifests
          </p>
        </div>
        <div className="flex gap-3">
          {activeTab === "vouchers" ? (
            <button
              onClick={() => setShowVoucherForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              <Plus className="w-4 h-4" />
              Generate Voucher
            </button>
          ) : (
            <button
              onClick={() => setShowManifestForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              <Plus className="w-4 h-4" />
              Create Manifest
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b">
        <button
          onClick={() => setActiveTab("vouchers")}
          className={`px-4 py-2 font-medium ${
            activeTab === "vouchers"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-gray-600"
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Service Vouchers
        </button>
        <button
          onClick={() => setActiveTab("manifests")}
          className={`px-4 py-2 font-medium ${
            activeTab === "manifests"
              ? "border-b-2 border-sky-600 text-sky-600"
              : "text-gray-600"
          }`}
        >
          <Users className="w-4 h-4 inline mr-2" />
          Group Manifests
        </button>
      </div>

      {/* Vouchers Tab */}
      {activeTab === "vouchers" && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Service Vouchers</h2>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-sky-500" />
              <p className="text-gray-600">Loading vouchers...</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Voucher #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Passenger
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
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
                {vouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium">
                      {voucher.voucher_number}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs bg-sky-100 text-sky-700 rounded">
                        {voucher.voucher_type}
                      </span>
                    </td>
                    <td className="px-6 py-4">{voucher.passenger_name}</td>
                    <td className="px-6 py-4 text-sm">{voucher.service_description}</td>
                    <td className="px-6 py-4 text-sm">
                      {new Date(voucher.service_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          voucher.status === "sent"
                            ? "bg-green-100 text-green-700"
                            : voucher.status === "used"
                            ? "bg-blue-100 text-blue-700"
                            : voucher.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {voucher.status === "sent" && (
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                        )}
                        {voucher.status === "draft" && (
                          <Clock className="w-3 h-3 inline mr-1" />
                        )}
                        {voucher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => alert("Preview voucher: " + voucher.voucher_number)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            const email = prompt("Enter recipient email:");
                            if (email) sendVoucher(voucher, email);
                          }}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => alert("Download PDF: " + voucher.voucher_number)}
                          className="p-1.5 text-sky-600 hover:bg-sky-50 rounded"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {vouchers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>No vouchers generated yet</p>
                      <p className="text-sm">Click &ldquo;Generate Voucher&rdquo; to create one</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Manifests Tab */}
      {activeTab === "manifests" && (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="font-semibold text-lg">Group Manifests</h2>
          </div>
          <div className="text-center py-12 text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Group manifests coming soon</p>
            <p className="text-sm">Manage group bookings and passenger lists</p>
          </div>
        </div>
      )}

      {/* Generate Voucher Modal */}
      {showVoucherForm && (
        <VoucherFormModal
          onClose={() => setShowVoucherForm(false)}
          onSuccess={() => {
            setShowVoucherForm(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
}

// Voucher Form Modal
function VoucherFormModal({ onClose, onSuccess }: any) {
  const [bookings, setBookings] = useState<any[]>([]);
  const [selectedBooking, setSelectedBooking] = useState("");
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("payment_status", "paid")
        .order("created_at", { ascending: false })
        .limit(50);

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

    if (!selectedBooking) {
      alert("Please select a booking");
      return;
    }

    // Get booking details and create voucher
    const booking = bookings.find((b) => b.id === selectedBooking);
    if (!booking) return;

    const voucherNumber = `VCH-${Date.now()}`;

    const { error } = await supabase.from("vouchers").insert([{
      voucher_number: voucherNumber,
      booking_id: booking.id,
      voucher_type: booking.module_type || "flight",
      passenger_name: booking.passenger_name,
      service_description: `${booking.module_type} - ${booking.destination}`,
      service_date: booking.travel_date,
      status: "draft",
    }]);

    if (error) {
      alert("Failed to generate voucher: " + error.message);
      return;
    }

    onSuccess();
    alert("Voucher generated: " + voucherNumber);
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg shadow-xl">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-xl">Generate Voucher</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Booking *
              </label>
              {loading ? (
                <div className="text-center py-4 text-gray-500">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  Loading bookings...
                </div>
              ) : (
                <select
                  value={selectedBooking}
                  onChange={(e) => setSelectedBooking(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select a paid booking...</option>
                  {bookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      {booking.passenger_name} - {booking.destination} ({booking.booking_ref})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {selectedBooking && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Voucher Preview</h3>
                {bookings
                  .filter((b) => b.id === selectedBooking)
                  .map((booking) => (
                    <div key={booking.id} className="text-sm space-y-1">
                      <p>
                        <strong>Type:</strong> {booking.module_type || "Flight"}
                      </p>
                      <p>
                        <strong>Passenger:</strong> {booking.passenger_name}
                      </p>
                      <p>
                        <strong>Service:</strong> {booking.destination}
                      </p>
                      <p>
                        <strong>Date:</strong>{" "}
                        {new Date(booking.travel_date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t mt-6">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700"
            >
              Generate Voucher
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
