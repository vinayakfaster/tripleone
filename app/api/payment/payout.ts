import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// ✅ Safely check for Razorpay credentials
const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_KEY_SECRET;

if (!key_id || !key_secret) {
  throw new Error("❌ Razorpay credentials are missing in environment variables");
}

const razorpay = new Razorpay({
  key_id,
  key_secret,
});

export async function POST(req: Request) {
  try {
    const { amount, hostRazorpayAccountId } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount for payout" },
        { status: 400 }
      );
    }

    if (!hostRazorpayAccountId || typeof hostRazorpayAccountId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid hostRazorpayAccountId" },
        { status: 400 }
      );
    }

    const payoutAmount = Math.round(amount * 0.8) * 100; // amount in paise

    const transfer = await razorpay.transfers.create({
      account: hostRazorpayAccountId,
      amount: payoutAmount,
      currency: "INR",
      notes: {
        purpose: "Host Payout",
      },
      on_hold: false,
    });

    return NextResponse.json({ success: true, transfer });
  } catch (error: any) {
    console.error("🔥 Error in payout route:", error);

    return NextResponse.json(
      {
        error: error?.message || "Unknown Razorpay payout error",
      },
      { status: 500 }
    );
  }
}
