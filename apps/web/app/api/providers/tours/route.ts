import { NextRequest, NextResponse } from "next/server";
import { searchTours } from "@/lib/api/providers";

export async function POST(request: NextRequest) {
  try {
    const { destination } = await request.json();

    const tours = await searchTours(destination || "");

    return NextResponse.json({
      success: true,
      data: tours,
      count: tours.length,
    });
  } catch (error) {
    console.error("Tour search error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to search tours" },
      { status: 500 },
    );
  }
}
