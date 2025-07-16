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
        listing: {
          include: {
            user: true, // host
          },
        },
        user: true, // guest
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeReservations = reservations.map((reservation) => ({
  ...reservation,
  startDate: reservation.startDate?.toISOString() || null,
  endDate: reservation.endDate?.toISOString() || null,
  createdAt: reservation.createdAt?.toISOString() || null,
  updatedAt: reservation.updatedAt?.toISOString() || null,
  listing: {
    ...reservation.listing,
    createdAt: reservation.listing.createdAt?.toISOString() || null,
    updatedAt: reservation.listing.updatedAt?.toISOString() || null,
    contactPhone: reservation.listing.contactPhone || null,
    user: {
      ...reservation.listing.user,
      contactPhone: reservation.listing.user.contactPhone || null,
      createdAt: reservation.listing.user.createdAt?.toISOString() || null,
      updatedAt: reservation.listing.user.updatedAt?.toISOString() || null,
      emailVerified: reservation.listing.user.emailVerified
        ? reservation.listing.user.emailVerified.toISOString()
        : null,
    },
  },
  user: {
    ...reservation.user,
    phone: reservation.user.phone || null,
    createdAt: reservation.user.createdAt?.toISOString() || null,
    updatedAt: reservation.user.updatedAt?.toISOString() || null,
    emailVerified: reservation.user.emailVerified
      ? reservation.user.emailVerified.toISOString()
      : null,
  },
}));


    return safeReservations;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
