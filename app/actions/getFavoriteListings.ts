import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    const favorites = await prisma.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const safeFavorites = favorites.map((listing: typeof favorites[number]) => ({
    id: listing.id,
  title: listing.title,
  description: listing.description,
  imageSrc: (listing.imageSrc as any[]).filter((img): img is string => typeof img === 'string'),
  category: listing.category,
  roomCount: listing.roomCount,
  bathroomCount: listing.bathroomCount,
  guestCount: listing.guestCount,
  locationValue: listing.locationValue,
  userId: listing.userId,
  price: listing.price,
  createdAt: listing.createdAt.toISOString(),
  updatedAt: listing.updatedAt ? listing.updatedAt.toISOString() : null,
  contactPhone: listing.contactPhone ?? null,
}));
    return safeFavorites;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
