import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { listingId, reservationId, rating, comment } = body;

    // Basic validation
    if (!listingId || !reservationId || !rating || !comment) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        listingId,
        reservationId,
        rating,
        comment,
        userId: currentUser.id, // ✅ pulled from session, not body
      },
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error("Review POST error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const listingId = new URL(req.url).searchParams.get("listingId");

    if (!listingId) return new NextResponse("Listing ID missing", { status: 400 });

    const reviews = await prisma.review.findMany({
      where: { listingId },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("Review GET error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
