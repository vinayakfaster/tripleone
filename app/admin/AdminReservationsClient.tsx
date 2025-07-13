"use client";

import { SafeReservation, SafeUser } from "@/types";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { toast } from "react-toastify";

import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";

type Props = {
  reservations: SafeReservation[];
  currentUser?: SafeUser | null;
};

function AdminReservationsClient({ reservations, currentUser }: Props) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success("Reservation cancelled");
          router.refresh();
        })
        .catch(() => {
          toast.error("Something went wrong.");
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router]
  );

  return (
    <Container>
      <Heading
        title="Admin Dashboard"
        subtitle="All upcoming reservations across the platform"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 px-4 sm:px-6 md:px-8">
        {reservations.map((reservation) => {
          const host = reservation.listing.user;
          const guest = reservation.user;

          const now = new Date();
          const start = new Date(reservation.startDate);
          const end = new Date(reservation.endDate);

          const isUpcoming = start > now;
          const isOngoing = start <= now && end >= now;
          const isCompleted = end < now;

          let statusLabel = "";
          let statusClass = "";
          let timingNote = "";

          if (isUpcoming) {
            const days = Math.ceil((start.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            statusLabel = "Upcoming";
            statusClass = "bg-yellow-100 text-yellow-800";
            timingNote = `Check-in in ${days} day${days !== 1 ? "s" : ""}`;
          } else if (isOngoing) {
            const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            statusLabel = "Ongoing";
            statusClass = "bg-blue-100 text-blue-800";
            timingNote = `Checkout in ${days} day${days !== 1 ? "s" : ""}`;
          } else {
            const days = Math.ceil((now.getTime() - end.getTime()) / (1000 * 60 * 60 * 24));
            statusLabel = "Completed";
            statusClass = "bg-gray-100 text-gray-800";
            timingNote = `Checked out ${days} day${days !== 1 ? "s" : ""} ago`;
          }

          return (
            <div
              key={reservation.id}
              className="flex flex-col gap-2 border border-gray-200 rounded-xl overflow-hidden bg-white"
            >
              <ListingCard
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId === reservation.id}
                actionLabel="Cancel reservation"
                currentUser={currentUser}
              />

              <div className="text-sm text-gray-800 space-y-1 px-4 py-3 bg-gray-50 border-t">
                <p>
                  <strong>Host:</strong> {host?.name || "N/A"} (
                  {host?.email || "N/A"}, 📞 {host?.contactPhone || "N/A"})
                </p>
                <p>
                  <strong>Guest:</strong> {guest?.name || "N/A"} (
                  {guest?.email || "N/A"}, 📞 {guest?.phone || "N/A"})
                </p>
                <p>
                  <strong>Guests:</strong> {reservation.guestCount || 1}
                </p>

                {/* 🟢 Payment info */}
                <p>
                  <strong>Payment Status:</strong>{" "}
                  {reservation.paymentId ? (
                    <span className="text-green-600 font-medium">Paid ✅</span>
                  ) : (
                    <span className="text-red-600 font-medium">Unpaid ❌</span>
                  )}
                </p>

                {reservation.paymentId && (
                  <>
                    <p>
                      <strong>Amount Received:</strong> ₹{reservation.totalPrice}
                    </p>
                    <p>
                      <strong>Payment ID:</strong> {reservation.paymentId}
                    </p>
                    <p>
                      <strong>Platform Share:</strong> ₹
                      {Math.round(reservation.totalPrice * 0.2)}
                    </p>
                    <p>
                      <strong>Host Share:</strong> ₹
                      {Math.round(reservation.totalPrice * 0.8)}
                    </p>
                  </>
                )}

                {/* ⏳ Check-in/out status */}
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-md font-medium ${statusClass}`}
                  >
                    {statusLabel}
                  </span>
                </p>
                <p className="text-gray-500 text-sm italic">{timingNote}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export default AdminReservationsClient;
