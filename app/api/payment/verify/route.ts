// app/api/payment/verify/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { sendBookingEmail } from "@/lib/email";

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
      endDate
    } = await req.json();

    const currentUser = await getCurrentUser();
    if (!currentUser) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // Get listing for title
    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

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

    // ✅ Send Email
    await sendBookingEmail({
      to: [
        currentUser.email!,                    // Guest
        "admin@yourdomain.com"                 // Admin
      ],
      subject: `✅ New Booking: ${listing?.title}`,
      html: `
        <h2>New Reservation Confirmed</h2>
        <p><strong>Guest:</strong> ${currentUser.name}</p>
        <p><strong>Listing:</strong> ${listing?.title}</p>
        <p><strong>Dates:</strong> ${startDate} to ${endDate}</p>
        <p><strong>Total Price:</strong> ₹${amount / 100}</p>
        <p><strong>Payment ID:</strong> ${razorpay_payment_id}</p>
      `,
    });

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error("❌ Razorpay verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
