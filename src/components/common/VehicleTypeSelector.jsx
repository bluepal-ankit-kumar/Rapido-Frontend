import React from 'react';

const types = [
  { type: 'Bike', icon: '🏍️' },
  { type: 'Auto', icon: '🛺' },
  { type: 'Cab', icon: '🚕' },
];

export default function VehicleTypeSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-4 justify-center my-4">
      {types.map(({ type, icon }) => (
        <button
          key={type}
          className={`flex items-center gap-2 px-10 py-2 min-w-[340px] rounded font-medium border transition-all duration-200 shadow-sm ${selected === type ? 'bg-yellow-400 text-white border-yellow-400' : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-yellow-50 hover:border-yellow-400'}`}
          onClick={() => onSelect(type)}
        >
          <span className="text-xl">{icon}</span> {type}
        </button>
      ))}
    </div>
  );
}
