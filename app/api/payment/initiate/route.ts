import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/lib/prismadb";

const key_id = process.env.RAZORPAY_KEY_ID;
const key_secret = process.env.RAZORPAY_SECRET;
if (!key_id || !key_secret) throw new Error("Missing Razorpay credentials");

const razorpay = new Razorpay({ key_id, key_secret });

export async function POST(req: Request) {
  try {
    const { listingId, amount } = await req.json();
    if (!listingId || !amount) return NextResponse.json({ error: "Missing listingId or amount" }, { status: 400 });

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    if (!listing) return NextResponse.json({ error: "Listing not found" }, { status: 404 });

    const host = await prisma.user.findUnique({ where: { id: listing.userId } });
    if (!host) return NextResponse.json({ error: "Host not found" }, { status: 404 });

    const isAdmin = host.role === "admin";
    const totalAmount = amount * 100;

const transfers = !isAdmin && host.razorpayAccountId
  ? [
      {
        account: host.razorpayAccountId,
        amount: Math.floor(totalAmount * 0.8), // 80% to host
        currency: "INR",
        notes: {
          listingId,
          hostId: host.id,
          type: "host_commission"
        },
        on_hold: false
      }
    ]
  : [];

const order = await razorpay.orders.create({
  amount: totalAmount,
  currency: "INR",
  receipt: `receipt_order_${Date.now()}`,
  notes: {
    listingId,
    userId: user.id,
    hostId: host.id,
    isAdmin: isAdmin.toString(),
    payoutAccountId: isAdmin ? "platform" : host.razorpayAccountId || ""
  },
  transfers
});


    return NextResponse.json(order);
  } catch (error: any) {
    console.error("Error initiating payment:", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}
