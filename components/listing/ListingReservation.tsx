"use client";

import React, { useState, useRef, useEffect } from "react";
import { Range } from "react-date-range";
import Calendar from "../inputs/Calendar";
import ReviewSummary from "../../app/reservations/ReviewSummary";
import useLoginModal from "@/hook/useLoginModal";
import { SafeUser } from "../../app/types";
import Modal from "../models/Modal";
import GuestSelector from "../inputs/GuestSelector";

interface Props {
  currentUser?: SafeUser | null;
  price: number;
  totalPrice: number; // ✅ Add this line
  onChangeDate: (value: Range) => void;
  dateRange: Range;
  onSubmit: (guestData: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }) => void;
  disabled: boolean;
  disabledDates: Date[];
  listingId: string;
}

function ListingReservation({
  listingId,
  price,
  dateRange,
  onChangeDate,
  onSubmit,
  disabled,
  disabledDates,
  currentUser,
}: Props) {
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [phone, setPhone] = useState(currentUser?.phone || "");
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  const loginModal = useLoginModal();
  const ref = useRef<HTMLDivElement>(null);

  const guestCount = guests.adults + guests.children;
  const baseGuests = 2;
  const extraGuestFee = 1200;
  const extraGuests = Math.max(0, guestCount - baseGuests);
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsCalendarOpen(false);
      setShowGuestDropdown(false); // close guest dropdown too
    }
  };
  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, []);

  const nights = Math.max(
    1,
    Math.ceil(
      (dateRange.endDate!.getTime() - dateRange.startDate!.getTime()) /
        (1000 * 60 * 60 * 24)
    )
  );

  const nightlyPrice = price + extraGuests * extraGuestFee;
  const totalPrice = nightlyPrice * nights;
  const serviceFee = Math.round(totalPrice * 0.15);
  const gstFee = Math.round(totalPrice * 0.18);
  const finalPrice = totalPrice + serviceFee + gstFee;



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    if (isMobile && (!dateRange.startDate || !dateRange.endDate)) {
      setIsCalendarOpen(true);
    }
  }, [dateRange]);

  const formatDate = (date?: Date) =>
    date?.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleReserveClick = () => {
    if (!currentUser) {
      loginModal.onOpen();
    } else {
      setShowPhoneModal(true);
    }
  };

  const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && (window as any).Razorpay) {
      resolve(true); // Already loaded
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};



