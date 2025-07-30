"use client";

import useCountries from "@/hook/useCountries";
import { SafeUser } from "../../app/types";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { IconType } from "react-icons";
import ListingCategory from "./ListingCategory";
import Offers from "../Offers";
import TripShieldModal from "../models/TripShieldModal";
import FormattedDescription from "@/components/FormattedDescription";
const Map = dynamic(() => import("../Map"), { ssr: false });

type Props = {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category?:
    | {
        icon: IconType;
        label: string;
        description: string;
      }
    | undefined;
  locationValue: string;
  images: { url: string; label: string }[];
};

function ListingInfo({
  user,
  description,
  guestCount,
  roomCount,
  bathroomCount,
  category,
  locationValue,
  images,
}: Props) {
  const { getByValue } = useCountries();
  const coordinates = getByValue(locationValue)?.latlng;
  const [showAll, setShowAll] = useState(false);
  const [isTripShieldOpen, setIsTripShieldOpen] = useState(false);

  const highlights = [
    ["🌀", "Designed for staying cool", "Beat the heat with the A/C and ceiling fan."],
    ["🚪", "Self check-in", "You can check in with the building staff."],
    ["📅", "Free cancellation before ", "Get a full refund if you change your mind."],
    ["📶", "Fast Wi-Fi", "Stream, work, or game with high-speed internet."],
    ["🛏️", "Premium bedding", "Enjoy extra-comfy pillows and fresh linens."],
    ["🍳", "Fully-equipped kitchen", "Cook your favorite meals with all the essentials."],
    ["🧼", "Sparkling clean", "Rated 5 stars for cleanliness by recent guests."],
    ["🚿", "Modern bathroom", "Spacious shower with luxury toiletries."],
    ["🧳", "Luggage drop-off", "Convenient for early arrivals or late departures."],
    ["🎧", "Quiet space", "Perfect for remote work or undisturbed rest."],
    ["🌇", "Great view", "Overlooks the city skyline or lush garden."],
    ["🚗", "Easy parking", "Paid parking available right on premises."],
    ["☕", "Coffee & tea station", "Complimentary beverages for your stay."],
    ["📺", "Streaming-ready TV", "Watch Netflix, YouTube, and more."],
    ["🧯", "Safety equipped", "Fire extinguisher, first aid, and smart lock."],
    ["🔑", "24/7 access", "Check-in any time with a secure smart lock."],
    ["📍", "Prime location", "Walkable distance to top cafes, shops, and transit."],
  ];

  const visibleItems = showAll ? highlights : highlights.slice(0, 6);

  return (
      <div className="w-full max-w-screen-md mx-auto px-4 sm:px-6 md:px-0 flex flex-col gap-8">

      {/* HOST INFO */}
      <div className="flex flex-col gap-2">
        <div className="text-lg sm:text-xl font-semibold text-black">
          Hosted and managed by <span className="text-rose-500">TripleOne</span>
        </div>
      </div>

      <hr />

      {category && (
        <ListingCategory
          icon={category.icon}
          label={category.label}
          description={category.description}
        />
      )}

      <hr />

      {/* GUEST FAVOURITE */}
      <div className="flex justify-between items-start gap-4 flex-wrap">
        <div className="flex gap-3 items-start">
          <span className="text-2xl">🏅</span>
          <div>
            <p className="font-semibold text-sm text-black">Guest favourite</p>
            <p className="text-sm text-gray-600">
              One of the most loved homes on Airbnb, according to guests
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <p className="text-black text-lg font-semibold">4.88</p>
            <p className="text-yellow-500 text-sm leading-none">★★★★★</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-black">{Math.floor(40 + Math.random() * 60)}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>

      <hr />

      {/* TRIPSHIELD BLOCK */}
      <div className="bg-[#FFF8F6] p-4 rounded-xl">
        <p className="text-3xl font-extrabold text-[#FF5A5F]">
          Trip<span className="text-black">Shield</span>
        </p>
        <p className="text-sm text-neutral-600 pt-3">
          Every booking includes free protection from host cancellations, inaccurate listings,
          and check-in issues — so you can book with confidence.
        </p>
        <button
          onClick={() => setIsTripShieldOpen(true)}
          className="mt-4 text-sm font-semibold underline text-black hover:text-rose-500 transition"
        >
          🔍 Learn more about TripShield
        </button>
      </div>

      <TripShieldModal
        isOpen={isTripShieldOpen}
        onClose={() => setIsTripShieldOpen(false)}
      />

      <hr />
      {/* HIGHLIGHTS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {visibleItems.map(([icon, title, desc], i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="text-2xl">{icon}</div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div>
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-sm font-medium underline text-black hover:text-black transition"
        >
          {showAll ? "Show less" : "Show more"}
        </button>
      </div>

      <hr />

      {/* DESCRIPTION */}
      <div className="text-neutral-700 text-base space-y-4">
        <FormattedDescription description={description} />
      </div>

      <hr />

      <Offers />

      {/* Optional Map (disabled by default) */}
      {/*
      <div className="mt-4 overflow-hidden w-full h-[40vh]">
        <Map center={coordinates} locationValue={locationValue} />
      </div>
      */}
    </div>
  );
}

export default ListingInfo;
