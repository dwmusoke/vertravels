export interface FlightSearchParams {
  origin: string;
  destination: string;
  departDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: "economy" | "business" | "first";
}

export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departure: string;
  arrival: string;
  duration: string;
  stops: number;
  stopover?: string;
  price: number;
  currency: string;
  cabinClass: string;
  available: boolean;
  source: "duffel" | "amadeus" | "travelport" | "internal";
}

export interface HotelSearchParams {
  destination: string;
  checkin: string;
  checkout: string;
  rooms: number;
  guests: number;
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  amenities: string[];
  images: string[];
  available: boolean;
  source: "hotelbeds" | "internal" | "expedia";
}

export interface Tour {
  id: string;
  name: string;
  location: string;
  duration: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  description: string;
  images: string[];
  available: boolean;
  source: "viator" | "getyourguide" | "internal";
}

export interface Car {
  id: string;
  model: string;
  type: string;
  location: string;
  pricePerDay: number;
  currency: string;
  seats: number;
  transmission: string;
  features: string[];
  available: boolean;
  source: "rentalcars" | "economybookings" | "internal";
}

export type Provider =
  | "duffel"
  | "amadeus"
  | "travelport"
  | "hotelbeds"
  | "viator"
  | "rentalcars"
  | "internal";

export interface ApiConfig {
  provider: Provider;
  apiKey?: string;
  apiSecret?: string;
  baseUrl: string;
  enabled: boolean;
}

export const apiProviders: Record<string, ApiConfig> = {
  duffel: {
    provider: "duffel",
    baseUrl: "https://api.duffel.com/v1",
    enabled: false,
  },
  amadeus: {
    provider: "amadeus",
    baseUrl: "https://api.amadeus.com/v1",
    enabled: false,
  },
  travelport: {
    provider: "travelport",
    baseUrl: "https://api.travelport.com",
    enabled: false,
  },
  hotelbeds: {
    provider: "hotelbeds",
    baseUrl: "https://api.hotelbeds.com/hotel-api/1.0",
    enabled: false,
  },
  viator: {
    provider: "viator",
    baseUrl: "https://api.viator.com/v3",
    enabled: false,
  },
  rentalcars: {
    provider: "rentalcars",
    baseUrl: "https://api.rentalcars.com/partners",
    enabled: false,
  },
  internal: {
    provider: "internal",
    baseUrl: "internal",
    enabled: true,
  },
};

export async function searchFlights(
  params: FlightSearchParams,
): Promise<Flight[]> {
  const results: Flight[] = [];

  for (const [providerKey, config] of Object.entries(apiProviders)) {
    if (!config.enabled) continue;

    try {
      switch (providerKey) {
        case "duffel":
          results.push(...(await searchDuffelFlights(params)));
          break;
        case "amadeus":
          results.push(...(await searchAmadeusFlights(params)));
          break;
        case "travelport":
          results.push(...(await searchTravelportFlights(params)));
          break;
        case "internal":
          results.push(...getInternalFlights(params));
          break;
      }
    } catch (error) {
      console.error(`Error searching ${providerKey}:`, error);
    }
  }

  return results.sort((a, b) => a.price - b.price);
}

async function searchDuffelFlights(
  params: FlightSearchParams,
): Promise<Flight[]> {
  const config = apiProviders.duffel;
  if (!config.apiKey) return [];

  try {
    const response = await fetch(`${config.baseUrl}/offers`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        origin: params.origin,
        destination: params.destination,
        depart_date: params.departDate,
        return_date: params.returnDate,
        passengers: params.passengers,
        cabin_class: params.cabinClass || "economy",
      }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (
      data.offers?.map((offer: any) => ({
        id: offer.id,
        airline: offer.slices?.[0]?.segments?.[0]?.carrier?.name || "Unknown",
        airlineCode: offer.slices?.[0]?.segments?.[0]?.carrier?.iata_code || "",
        flightNumber:
          offer.slices?.[0]?.segments?.[0]?.carrier?.iata_code +
            offer.slices?.[0]?.segments?.[0]?.number || "",
        origin: params.origin,
        destination: params.destination,
        departure: offer.slices?.[0]?.segments?.[0]?.departure_time || "",
        arrival: offer.slices?.[0]?.segments?.[0]?.arrival_time || "",
        duration: offer.slices?.[0]?.duration || "",
        stops: (offer.slices?.[0]?.segments?.length || 1) - 1,
        price: offer.total_amount || 0,
        currency: offer.total_currency || "USD",
        cabinClass: offer.cabin_class || "economy",
        available: true,
        source: "duffel" as const,
      })) || []
    );
  } catch {
    return [];
  }
}

