import { NextRequest, NextResponse } from "next/server";
import {
  processPayment,
  PaymentRequest,
  paymentMethods,
} from "@/lib/api/payments";

export async function POST(request: NextRequest) {
  try {
    const paymentRequest: PaymentRequest = await request.json();

    const result = await processPayment(paymentRequest);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json(
      { success: false, message: "Payment processing failed" },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    methods: paymentMethods,
  });
}
