"use client";

import { IoBedOutline } from "react-icons/io5";

type Bedroom = {
  name: string;
  beds: string;
};

const bedrooms: Bedroom[] = [
  { name: "Bedroom 1", beds: "1 king bed" },
  { name: "Bedroom 2", beds: "1 queen bed" },
  { name: "Bedroom 3", beds: "1 queen bed, 1 single bed" },
];

export default function Sleep() {
  return (
    <section className="mt-10 space-y-6">
      <h2 className="text-2xl font-semibold">Where you&apos;ll sleep</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bedrooms.map((room, index) => (
          <div
            key={index}
            className="border rounded-2xl shadow-sm hover:shadow-md transition p-6 bg-white"
          >
            <div className="flex flex-col gap-2">
              <IoBedOutline size={32} className="text-gray-700" />
              <p className="text-lg font-semibold text-gray-800">{room.name}</p>
              <p className="text-sm text-gray-500">{room.beds}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
