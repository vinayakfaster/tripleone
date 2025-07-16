import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const rawBody = await req.text(); // read raw body for signature check
  const signature = req.headers.get("x-razorpay-signature");

  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "payout.processed") {
    const payout = event.payload.payout.entity;
    console.log("✅ Payout processed:", payout.id);

    // Optional: Save payout to DB
    await prisma.payout.create({
      data: {
        payoutId: payout.id,
        amount: payout.amount / 100,
        currency: payout.currency,
        status: payout.status,
        notes: payout.notes || {},
        userId: payout.notes?.hostId || null,
      },
    });
  }

  return NextResponse.json({ received: true });
}
