"use client";

import Image from "next/image";
import Link from "next/link";
import { SafeListing, SafeUser } from "@/types";
import { Heart } from "lucide-react";

type Props = {
  title: string;
  listings: SafeListing[];
  currentUser?: SafeUser | null;
};

export default function HorizontalListingRow({ title, listings }: Props) {
  return (
    <section className="mt-24 px-3 md:px-12">

      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {listings.map((listing) => {
          const image = listing.imageSrc?.[0] || "/placeholder.jpg";
          const isFavorite =
            listing.isFavorite || Math.random() < 0.4; // randomly add badge
          const rating = listing.rating || 4.9; // fallback if missing

          return (
            <Link
              key={listing.id}
              href={`/listings/${listing.id}`}
              className="min-w-[240px] sm:min-w-[260px] rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-md transition"
            >
              {/* Image */}
              <div className="relative h-[180px] w-full">
                <Image
                  src={image}
                  alt={listing.title}
                  fill
                  className="object-cover"
                />
                {isFavorite && (
                  <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded-full shadow">
                    Guest favourite
                  </div>
                )}
                <button className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
                  <Heart size={16} className="text-gray-600" />
                </button>
              </div>

              {/* Text */}
              <div className="p-3 space-y-0.5">
                <p className="font-medium text-sm truncate">
                  {listing.locationValue}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {listing.title || listing.category}
                </p>
                <p className="text-sm">
                  <span className="font-semibold">₹{listing.price}</span>{" "}
                  <span className="text-gray-500">/ night</span>
                </p>
                <p className="text-yellow-500 text-sm">★ {rating.toFixed(2)}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
