import prisma from "@/lib/prismadb";

interface IParams {
  listingId?: string;
}

export default async function getListingById(params: IParams) {
  try {
    const { listingId } = params;

    const listing = await prisma.listing.findUnique({
      where: {
        id: listingId,
      },
      include: {
        user: true,
      },
    });

    if (!listing) {
      return null;
    }

   return {
  ...listing,
  createdAt: listing.createdAt.toString(),
  updatedAt: listing.updatedAt?.toString() || null, // 🟢 add this
  imageSrc: Array.isArray(listing.imageSrc)
    ? listing.imageSrc.filter((img: unknown): img is string => typeof img === "string")
    : [],
  user: {
    ...listing.user,
    createdAt: listing.user.createdAt.toString(),
    updatedAt: listing.user.updatedAt?.toString() || null, // 🔥 yeh line add karo
    emailVerified: listing.user.emailVerified?.toString() || null,
  },
};

  } catch (error: any) {
    throw new Error(error.message);
  }
}
