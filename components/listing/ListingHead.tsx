"use client";

import { useState } from "react";
import Image from "next/image";
import useCountries from "@/hook/useCountries";
import Heading from "../Heading";
import HeartButton from "../HeartButton";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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

  const locationLabel = location?.region && location?.label
    ? `${location.region}, ${location.label}`
    : locationValue;

  return (
    <>
      <div className="pt-4 lg:pt-0">
        <Heading title={title} subtitle={locationLabel} />
      </div>

      {/* ✅ Mobile Slider View - Styled like Airbnb */}
      <div className="relative w-full overflow-hidden lg:hidden rounded-xl mb-6">
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{ clickable: true }}
          navigation={false}
          spaceBetween={10}
          slidesPerView={1}
          className="rounded-xl"
        >
          {imageSrc.map((src, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative h-[250px] w-full rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setOpen(true)}
              >
                <Image
                  src={src}
                  alt={`Slide ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover transition duration-300 ease-in-out"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* ❤️ HeartButton (top right corner) */}
        <div className="absolute top-3 right-3 z-10">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>

      {/* 🖥️ Desktop Grid Layout */}
      <div className="relative w-full overflow-hidden rounded-xl hidden lg:block mb-6">
        <div className="grid grid-cols-4 grid-rows-2 gap-[8px] h-[60vh] rounded-xl overflow-hidden">
          {/* Main Image */}
          <div className="col-span-2 row-span-2 relative">
            <Image
              src={imageSrc[0]}
              alt="Main image"
              fill
              priority
              className="object-cover hover:scale-105 transition duration-300 cursor-pointer"
              onClick={() => setOpen(true)}
            />
          </div>

          {/* Side Images */}
          {visibleImages.slice(1, 5).map((url, index) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => setOpen(true)}
            >
              <Image
                src={url}
                alt={`Photo ${index + 2}`}
                fill
                className="object-cover group-hover:brightness-90 transition duration-300"
              />
            </div>
          ))}

          {/* Show All */}
          {imageSrc.length > 5 && (
            <div
              className="relative cursor-pointer"
              onClick={() => setOpen(true)}
            >
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
      </div>

      {/* 🔍 Lightbox Fullscreen Viewer */}
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
