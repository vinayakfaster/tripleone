// lib/safeListing.ts
import { Listing, User } from "@prisma/client";

function toISOStringSafe(value: any) {
  return value instanceof Date ? value.toISOString() : value ?? null;
}

export default function SafeListing(listing: Listing & { user?: User }) {
  return {
    ...listing,
    createdAt: toISOStringSafe(listing.createdAt),
    userId: listing.userId,
    user: listing.user
      ? {
          ...listing.user,
          createdAt: toISOStringSafe(listing.user.createdAt),
          updatedAt: toISOStringSafe(listing.user.updatedAt),
          emailVerified: toISOStringSafe(listing.user.emailVerified),
        }
      : undefined,
  };
}
