import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await req.json();
  const {
    title,
    description,
    imageSrc,
    category,
    roomCount,
    bathroomCount,
    guestCount,
    location,
    price,
    contactPhone,
  } = body;

  // ✅ Validate required fields
  if (
    !title ||
    !description ||
    !imageSrc ||
    !category ||
    !roomCount ||
    !bathroomCount ||
    !guestCount ||
    !location ||
    !location.label ||
    price === undefined ||
    isNaN(Number(price))
  ) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  // ✅ Update user's phone if provided
  if (contactPhone) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { contactPhone },
    });
  }

  // ✅ Create listing
  const listing = await prisma.listing.create({
    data: {
      title,
      description,
      imageSrc,
      category,
      roomCount,
      bathroomCount,
      guestCount,
      locationValue: location.label,
      price: parseInt(price, 10),
      contactPhone,
      user: {
        connect: { id: currentUser.id },
      },
    },
  });

  return NextResponse.json(listing);
}
