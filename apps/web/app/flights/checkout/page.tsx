"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  Plane,
  CreditCard,
  User,
  Mail,
  Phone,
  Calendar,
  Loader,
  ArrowLeft,
  Check,
  AlertCircle,
  Wallet,
  Building2,
  Smartphone,
  Landmark,
} from "lucide-react";
import { paymentMethods, calculateFee, getTotal } from "@/lib/api/payments";

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  duration: string;
  price: number;
  currency: string;
  stops: number;
}

interface PaymentMethodOption {
  id: string;
  name: string;
  logo: string;
  color: string;
  icon: any;
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"details" | "payment" | "confirmation">(
    "details",
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flight, setFlight] = useState<FlightOption | null>(null);
  const [passengers, setPassengers] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    passportNumber: "",
    nationality: "",
    cardNumber: "",
    cardExpiry: "",
    cardCvv: "",
    cardName: "",
    travelInsurance: false,
    paymentMethod: "card",
  });

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedFlight");
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setFlight(data);
        setPassengers(parseInt(searchParams.get("pax") || "1"));
      } catch (e) {
        console.error("Error parsing flight data", e);
      }
    } else if (searchParams.get("id")) {
      setFlight({
        id: searchParams.get("id") || "FL001",
        airline: "Uganda Airlines",
        flightNumber: "UA 203",
        from: searchParams.get("from") || "EBB",
        to: searchParams.get("to") || "LHR",
        departure: searchParams.get("depart") || "2026-06-15",
        arrival: "2026-06-16",
        duration: "8h 30m",
        price: parseInt(searchParams.get("price") || "1250"),
        currency: "USD",
        stops: 0,
      });
      setPassengers(parseInt(searchParams.get("pax") || "1"));
    }
  }, [searchParams]);

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
        type: "Flight",
        customer: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        route: `${flight?.from} → ${flight?.to}`,
        date: flight?.departure,
        returnDate: flight?.arrival,
        guests: passengers.toString(),
        amount: `$${(flight?.price || 0) * passengers}`,
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

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-sky-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading flight details...</p>
          <Link
            href="/flights"
            className="mt-4 inline-block text-sky-600 hover:underline"
          >
            Search Flights
          </Link>
        </div>
      </div>
    );
  }

  const totalPrice = flight.price * passengers;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/flights"
            className="flex items-center gap-2 text-gray-600 hover:text-sky-600"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Search
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-center mb-8">
          <div
            className={`flex items-center gap-2 ${step === "details" ? "text-sky-600" : "text-green-600"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step !== "details" ? "bg-green-600 text-white" : "bg-sky-600 text-white"}`}
            >
              {step !== "details" ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="font-medium">Passenger</span>
          </div>
          <div className="w-16 h-px bg-gray-300 mx-4" />
          <div
            className={`flex items-center gap-2 ${step === "payment" ? "text-sky-600" : "text-gray-400"}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "payment" ? "bg-sky-600 text-white" : "bg-gray-300 text-gray-500"}`}
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
                  Passenger Details
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
                  <button
                    type="submit"
                    className="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-700 flex items-center justify-center gap-2"
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
                  Select Payment Method
                </h2>

                <div className="space-y-3 mb-6">
                  {paymentMethods
                    .filter((m) => m.enabled)
                    .map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                          formData.paymentMethod === method.id
                            ? "border-sky-500 bg-sky-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value={method.id}
                            checked={formData.paymentMethod === method.id}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                paymentMethod: e.target.value,
                              })
                            }
                            className="w-4 h-4 text-sky-600"
                          />
                          <span className="text-2xl">{method.logo}</span>
                          <div>
                            <p className="font-medium">{method.name}</p>
                            <p className="text-xs text-gray-500">
                              {method.fee > 0 ? `${method.fee}% fee` : "No fee"}{" "}
                              • {method.processingTime}
                            </p>
                          </div>
                        </div>
                        {method.type === "card" && (
                          <CreditCard className="w-5 h-5 text-gray-400" />
                        )}
                        {method.type === "mobile_money" && (
                          <Smartphone className="w-5 h-5 text-gray-400" />
                        )}
                        {method.type === "bank_transfer" && (
                          <Building2 className="w-5 h-5 text-gray-400" />
                        )}
                        {method.type === "wallet" && (
                          <Wallet className="w-5 h-5 text-gray-400" />
                        )}
                      </label>
                    ))}
                </div>

                {formData.paymentMethod === "bank_transfer" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-yellow-800 mb-2">
                      Bank Transfer Details
                    </h3>
                    <div className="text-sm text-yellow-700 space-y-1 font-mono">
                      <p>Bank: Stanbic Bank Uganda</p>
                      <p>Account: 9030012345678</p>
                      <p>Name: VerTravels Ltd</p>
                      <p>Reference: VT-{Date.now().toString().slice(-6)}</p>
                    </div>
                  </div>
                )}
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
              <h3 className="font-bold mb-4">Flight Summary</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <Plane className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <p className="font-bold">{flight.airline}</p>
                  <p className="text-sm text-gray-500">{flight.flightNumber}</p>
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div>
                  <p className="font-medium">{flight.from}</p>
                  <p className="text-sm text-gray-500">{flight.departure}</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-px bg-gray-300 mx-auto" />
                  <p className="text-xs text-gray-500">{flight.duration}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{flight.to}</p>
                  <p className="text-sm text-gray-500">{flight.arrival}</p>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-sm">
                  <span>Adult x {passengers}</span>
                  <span>${flight.price * passengers}</span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-2">
                  <span>Total</span>
                  <span className="text-sky-600">${totalPrice}</span>
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
          <Loader className="w-12 h-12 animate-spin text-sky-600" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
