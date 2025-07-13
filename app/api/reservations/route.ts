import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const body = await request.json();
  const { listingId, startDate, endDate, totalPrice, guestCount } = body;

  // Validate inputs
  if (!listingId || !startDate || !endDate || !totalPrice || !guestCount) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.create({
  data: {
    userId: currentUser.id,
    listingId,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    totalPrice: amount / 100, // Razorpay sends amount in paise
    guestCount: guests?.adults || 1,
    guests: guests, // ✅ Now allowed thanks to Json? type
    paymentId: razorpay_payment_id, // ✅ Now allowed
  },
});

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