async function searchAmadeusFlights(
  params: FlightSearchParams,
): Promise<Flight[]> {
  const config = apiProviders.amadeus;
  if (!config.apiKey) return [];

  try {
    const response = await fetch(`${config.baseUrl}/shopping/flight-offers`, {
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
      },
    });

    if (!response.ok) return [];

    const data = await response.json();
    return (
      data.data?.map((offer: any) => ({
        id: offer.id,
        airline:
          offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin ||
          "Unknown",
        airlineCode: "",
        flightNumber: "",
        origin: params.origin,
        destination: params.destination,
        departure: "",
        arrival: "",
        duration: "",
        stops: 0,
        price: offer.price?.total || 0,
        currency: offer.price?.currency || "USD",
        cabinClass: "economy",
        available: true,
        source: "amadeus" as const,
      })) || []
    );
  } catch {
    return [];
  }
}

async function searchTravelportFlights(
  params: FlightSearchParams,
): Promise<Flight[]> {
  const config = apiProviders.travelport;
  if (!config.apiKey) return [];

  return [];
}

function getInternalFlights(params: FlightSearchParams): Flight[] {
  const outbound: Flight[] = [
    {
      id: "FL001",
      airline: "Uganda Airlines",
      airlineCode: "UR",
      flightNumber: "UR201",
      origin: params.origin,
      destination: params.destination,
      departure: `${params.departDate}T08:00:00`,
      arrival: `${params.departDate}T14:30:00`,
      duration: "5h 30m",
      stops: 0,
      price: 450,
      currency: "USD",
      cabinClass: "economy",
      available: true,
      source: "internal",
    },
    {
      id: "FL002",
      airline: "Kenya Airways",
      airlineCode: "KQ",
      flightNumber: "KQ512",
      origin: params.origin,
      destination: params.destination,
      departure: `${params.departDate}T10:00:00`,
      arrival: `${params.departDate}T18:15:00`,
      duration: "7h 15m",
      stops: 0,
      price: 380,
      currency: "USD",
      cabinClass: "economy",
      available: true,
      source: "internal",
    },
    {
      id: "FL003",
      airline: "Emirates",
      airlineCode: "EK",
      flightNumber: "EK714",
      origin: params.origin,
      destination: params.destination,
      departure: `${params.departDate}T14:00:00`,
      arrival: `${params.departDate}T23:45:00`,
      duration: "8h 45m",
      stops: 0,
      price: 650,
      currency: "USD",
      cabinClass: "business",
      available: true,
      source: "internal",
    },
  ];

  if (!params.returnDate) return outbound;

  const returnFlights: Flight[] = [
    {
      id: "RF001",
      airline: "Kenya Airways",
      airlineCode: "KQ",
      flightNumber: "KQ513",
      origin: params.destination,
      destination: params.origin,
      departure: `${params.returnDate}T09:00:00`,
      arrival: `${params.returnDate}T17:30:00`,
      duration: "7h 30m",
      stops: 0,
      price: 400,
      currency: "USD",
      cabinClass: "economy",
      available: true,
      source: "internal",
    },
    {
      id: "RF002",
      airline: "Uganda Airlines",
      airlineCode: "UR",
      flightNumber: "UR202",
      origin: params.destination,
      destination: params.origin,
      departure: `${params.returnDate}T12:00:00`,
      arrival: `${params.returnDate}T20:15:00`,
      duration: "7h 15m",
      stops: 0,
      price: 420,
      currency: "USD",
      cabinClass: "economy",
      available: true,
      source: "internal",
    },
    {
      id: "RF003",
      airline: "Emirates",
      airlineCode: "EK",
      flightNumber: "EK715",
      origin: params.destination,
      destination: params.origin,
      departure: `${params.returnDate}T16:00:00`,
      arrival: `${params.returnDate}T23:45:00`,
      duration: "6h 45m",
      stops: 0,
      price: 700,
      currency: "USD",
      cabinClass: "business",
      available: true,
      source: "internal",
    },
  ];

  return [...outbound, ...returnFlights];
}

export async function searchHotels(
  params: HotelSearchParams,
): Promise<Hotel[]> {
  const results: Hotel[] = [];

  for (const [providerKey, config] of Object.entries(apiProviders)) {
    if (!config.enabled && providerKey !== "internal") continue;

    try {
      switch (providerKey) {
        case "hotelbeds":
          results.push(...(await searchHotelbeds(params)));
          break;
        case "internal":
          results.push(...getInternalHotels(params));
          break;
      }
    } catch (error) {
      console.error(`Error searching ${providerKey}:`, error);
    }
  }

  return results.sort((a, b) => a.price - b.price);
}

