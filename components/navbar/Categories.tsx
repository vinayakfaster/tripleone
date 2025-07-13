"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { BsSnow } from "react-icons/bs";
import { FaSkiing } from "react-icons/fa";
import {
  GiBarn,
  GiBoatFishing,
  GiCactus,
  GiCastle,
  GiCaveEntrance,
  GiForestCamp,
  GiIsland,
  GiWindmill,
} from "react-icons/gi";
import { IoDiamond } from "react-icons/io5";
import { MdOutlineVilla } from "react-icons/md";
import { TbBeach, TbMountain, TbPool } from "react-icons/tb";
import CategoryBox from "../CategoryBox";
import Container from "../Container";

export const categories = [
  { label: "Beach", icon: TbBeach, description: "This property is close to the beach!" },
  { label: "Windmills", icon: GiWindmill, description: "This property has windmills!" },
  { label: "Modern", icon: MdOutlineVilla, description: "This property is modern!" },
  { label: "Countryside", icon: TbMountain, description: "This property is in the countryside!" },
  { label: "Pools", icon: TbPool, description: "This property has a beautiful pool!" },
  { label: "Islands", icon: GiIsland, description: "This property is on an island!" },
  { label: "Lake", icon: GiBoatFishing, description: "This property is near a lake!" },
  { label: "Skiing", icon: FaSkiing, description: "This property has skiing activities!" },
  { label: "Castles", icon: GiCastle, description: "This property is an ancient castle!" },
  { label: "Caves", icon: GiCaveEntrance, description: "This property is in a spooky cave!" },
  { label: "Camping", icon: GiForestCamp, description: "This property offers camping!" },
  { label: "Arctic", icon: BsSnow, description: "This property is in an arctic environment!" },
  { label: "Desert", icon: GiCactus, description: "This property is in the desert!" },
  { label: "Barns", icon: GiBarn, description: "This property is a barn!" },
  { label: "Lux", icon: IoDiamond, description: "This property is luxurious!" },
];

function Categories() {
  const params = useSearchParams();
  const category = params?.get("category");
  const pathname = usePathname();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

useEffect(() => {
  const onScroll = () => {
    const currentScroll = window.scrollY;

    // Only hide if user scrolled significantly down
    if (currentScroll > lastScrollY && currentScroll > 100) {
      setShow(false);
    } else if (currentScroll < lastScrollY || currentScroll < 100) {
      setShow(true);
    }

    setLastScrollY(currentScroll);
  };

  window.addEventListener("scroll", onScroll);
  return () => window.removeEventListener("scroll", onScroll);
}, [lastScrollY]);

  if (pathname !== "/") return null;

  return (
    <div
     className={`fixed top-[100px] z-[20] w-full bg-white shadow-md transition-all duration-500 ease-in-out ${
    show ? "translate-y-0 opacity-100" : "-translate-y-[100%] opacity-0 pointer-events-none"
  }`}
    >
      <Container>
        <div className="py-3 flex flex-row items-center justify-between overflow-x-auto gap-3">
          {categories.map((item) => (
            <div key={item.label} className="transition-transform duration-300 hover:scale-105">
              <CategoryBox
                icon={item.icon}
                label={item.label}
                selected={category === item.label}
              />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default Categories;
