import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.error();
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
    !price
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // ✅ Update host's contactPhone on the user
  if (contactPhone) {
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { contactPhone },
    });
  }

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
    contactPhone, // ✅ Add this line
    user: {
      connect: { id: currentUser.id },
    },
  },
});


  return NextResponse.json(listing);
}
