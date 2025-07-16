import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";
import HostDashboardClient from "@/components/host/HostDashboardClient";

export default async function HostDashboardPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "host") {
    return <div className="p-10 text-lg">❌ Unauthorized</div>;
  }

  // 🔍 Fetch full user to get Razorpay account ID
  const user = await prisma.user.findUnique({
    where: { id: currentUser.id },
    select: { razorpayAccountId: true },
  });

  // 🏡 Get listings by this host
  const listings = await prisma.listing.findMany({
    where: { userId: currentUser.id },
    select: { id: true },
  });

  const listingIds = listings.map((listing) => listing.id);

  // 📅 Upcoming reservations (check-in after today)
  const upcomingReservations = await prisma.reservation.findMany({
    where: {
      listingId: { in: listingIds },
      startDate: { gte: new Date() },
    },
    select: { id: true },
  });

  // 💰 All reservations to calculate earnings
  const allReservations = await prisma.reservation.findMany({
    where: {
      listingId: { in: listingIds },
    },
    select: { totalPrice: true },
  });

  const totalEarnings = allReservations.reduce(
    (sum, res) => sum + (res.totalPrice || 0),
    0
  );

  return (
    <HostDashboardClient
      listingsCount={listings.length}
      upcomingReservationsCount={upcomingReservations.length}
      totalEarnings={totalEarnings}
      hasRazorpayAccount={!!user?.razorpayAccountId} // ✅ pass to client
    />
  );
}
