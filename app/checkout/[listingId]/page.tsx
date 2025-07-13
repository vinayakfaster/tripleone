// checkout/page.tsx
"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const params = useSearchParams();

  useEffect(() => {
    const initiatePayment = async () => {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        body: JSON.stringify({
          amount: params.get("amount"),
          listingId: params.get("listingId"),
          hostId: params.get("hostId"),
        }),
      });
      const data = await res.json();

      const options = {
        key: "RAZORPAY_KEY_ID",
        amount: data.amount,
        currency: "INR",
        name: "YourAppName",
        description: "Reservation Payment",
        order_id: data.orderId,
        handler: function (response: any) {
          fetch("/api/payment/verify", {
            method: "POST",
            body: JSON.stringify(response),
          });
        },
        prefill: {
          email: "user@example.com", // fetch from current user
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    };

    initiatePayment();
  }, []);

  return <div>Redirecting to Razorpay...</div>;
}
