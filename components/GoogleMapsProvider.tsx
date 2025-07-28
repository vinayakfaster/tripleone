"use client";

import {
  useJsApiLoader,
  LoadScriptProps, // ✅ use this instead of GoogleMapProps
} from "@react-google-maps/api";
import React from "react";

// ✅ Use correct type to define libraries
const libraries: LoadScriptProps["libraries"] = ["places"];

type Props = {
  children: React.ReactNode;
};

export default function GoogleMapsProvider({ children }: Props) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  if (loadError) return <div>Failed to load Google Maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return <>{children}</>;
}
