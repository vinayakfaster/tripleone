"use client";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { SafeReservation, SafeUser } from "../types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { isBefore, isAfter, isSameDay, setHours, setMinutes } from "date-fns";
import { FaStar } from "react-icons/fa";



type Props = {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
};

type ReviewForm = {
  [key: string]: {
    comment: string;
    rating: number;
  };
};

function TripsClient({ reservations, currentUser }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const [submittingReviewId, setSubmittingReviewId] = useState("");
  const [reviewData, setReviewData] = useState<ReviewForm>({});
  const [checkInConfirm, setCheckInConfirm] = useState<{ [key: string]: boolean }>({});

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);
      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.info("Reservation cancelled");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error || "Something went wrong");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  const handleReviewSubmit = async (reservationId: string, listingId: string) => {
    const review = reviewData[reservationId];
    if (!review || !review.comment || review.rating < 1 || review.rating > 5) {
      return toast.error("Please enter a comment and a rating between 1 and 5.");
    }

    setSubmittingReviewId(reservationId);

    try {
      await axios.post("/api/reviews", {
        listingId,
        reservationId,
        rating: review.rating,
        comment: review.comment,
      });
      toast.success("Review submitted!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to submit review.");
    } finally {
      setSubmittingReviewId("");
    }
  };

  return (
    <Container>
      <Heading title="Trips" subtitle="Where you've been and where you're going" />
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6 gap-4 px-4 sm:px-8">
        {reservations.map((reservation) => {
          const now = new Date();
          const checkIn = new Date(reservation.startDate);
          const checkOut = new Date(reservation.endDate);
          const checkOutDeadline = setMinutes(setHours(new Date(checkOut), 10), 30); // 10:30 AM checkout IST

          const isBeforeCheckIn = isBefore(now, checkIn);
          const isCheckInDay = isSameDay(now, checkIn);
          const isAfterCheckIn = isAfter(now, checkIn);
          const isBeforeCheckOutTime = isBefore(now, checkOutDeadline);
          const isAfterCheckOutTime = isAfter(now, checkOutDeadline);

          const isCheckedIn = checkInConfirm[reservation.id] || isAfterCheckIn;
          const isCompleted = isAfterCheckOutTime;
          const hasReview = !!reservation.reviewId;

          return (
            <div key={reservation.id}>
              <ListingCard
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId === reservation.id || !isBeforeCheckIn}
                actionLabel={isBeforeCheckIn ? "Cancel reservation" : undefined}
                currentUser={currentUser}
              />

              {/* Check-in confirmation on check-in date */}
              {isCheckInDay && !isCheckedIn && (
                <div className="mt-2 bg-yellow-100 p-4 rounded-lg text-sm">
                  <p>Have you checked in?</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setCheckInConfirm(prev => ({ ...prev, [reservation.id]: true }))}
                      className="px-3 py-1 bg-green-500 text-white rounded-md"
                    >
                      Yes
                    </button>
                    <button
                      className="px-3 py-1 bg-gray-300 text-gray-800 rounded-md"
                      disabled
                    >
                      No
                    </button>
                  </div>
                </div>
              )}

              {/* Checked in status */}
              {isCheckedIn && !isCompleted && (
                <div className="mt-2 text-sm font-semibold text-blue-600">Checked In</div>
              )}

              {/* Completed status + review */}
              {isCompleted && (
                <>
                  <div className="mt-2 text-sm font-semibold text-green-600">Completed</div>
                  {!hasReview && (
                    <div className="mt-4 p-4 rounded-lg border bg-white shadow-sm space-y-3 text-sm">
                      <h3 className="text-lg font-semibold text-gray-800">How was your trip?</h3>

                      <textarea
  className="w-full min-h-[80px] border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-rose-500 resize-none"

                        placeholder="Share your experience..."
                        value={reviewData[reservation.id]?.comment || ""}
                        onChange={(e) =>
                          setReviewData((prev) => ({
                            ...prev,
                            [reservation.id]: {
                              ...prev[reservation.id],
                              comment: e.target.value,
                            },
                          }))
                        }
                      />

                      <div>
                        <label className="block mb-1 text-sm font-medium text-gray-700">Rating</label>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={24}
                              className={`cursor-pointer transition-colors ${
                                reviewData[reservation.id]?.rating >= star
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              onClick={() =>
                                setReviewData((prev) => ({
                                  ...prev,
                                  [reservation.id]: {
                                    ...prev[reservation.id],
                                    rating: star,
                                  },
                                }))
                              }
                            />
                          ))}
                        </div>
                      </div>

                      <button
                        onClick={() => handleReviewSubmit(reservation.id, reservation.listing.id)}
                        disabled={submittingReviewId === reservation.id}
                        className="w-full bg-rose-500 text-white font-medium py-2 rounded-lg transition hover:bg-rose-600 disabled:opacity-50"
                      >
                        {submittingReviewId === reservation.id ? "Submitting..." : "Submit Review"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default TripsClient;
