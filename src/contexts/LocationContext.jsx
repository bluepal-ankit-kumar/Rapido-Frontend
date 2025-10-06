import React, { createContext, useContext, useState } from 'react';
// import LocationService or Rider API if needed

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [userLocation, setUserLocation] = useState(mockUsers[0].location);
  const [nearbyRiders, setNearbyRiders] = useState([]);

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
