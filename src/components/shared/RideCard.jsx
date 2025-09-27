import React from 'react';
import StarRating from '../common/StarRating';
import { 
  Person, 
  Star, 
  AccessTime, 
  LocationOn, 
  Navigation,
  TwoWheeler,
  LocalTaxi,
  AirportShuttle
} from '@mui/icons-material';

export default function RideCard({ ride }) {
  // Get vehicle icon based on ride type
  const getVehicleIcon = (type) => {
    switch(type) {
      case 'Bike':
        return <TwoWheeler className="text-yellow-500" />;
      case 'Auto':
        return <AirportShuttle className="text-yellow-500" />;
      case 'Cab':
        return <LocalTaxi className="text-yellow-500" />;
      default:
        return <TwoWheeler className="text-yellow-500" />;
    }
  };

  // Format date and time
  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="border border-gray-200 rounded-xl p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-yellow-50 rounded-lg">
            {getVehicleIcon(ride.type)}
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">{ride.type} Ride</h3>
            <p className="text-sm text-gray-500">{formatDateTime(ride.date)}</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-bold text-lg text-gray-800">₹{ride.price}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            ride.status === 'Completed' 
              ? 'bg-green-100 text-green-700' 
              : ride.status === 'Cancelled'
                ? 'bg-red-100 text-red-700'
                : 'bg-yellow-100 text-yellow-700'
          }`}>
            {ride.status}
          </span>
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="flex items-center mb-3">
          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-2">
            <Person className="text-gray-500 text-sm" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-800">{ride.driver.name}</p>
            <div className="flex items-center">
              <StarRating rating={ride.driver.rating} />
              <span className="text-sm text-gray-500 ml-1">({ride.driver.rating})</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-start mb-2">
          <div className="flex flex-col items-center mr-3">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-0.5 h-8 bg-gray-300 my-1"></div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <p className="text-xs text-gray-500">Pickup</p>
              <p className="text-sm font-medium text-gray-800">{ride.pickup}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Destination</p>
              <p className="text-sm font-medium text-gray-800">{ride.destination}</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center text-sm text-gray-600">
            <AccessTime className="text-gray-400 mr-1" fontSize="small" />
            <span>{ride.duration} min</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Navigation className="text-gray-400 mr-1" fontSize="small" />
            <span>{ride.distance} km</span>
          </div>
          <button className="text-sm font-medium text-yellow-500 hover:text-yellow-600">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}