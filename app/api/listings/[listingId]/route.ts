import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

// ✅ DELETE listing
export async function DELETE(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { listingId } = params;

  if (!listingId || typeof listingId !== "string") {
    throw new Error("Invalid Id");
  }

  const deleted = await prisma.listing.deleteMany({
    where: {
      id: listingId,
      userId: currentUser.id,
    },
  });

  if (deleted.count === 0) {
    return NextResponse.json({ error: "Listing not found or unauthorized" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

// ✅ PATCH listing (update title and price)

export async function PATCH(
  request: Request,
  { params }: { params: IParams }
) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { listingId } = params;
  const body = await request.json();
  const { title, price } = body;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  const listing = await prisma.listing.update({
    where: {
      id: listingId,
      userId: currentUser.id, // Optional: ensure user owns it
    },
    data: {
      title,
      price: parseInt(price, 10),
    },
  });

  return NextResponse.json(listing);
}