async function searchHotelbeds(params: HotelSearchParams): Promise<Hotel[]> {
  return [];
}

function getInternalHotels(params: HotelSearchParams): Hotel[] {
  return [
    {
      id: "HTL001",
      name: "Serena Hotel Kampala",
      location: params.destination,
      rating: 4.8,
      reviews: 1250,
      price: 180,
      currency: "USD",
      amenities: ["WiFi", "Pool", "Spa", "Restaurant"],
      images: [],
      available: true,
      source: "internal",
    },
    {
      id: "HTL002",
      name: "Lake Victoria Resort",
      location: params.destination,
      rating: 4.6,
      reviews: 890,
      price: 150,
      currency: "USD",
      amenities: ["WiFi", "Beach", "Restaurant"],
      images: [],
      available: true,
      source: "internal",
    },
    {
      id: "HTL003",
      name: "Murchison Falls Lodge",
      location: params.destination,
      rating: 4.9,
      reviews: 560,
      price: 250,
      currency: "USD",
      amenities: ["WiFi", "Safari", "Pool"],
      images: [],
      available: true,
      source: "internal",
    },
  ];
}

export async function searchTours(destination: string): Promise<Tour[]> {
  const results: Tour[] = [];

  for (const [providerKey, config] of Object.entries(apiProviders)) {
    if (!config.enabled && providerKey !== "internal") continue;

    try {
      switch (providerKey) {
        case "viator":
          results.push(...(await searchViatorTours(destination)));
          break;
        case "internal":
          results.push(...getInternalTours(destination));
          break;
      }
    } catch (error) {
      console.error(`Error searching ${providerKey}:`, error);
    }
  }

  return results.sort((a, b) => a.price - b.price);
}

async function searchViatorTours(destination: string): Promise<Tour[]> {
  return [];
}

function getInternalTours(destination: string): Tour[] {
  return [
    {
      id: "TR001",
      name: "Gorilla Trekking Adventure",
      location: "Bwindi Forest",
      duration: "2 Days",
      price: 890,
      currency: "USD",
      rating: 4.9,
      reviews: 328,
      description: "Trek through the forest to see mountain gorillas",
      images: [],
      available: true,
      source: "internal",
    },
    {
      id: "TR002",
      name: "Murchison Falls Safari",
      location: "Murchison Falls",
      duration: "3 Days",
      price: 1250,
      currency: "USD",
      rating: 4.8,
      reviews: 256,
      description: "Wildlife safari at Murchison Falls",
      images: [],
      available: true,
      source: "internal",
    },
    {
      id: "TR003",
      name: "Source of Nile Tour",
      location: "Jinja",
      duration: "1 Day",
      price: 150,
      currency: "USD",
      rating: 4.7,
      reviews: 189,
      description: "Visit the source of the Nile River",
      images: [],
      available: true,
      source: "internal",
    },
  ];
}

export async function searchCars(params: {
  location: string;
  pickup: string;
  dropoff: string;
}): Promise<Car[]> {
  return getInternalCars(params.location);
}

function getInternalCars(location: string): Car[] {
  return [
    {
      id: "CAR001",
      model: "Toyota Corolla",
      type: "Compact",
      location: location,
      pricePerDay: 45,
      currency: "USD",
      seats: 5,
      transmission: "Automatic",
      features: ["A/C", "Bluetooth", "USB"],
      available: true,
      source: "internal",
    },
    {
      id: "CAR002",
      model: "Toyota Prado",
      type: "SUV",
      location: location,
      pricePerDay: 80,
      currency: "USD",
      seats: 7,
      transmission: "Automatic",
      features: ["4x4", "A/C", "Bluetooth", "Leather"],
      available: true,
      source: "internal",
    },
    {
      id: "CAR003",
      model: "Tesla Model 3",
      type: "Electric",
      location: location,
      pricePerDay: 120,
      currency: "USD",
      seats: 5,
      transmission: "Automatic",
      features: [" autopilot", "WiFi", "Premium Audio"],
      available: true,
      source: "internal",
    },
  ];
}

export function enableProvider(
  provider: Provider,
  apiKey: string,
  apiSecret?: string,
) {
  if (apiProviders[provider]) {
    apiProviders[provider].enabled = true;
    apiProviders[provider].apiKey = apiKey;
    apiProviders[provider].apiSecret = apiSecret;
  }
}

export function disableProvider(provider: Provider) {
  if (apiProviders[provider]) {
    apiProviders[provider].enabled = false;
  }
}
