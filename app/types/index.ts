export type SafeUser = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: string | null;
  image: string | null;
  createdAt: string;
  updatedAt: string | null;
  role: string;
  phone: string | null;
  bio: string | null;
  razorpayAccountId: string | null;
  contactPhone: string | null;
   favoriteIds?: string[];
};

export type SafeListing = {
  id: string;
  title: string;
  description: string;
  imageSrc: string[];
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
  createdAt: string;
  updatedAt: string | null
  userId: string;
  contactPhone: string | null;
  lastModifiedBy?: string | null;
  user?: SafeUser; // ✅ include this only if you are using listing.user anywhere
  isFavorite?: boolean;
};

export type SafeReservation = {
  user: any;
  guestCount: number;
  paymentId: any;
  id: string;
  listing: SafeListing;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  reviewId?: string | null;
};

export interface SafeAdminReservation {
  id: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  listingId: string;
  userId: string;
  totalPrice: number;
  guestCount: number;
  bookedEmail: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  listing: {
    id: string;
    title: string;
    createdAt: string;
    updatedAt: string | null;
    user: {
      id: string;
      name: string | null;
      email: string | null;
      image: string | null;
    };
  };
}


export type Review = {
  id: string;
  listingId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    image: string;
  };
};
