import { useState, useEffect, useContext } from 'react';
import RideContext from '../contexts/RideContext.jsx';

export default function useRideTracking(rideId) {
  const { rides, updateRideStatus, getRideLocation } = useContext(RideContext);
  const [ride, setRide] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (!rideId) return;
    const currentRide = rides.find(r => r.id === rideId);
    setRide(currentRide || null);
    // Simulate real-time location updates
    const interval = setInterval(() => {
      if (getRideLocation && rideId) {
        setLocation(getRideLocation(rideId));
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [rideId, rides, getRideLocation]);

  const changeStatus = status => {
    if (updateRideStatus && rideId) {
      updateRideStatus(rideId, status);
    }
  };

  return { ride, location, changeStatus };
}
