import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

interface IParams {
  listingId?: string;
}

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
  const { newTitle, newPrice } = body;

  if (!listingId || typeof listingId !== "string") {
    return NextResponse.json({ error: "Invalid listing ID" }, { status: 400 });
  }

  if (!newTitle || typeof newPrice !== "number" || isNaN(newPrice)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existingListing = await prisma.listing.findUnique({
    where: { id: listingId },
  });

  if (!existingListing || existingListing.userId !== currentUser.id) {
    return NextResponse.json(
      { error: "Unauthorized or listing not found" },
      { status: 403 }
    );
  }

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: {
      title: newTitle,
      price: newPrice, // ✅ No parseInt — already a number
    },
  });

  return NextResponse.json(updatedListing);
}
