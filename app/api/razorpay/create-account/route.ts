import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "host") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    // ✅ DO NOT INCLUDE 'contact' FIELD
  const account = await razorpay.accounts.create({
  type: "route",
  email: currentUser.email,
  phone: currentUser.phone,
  legal_business_name: currentUser.name,
  business_type: "individual",
  customer_facing_business_name: currentUser.name,
  profile: {
    category: "individual",
    subcategory: "freelancer",
    addresses: {
      registered: {
        street1: "123 Host Lane",
        street2: "Near TripleOne HQ",
        city: "Mumbai",
        state: "Maharashtra",
        postal_code: "400001",
        country: "IN",
      },
    },
  },
});


    // ✅ Save Razorpay Account ID to DB
    await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        razorpayAccountId: account.id, // e.g. acc_9Dj2gY9bnnF8cG
      },
    });

    return NextResponse.json({ success: true, accountId: account.id });
  } catch (error: any) {
    console.error("🔴 Razorpay account error:", error.response?.data || error.message || error);
    return NextResponse.json({ error: "Failed to create Razorpay account" }, { status: 500 });
  }
}
