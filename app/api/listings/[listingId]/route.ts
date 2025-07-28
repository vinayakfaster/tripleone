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

  // ✅ First check ownership
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized or listing not found" }, { status: 403 });
  }

  await prisma.listing.delete({
    where: { id: listingId },
  });

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

  // ✅ Step 1: Check if listing exists and belongs to the user
  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing || existingListing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized or listing not found" }, { status: 403 });
  }

  // ✅ Step 2: Proceed with update
  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      title,
      price: parseInt(price, 10),
    },
  });

  return NextResponse.json(updatedListing);

}