const handleConfirm = async () => {
  if (!phone || phone.trim().length < 5) {
    alert("Please enter a valid phone number.");
    return;
  }
   const startDate = dateRange.startDate;
  const endDate = dateRange.endDate;

  if (!startDate || !endDate) {
    alert("Please select your check-in and check-out dates.");
    return;
  }

  try {
    // Load Razorpay script first!
    const razorpayLoaded = await loadRazorpayScript();
    if (!razorpayLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    // Save phone
    const res = await fetch("/api/phone", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      alert(errorData.message || "Failed to save phone.");
      return;
    }

    // Initiate order
    const orderRes = await fetch("/api/payment/initiate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: finalPrice, listingId }),
    });

    const text = await orderRes.text();
    if (text.startsWith("<!DOCTYPE html>")) {
      console.error("❌ Received HTML instead of JSON:", text);
      alert("Broken API route or crash: check /api/payment/initiate");
      return;
    }

    const order = JSON.parse(text);
    if (!order.id) {
      alert("Order failed: " + (order.error || "No order ID returned"));
      return;
    }

    // ✅ Now Razorpay is available and safe to use
const razorpay = new (window as any).Razorpay({
  key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  amount: order.amount,
  currency: order.currency,
  name: "Book Stay",
  description: "Reservation Payment",
  order_id: order.id,

  // ✅ Place it here
handler: async function (response: any) {
  const verifyRes = await fetch("/api/payment/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      razorpay_order_id: response.razorpay_order_id,
      razorpay_payment_id: response.razorpay_payment_id,
      razorpay_signature: response.razorpay_signature,
      listingId,
      amount: order.amount,
      guests,
      startDate,
      endDate,
    }),
  });

  if (verifyRes.ok) {

    alert("✅ Payment successful!");
    
    setShowPhoneModal(false);
  } else {
    alert("❌ Payment verification failed.");
  }
},

  prefill: {
    name: currentUser?.name,
    email: currentUser?.email,
    contact: phone,
  },
  theme: { color: "#ff385c" },
});

    razorpay.open();
  } catch (error: any) {
    console.error("💥 Error in handleConfirm:", error);
    alert("Something went wrong: " + error.message || error);
  }
};


  return (
    <>
      <div
        ref={ref}
        className="bg-white rounded-2xl border border-neutral-200 shadow-md p-6 w-full max-w-sm mx-auto sm:mx-0"
      >
        <p className="text-2xl font-bold mb-2 text-black">
          ₹{totalPrice.toLocaleString("en-IN")}{" "}
          <span className="font-normal text-sm text-neutral-500">
            for {nights} night{nights > 1 ? "s" : ""}
          </span>
        </p>

        {/* Date Range */}
        <div
          className="grid grid-cols-2 border rounded-xl overflow-hidden text-sm mb-4 cursor-pointer hover:ring-1 hover:ring-blue-700 transition"
          onClick={() => setIsCalendarOpen((prev) => !prev)}
        >
          <div className="p-3 border-r">
            <p className="uppercase text-gray-500 text-xs mb-1">Check-in</p>
            <p className="text-gray-800">
              {formatDate(dateRange.startDate) || "Add date"}
            </p>
          </div>
          <div className="p-3">
            <p className="uppercase text-gray-500 text-xs mb-1">Checkout</p>
            <p className="text-gray-800">
              {formatDate(dateRange.endDate) || "Add date"}
            </p>
          </div>
        </div>

        {/* Calendar */}
        {isCalendarOpen && (
          <div className="mt-2 max-h-[60vh] overflow-y-auto sm:max-h-none">
            <Calendar
              value={dateRange}
              onChange={({ selection }) => {
                onChangeDate(selection);
                if (
                  selection.startDate &&
                  selection.endDate &&
                  selection.startDate.toDateString() !==
                    selection.endDate.toDateString()
                ) {
                  setTimeout(() => setIsCalendarOpen(false), 150);
                }
              }}
              disabledDates={disabledDates}
            />
          </div>
        )}

        {/* Guest Selector */}
        {/* Guest Count Dropdown */}
<div className="relative mb-4">
  <div
    onClick={() => setShowGuestDropdown((prev) => !prev)}
    className="border rounded-xl px-4 py-3 text-sm cursor-pointer hover:ring-1 hover:ring-blue-700 transition flex justify-between"
  >
    <div>
      <p className="uppercase text-gray-500 text-xs mb-1">Guests</p>
     <p className="text-gray-800">
  {guestCount > 0 ? `${guestCount} guest${guestCount > 1 ? "s" : ""}` : "Add guests"}
</p>
    </div>
    <div className="text-gray-400 text-sm">▼</div>
  </div>

  {showGuestDropdown && (
    <div className="absolute z-10 w-full mt-2 bg-white rounded-xl shadow-lg border">
      <GuestSelector maxGuests={5} onChange={setGuests} />
      <div className="p-3">
        <button
          onClick={() => setShowGuestDropdown(false)}
          className="w-full text-sm bg-[#ff385c] hover:bg-[#e03150] text-white font-semibold px-4 py-2 rounded-full"
        >
          Done
        </button>
      </div>
    </div>
  )}
</div>


        {/* Reserve Button */}
<button
  onClick={handleReserveClick}
  disabled={disabled}
className={`w-full bg-blue-600 text-white py-3 rounded-lg hover:ring-blue-700 transition ${
  disabled ? "opacity-50 cursor-not-allowed" : ""
}`}

>
  Reserve
</button>


        <p className="text-center text-xs text-neutral-500 mt-3">
          You won’t be charged yet
        </p>
      </div>

      {/* Reviews */}
      <div className="mt-10 w-full">
        <ReviewSummary />
      </div>

      {/* Phone Confirmation Modal */}
      <Modal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        title="Confirm your Booking Details"
        actionLabel="Confirm"
        onSubmit={handleConfirm}
        body={
          <div className="flex flex-col gap-6 text-sm">
            <div className="space-y-3">
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={currentUser?.name || ""}
                  disabled
                  className="w-full border px-3 py-2 rounded-md bg-neutral-100"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={currentUser?.email || ""}
                  disabled
                  className="w-full border px-3 py-2 rounded-md bg-neutral-100"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border px-3 py-2 rounded-md"
                />
              </div>
            </div>

            {/* Breakdown */}
            <div className="border-t pt-4 text-sm text-gray-700 space-y-2">
              <h3 className="font-semibold text-base mb-1">Price breakdown</h3>

              <div className="flex justify-between">
                <span>
                  {nights} night{nights > 1 ? "s" : ""} × ₹
                  {nightlyPrice.toLocaleString("en-IN")}
                </span>
                <span>₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>Service Fee (15%)</span>
                <span>₹{serviceFee.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{gstFee.toLocaleString("en-IN")}</span>
              </div>

              <hr />

              <div className="flex justify-between font-semibold text-black">
                <span>Total</span>
                <span>₹{finalPrice.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
}

export default ListingReservation;
