"use client";

import { useState } from "react";

type Props = {
  listingsCount: number;
  upcomingReservationsCount: number;
  totalEarnings: number;
  hasRazorpayAccount?: boolean; // ✅ Passed from server
};

export default function HostDashboardClient({
  listingsCount,
  upcomingReservationsCount,
  totalEarnings,
  hasRazorpayAccount,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [accountCreated, setAccountCreated] = useState(hasRazorpayAccount);
  const [error, setError] = useState("");

  const handleSetup = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/create-account", {
        method: "POST",
      });

      const data = await res.json();
      if (res.ok) {
        setAccountCreated(true);
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch (err: any) {
      setError("Failed to connect. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">👋 Welcome, Host!</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border shadow p-5 text-center">
          <p className="text-sm text-gray-500 mb-2">Your Listings</p>
          <p className="text-2xl font-bold">{listingsCount}</p>
        </div>

        <div className="bg-white rounded-xl border shadow p-5 text-center">
          <p className="text-sm text-gray-500 mb-2">Upcoming Reservations</p>
          <p className="text-2xl font-bold">{upcomingReservationsCount}</p>
        </div>

        <div className="bg-white rounded-xl border shadow p-5 text-center">
          <p className="text-sm text-gray-500 mb-2">Total Earnings</p>
          <p className="text-2xl font-bold">
            ₹{totalEarnings.toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Razorpay Setup */}
      <div className="mt-6">
        {accountCreated ? (
          <p className="text-green-600 font-medium">
            ✅ Razorpay account is already set up.
          </p>
        ) : (
          <>
            <button
              onClick={handleSetup}
              disabled={loading}
              className="bg-black text-white px-5 py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Creating Razorpay Account..." : "Set Up Razorpay Payouts"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </div>
    </div>
  );
}
