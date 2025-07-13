"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Container from "@/components/Container";
import Heading from "@/components/Heading";
import ListingCard from "@/components/listing/ListingCard";
import { SafeReservation, SafeUser } from "@/types";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function ReservationsAdminClient() {
  const [reservations, setReservations] = useState<SafeReservation[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/admin/reservations")
      .then(res => setReservations(res.data))
      .catch(err => toast.error("Not authorized or failed to fetch"))
      .finally(() => setLoading(false));
  }, []);

  const onCancel = async (id: string) => {
    try {
      await axios.delete(`/api/reservations/${id}`);
      toast.info("Reservation cancelled");
      setReservations(prev => prev.filter(r => r.id !== id));
    } catch {
      toast.error("Failed to cancel");
    }
  };

  if (loading) return <Container><Heading title="Admin" subtitle="Loading…" /></Container>;
  if (reservations.length === 0)
    return <Container><Heading title="Admin" subtitle="No upcoming reservations" /></Container>;

  return (
    <Container>
      <Heading title="Admin Panel" subtitle="Manage upcoming bookings" />
      <div className="grid ...">
        {reservations.map(r => (
          <ListingCard
            key={r.id}
            data={r.listing}
            reservation={r}
            actionId={r.id}
            onAction={onCancel}
            actionLabel="Cancel booking"
            currentUser={r.user as SafeUser}
          />
        ))}
      </div>
    </Container>
  );
}
