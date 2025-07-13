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
      startDate: reservation.startDate.toISOString(),
      endDate: reservation.endDate.toISOString(),
      createdAt: reservation.createdAt.toISOString(),
      listing: {
        ...reservation.listing,
        createdAt: reservation.listing.createdAt.toISOString(),
        contactPhone: reservation.listing.contactPhone || null, // ✅ Ensure it's passed
        user: {
          ...reservation.listing.user,
          contactPhone: reservation.listing.user.contactPhone || null, // ✅ Include host phone
          createdAt: reservation.listing.user.createdAt.toISOString(),
          updatedAt: reservation.listing.user.updatedAt.toISOString(),
          emailVerified: reservation.listing.user.emailVerified
            ? reservation.listing.user.emailVerified.toISOString()
            : null,
        },
      },
      user: {
        ...reservation.user,
        phone: reservation.user.phone || null, // ✅ Include guest phone
        createdAt: reservation.user.createdAt.toISOString(),
        updatedAt: reservation.user.updatedAt.toISOString(),
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
