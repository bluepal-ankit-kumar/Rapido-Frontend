import React from 'react';

const types = [
  { type: 'Bike', icon: '🏍️' },
  { type: 'Auto', icon: '🛺' },
  { type: 'SUV', icon: '🚙' },
  { type: 'Scooty', icon: '🛵' },
  { type: 'Non AC Cab', icon: '🚖' },
  { type: 'Ac Cab', icon: '🚗' },

];

export default function VehicleTypeSelector({ selected, onSelect }) {
  return (
   <div className="flex flex-wrap justify-center gap-6 my-8 px-4">
  {types.map(({ type, icon }) => (
    <button
      key={type}
      onClick={() => onSelect(type)}
      className={`flex items-center justify-center gap-4 px-8 py-4 min-w-[300px] rounded-2xl font-semibold text-lg shadow-md transition-all duration-300 
        ${
          selected === type
            ? 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-lg scale-105 border border-yellow-400'
            : 'bg-white text-gray-800 border border-gray-200 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-yellow-100 hover:scale-105 hover:shadow-md'
        }`}
    >
      <span className="text-2xl">{icon}</span>
      <span>{type}</span>
    </button>
  ))}
</div>

  );
}
