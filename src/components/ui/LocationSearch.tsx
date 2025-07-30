"use client";

import { useEffect, useRef } from "react";

export default function LocationSearch({
  onPlaceSelected,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
   

    const interval = setInterval(() => {
      if (
        typeof window !== "undefined" &&
        window.google &&
        window.google.maps &&
        window.google.maps.places &&
        inputRef.current
      ) {
        const autocomplete = new google.maps.places.Autocomplete(
          inputRef.current
        );

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          onPlaceSelected(place);
        });

        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <input
      type="text"
      ref={inputRef}
      placeholder="Enter your city or location"
      className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
    />
  );
}
