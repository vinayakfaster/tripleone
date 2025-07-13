"use client";

import {
  GoogleMap,
  MarkerF,
  Autocomplete,
} from "@react-google-maps/api";
import { useCallback, useRef, useState } from "react";

type Props = {
  selectedLatLng: { lat: number; lng: number };
  onSelectLocation: (loc: { lat: number; lng: number; address: string }) => void;
};

export default function Map({ selectedLatLng, onSelectLocation }: Props) {
  const [position, setPosition] = useState(selectedLatLng);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || "";

    setPosition({ lat, lng });
    onSelectLocation({ lat, lng, address });
  }, [onSelectLocation]);

  return (
    <div className="space-y-4">
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <input
          className="w-full p-2 border rounded"
          placeholder="Search for a place"
        />
      </Autocomplete>

      <GoogleMap
        center={position}
        zoom={13}
        mapContainerClassName="w-full h-[300px] rounded-lg"
        onClick={(e) => {
          const lat = e.latLng?.lat();
          const lng = e.latLng?.lng();
          if (!lat || !lng) return;

          fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
          )
            .then((res) => res.json())
            .then((data) => {
              const address = data.results?.[0]?.formatted_address || "Unknown";
              setPosition({ lat, lng });
              onSelectLocation?.({ lat, lng, address });
            });
        }}
      >
        <MarkerF
          position={position}
          draggable
          onDragEnd={(e) => {
            const lat = e.latLng?.lat();
            const lng = e.latLng?.lng();
            if (!lat || !lng) return;

            fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
            )
              .then((res) => res.json())
              .then((data) => {
                const address = data.results?.[0]?.formatted_address || "Unknown";
                setPosition({ lat, lng });
                onSelectLocation({ lat, lng, address });
              });
          }}
        />
      </GoogleMap>
    </div>
  );
}
