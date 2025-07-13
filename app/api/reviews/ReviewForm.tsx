"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

type Props = {
  listingId: string;
  reservationId: string;
  userId: string;
  onReviewSubmitted?: () => void;
};

function ReviewForm({ listingId, reservationId, userId, onReviewSubmitted }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post("/api/reviews", {
        listingId,
        reservationId,
        userId,
        rating,
        comment,
      });

      toast.success("Review submitted!");
      onReviewSubmitted?.();
      setRating(5);
      setComment("");
    } catch (error) {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-xl">
      <div className="mb-3">
        <label className="block mb-1">Rating (1–5)</label>
        <input
          type="number"
          min="1"
          max="5"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border p-2 rounded w-full"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border p-2 rounded w-full"
          rows={4}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600"
      >
        Submit Review
      </button>
    </div>
  );
}

export default ReviewForm;
