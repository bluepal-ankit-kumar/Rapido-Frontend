import React from "react";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-yellow-400">About Rapido</h1>
      <p className="mb-4 text-gray-700">
        <strong>Rapido</strong> is a cutting-edge ride-hailing platform that effortlessly connects riders with drivers. Our mission is to deliver safe, affordable, and convenient travel experiences for everyone — whether you're commuting, running errands, or exploring your city.
      </p>
      <ul className="mb-4 list-disc pl-6 text-gray-700">
        <li>🚀 <strong>Fast Booking:</strong> Book your ride instantly through our simple and intuitive.</li>
        <li>🛵 <strong>Multiple Ride Options:</strong> Choose from bikes, autos, and more.</li>
        <li>📍 <strong>Live Tracking:</strong> Track your ride in real time with live map updates.</li>
        <li>⭐ <strong>Ratings & Reviews:</strong> Rate your experience and help us improve our service.</li>
        <li>🔒 <strong>Secure Payments:</strong> Pay easily and securely with multiple payment options.</li>
        <li>👥 <strong>For Riders & Drivers:</strong> Dedicated features and dashboards for both customers and captains.</li>
      </ul>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Key Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">10,000+</p>
            <p className="text-sm text-gray-600">Rides Completed</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">4.8/5</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">5,000+</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-400">2,000+</p>
            <p className="text-sm text-gray-600">Registered Riders</p>
          </div>
        </div>
      </div>
      <div className="mt-8 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()} Rapido. All rights reserved.
      </div>
    </div>
  );
}