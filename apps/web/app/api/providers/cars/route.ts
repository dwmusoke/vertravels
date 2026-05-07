import { NextRequest, NextResponse } from "next/server";
import { searchCars } from "@/lib/api/providers";

export async function POST(request: NextRequest) {
  try {
    const params = await request.json();

    const cars = await searchCars(params);

    return NextResponse.json({
      success: true,
      data: cars,
      count: cars.length,
    });
  } catch (error) {
    console.error("Car search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search cars" },
      { status: 500 },
    );
  }
}
