"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Check,
  Mail,
  Download,
  FileText,
  Plane,
  Calendar,
  MapPin,
  User,
  Send,
  Printer,
} from "lucide-react";

interface BookingData {
  id: string;
  type: string;
  customer: string;
  email: string;
  phone: string;
  route?: string;
  date?: string;
  returnDate?: string;
  guests?: string;
  amount?: string;
  status?: string;
  createdAt?: string;
}

export default function ConfirmationPage() {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastBooking");
    if (stored) {
      try {
        setBooking(JSON.parse(stored));
      } catch (e) {
        console.error("Error parsing booking", e);
      }
    }
  }, []);

  const sendItinerary = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setEmailSent(true);
    setLoading(false);
  };

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No booking found</p>
          <Link
            href="/flights"
            className="mt-4 text-sky-600 hover:underline block"
          >
            Book a Flight
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6 text-center">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-green-800 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-green-700">
            Your booking has been confirmed. Reference:{" "}
            <strong>{booking.id}</strong>
          </p>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Flight Itinerary
            </h2>
            <button className="text-sky-600 hover:text-sky-700 flex items-center gap-1 text-sm">
              <Printer className="w-4 h-4" />
              Print
            </button>
          </div>

          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-4 mb-4 pb-4 border-b">
              <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                <Plane className="w-6 h-6 text-sky-600" />
              </div>
              <div>
                <p className="font-bold text-lg">Uganda Airlines</p>
                <p className="text-sm text-gray-500">UA 203</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">From</p>
                <p className="font-medium">
                  {booking.route?.split(" → ")[0] || "EBB"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">To</p>
                <p className="font-medium">
                  {booking.route?.split(" → ")[1] || "LHR"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Departure</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {booking.date || "2026-06-15"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Return</p>
                <p className="font-medium flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {booking.returnDate || "2026-06-22"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Passengers</p>
                <p className="font-medium flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {booking.guests || "1"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Download className="w-5 h-5" />
            Invoice
          </h2>

          <div className="border rounded-lg p-4">
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Flight Fare</span>
              <span className="font-medium">{booking.amount || "$1,250"}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Taxes & Fees</span>
              <span className="font-medium">$125</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Travel Insurance</span>
              <span className="font-medium">$45</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-gray-600">Extra Baggage</span>
              <span className="font-medium">$65</span>
            </div>
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total</span>
              <span className="text-sky-600">{booking.amount || "$1,485"}</span>
            </div>
          </div>

          <button className="w-full mt-4 border border-sky-600 text-sky-600 py-2 rounded-lg hover:bg-sky-50 flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            Download PDF Invoice
          </button>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={sendItinerary}
            disabled={loading || emailSent}
            className="bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Sending...</span>
            ) : emailSent ? (
              <>
                <Check className="w-4 h-4" />
                Sent to {booking.email}
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Email Itinerary
              </>
            )}
          </button>

          <Link
            href="/dashboard/bookings"
            className="bg-gray-900 text-white py-3 rounded-lg hover:bg-gray-800 flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            View in Dashboard
          </Link>
        </div>

        {/* Upsells / Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6">
          <h3 className="font-bold text-gray-900 mb-4">Complete Your Trip</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/hotels"
              className="bg-white p-4 rounded-lg border hover:border-amber-400"
            >
              <p className="font-medium">Hotels</p>
              <p className="text-sm text-gray-500">Book accommodation</p>
            </Link>
            <Link
              href="/cars"
              className="bg-white p-4 rounded-lg border hover:border-amber-400"
            >
              <p className="font-medium">Car Rental</p>
              <p className="text-sm text-gray-500">Airport transfers</p>
            </Link>
            <Link
              href="/tours"
              className="bg-white p-4 rounded-lg border hover:border-amber-400"
            >
              <p className="font-medium">Tours</p>
              <p className="text-sm text-gray-500">Local experiences</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
