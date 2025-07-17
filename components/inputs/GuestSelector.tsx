"use client";

import { useState } from "react";

interface Props {
  maxGuests: number;
  onChange: (data: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  }) => void;
}

const GuestSelector = ({ maxGuests, onChange }: Props) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [pets, setPets] = useState(0);

  const totalGuests = adults + children;

  const increment = (type: string) => {
    if (type === "adults" && totalGuests < maxGuests) setAdults(adults + 1);
    if (type === "children" && totalGuests < maxGuests) setChildren(children + 1);
    if (type === "infants") setInfants(infants + 1);
    if (type === "pets") setPets(pets + 1);
    onChange({ adults, children, infants, pets });
  };

  const decrement = (type: string) => {
    if (type === "adults" && adults > 1) setAdults(adults - 1);
    if (type === "children" && children > 0) setChildren(children - 1);
    if (type === "infants" && infants > 0) setInfants(infants - 1);
    if (type === "pets" && pets > 0) setPets(pets - 1);
    onChange({ adults, children, infants, pets });
  };

  return (
    <div className="border rounded-xl shadow-md p-4 space-y-4 text-sm text-gray-800 w-full max-w-sm">
      {[
        { label: "Adults", desc: "Age 13+", value: adults, type: "adults" },
        { label: "Children", desc: "Ages 2–12", value: children, type: "children" },
        { label: "Infants", desc: "Under 2", value: infants, type: "infants" },
        { label: "Pets", desc: "Bringing a service animal?", value: pets, type: "pets" },
      ].map(({ label, desc, value, type }) => (
        <div key={type} className="flex items-center justify-between">
          <div>
            <div className="font-medium">{label}</div>
            <div className="text-neutral-500 text-xs">{desc}</div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => decrement(type)}
              disabled={value === 0 || (type === "adults" && adults === 1)}
              className="w-8 h-8 border rounded-full text-xl text-neutral-600 disabled:opacity-30"
            >
              –
            </button>
            <span>{value}</span>
            <button
              onClick={() => increment(type)}
              disabled={
                (type === "adults" || type === "children") &&
                totalGuests >= maxGuests
              }
              className="w-8 h-8 border rounded-full text-xl text-neutral-600 disabled:opacity-30"
            >
              +
            </button>
          </div>
        </div>
      ))}

      <div className="text-xs text-neutral-500 pt-2">
        This place has a maximum of {maxGuests} guests, not including infants. Pets aren&apos;t allowed.
      </div>
    </div>
  );
};

export default GuestSelector;
