import React, { useEffect, useRef, useState } from 'react';
import { loadGoogleMaps } from '../../services/GoogleMapsLoader';

export default function GoogleMapDisplay({ userLocation, riderLocation, routePoints = [] }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let isMounted = true;
    async function init() {
      const g = await loadGoogleMaps().catch((e) => {
        if (isMounted) setLoadError(e?.message || 'Failed to load Google Maps');
        return null;
      });
      if (!g || !isMounted) return;
      setLoadError('');
      if (!mapInstanceRef.current) {
        mapInstanceRef.current = new g.maps.Map(mapRef.current, {
          center: userLocation && Array.isArray(userLocation) ? { lat: userLocation[0], lng: userLocation[1] } : { lat: 17.385, lng: 78.4867 },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
      }
      const map = mapInstanceRef.current;

      // update or create user marker
      if (userLocation && Array.isArray(userLocation) && typeof userLocation[0] === 'number' && typeof userLocation[1] === 'number') {
        if (!markersRef.current.user) {
          markersRef.current.user = new g.maps.Marker({
            map,
            position: { lat: userLocation[0], lng: userLocation[1] },
            icon: {
              path: g.maps.SymbolPath.CIRCLE,
              scale: 6,
              fillColor: '#1E88E5',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: '#ffffff',
            },
            title: 'Your Location',
          });
        } else {
          markersRef.current.user.setPosition({ lat: userLocation[0], lng: userLocation[1] });
        }
      }

      // update or create rider/driver marker
      if (riderLocation && Array.isArray(riderLocation) && typeof riderLocation[0] === 'number' && typeof riderLocation[1] === 'number') {
        if (!markersRef.current.rider) {
          markersRef.current.rider = new g.maps.Marker({
            map,
            position: { lat: riderLocation[0], lng: riderLocation[1] },
            icon: {
              path: g.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
              scale: 5,
              fillColor: '#F9A825',
              fillOpacity: 1,
              strokeWeight: 1,
              strokeColor: '#B28704',
            },
            title: 'Destination',
          });
        } else {
          markersRef.current.rider.setPosition({ lat: riderLocation[0], lng: riderLocation[1] });
        }
      }

      // update polyline for route
      if (Array.isArray(routePoints) && routePoints.length > 1) {
        const path = routePoints
          .filter(p => Array.isArray(p) && typeof p[0] === 'number' && typeof p[1] === 'number')
          .map(p => ({ lat: p[0], lng: p[1] }));
        if (polylineRef.current) {
          polylineRef.current.setPath(path);
        } else {
          polylineRef.current = new g.maps.Polyline({
            map,
            path,
            strokeColor: '#1976d2',
            strokeOpacity: 0.8,
            strokeWeight: 5,
          });
        }
        // fit bounds
        const bounds = new g.maps.LatLngBounds();
        path.forEach(pt => bounds.extend(pt));
        map.fitBounds(bounds, 64);
      } else if (userLocation) {
        map.setCenter({ lat: userLocation[0], lng: userLocation[1] });
      }
    }
    init();
    return () => { isMounted = false; };
  }, [userLocation?.[0], userLocation?.[1], riderLocation?.[0], riderLocation?.[1], JSON.stringify(routePoints)]);

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg relative">
      {loadError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-gray-700 text-sm">
          {loadError}. Check your API key and referrer settings.
        </div>
      )}
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </div>
  );
}
