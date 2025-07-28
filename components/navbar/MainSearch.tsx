"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { BiSearch } from "react-icons/bi";
import qs from "query-string";
import { formatISO } from "date-fns";
import { Range } from "react-date-range"; // make sure this is imported

import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import Map from "../Map";


type MainSearchProps = {
  isCompact?: boolean;
};

const MainSearch = ({ isCompact = false }: MainSearchProps) => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [autoFlow, setAutoFlow] = useState(false);
  const [activeSection, setActiveSection] = useState<"location" | "date" | "guests" | null>(null);

  const [location, setLocation] = useState<any>(null);

const [dateRange, setDateRange] = useState<Range>({
  startDate: undefined,
  endDate: undefined,
  key: "selection",
});

  const [guestCount, setGuestCount] = useState(1);

  const onSearch = useCallback(() => {
    const query = {
      locationValue: location?.label,
      guestCount,
      startDate: dateRange.startDate ? formatISO(dateRange.startDate) : undefined,
      endDate: dateRange.endDate ? formatISO(dateRange.endDate) : undefined,
    };

    const url = qs.stringifyUrl({ url: "/", query }, { skipNull: true });

    router.push(url);
    setIsOpen(false);
    setActiveSection(null);
    setAutoFlow(false);
  }, [location, guestCount, dateRange, router]);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({ latlng: [lat, lng], label: address, value: address });
    if (autoFlow) setTimeout(() => setActiveSection("date"), 300);
  };

  const handleDateSelect = (range: any) => {
    setDateRange(range.selection);
    if (autoFlow) setTimeout(() => setActiveSection("guests"), 300);
  };

  const handleGuestChange = (val: number) => {
    setGuestCount(val);
    if (autoFlow) setTimeout(() => onSearch(), 300);
  };

  return (
    <div className="relative w-full max-w-[1280px] mx-auto px-4">
      {/* Top Bar */}
      <div
        className="bg-white rounded-full border shadow-xl py-4 px-6 flex justify-between items-center cursor-pointer transition-all duration-300 hover:shadow-2xl"
        onClick={() => {
          setIsOpen(true);
          setActiveSection("location");
          setAutoFlow(true);
        }}
      >
        <div
          className="text-sm font-semibold px-6 border-r flex-1 truncate hover:scale-105 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setActiveSection("location");
            setAutoFlow(false);
          }}
        >
          🌍 {location?.label || "Where"}
          <div className="text-gray-500 text-xs">Search destinations</div>
        </div>
        <div
          className="text-sm font-semibold px-6 border-r flex-1 text-center hover:scale-105 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setActiveSection("date");
            setAutoFlow(false);
          }}
        >
          📅
          {dateRange.startDate
            ? `${dateRange.startDate.toDateString().slice(4, 10)} - ${
                dateRange.endDate?.toDateString().slice(4, 10) || "..."
              }`
            : "Add dates"}
          <div className="text-gray-500 text-xs">Check in - out</div>
        </div>
        <div
          className="text-sm font-semibold px-6 flex items-center gap-2 hover:scale-105 transition-transform"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
            setActiveSection("guests");
            setAutoFlow(false);
          }}
        >
          👤 {guestCount > 0 ? `${guestCount} guests` : "Who"}
          <div className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full">
            <BiSearch size={16} onClick={onSearch} />
          </div>
        </div>
      </div>

      {/* Responsive Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 left-0 w-full bg-white rounded-xl shadow-xl z-50 animate-fadeIn max-h-[85vh] overflow-y-auto p-4 sm:p-6">
          <div className="flex justify-end mb-2">
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveSection(null);
                setAutoFlow(false);
              }}
              className="text-sm text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {activeSection === "location" && (
            <div className="space-y-3">
              <h2 className="font-semibold text-lg">Where do you want to go?</h2>
              <Map
                selectedLatLng={location?.latlng || { lat: 20.5937, lng: 78.9629 }}
                onSelectLocation={({ lat, lng, address }) =>
                  handleLocationSelect(lat, lng, address)
                }
              />
            </div>
          )}

          {activeSection === "date" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Choose your dates</h2>
              <Calendar value={dateRange} onChange={handleDateSelect} />
            </div>
          )}

          {activeSection === "guests" && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg">Guests</h2>
              <Counter
                title="Guests"
                subtitle="How many guests are coming?"
                value={guestCount}
                onChange={handleGuestChange}
              />
              {!autoFlow && (
                <button
                  className="mt-4  bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full w-full sm:w-auto"
                  onClick={onSearch}
                >
                  Search
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MainSearch;