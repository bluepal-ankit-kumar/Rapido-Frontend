
// import React, { useState, useEffect } from 'react';
// import L from 'leaflet';
// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';
// import { MapContainer, Marker, Popup, TileLayer, ZoomControl, Polyline } from 'react-leaflet';
// import RoutingMachine from './RoutingMachine';

// // Fix for default markers not showing
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// // Custom icons
// const userIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// const riderIcon = new L.Icon({
//   iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
//   shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41]
// });

// export default function MapDisplay({ userLocation, pickupCoords, dropoffCoords, riderLocation  }) {
//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState([28.6139, 77.2090]); // Default to Delhi
  
//   useEffect(() => {
//     if (userLocation && map) {
//       setCenter(userLocation);
//       // Use setView for instant recentering, or flyTo for smooth animation
//       map.setView(userLocation, 15, { animate: true });
//     } else if (userLocation) {
//       setCenter(userLocation);
//     }
//   }, [userLocation, map]);

//   return (
//     <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg relative">
//       <MapContainer
//         center={center}
//         zoom={13}
//         style={{ height: '100%', width: '100%' }}
//         whenCreated={setMap}
//         zoomControl={false}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
        
//         <ZoomControl position="topright" />
        
//         {userLocation && Array.isArray(userLocation) && userLocation.length === 2 &&
//           typeof userLocation[0] === 'number' && typeof userLocation[1] === 'number' && (
//             <Marker position={userLocation} icon={userIcon}>
//               <Popup>
//                 <div className="text-center p-1">
//                   <p className="font-semibold text-blue-600">User Location</p>
//                   <p className="text-xs text-gray-600">
//                     Lat: {userLocation[0].toFixed(4)}
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     Lng: {userLocation[1].toFixed(4)}
//                   </p>
//                 </div>
//               </Popup>
//             </Marker>
//         )}

//         {/* Rider location pointer (tracked) */}
//         {riderLocation && Array.isArray(riderLocation) && riderLocation.length === 2 &&
//           typeof riderLocation[0] === 'number' && typeof riderLocation[1] === 'number' && (
//             <Marker position={riderLocation} icon={riderIcon}>
//               <Popup>
//                 <div className="text-center p-1">
//                   <p className="font-semibold text-yellow-600">Rider Location</p>
//                   <p className="text-xs text-gray-600">
//                     Lat: {riderLocation[0].toFixed(4)}
//                   </p>
//                   <p className="text-xs text-gray-600">
//                     Lng: {riderLocation[1].toFixed(4)}
//                   </p>
//                 </div>
//               </Popup>
//             </Marker>
//         )}
        
//   {nearbyRiders && nearbyRiders.map((rider) => (
//           Array.isArray(rider.location) && rider.location.length === 2 &&
//           typeof rider.location[0] === 'number' && typeof rider.location[1] === 'number' ? (
//             <Marker key={rider.id} position={rider.location} icon={riderIcon}>
//               <Popup>
//                 <div className="text-center p-1 min-w-[150px]">
//                   <div className="flex items-center justify-center mb-1">
//                     <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
//                       <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
//                         <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
//                         <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-6a1 1 0 00-.293-.707l-4-4A1 1 0 0016 3H3z" />
//                       </svg>
//                     </div>
//                     <p className="font-semibold text-yellow-600">{rider.name}</p>
//                   </div>
//                   <p className="text-xs text-gray-600">Distance: {rider.distance} km</p>
//                   <p className="text-xs text-gray-600">ETA: {rider.eta} min</p>
//                   <button className="mt-2 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition-colors">
//                     Book Ride
//                   </button>
//                 </div>
//               </Popup>
//             </Marker>
//           ) : null
//         ))}

//          {pickupCoords && (
//           <Marker position={pickupCoords} icon={userIcon}>
//             <Popup>Pickup Location</Popup>
//           </Marker>
//         )}

