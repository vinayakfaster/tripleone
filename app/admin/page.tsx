import getCurrentUser from "../actions/getCurrentUser";
import ClientOnly from "@/components/ClientOnly";
import EmptyState from "@/components/EmptyState";
import AdminReservationsClient from "./AdminReservationsClient";
import prisma from "@/lib/prismadb";

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
          user: true, // host
        },
      },
    },
    orderBy: {
      startDate: "asc",
    },
  });

  return (
    <ClientOnly>
      <AdminReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
}
