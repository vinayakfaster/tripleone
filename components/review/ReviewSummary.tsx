"use client";

import { Review } from "../../app/types";
import { formatDistanceToNow } from "date-fns";

type Props = {
  reviews: Review[];
};

function getInitials(name: string) {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function ReviewSummary({ reviews }: Props) {
  return (
    <div className="bg-white rounded-md p-3 border border-neutral-100">

      <div className="space-y-6">
        {reviews.map((review) => {
          const name = review.user?.name || "Anonymous";
          const initials = getInitials(name);
          const timeAgo = formatDistanceToNow(new Date(review.createdAt), {
            addSuffix: true,
          });

          return (
            <div key={review.id} className="flex gap-4 items-start border-b pb-4">
              <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full text-sm font-semibold">
                {initials}
              </div>
              <div>
                <p className="font-semibold text-sm">{name}</p>
                <p className="text-xs text-neutral-500">{timeAgo}</p>
                <p className="text-sm text-neutral-600 mt-1">{review.comment}</p>
                <p className="text-sm text-yellow-500 mt-1">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ReviewSummary;
