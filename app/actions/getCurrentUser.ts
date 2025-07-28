import prisma from "@/lib/prismadb";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getServerSession } from "next-auth/next";

export async function getSession() {
  return await getServerSession(authOptions);
}

export default async function getCurrentUser() {
  try {
    const session = await getSession();

    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        contactPhone: true,
        razorpayAccountId: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        role: true,
        favoriteIds: true,
        bio: true,
      },
    });

    if (!currentUser) {
      return null;
    }

    return {
      ...currentUser,
      createdAt: currentUser.createdAt.toISOString(),
      // updatedAt: currentUser.updatedAt.toISOString(), // ✅ FIXED
      updatedAt: currentUser.updatedAt?.toISOString() || null,

      emailVerified: currentUser.emailVerified?.toISOString() || null,
      favoriteIds: currentUser.favoriteIds || [],
      phone: currentUser.phone ?? null,
      contactPhone: currentUser.contactPhone ?? null,
      razorpayAccountId: currentUser.razorpayAccountId ?? null,
      role: currentUser.role,
      bio: currentUser.bio ?? null,
    };
  } catch (error: any) {
    console.log("❌ getCurrentUser error:", error);
    return null;
  }
}
