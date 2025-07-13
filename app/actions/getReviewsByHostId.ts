import prisma from "@/lib/prismadb";

export default async function getReviewsByHostId(hostId: string) {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        listing: {
          userId: hostId,
        },
      },
      include: {
        user: true,
        listing: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews;
  } catch (error) {
    return [];
  }
}
