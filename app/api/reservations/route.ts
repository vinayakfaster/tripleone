import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const body = await request.json();

  const {
    listingId,
    startDate,
    endDate,
    totalPrice,
    guestCount,
    guests,
    amount,
    razorpay_payment_id,
  } = body;

  // Validate inputs
  if (
    !listingId ||
    !startDate ||
    !endDate ||
    !totalPrice ||
    !guestCount ||
    !amount ||
    !razorpay_payment_id
  ) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  try {
    const reservation = await prisma.reservation.create({
      data: {
        userId: currentUser.id,
        listingId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        totalPrice: amount / 100, // Convert from paise
        guestCount: guests?.adults || guestCount,
        guests, // JSON field in schema.prisma
        paymentId: razorpay_payment_id,
      },
    });

    return NextResponse.json(reservation);
  } catch (error) {
    console.error("[RESERVATION_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
