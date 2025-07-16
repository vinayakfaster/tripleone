"use client";

import useCountries from "@/hook/useCountries";
import { SafeReservation, SafeUser, safeListing } from "@/types";
import { format } from "date-fns";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo } from "react";
import Button from "../Button";
import { Heart } from "lucide-react";
import HeartButton from "../../components/HeartButton"
interface Props {
  data: safeListing;
  reservation?: SafeReservation;
  onAction?: (id: string) => void;
  disabled?: boolean;
  actionLabel?: string;
  actionId?: string;
  currentUser?: SafeUser | null;
  layout?: "grid" | "horizontal";
}

function ListingCard({
  data,
  reservation,
  onAction,
  disabled,
  actionLabel,
  actionId = "",
  layout = "grid",
  currentUser,
}: Props) {
  const router = useRouter();
  const { getByValue } = useCountries();
  const location = getByValue(data.locationValue);

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) return;
      onAction?.(actionId);
    },
    [onAction, actionId, disabled]
  );

  const price = useMemo(() => {
    return reservation ? reservation.totalPrice : data.price;
  }, [reservation, data.price]);

  const reservationDate = useMemo(() => {
    if (!reservation) return null;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return `${format(start, "PP")} – ${format(end, "PP")}`;
  }, [reservation]);

  const rating = useMemo(() => {
    return data.rating ?? (Math.random() * 1.2 + 3.8); // 3.8 – 5.0
  }, [data.rating]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={() => router.push(`/listings/${data.id}`)}
      className="col-span-1 cursor-pointer rounded-2xl overflow-hidden border border-neutral-200 bg-white hover:shadow-md transition"
    >
      {/* Image */}
      <div className="relative h-[180px] w-full">
        <Image
          fill
          alt="Listing"
          src={data.imageSrc?.[0] || "/placeholder.jpg"}
          className="object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/placeholder.jpg";
          }}
        />
        {/* Guest favourite */}
        {data.isFavorite && (
          <div className="absolute top-2 left-2 bg-white text-xs font-medium px-2 py-1 rounded-full shadow">
            Guest favourite
          </div>
        )}
        {/* Heart icon */}
        <div className="absolute top-3 right-3">
            <HeartButton listingId={data.id} currentUser={currentUser} />
          </div>
      </div>

      {/* Text */}
      <div className="p-3 space-y-0.5">
        <p className="font-medium text-sm truncate">
          {location?.label || data.locationValue || "Unknown location"}
        </p>
        <p className="text-sm text-gray-600 truncate">
          {reservationDate || data.title || data.category}
        </p>
        <p className="text-sm">
          <span className="font-semibold">₹{price}</span>{" "}
          <span className="text-gray-500">/ night</span>
        </p>
        <p className="text-yellow-500 text-sm">★ {rating.toFixed(2)}</p>

        {/* Optional Action Button */}
        {onAction && actionLabel && (
          <div className="pt-2">
            <Button
              disabled={disabled}
              small
              label={actionLabel}
              onClick={handleCancel}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ListingCard;
