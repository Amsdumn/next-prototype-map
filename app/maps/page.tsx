"use client";

import React, { useEffect, useState } from "react";
import { BiTargetLock } from "react-icons/bi";
import MapComponent from "@/components/Map";
import AutocompleteComponent from "@/components/Autocomplete";

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 13.7563, // Bangkok
    lng: 100.5018,
  });
  const [markers, setMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [address, setAddress] = useState<string | null>(null);

  const getAddressFromLatLng = (lat: number, lng: number) => {
    const geocoder = new google.maps.Geocoder();
    const latlng = { lat, lng };
  
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        setAddress(results[0].formatted_address);
      } else {
        console.error("Geocoding failed:", status);
        setAddress("ไม่พบที่อยู่");
      }
    });
  };

  const handlePlaceSelected = (place: google.maps.places.PlaceResult) => {
    if (place.geometry) {
      const location = {
        lat: place.geometry.location?.lat() || 0,
        lng: place.geometry.location?.lng() || 0,
      };
      setCenter(location);
      setMarkers(() => [location]);
      getAddressFromLatLng(location.lat, location.lng);
    }
  };

  const handleUseCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(currentLocation);
          setMarkers(() => [currentLocation]);
          getAddressFromLatLng(currentLocation.lat, currentLocation.lng);
          setLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleMapClick = (location: google.maps.LatLngLiteral) => {
    setMarkers(() => [location]);
    getAddressFromLatLng(location.lat, location.lng);
  };

  useEffect(() => {
    handleUseCurrentLocation();
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center max-w-80 mx-auto">
      <div className="relative px-4">
        <h1 className="text-2xl font-bold text-center py-4">ค้นหาสถานที่</h1>
        <div className="space-y-4 mb-4">
          <AutocompleteComponent onPlaceSelected={handlePlaceSelected} />
          <button
            onClick={handleUseCurrentLocation}
            className="bg-blue-500 text-white p-2 rounded shadow flex items-center"
          >
            <BiTargetLock />
            <span className="ml-1">ใช้ตำแหน่งปัจจุบัน</span>
          </button>
        </div>
        <div className="relative">
          {loading && (
            <div className="absolute top-0 left-0 z-10 w-full h-full bg-slate-900 opacity-50 flex items-center justify-center">
              <span className="loader-rotation"></span>
            </div>
          )}
          <MapComponent center={center} markers={markers} onMapClick={handleMapClick} />
        </div>
        <div className="py-4 text-white">
          <p>พิกัด: {markers[0]?.lat}, {markers[0]?.lng}</p>
          <p>ที่อยู่: {address || "กำลังค้นหาที่อยู่..."}</p>
        </div>
      </div>
    </div>
  );
}