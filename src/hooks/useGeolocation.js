import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  useEffect(() => {
    if (!navigator.geolocation) return;
      const success = pos => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          error: null,
        });
      };
      const error = err => {
        setLocation(loc => ({ ...loc, error: err.message }));
      };
      const watcher = navigator.geolocation.watchPosition(success, error);
      return () => navigator.geolocation.clearWatch(watcher);
  }, []);
  return location;
}
