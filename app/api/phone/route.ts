import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";


export async function POST(request: Request) {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const { phone } = body;

  if (!phone) {
    return NextResponse.json({ error: "Phone is required" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { phone },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[PHONE_UPDATE_ERROR]", error);
    return NextResponse.json({ error: "Failed to update phone" }, { status: 500 });
  }
}
