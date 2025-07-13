"use client";

import useSWR from "swr";
import axios from "axios";
import Image from "next/image";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

type Props = {
  listingId: string;
};

function ReviewList({ listingId }: Props) {
  const { data: reviews, mutate } = useSWR(`/api/reviews?listingId=${listingId}`, fetcher);

  if (!reviews) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet.</p>;

 return (
  <div className="mt-6 space-y-4">
    {reviews.map((review: any) => {
      const initials = review.user.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div key={review.id} className="border-b pb-4">
          <div className="flex items-center gap-2 mb-1">
            {/* Initials Circle */}
            <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-semibold">
              {initials || "?"}
            </div>

            <div className="flex flex-col">
              <span className="font-semibold">{review.user.name}</span>
              <span className="text-yellow-500 text-sm">⭐ {review.rating}</span>
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-1">{review.comment}</p>
        </div>
      );
    })}
  </div>
);

}

export default ReviewList;
