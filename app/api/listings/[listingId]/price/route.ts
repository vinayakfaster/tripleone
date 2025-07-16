import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function PATCH(request: Request, { params }: { params: { listingId: string } }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.error();

  const body = await request.json();
  const { newPrice } = body;

  if (!newPrice || isNaN(newPrice)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const listing = await prisma.listing.findUnique({
    where: { id: params.listingId },
  });

  if (!listing || listing.userId !== currentUser.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const updatedListing = await prisma.listing.update({
    where: { id: params.listingId },
    data: {
      price: parseInt(newPrice),
      lastModifiedBy: currentUser.id,
    },
  });

  return NextResponse.json(updatedListing);
}
