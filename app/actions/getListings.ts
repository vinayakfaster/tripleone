import prisma from "@/lib/prismadb";

export interface IListingsParams {
  userId?: string;
  guestCount?: number;
  roomCount?: number;
  bathroomCount?: number;
  startDate?: string;
  endDate?: string;
  locationValue?: string;
  category?: string;
}

export default async function getListings(params: IListingsParams) {
  try {
    const {
      userId,
      roomCount,
      guestCount,
      bathroomCount,
      locationValue,
      startDate,
      endDate,
      category,
    } = params;

    let query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (category) {
      query.category = category;
    }

    if (roomCount) {
      query.roomCount = {
        gte: +roomCount,
      };
    }

    if (guestCount) {
      query.guestCount = {
        gte: +guestCount,
      };
    }

    if (bathroomCount) {
      query.bathroomCount = {
        gte: +bathroomCount,
      };
    }

    if (locationValue) {
      query.locationValue = locationValue;
    }

    if (startDate && endDate) {
      query.NOT = {
        reservations: {
          some: {
            OR: [
              {
                endDate: { gte: startDate },
                startDate: { lte: startDate },
              },
              {
                startDate: { lte: endDate },
                endDate: { gte: endDate },
              },
            ],
          },
        },
      };
    }

    const listings = await prisma.listing.findMany({
      where: query,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    });

    const safeListings = listings.map((list: typeof listings[number]) => ({      ...list,
      createdAt: list.createdAt.toISOString(),
      updatedAt: list.updatedAt ? list.updatedAt.toISOString() : null,
      imageSrc: (list.imageSrc as unknown[]).filter((img): img is string => typeof img === "string"),

      user: {
        ...list.user,
        createdAt: list.user.createdAt.toISOString(),
        updatedAt: list.user.updatedAt ? list.user.updatedAt.toISOString() : null,
        emailVerified: list.user.emailVerified
          ? list.user.emailVerified.toISOString()
          : null,
      },
    }));

    return safeListings;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
