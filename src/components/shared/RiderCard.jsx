import React from 'react';
import StarRating from '../common/StarRating';
import { 
  Person, 
  Star, 
  AccessTime, 
  LocationOn, 
  TwoWheeler,
  LocalTaxi,
  AirportShuttle,
  Phone,
  Message
} from '@mui/icons-material';

export default function RiderCard({ rider, onBook }) {
  // Get vehicle icon based on rider type
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

  // Format distance
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${Math.round(distance * 1000)} m away`;
    }
    return `${distance} km away`;
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden">
      {/* Online indicator */}
      <div className="absolute top-4 right-4 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-1 ${rider.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
        <span className="text-xs text-gray-500">{rider.isOnline ? 'Online' : 'Offline'}</span>
      </div>
      
      <div className="flex flex-col items-center text-center mb-4">
        {/* Rider avatar */}
        <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mb-3 border-2 border-yellow-200">
          {rider.avatar ? (
            <img src={rider.avatar} alt={rider.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            <Person className="text-yellow-500 text-2xl" />
          )}
        </div>
        
        {/* Rider name and type */}
        <h3 className="font-bold text-lg text-gray-800">{rider.name}</h3>
        <div className="flex items-center justify-center mt-1 text-gray-600">
          <span className="mr-2">{getVehicleIcon(rider.type)}</span>
          <span>{rider.type}</span>
        </div>
      </div>
      
      {/* Stats and rating */}
      <div className="flex justify-around mb-4 py-3 border-t border-gray-100 border-b">
        <div className="text-center">
          <div className="flex items-center justify-center text-yellow-500 mb-1">
            <StarRating rating={rider.rating} />
          </div>
          <p className="text-xs text-gray-500">{rider.rating} Rating</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-700 mb-1">
            <AccessTime className="text-yellow-500 mr-1" fontSize="small" />
            <span className="font-medium">{rider.eta || '5'} min</span>
          </div>
          <p className="text-xs text-gray-500">ETA</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center text-gray-700 mb-1">
            <LocationOn className="text-yellow-500 mr-1" fontSize="small" />
            <span className="font-medium">{formatDistance(rider.distance)}</span>
          </div>
          <p className="text-xs text-gray-500">Distance</p>
        </div>
      </div>
      
      {/* Additional info */}
      <div className="mb-4">
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span className="font-medium w-20">Vehicle:</span>
          <span>{rider.vehicleModel || 'Honda Activa'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <span className="font-medium w-20">Plate:</span>
          <span>{rider.licensePlate || 'DL-01-AB-1234'}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <span className="font-medium w-20">Trips:</span>
          <span>{rider.tripCount || 150}+ completed</span>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex gap-2">
        <button className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
          <Phone fontSize="small" />
          <span>Call</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
          <Message fontSize="small" />
          <span>Message</span>
        </button>
        <button 
          onClick={() => onBook && onBook(rider)}
          className="flex-1 flex items-center justify-center gap-1 py-2 px-3 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition-colors font-medium"
        >
          Book
        </button>
      </div>
    </div>
  );
}