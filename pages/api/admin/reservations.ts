// /pages/api/admin/reservations.ts

import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role?.toLowerCase() !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }

  const now = new Date();
  const reservations = await prisma.reservation.findMany({
    where: {
      endDate: { gte: now }, // upcoming
    },
    include: {
      listing: {
        include: {
          user: true, // host
        },
      },
      user: true, // guest
    },
    orderBy: {
      startDate: "desc",
    },
  });

  res.status(200).json(reservations);
}
