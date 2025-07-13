// components/Offers.tsx
"use client";

import { useState } from "react";
import {
  AiOutlineCar,
  AiOutlineWifi,
  AiOutlineDesktop,
  AiOutlineFieldTime,
} from "react-icons/ai";
import { BiCctv } from "react-icons/bi";
import { BsFire } from "react-icons/bs";
import { FaFireExtinguisher } from "react-icons/fa";
import { GiButterflyFlower } from "react-icons/gi";
import { GrWorkshop } from "react-icons/gr";
import {
  MdOutlineBathtub,
  MdOutlineCoffeeMaker,
  MdOutlineIron,
  MdOutlineKitchen,
  MdPets,
  MdAcUnit,
  MdTv,
} from "react-icons/md";
import { RiSafeLine } from "react-icons/ri";
import { IoClose } from "react-icons/io5";

const allOffers = [
  { label: "Garden view", icon: GiButterflyFlower },
  { label: "Hot water", icon: BsFire },
  { label: "Wifi", icon: AiOutlineWifi },
  { label: "Coffee maker", icon: MdOutlineCoffeeMaker },
  { label: "Security cameras on property", icon: BiCctv },
  { label: "Bathtub", icon: MdOutlineBathtub },
  { label: "Dedicated workspace", icon: GrWorkshop },
  { label: "Safe", icon: RiSafeLine },
  { label: "Free parking", icon: AiOutlineCar },
  { label: "Fire extinguisher", icon: FaFireExtinguisher },
  { label: "Kitchen", icon: MdOutlineKitchen },
  { label: "Pets allowed", icon: MdPets },
  { label: "Air conditioning", icon: MdAcUnit },
  { label: "TV", icon: MdTv },
  { label: "Iron", icon: MdOutlineIron },
  { label: "Late checkout", icon: AiOutlineFieldTime },
];

function Offers() {
  const [isOpen, setIsOpen] = useState(false);

  const shownOffers = allOffers.slice(0, 6);
  const hiddenOffers = allOffers.slice(6);

  return (
    <div className="py-6 border-t">
      <h2 className="text-xl font-semibold mb-6">What this place offers</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {shownOffers.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-4 text-gray-800 text-sm"
          >
            <item.icon size={22} className="text-gray-600" />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {hiddenOffers.length > 0 && (
        <>
          <button
            onClick={() => setIsOpen(true)}
            className="mt-6 underline text-sm text-gray-700 hover:text-black"
          >
            Show all {allOffers.length} amenities
          </button>

          {isOpen && (
            <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-2xl rounded-lg p-6 relative shadow-xl max-h-[80vh] overflow-y-auto">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                  <IoClose size={24} />
                </button>

                <h3 className="text-lg font-bold mb-6">What this place offers</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {allOffers.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 text-sm text-gray-800"
                    >
                      <item.icon size={20} className="text-gray-600 mt-1" />
                      <p>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Offers;
