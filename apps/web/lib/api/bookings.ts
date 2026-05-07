"use client";

export interface PassengerDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  nationality: string;
  passportNumber: string;
  passportExpiry: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export interface UpsellingService {
  id: string;
  name: string;
  type: "insurance" | "baggage" | "meal" | "lounge" | "transfer" | "visa";
  description: string;
  price: number;
  currency: string;
  required: boolean;
}

export const upsellingServices: UpsellingService[] = [
  {
    id: "INS-001",
    name: "Travel Insurance",
    type: "insurance",
    description:
      "Comprehensive travel insurance including medical, cancellation, and baggage",
    price: 45,
    currency: "USD",
    required: false,
  },
  {
    id: "INS-002",
    name: "Travel Insurance Plus",
    type: "insurance",
    description: "Premium insurance with higher coverage and adventure sports",
    price: 89,
    currency: "USD",
    required: false,
  },
  {
    id: "BAG-001",
    name: "Extra Baggage (23kg)",
    type: "baggage",
    description: "Additional 23kg checked baggage allowance",
    price: 65,
    currency: "USD",
    required: false,
  },
  {
    id: "BAG-002",
    name: "Excess Baggage",
    type: "baggage",
    description: "Up to 32kg with priority handling",
    price: 120,
    currency: "USD",
    required: false,
  },
  {
    id: "MEAL-001",
    name: "Special Meal",
    type: "meal",
    description: "Vegetarian, Vegan, Halal, Kosher, or Medical diet",
    price: 0,
    currency: "USD",
    required: false,
  },
  {
    id: "MEAL-002",
    name: "Premium Meal",
    type: "meal",
    description: "Gourmet in-flight dining experience",
    price: 35,
    currency: "USD",
    required: false,
  },
  {
    id: "LOUNGE-001",
    name: "Airport Lounge Access",
    type: "lounge",
    description: "Access to premium lounges before departure",
    price: 55,
    currency: "USD",
    required: false,
  },
  {
    id: "TRANS-001",
    name: "Airport Transfer",
    type: "transfer",
    description: "Private transfer to/from airport",
    price: 45,
    currency: "USD",
    required: false,
  },
  {
    id: "TRANS-002",
    name: "VIP Meet & Greet",
    type: "transfer",
    description: "Fast-track immigration and assistance",
    price: 150,
    currency: "USD",
    required: false,
  },
  {
    id: "VISA-001",
    name: "Visa Assistance",
    type: "visa",
    description: "Visa invitation letter and processing assistance",
    price: 75,
    currency: "USD",
    required: false,
  },
  {
    id: "VISA-002",
    name: "Fast-track Visa",
    type: "visa",
    description: "Priority visa processing (48 hours)",
    price: 150,
    currency: "USD",
    required: false,
  },
];

export interface BookingItem {
  id: string;
  type: "flight" | "hotel" | "tour" | "car";
  reference: string;
  pnr: string;
  status: "pending" | "confirmed" | "used" | "cancelled" | "expired";
  provider: string;

  passengerDetails: PassengerDetails;
  upselling: string[];

  fare: {
    base: number;
    tax: number;
    fee: number;
    upselling: number;
    total: number;
    currency: string;
  };

  segments?: {
    from: string;
    to: string;
    depart: string;
    arrive: string;
    flight: string;
    class: string;
  }[];

  issuedAt: string;
  travelDate: string;
  expirationDate: string;
  usedAt?: string;
}

export function calculateUpsellingTotal(services: string[]): number {
  return services.reduce((total, serviceId) => {
    const service = upsellingServices.find((s) => s.id === serviceId);
    return total + (service?.price || 0);
  }, 0);
}

export function calculateBookingTotal(
  baseFare: number,
  taxRate: number,
  services: string[],
): {
  base: number;
  tax: number;
  fee: number;
  upselling: number;
  total: number;
} {
  const tax = baseFare * (taxRate / 100);
  const upselling = calculateUpsellingTotal(services);
  const total = baseFare + tax + upselling;

  return {
    base: baseFare,
    tax,
    fee: 0,
    upselling,
    total: Math.round(total * 100) / 100,
  };
}
