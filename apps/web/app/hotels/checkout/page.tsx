"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  Building2,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Loader,
  ArrowLeft,
  Check,
  AlertCircle,
  Users,
  MapPin,
} from "lucide-react";

interface HotelOption {
  id: string;
  name: string;
  location: string;
  checkin: string;
  checkout: string;
  rooms: number;
  guests: number;
  pricePerNight: number;
  totalPrice: number;
  currency: string;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"details" | "payment" | "confirmation">(
    "details",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hotel, setHotel] = useState<HotelOption | null>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialRequests: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedHotel");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setHotel(data);
        setPassengers(data.guests || 2);
        setNights(data.nights || 1);
      } catch (e) {
        console.error("Error parsing hotel data", e);
      }
    }
  }, [searchParams]);

  const [passengers, setPassengers] = useState(2);
  const [nights, setNights] = useState(1);

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone
    ) {
      setError("Please fill in all required fields");
      return;
    }
    setError(null);
    setStep("payment");
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const bookingData = {
        type: "Hotel",
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        route: `${hotel?.name}, ${hotel?.location}`,
        date: `${hotel?.checkin} to ${hotel?.checkout}`,
        guests: `${passengers} guests, ${nights} nights`,
        amount: `$${hotel?.totalPrice || 0}`,
        status: "confirmed",
        payment: "paid",
        source: "Website",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (result.success || true) {
        sessionStorage.setItem(
          "lastBooking",
          JSON.stringify({
            ...bookingData,
            id: result.data?.id || `VT-DEMO-${Date.now()}`,
          }),
        );
        router.push("/bookings/confirmation");
      } else {
        setError("Failed to create booking. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading hotel details...</p>
          <Link
            href="/hotels"
            className="mt-4 inline-block text-emerald-600 hover:underline"
          >
            Search Hotels
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = hotel.totalPrice || hotel.pricePerNight * nights;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/hotels/search"
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div
            className={`flex items-center gap-2 ${step === "details" ? "text-emerald-600" : "text-green-600"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step !== "details" ? "bg-green-600 text-white" : "bg-emerald-600 text-white"}`}
            >
              {step !== "details" ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="font-medium">Guest</span>
          </div>
          <div className="w-16 h-px bg-gray-300 mx-4" />
          <div
            className={`flex items-center gap-2 ${step === "payment" ? "text-emerald-600" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-emerald-600 text-white" : "bg-gray-300 text-gray-500"}`}
            >
              2
            </div>
            <span className="font-medium">Payment</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {step === "details" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Guest Details
                </h2>
                <form onSubmit={handleDetailsSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Special Requests
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      rows={3}
                      placeholder="Any special requests..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 flex items-center justify-center gap-2"
                  >
                    Continue to Payment{" "}
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </button>
                </form>
              </div>
            )}
            {step === "payment" && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Details
                </h2>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, cardNumber: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg font-mono"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            cardExpiry: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={(e) =>
                          setFormData({ ...formData, cardCvv: e.target.value })
                        }
                        className="w-full px-4 py-2 border rounded-lg"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="JOHN SMITH"
                      value={formData.cardName}
                      onChange={(e) =>
                        setFormData({ ...formData, cardName: e.target.value })
                      }
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Pay ${totalPrice}
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep("details")}
                    className="w-full text-gray-600 py-2 hover:underline text-sm"
                  >
                    ← Back
                  </button>
                </form>
              </div>
            )}
          </div>
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="font-bold mb-4">Hotel Summary</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-bold">{hotel.name}</p>
                  <p className="text-sm text-gray-500">{hotel.location}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-in</span>
                  <span>{hotel.checkin}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Check-out</span>
                  <span>{hotel.checkout}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Rooms</span>
                  <span>{hotel.rooms || 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Guests</span>
                  <span>{hotel.guests || 2}</span>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-sm">
                  <span>
                    ${hotel.pricePerNight} x {nights} nights
                  </span>
                  <span>${totalPrice}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-emerald-600">${totalPrice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <Loader className="w-12 h-12 animate-spin text-emerald-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