//         {dropoffCoords && (
//           <Marker position={dropoffCoords}>
//             <Popup>Dropoff Location</Popup>
//           </Marker>
//         )}
//         {/* Routing machine for route */}
//        {pickupCoords && dropoffCoords && (
//           <RoutingMachine pickup={pickupCoords} dropoff={dropoffCoords} />
//         )}
//       </MapContainer>
      
//       {/* Location info card */}
//       <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-3 max-w-xs z-[1000]">
//         <div className="flex items-start">
//           <div className="bg-yellow-100 p-1 rounded mr-2">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" viewBox="0 0 20 20" fill="currentColor">
//               <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <div>
//             <p className="text-sm font-medium text-gray-900">Current Location</p>
//             <p className="text-xs text-gray-500">
//               {userLocation && Array.isArray(userLocation) && typeof userLocation[0] === 'number' && typeof userLocation[1] === 'number'
//                 ? `${userLocation[0].toFixed(4)}, ${userLocation[1].toFixed(4)}`
//                 : 'Fetching location...'}
//             </p>
//           </div>
//         </div>
//       </div>
      
//       {/* Map attribution styling */}
//       <style>{`
//         .leaflet-control-attribution {
//           background-color: rgba(255, 255, 255, 0.7) !important;
//           font-size: 10px !important;
//         }
//       `}</style>
//     </div>
//   );
// }


import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import RoutingMachine from './RoutingMachine'; // Make sure this path is correct

// --- ICON SETUP (No changes needed here, your code is perfect) ---
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import DynamicMarker from '../../pages/Rider/DynamicMarker'; // Adjust the path as necessary

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const riderIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
// --- END OF ICON SETUP ---


export default function MapDisplay({ userLocation, riderLocation, pickupCoords, dropoffCoords, nearbyRiders }) {
  const [map, setMap] = useState(null);

  // Determine a sensible center point for the map on initial load.
  // It prioritizes the user's (driver's) location, then the pickup, then a default.
  const initialCenter = userLocation || pickupCoords || [28.6139, 77.2090]; // Default to Delhi

  return (
    <div className="w-full h-80 rounded-xl overflow-hidden shadow-lg relative">
      <MapContainer
        center={initialCenter}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={setMap}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <ZoomControl position="topright" />
        
        {/* Marker for the current user (e.g., the driver's own location) */}
        {/* {userLocation && (
            <Marker position={userLocation} icon={userIcon}>
              <Popup>Your Location</Popup>
            </Marker>
        )} */}

        {/* Marker for the customer's pickup location */}
        {/* {pickupCoords && (
            <Marker position={pickupCoords}>
              <Popup>Customer Pickup</Popup>
            </Marker>
        )} */}
        
        {/* Marker for a single, tracked rider (e.g., in the live tracking screen) */}
        {/* {riderLocation && (
            <Marker position={riderLocation} icon={riderIcon}>
              <Popup>Rider Location</Popup>
            </Marker>
        )} */}

        <DynamicMarker 
          position={riderLocation} 
          icon={riderIcon} 
          popupText="Rider Location" 
        />
        
        {/* Renders a list of nearby riders (e.g., for a customer's view) */}
        {nearbyRiders && nearbyRiders.map((rider) => (
            <Marker key={rider.id} position={rider.location} icon={riderIcon}>
              <Popup>{rider.name}</Popup>
            </Marker>
        ))}
        
        {/* --- THIS IS THE KEY ADDITION --- */}
        {/* It renders the route only when both a pickup and dropoff point are provided */}
        {pickupCoords && dropoffCoords && (
          <RoutingMachine pickup={pickupCoords} dropoff={dropoffCoords} />
        )}

      </MapContainer>
      
      {/* Your location info card and styles are great, keeping them as is. */}
      <div className="absolute bottom-3 left-3 bg-white rounded-lg shadow-md p-3 max-w-xs z-[1000]">
        {/* ... your location info card JSX ... */}
      </div>
      
      <style>{`
        .leaflet-control-attribution {
          background-color: rgba(255, 255, 255, 0.7) !important;
          font-size: 10px !important;
        }
      `}</style>
    </div>
  );
}