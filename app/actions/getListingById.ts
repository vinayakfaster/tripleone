import prisma from "@/lib/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    if (!listingId) return null;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
        reviews: {
          include: {
            user: true,
          },
        },
      },
    });


    if (!listing) return null;

    return {
      ...listing,
      createdAt: listing.createdAt.toISOString(),
      user: {
        ...listing.user,
        createdAt: listing.user.createdAt.toISOString(),
        updatedAt: listing.user.updatedAt.toISOString(),
        emailVerified: listing.user.emailVerified?.toISOString() || null,
      },
      reviews: listing.reviews.map((review) => ({
        ...review,
        createdAt: review.createdAt.toISOString(),
        user: {
          name: review.user.name,
          image: review.user.image,
        },
      })),
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
