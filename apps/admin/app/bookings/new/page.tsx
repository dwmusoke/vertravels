"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@vertravels/ui";
import { Button } from "@vertravels/ui";
import { Input } from "@vertravels/ui";
import { Select } from "@vertravels/ui";
import { Label } from "@vertravels/ui";
import { Textarea } from "@vertravels/ui";
import {
  Plane,
  Hotel,
  MapPin,
  Car,
  FileText,
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  User,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  CreditCard,
  FileUp,
} from "lucide-react";

type ModuleType = "flights" | "hotels" | "tours" | "cars" | "visa";

interface Passenger {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  passportNumber: string;
  passportExpiry: string;
  nationality: string;
  type: "adult" | "child" | "infant";
}

interface FlightSegment {
  airline: string;
  flightNumber: string;
  from: string;
  to: string;
  departure: string;
  arrival: string;
  class: string;
  duration: string;
  stops: number;
}

export default function NewBookingPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [moduleType, setModuleType] = useState<ModuleType>("flights");
  const [pnrFile, setPnrFile] = useState<File | null>(null);
  const [pnrUploading, setPnrUploading] = useState(false);
  const [pnrUrl, setPnrUrl] = useState<string>("");
  const [success, setSuccess] = useState(false);
  const [createdBookingRef, setCreatedBookingRef] = useState("");

  const [customerData, setCustomerData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const [bookingData, setBookingData] = useState({
    bookingRef: "MANUAL" + Date.now().toString().slice(-8),
    travelDate: "",
    totalAmount: "",
    currency: "USD",
    paymentMethod: "cash",
    paymentStatus: "paid",
    status: "confirmed",
    notes: "",
  });

  const [flightData, setFlightData] = useState({
    passengerName: '',
    airline: '',
    flightNumber: '',
    from: '',
    to: '',
    departureTime: '',
    arrivalTime: '',
    class: 'Economy',
    pnr: '',
    ticketNumber: '',
    baseFare: '',
    taxes: '',
    iataBooking: false,
    iataCode: '',
    commissionAmount: '',
    airlineCode: ''
  })
          .select()
          .single();

        if (flightError) throw flightError;
      }

      if (moduleType === "hotels") {
        mainBookingData.hotel_name = hotelData.hotelName;
        mainBookingData.check_in_date = hotelData.checkIn;
        mainBookingData.check_out_date = hotelData.checkOut;
        mainBookingData.nights = Math.ceil(
          (new Date(hotelData.checkOut).getTime() -
            new Date(hotelData.checkIn).getTime()) /
            (1000 * 60 * 60 * 24),
        );

        const { error: hotelError } = await supabase
          .from("hotels_bookings")
          .insert({
            booking_ref_no: bookingRef,
            user_id: user?.id,
            hotel_name: hotelData.hotelName,
            hotel_address: hotelData.address,
            check_in_date: hotelData.checkIn,
            check_out_date: hotelData.checkOut,
            room_type: hotelData.roomType,
            number_of_guests: hotelData.guests,
            total_price: parseFloat(bookingData.totalAmount),
            currency: bookingData.currency,
            payment_status: bookingData.paymentStatus,
            payment_gateway: bookingData.paymentMethod,
            booking_status: bookingData.status,
          });

        if (hotelError) throw hotelError;
      }

      if (moduleType === "tours") {
        mainBookingData.tour_name = tourData.tourName;
        mainBookingData.destination = tourData.destination;
        mainBookingData.travel_date = tourData.tourDate;
        mainBookingData.adults = tourData.participants;

        const { error: tourError } = await supabase
          .from("tours_bookings")
          .insert({
            booking_ref_no: bookingRef,
            user_id: user?.id,
            tour_name: tourData.tourName,
            destination: tourData.destination,
            tour_date: tourData.tourDate,
            duration: tourData.duration,
            number_of_participants: tourData.participants,
            total_price: parseFloat(bookingData.totalAmount),
            currency: bookingData.currency,
            payment_status: bookingData.paymentStatus,
            payment_gateway: bookingData.paymentMethod,
            booking_status: bookingData.status,
          });

        if (tourError) throw tourError;
      }

      if (moduleType === "cars") {
        mainBookingData.car_name = carData.carName;
        mainBookingData.pickup_date = carData.pickupDate;
        mainBookingData.dropoff_date = carData.dropoffDate;

        const { error: carError } = await supabase
          .from("cars_bookings")
          .insert({
            booking_ref_no: bookingRef,
            user_id: user?.id,
            car_name: carData.carName,
            car_type: carData.carType,
            pickup_location: carData.pickupLocation,
            dropoff_location: carData.dropoffLocation,
            pickup_date: carData.pickupDate,
            dropoff_date: carData.dropoffDate,
            total_price: parseFloat(bookingData.totalAmount),
            currency: bookingData.currency,
            payment_status: bookingData.paymentStatus,
            payment_gateway: bookingData.paymentMethod,
            booking_status: bookingData.status,
          });

        if (carError) throw carError;
      }

      if (moduleType === "visa") {
        mainBookingData.visa_type = visaData.visaType;
        mainBookingData.destination = visaData.destination;
        mainBookingData.travel_date = visaData.travelDate;

        const { error: visaError } = await supabase
          .from("visa_bookings")
          .insert({
            booking_ref_no: bookingRef,
            user_id: user?.id,
            visa_type: visaData.visaType,
            destination_country: visaData.destination,
            travel_date: visaData.travelDate,
            applicant_name: visaData.applicantName,
            passport_number: visaData.passportNumber,
            passport_expiry: visaData.passportExpiry,
            nationality: visaData.nationality,
            total_price: parseFloat(bookingData.totalAmount),
            currency: bookingData.currency,
            payment_status: bookingData.paymentStatus,
            payment_gateway: bookingData.paymentMethod,
            booking_status: bookingData.status,
          });

        if (visaError) throw visaError;
      }

      const { data: booking, error: bookingError } = await supabase
        .from("bookings")
        .insert(mainBookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      setCreatedBookingRef(bookingRef);
      setSuccess(true);
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Created!
              </h2>
              <p className="text-gray-600 mb-4">
                Booking reference:{" "}
                <span className="font-mono font-bold">{createdBookingRef}</span>
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => router.push("/bookings")}
                >
                  View All Bookings
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setSuccess(false);
                    setBookingData((prev) => ({
                      ...prev,
                      bookingRef: "MANUAL" + Date.now().toString().slice(-8),
                    }));
                  }}
                >
                  Create Another
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Manual Booking
            </h1>
            <p className="text-gray-600 mt-1">
              Add a new booking directly to the system
            </p>
          </div>
          <Button variant="outline" onClick={() => router.push("/bookings")}>
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Module Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-3">
              {[
                { value: "flights", label: "Flights", icon: Plane },
                { value: "hotels", label: "Hotels", icon: Hotel },
                { value: "tours", label: "Tours", icon: MapPin },
                { value: "cars", label: "Cars", icon: Car },
                { value: "visa", label: "Visa", icon: FileText },
              ].map((module) => (
                <button
                  key={module.value}
                  onClick={() => setModuleType(module.value as ModuleType)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    moduleType === module.value
                      ? "border-sky-600 bg-sky-50 text-sky-600"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <module.icon className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm font-medium">{module.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Full Name *</Label>
              <Input
                value={customerData.fullName}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    fullName: e.target.value,
                  }))
                }
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={customerData.email}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={customerData.phone}
                onChange={(e) =>
                  setCustomerData((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }))
                }
                placeholder="+1 234 567 8900"
              />
            </div>
          </CardContent>
        </Card>

        {moduleType === "flights" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plane className="w-5 h-5" />
                Flight Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Passenger Name</Label>
                  <Input
                    value={flightData.passengerName}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        passengerName: e.target.value,
                      }))
                    }
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label>PNR / Booking Reference</Label>
                  <Input
                    value={flightData.pnr}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        pnr: e.target.value.toUpperCase(),
                      }))
                    }
                    placeholder="ABC123"
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Airline</Label>
                  <Input
                    value={flightData.airline}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        airline: e.target.value,
                      }))
                    }
                    placeholder="Emirates"
                  />
                </div>
                <div>
                  <Label>Flight Number</Label>
                  <Input
                    value={flightData.flightNumber}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        flightNumber: e.target.value,
                      }))
                    }
                    placeholder="EK001"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>From</Label>
                  <Input
                    value={flightData.from}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        from: e.target.value,
                      }))
                    }
                    placeholder="JFK - New York"
                  />
                </div>
                <div>
                  <Label>To</Label>
                  <Input
                    value={flightData.to}
                    onChange={(e) =>
                      setFlightData((prev) => ({ ...prev, to: e.target.value }))
                    }
                    placeholder="LHR - London"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Departure Time</Label>
                  <Input
                    type="datetime-local"
                    value={flightData.departureTime}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        departureTime: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Arrival Time</Label>
                  <Input
                    type="datetime-local"
                    value={flightData.arrivalTime}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        arrivalTime: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Class</Label>
                  <Select
                    value={flightData.class}
                    onChange={(e) =>
                      setFlightData((prev) => ({
                        ...prev,
                        class: e.target.value,
                      }))
                    }
                  >
                    <option value="Economy">Economy</option>
                    <option value="Premium Economy">Premium Economy</option>
                    <option value="Business">Business</option>
                    <option value="First">First Class</option>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="flex items-center gap-2">
                  <FileUp className="w-4 h-4" />
                  Upload PNR Document
                </Label>
                <div className="mt-2 flex items-center gap-4">
                  <Input
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) =>
                      e.target.files?.[0] && handlePnrUpload(e.target.files[0])
                    }
                    disabled={pnrUploading}
                    className="max-w-xs"
                  />
                  {pnrUploading && (
                    <span className="text-sm text-gray-500">Uploading...</span>
                  )}
                  {pnrUrl && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <a
                        href={pnrUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        View Document
                      </a>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Upload PNR confirmation, e-ticket, or booking voucher (PDF,
                  JPG, PNG)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {moduleType === "hotels" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hotel className="w-5 h-5" />
                Hotel Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Hotel Name</Label>
                <Input
                  value={hotelData.hotelName}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      hotelName: e.target.value,
                    }))
                  }
                  placeholder="Grand Hotel"
                />
              </div>
              <div>
                <Label>Address</Label>
                <Textarea
                  value={hotelData.address}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="123 Main Street, City, Country"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Check-in Date</Label>
                  <Input
                    type="date"
                    value={hotelData.checkIn}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Check-out Date</Label>
                  <Input
                    type="date"
                    value={hotelData.checkOut}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Room Type</Label>
                  <Input
                    value={hotelData.roomType}
                    onChange={(e) =>
                      setHotelData((prev) => ({
                        ...prev,
                        roomType: e.target.value,
                      }))
                    }
                    placeholder="Deluxe King Room"
                  />
                </div>
              </div>
              <div>
                <Label>Number of Guests</Label>
                <Input
                  type="number"
                  value={hotelData.guests}
                  onChange={(e) =>
                    setHotelData((prev) => ({
                      ...prev,
                      guests: parseInt(e.target.value),
                    }))
                  }
                  min={1}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {moduleType === "tours" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Tour Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Tour Name</Label>
                <Input
                  value={tourData.tourName}
                  onChange={(e) =>
                    setTourData((prev) => ({
                      ...prev,
                      tourName: e.target.value,
                    }))
                  }
                  placeholder="City Walking Tour"
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Destination</Label>
                  <Input
                    value={tourData.destination}
                    onChange={(e) =>
                      setTourData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="Paris, France"
                  />
                </div>
                <div>
                  <Label>Tour Date</Label>
                  <Input
                    type="date"
                    value={tourData.tourDate}
                    onChange={(e) =>
                      setTourData((prev) => ({
                        ...prev,
                        tourDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={tourData.duration}
                    onChange={(e) =>
                      setTourData((prev) => ({
                        ...prev,
                        duration: e.target.value,
                      }))
                    }
                    placeholder="4 hours"
                  />
                </div>
                <div>
                  <Label>Number of Participants</Label>
                  <Input
                    type="number"
                    value={tourData.participants}
                    onChange={(e) =>
                      setTourData((prev) => ({
                        ...prev,
                        participants: parseInt(e.target.value),
                      }))
                    }
                    min={1}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {moduleType === "cars" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="w-5 h-5" />
                Car Rental Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Car Name / Model</Label>
                <Input
                  value={carData.carName}
                  onChange={(e) =>
                    setCarData((prev) => ({ ...prev, carName: e.target.value }))
                  }
                  placeholder="Toyota Camry 2024"
                />
              </div>
              <div>
                <Label>Car Type</Label>
                <Select
                  value={carData.carType}
                  onChange={(e) =>
                    setCarData((prev) => ({ ...prev, carType: e.target.value }))
                  }
                >
                  <option value="Economy">Economy</option>
                  <option value="Compact">Compact</option>
                  <option value="Midsize">Midsize</option>
                  <option value="Full Size">Full Size</option>
                  <option value="SUV">SUV</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Van">Van</option>
                </Select>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Pickup Date</Label>
                  <Input
                    type="datetime-local"
                    value={carData.pickupDate}
                    onChange={(e) =>
                      setCarData((prev) => ({
                        ...prev,
                        pickupDate: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Dropoff Date</Label>
                  <Input
                    type="datetime-local"
                    value={carData.dropoffDate}
                    onChange={(e) =>
                      setCarData((prev) => ({
                        ...prev,
                        dropoffDate: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Pickup Location</Label>
                  <Input
                    value={carData.pickupLocation}
                    onChange={(e) =>
                      setCarData((prev) => ({
                        ...prev,
                        pickupLocation: e.target.value,
                      }))
                    }
                    placeholder="Airport Terminal 1"
                  />
                </div>
                <div>
                  <Label>Dropoff Location</Label>
                  <Input
                    value={carData.dropoffLocation}
                    onChange={(e) =>
                      setCarData((prev) => ({
                        ...prev,
                        dropoffLocation: e.target.value,
                      }))
                    }
                    placeholder="Downtown Office"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {moduleType === "visa" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Visa Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Visa Type</Label>
                  <Input
                    value={visaData.visaType}
                    onChange={(e) =>
                      setVisaData((prev) => ({
                        ...prev,
                        visaType: e.target.value,
                      }))
                    }
                    placeholder="Tourist Visa"
                  />
                </div>
                <div>
                  <Label>Destination Country</Label>
                  <Input
                    value={visaData.destination}
                    onChange={(e) =>
                      setVisaData((prev) => ({
                        ...prev,
                        destination: e.target.value,
                      }))
                    }
                    placeholder="United Arab Emirates"
                  />
                </div>
              </div>
              <div>
                <Label>Applicant Name</Label>
                <Input
                  value={visaData.applicantName}
                  onChange={(e) =>
                    setVisaData((prev) => ({
                      ...prev,
                      applicantName: e.target.value,
                    }))
                  }
                  placeholder="John Doe"
                />
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Passport Number</Label>
                  <Input
                    value={visaData.passportNumber}
                    onChange={(e) =>
                      setVisaData((prev) => ({
                        ...prev,
                        passportNumber: e.target.value,
                      }))
                    }
                    placeholder="A12345678"
                  />
                </div>
                <div>
                  <Label>Passport Expiry</Label>
                  <Input
                    type="date"
                    value={visaData.passportExpiry}
                    onChange={(e) =>
                      setVisaData((prev) => ({
                        ...prev,
                        passportExpiry: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label>Nationality</Label>
                  <Input
                    value={visaData.nationality}
                    onChange={(e) =>
                      setVisaData((prev) => ({
                        ...prev,
                        nationality: e.target.value,
                      }))
                    }
                    placeholder="American"
                  />
                </div>
              </div>
              <div>
                <Label>Travel Date</Label>
                <Input
                  type="date"
                  value={visaData.travelDate}
                  onChange={(e) =>
                    setVisaData((prev) => ({
                      ...prev,
                      travelDate: e.target.value,
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Information
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 gap-4">
            <div>
              <Label>Total Amount *</Label>
              <Input
                type="number"
                value={bookingData.totalAmount}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    totalAmount: e.target.value,
                  }))
                }
                placeholder="500.00"
                step="0.01"
              />
            </div>
            <div>
              <Label>Currency</Label>
              <Select
                value={bookingData.currency}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    currency: e.target.value,
                  }))
                }
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="AED">AED</option>
                <option value="SAR">SAR</option>
                <option value="INR">INR</option>
              </Select>
            </div>
            <div>
              <Label>Payment Method</Label>
              <Select
                value={bookingData.paymentMethod}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    paymentMethod: e.target.value,
                  }))
                }
              >
                <option value="cash">Cash</option>
                <option value="card">Card</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cheque">Cheque</option>
                <option value="credit">Credit</option>
              </Select>
            </div>
            <div>
              <Label>Payment Status</Label>
              <Select
                value={bookingData.paymentStatus}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    paymentStatus: e.target.value,
                  }))
                }
              >
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="unpaid">Unpaid</option>
                <option value="partial">Partial</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Booking Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <div>
              <Label>Booking Reference</Label>
              <Input
                value={bookingData.bookingRef}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    bookingRef: e.target.value,
                  }))
                }
                placeholder="MANUAL12345"
              />
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={bookingData.status}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    status: e.target.value,
                  }))
                }
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </Select>
            </div>
            <div>
              <Label>Travel Date</Label>
              <Input
                type="date"
                value={bookingData.travelDate}
                onChange={(e) =>
                  setBookingData((prev) => ({
                    ...prev,
                    travelDate: e.target.value,
                  }))
                }
              />
            </div>
            <div className="md:col-span-3">
              <Label>Notes</Label>
              <Textarea
                value={bookingData.notes}
                onChange={(e) =>
                  setBookingData((prev) => ({ ...prev, notes: e.target.value }))
                }
                placeholder="Additional notes or special requests..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => router.push("/bookings")}>
            Cancel
          </Button>
          <Button onClick={createBooking} disabled={loading}>
            {loading ? "Creating Booking..." : "Create Booking"}
          </Button>
        </div>
      </div>
    </div>
  );
}
