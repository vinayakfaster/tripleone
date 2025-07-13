"use client";

import useCountries from "@/hook/useCountries";
import useSearchModal from "@/hook/useSearchModal";
import { differenceInDays } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { BiSearch } from "react-icons/bi";

function Search() {
  const searchModal = useSearchModal();
  const params = useSearchParams();
  const { getByValue } = useCountries();

  const locationValue = params?.get("locationValue");
  const startDate = params?.get("startDate");
  const endDate = params?.get("endDate");
  const guestCount = params?.get("guestCount");

  const locationLabel = useMemo(() => {
    if (locationValue) return getByValue(locationValue as string)?.label;
    return "Where";
  }, [getByValue, locationValue]);

  const durationLabel = useMemo(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      let diff = differenceInDays(end, start);
      if (diff === 0) diff = 1;
      return `${diff} days`;
    }
    return "Add dates";
  }, [startDate, endDate]);

  const guestLabel = useMemo(() => {
    return guestCount ? `${guestCount} guests` : "Guests";
  }, [guestCount]);

  return (
    <div
      onClick={searchModal.onOpen}
      className="w-full md:w-auto border border-neutral-300 rounded-full shadow-sm hover:shadow-md transition cursor-pointer px-4 py-2 flex items-center justify-between gap-3 bg-white"
    >
      <div className="text-sm font-bold px-1">🌍 {locationLabel}</div>
      <div className="hidden sm:block text-sm border-l border-r px-4 text-gray-500">
        📅 {durationLabel}
      </div>
      <div className="hidden sm:block text-sm text-gray-500 px-1">
        👤 {guestLabel}
      </div>

      {/* ✅ Proper Search Button */}
      <div className="p-2 rounded-full text-white ml-2 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:from-indigo-700 hover:to-cyan-600">
        <BiSearch size={18} />
      </div>
    </div>
  );
}

export default Search;
