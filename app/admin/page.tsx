// /app/admin/page.tsx

import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import AdminReservationsClient from "./AdminReservationsClient";
import prisma from "@/lib/prismadb";
import { SafeUser } from "../types";

export default async function AdminPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <ClientOnly>
        <EmptyState title="Unauthorized" subtitle="Admin access only" />
      </ClientOnly>
    );
  }

  const reservations = await prisma.reservation.findMany({
    where: {
      endDate: {
        gte: new Date(),
      },
    },
    include: {
      user: true,
      listing: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  // Type for each reservation item
  type ReservationWithNestedData = typeof reservations[number];

 const safeReservations = reservations.map((reservation: ReservationWithNestedData) => ({
  ...reservation,
  createdAt: reservation.createdAt.toISOString(),
  startDate: reservation.startDate.toISOString(),
  endDate: reservation.endDate.toISOString(),
  user: {
    ...reservation.user,
    createdAt: reservation.user.createdAt.toISOString(),
    updatedAt: reservation.user.updatedAt
      ? reservation.user.updatedAt.toISOString()
      : null,
    emailVerified: reservation.user.emailVerified
      ? reservation.user.emailVerified.toISOString()
      : null,
  },
  listing: {
    ...reservation.listing,
    createdAt: reservation.listing.createdAt.toISOString(),
    updatedAt: reservation.listing.updatedAt
      ? reservation.listing.updatedAt.toISOString()
      : null,
    imageSrc: (reservation.listing.imageSrc as unknown[] as string[]).filter(
      (val): val is string => typeof val === "string"
    ), // ✅ Filter and cast imageSrc safely
    user: {
      ...reservation.listing.user,
      createdAt: reservation.listing.user.createdAt.toISOString(),
      updatedAt: reservation.listing.user.updatedAt
        ? reservation.listing.user.updatedAt.toISOString()
        : null,
      emailVerified: reservation.listing.user.emailVerified
        ? reservation.listing.user.emailVerified.toISOString()
        : null,
    },
  },
}));


  const safeCurrentUser: SafeUser = {
    ...currentUser,
    createdAt: new Date(currentUser.createdAt).toISOString(),
    updatedAt: currentUser.updatedAt
      ? new Date(currentUser.updatedAt).toISOString()
      : null,
    emailVerified: currentUser.emailVerified
      ? new Date(currentUser.emailVerified).toISOString()
      : null,
  };

  return (
    <ClientOnly>
      <AdminReservationsClient
        reservations={safeReservations}
        currentUser={safeCurrentUser}
      />
    </ClientOnly>
  );
}
