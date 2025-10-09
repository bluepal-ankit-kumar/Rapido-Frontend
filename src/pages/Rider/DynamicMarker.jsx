// In MapDisplay.jsx, before the main export default function

import { Marker, Popup, useMap } from 'react-leaflet';
import React, { useEffect, useRef } from 'react';

const DynamicMarker = ({ position, icon, popupText }) => {
  const map = useMap(); // Get the map instance
  const markerRef = useRef(null); // Get a ref to the marker instance

  // This effect runs whenever the 'position' prop changes
  useEffect(() => {
    if (position && markerRef.current) {
      // Update the marker's position on the map
      markerRef.current.setLatLng(position);
      // Optionally, pan the map to keep the marker in view
      map.panTo(position);
    }
  }, [position, map]);

  if (!position) return null;

  return (
    <Marker ref={markerRef} position={position} icon={icon}>
      <Popup>{popupText}</Popup>
    </Marker>
  );
};

export default DynamicMarker;