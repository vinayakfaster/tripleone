export type SafeUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  hashedPassword?: string;
  createdAt: string;
  updatedAt: string;
};

export type SafeReservation = {
  id: string;
  listing: SafeListing;
  userId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  reviewId?: string | null; // ✅ this is important
};


export type safeListing = {
  id: string;
  title: string;
  description: string;
  imageSrc: string[]; // For multiple images
  category: string;
  roomCount: number;
  bathroomCount: number;
  guestCount: number;
  locationValue: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

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

