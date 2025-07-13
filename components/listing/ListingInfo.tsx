"use client";

import useCountries from "@/hook/useCountries";
import { SafeUser } from "@/types";
import dynamic from "next/dynamic";
import Image from "next/image";
import React, { useState } from "react";
import { IconType } from "react-icons";
import Avatar from "../Avatar";
import ListingCategory from "./ListingCategory";
import Offers from "../Offers";
import Sleep from "../Sleep";
import TripShieldModal from "../models/TripShieldModal"; // ✅ your custom modal

const Map = dynamic(() => import("../Map"), { ssr: false });

type Props = {
  user: SafeUser;
  description: string;
  guestCount: number;
  roomCount: number;
  bathroomCount: number;
  category:
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

  const [isTripShieldOpen, setIsTripShieldOpen] = useState(false);

  return (
    <div className="col-span-4 flex flex-col gap-8">
      {/* PHOTO TOUR */}
      {images?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 rounded-xl overflow-hidden">
          <div className="md:col-span-2 row-span-2 relative aspect-[4/3]">
            <Image
              src={images[0].url}
              alt={images[0].label || "Image"}
              fill
              className="object-cover"
            />
          </div>
          {images.slice(1, 5).map((img, idx) => (
            <div key={idx} className="relative aspect-square">
              <Image
                src={img.url}
                alt={img.label || `Image ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* HOST INFO */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xl font-semibold">
          <Avatar src="/images/tripleone-avatar.png" />
          <div className="flex flex-col">
            <span className="text-black font-semibold">
              Hosted and managed by <span className="text-rose-500">TripleOne</span>
            </span>
          </div>
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
      <div className="flex items-center justify-between border border-gray-300 rounded-xl px-5 py-4">
        <div className="flex items-center space-x-3">
          <span className="text-xl">🏅</span>
          <div>
            <p className="font-semibold text-sm text-black">Guest favourite</p>
            <p className="text-sm text-gray-600">
              One of the most loved homes on Airbnb, according to guests
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-6 pl-4">
          <div className="text-right pr-4 border-r border-gray-300">
            <p className="font-semibold text-lg text-black">4.88</p>
            <div className="text-yellow-500 text-sm leading-none">★★★★★</div>
          </div>
          <div className="text-sm text-gray-800 text-center">
            <p className="font-semibold">{Math.floor(40 + Math.random() * 60)}</p>
            <p className="text-xs text-gray-500">Reviews</p>
          </div>
        </div>
      </div>

      <hr />

      {/* ✅ TRIPSHIELD BLOCK */}
      <div className="flex flex-col bg-[#FFF8F6] border border-rose-100 rounded-2xl p-5 md:p-6 shadow-sm">
        <p className="text-3xl md:text-4xl font-extrabold text-[#FF5A5F] leading-tight">
          Trip<span className="text-black">Shield</span>
        </p>
        <p className="text-sm md:text-base text-neutral-600 pt-3 leading-relaxed">
          Every booking includes free protection from host cancellations, inaccurate listings,
          and check-in issues — so you can book with confidence.
        </p>
        <button
          onClick={() => setIsTripShieldOpen(true)}
          className="mt-4 inline-flex items-center gap-1 text-sm md:text-base font-semibold underline text-black hover:text-rose-500 transition"
        >
          🔍 Learn more about TripShield
        </button>
      </div>

      {/* ✅ Modal Trigger */}
      <TripShieldModal
        isOpen={isTripShieldOpen}
        onClose={() => setIsTripShieldOpen(false)}
      />

      <hr className="my-6" />

      {/* HIGHLIGHTS */}
      <div className="space-y-6">
        {[
          ["🌀", "Designed for staying cool", "Beat the heat with the A/C and ceiling fan."],
          ["🚪", "Self check-in", "You can check in with the building staff."],
          ["📅", "Free cancellation before 17 Jul", "Get a full refund if you change your mind."],
          ["📶", "Fast Wi-Fi", "Stream, work, or game with high-speed internet."],
          ["🛏️", "Premium bedding", "Enjoy extra-comfy pillows and fresh linens."],
          ["🍳", "Fully-equipped kitchen", "Cook your favorite meals with all the essentials."],
          ["🧼", "Sparkling clean", "Rated 5 stars for cleanliness by recent guests."],
        ].map(([icon, title, desc], i) => (
          <div key={i} className="flex items-start space-x-4">
            <div className="text-2xl">{icon}</div>
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-gray-600 text-sm">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <hr />

      <p className="text-lg font-light text-neutral-500">{description}</p>

      <hr />

      <Sleep />

      <hr />

      <Offers />

      <hr />

      {/* Optional Map */}
      {/* <div className="mt-4 rounded-xl overflow-hidden w-full h-[40vh]">
        <Map center={coordinates} locationValue={locationValue} />
      </div> */}
    </div>
  );
}

export default ListingInfo;
