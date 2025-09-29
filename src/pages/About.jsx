import React from "react";

export default function About() {
  return (
    <div className="max-w-2xl mx-auto p-8 mt-8 bg-white rounded-xl shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-yellow-600">About Rapido</h1>
      <p className="mb-4 text-gray-700">
        <strong>Rapido</strong> is a modern ride-hailing platform designed to connect riders and drivers seamlessly. Our mission is to provide safe, affordable, and convenient transportation for everyone, whether you are commuting to work, running errands, or exploring the city.
      </p>
      <ul className="mb-4 list-disc pl-6 text-gray-700">
        <li>🚀 <strong>Fast Booking:</strong> Book a ride in seconds with our user-friendly interface.</li>
        <li>🛵 <strong>Multiple Ride Options:</strong> Choose from bikes, autos, and more for your journey.</li>
        <li>📍 <strong>Live Tracking:</strong> Track your ride and driver in real-time on the map.</li>
        <li>⭐ <strong>Ratings & Reviews:</strong> Rate your experience and help us improve our service.</li>
        <li>🔒 <strong>Secure Payments:</strong> Pay easily and securely with multiple payment options.</li>
        <li>👥 <strong>For Riders & Drivers:</strong> Dedicated features and dashboards for both customers and captains.</li>
      </ul>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-800">Key Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">10,000+</p>
            <p className="text-sm text-gray-600">Rides Completed</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
            <p className="text-sm text-gray-600">Average Rating</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">5,000+</p>
            <p className="text-sm text-gray-600">Active Users</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">2,000+</p>
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
