"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();

  useEffect(() => {
    if (!params) return;

    const initiatePayment = async () => {
      const amount = params.get("amount");
      const listingId = params.get("listingId");
      const hostId = params.get("hostId");

      if (!amount || !listingId || !hostId) {
        console.error("Missing required query parameters");
        return;
      }

      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, listingId, hostId }),
      });

      const data = await res.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "RAZORPAY_KEY_ID", // best practice
        amount: data.amount,
        currency: "INR",
        name: "YourAppName",
        description: "Reservation Payment",
        order_id: data.orderId,
        handler: function (response: any) {
          fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
        },
        prefill: {
          email: "user@example.com", // optionally get from logged-in user
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };

    initiatePayment();
  }, [params]);

  return <div>Redirecting to Razorpay...</div>;
}
