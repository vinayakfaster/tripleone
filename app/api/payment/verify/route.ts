// app/api/payment/verify/route.ts

import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: Request) {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      listingId,
      amount,
      guests,
      startDate,
      endDate,
    } = await req.json();

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // 🔐 Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 🏠 Get listing info
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // ✅ Create Reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: currentUser.id,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: amount / 100,
        paymentId: razorpay_payment_id,
        guestCount: guests.adults,
        guests,
        bookedName: currentUser.name,
        bookedPhone: currentUser.phone,
        bookedEmail: currentUser.email,
      },
    });

    // 📧 Send Email using Resend API
    const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: [currentUser.email, "hijeckerg@gmail.com"], // ✅ Send to both user & admin
        name: currentUser.name,
        listingTitle: listing.title,
        checkIn: startDate,
        checkOut: endDate,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("📧 Email response:", emailResult);

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error("❌ Verify error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
