// app/actions/getReservation.ts

import prisma from "@/lib/prismadb";

interface IParams {
  listingId?: string;
  userId?: string;
  authorId?: string;
}

export default async function getReservation(params: IParams) {
  try {
    const { listingId, userId, authorId } = params;

    const query: any = {};
    if (listingId) query.listingId = listingId;
    if (userId) query.userId = userId;
    if (authorId) query.listing = { userId: authorId };

    const reservations = await prisma.reservation.findMany({
      where: query,
      include: {
        user: true,
        listing: {
          include: {
            user: true,
          },
        },
      },
    });

    const safeReservations = reservations.map((reservation: any) => ({
      ...reservation,
      guests: reservation.guests ?? 0,
      reviewId: reservation.reviewId ?? null,
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
        contactPhone: reservation.listing.contactPhone || null,
        user: {
          ...reservation.listing.user,
          createdAt: reservation.listing.user.createdAt.toISOString(),
          updatedAt:
            reservation.listing.user.updatedAt?.toISOString() || "",
          emailVerified:
            reservation.listing.user.emailVerified?.toISOString() || null,
          contactPhone: reservation.listing.user.contactPhone || null,
        },
      },
      user: {
        ...reservation.user,
        createdAt: reservation.user.createdAt.toISOString(),
        updatedAt: reservation.user.updatedAt?.toISOString() || "",
        emailVerified:
          reservation.user.emailVerified?.toISOString() || null,
        phone: reservation.user.phone || null,
        contactPhone: reservation.user.contactPhone || null,
      },
    }));

    return safeReservations;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
