import React, { createContext, useContext, useState } from 'react';
import { mockUsers, mockRiders } from '../data/mockData';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  // Use profile or user location if available, fallback to default
  const [userLocation, setUserLocation] = useState({
    lat: 12.9716,
    lon: 77.5946
  });
  const [nearbyRiders, setNearbyRiders] = useState(mockRiders);

  // Simulate location update
  const updateUserLocation = (location) => setUserLocation(location);
  const updateNearbyRiders = (riders) => setNearbyRiders(riders);

  return (
    <LocationContext.Provider value={{ userLocation, nearbyRiders, updateUserLocation, updateNearbyRiders }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
