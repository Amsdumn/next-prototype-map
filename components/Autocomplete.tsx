import React, { useRef, useEffect } from "react";

const AutocompleteComponent = ({
  onPlaceSelected,
}: {
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps || !inputRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ["establishment"],
      componentRestrictions: { country: "th" }, // จำกัดเฉพาะประเทศไทย
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        onPlaceSelected(place);
      }
    });
  }, [onPlaceSelected]);

  return <input ref={inputRef} type="text" placeholder="ค้นหาสถานที่..." className="border p-2 w-full rounded text-gray-900" />;
};

export default AutocompleteComponent;
