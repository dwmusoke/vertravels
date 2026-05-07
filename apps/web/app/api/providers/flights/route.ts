import { NextRequest, NextResponse } from "next/server";
import { searchFlights, FlightSearchParams } from "@/lib/api/providers";

export async function POST(request: NextRequest) {
  try {
    const params: FlightSearchParams = await request.json();

    const flights = await searchFlights(params);

    return NextResponse.json({
      success: true,
      data: flights,
      count: flights.length,
    });
  } catch (error) {
    console.error("Flight search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search flights" },
      { status: 500 },
    );
  }
}
