import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(
  request: Request,
  { params }: { params: { listingId: string } }
) {
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.error();

  const { newPrice, newTitle } = await request.json();

  if (!params.listingId) {
    return NextResponse.json({ error: "Listing ID is required" }, { status: 400 });
  }

  if (!newTitle || typeof newTitle !== "string" || isNaN(newPrice)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: {
      id: params.listingId,
    },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedListing = await prisma.listing.update({
    where: {
      id: params.listingId,
    },
    data: {
      title: newTitle,
      price: parseInt(newPrice),
    },
  });

  return NextResponse.json(updatedListing);
}
