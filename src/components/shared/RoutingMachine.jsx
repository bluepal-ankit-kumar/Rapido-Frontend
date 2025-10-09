// In src/components/shared/RoutingMachine.jsx

import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

const RoutingMachine = ({ pickup, dropoff }) => {
  // useMap() is a hook from react-leaflet that gives us the underlying Leaflet map instance
  const map = useMap();

  useEffect(() => {
    // Ensure the map instance and coordinates are available
    if (!map || !pickup || !dropoff) return;

    // Create the routing control instance
    const routingControl = L.Routing.control({
      // The main waypoints for the route
      waypoints: [
        L.latLng(pickup[0], pickup[1]),
        L.latLng(dropoff[0], dropoff[1]),
      ],
      // --- CUSTOMIZATION OPTIONS ---
      
      // Hides the step-by-step instructions panel
      show: false, 
      
      // Prevents the user from adding new waypoints by clicking on the map
      addWaypoints: false, 
      
      // Allows the route line to be dragged and recalculated
      routeWhileDragging: true,
      
      // Hides the default start and end markers, since you are already rendering your own
      // in the MapDisplay component.
      createMarker: function() { return null; },
      
      // Automatically fits the map view to the calculated route
      fitSelectedRoutes: true, 
      
      // Custom styling for the route line
      lineOptions: {
        styles: [{ color: '#1976d2', opacity: 0.8, weight: 6 }],
      },
    }).addTo(map); // Add the routing control to the map

    // This is a "cleanup function" that runs when the component is unmounted or when
    // the pickup/dropoff coordinates change. It removes the old route from the map.
    return () => map.removeControl(routingControl);

  }, [map, pickup, dropoff]); // Re-run the effect if the map or coordinates change

  // This component does not render any visible JSX itself; it just manipulates the map.
  return null; 
};

export default RoutingMachine;