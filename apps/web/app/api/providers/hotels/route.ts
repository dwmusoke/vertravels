import { NextRequest, NextResponse } from "next/server";
import { searchHotels, HotelSearchParams } from "@/lib/api/providers";

export async function POST(request: NextRequest) {
  try {
    const params: HotelSearchParams = await request.json();

    const hotels = await searchHotels(params);

    return NextResponse.json({
      success: true,
      data: hotels,
      count: hotels.length,
    });
  } catch (error) {
    console.error("Hotel search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search hotels" },
      { status: 500 },
    );
  }
}
