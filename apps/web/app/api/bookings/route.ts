import { NextRequest, NextResponse } from "next/server";

// In-memory storage for demo (replace with database in production)
let bookings: any[] = [
  {
    id: "VT-001",
    type: "Flight",
    customer: "John Smith",
    email: "john@example.com",
    phone: "+1 234 567 890",
    route: "EBB → LON",
    date: "May 15, 2026",
    amount: "$1,234",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "2026-05-10",
  },
  {
    id: "VT-002",
    type: "Hotel",
    customer: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 234 567 891",
    route: "Dubai",
    date: "May 18, 2026",
    amount: "$567",
    status: "Pending",
    payment: "Pending",
    source: "Agent",
    createdAt: "2026-05-11",
  },
  {
    id: "VT-003",
    type: "Tour",
    customer: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 234 567 892",
    route: "Safari",
    date: "May 20, 2026",
    amount: "$890",
    status: "Confirmed",
    payment: "Paid",
    source: "Website",
    createdAt: "2026-05-12",
  },
];

// GET - Fetch all bookings (for backoffice)
export async function GET() {
  return NextResponse.json({
    success: true,
    data: bookings,
    total: bookings.length,
  });
}

// POST - Create new booking (from website checkout)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    const required = ["type", "customer", "email", "route", "date", "amount"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 },
        );
      }
    }

    // Generate booking ID
    const newId = `VT-${String(bookings.length + 1).padStart(3, "0")}`;

    // Create new booking
    const newBooking = {
      id: newId,
      type: body.type,
      customer: body.customer,
      email: body.email,
      phone: body.phone || "",
      route: body.route,
      date: body.date,
      returnDate: body.returnDate || "",
      guests: body.guests || "1",
      amount: body.amount,
      status: "Pending",
      payment: "Pending",
      source: "Website",
      pnr: body.pnr || "",
      notes: body.notes || "",
      createdAt: new Date().toISOString().split("T")[0],
    };

    // Add to stored bookings
    bookings.unshift(newBooking);

    return NextResponse.json({
      success: true,
      data: newBooking,
      message: "Booking created successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
