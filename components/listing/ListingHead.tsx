"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import useCountries from "@/hook/useCountries";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

type Props = {
  title: string;
  locationValue: string;
  imageSrc: string[];
  id: string;
  currentUser?: any;
};

function ListingHead({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser,
}: Props) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  const [open, setOpen] = useState(false);

  const visibleImages = imageSrc.slice(0, 5);

  return (
    <>
      <Heading
        title={title}
        subtitle={
          location?.region && location?.label
            ? `${location.region}, ${location.label}`
            : locationValue
        }
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full overflow-hidden rounded-xl"
      >
        <div className="grid grid-cols-4 grid-rows-2 gap-[8px] h-[60vh] rounded-xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={imageSrc[0]}
              alt="Main image"
              fill
              priority
              className="object-cover cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>

          {visibleImages.slice(1, 5).map((url, index) => (
            <div key={index} className="relative cursor-pointer" onClick={() => setOpen(true)}>
              <Image
                src={url}
                alt={`Photo ${index + 2}`}
                fill
                className="object-cover"
              />
            </div>
          ))}

          {imageSrc.length > 5 && (
            <div className="relative cursor-pointer" onClick={() => setOpen(true)}>
              <Image
                src={imageSrc[5]}
                alt="More images"
                fill
                className="object-cover brightness-75"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-base font-semibold">
                Show all photos
              </div>
            </div>
          )}
        </div>

        <div className="absolute top-5 right-5 z-10">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </motion.div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={imageSrc.map((src) => ({ src }))}
        plugins={[Zoom]}
      />
    </>
  );
}

export default ListingHead;
