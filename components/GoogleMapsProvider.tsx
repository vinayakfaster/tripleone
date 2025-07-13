"use client";

import {
  useJsApiLoader,
  GoogleMapProps,
} from "@react-google-maps/api";
import React from "react";

const libraries: GoogleMapProps["libraries"] = ["places"];

type Props = {
  children: React.ReactNode;
};

export default function GoogleMapsProvider({ children }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script", // ✅ consistent
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (loadError) return <div>Google Maps #00C4FF to load</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <>{children}</>;
}
