import React, { createContext, useContext, useState } from 'react';
import { mockRiders } from '../data/mockData.js';

const RideContext = createContext();

export default RideContext;

export function RideProvider({ children }) {
	// Mock rides data
	const [rides, setRides] = useState([
		{ id: 101, rider: mockRiders[0], status: 'in-progress', location: { latitude: 12.9716, longitude: 77.5946 } },
		{ id: 102, rider: mockRiders[1], status: 'completed', location: { latitude: 12.9352, longitude: 77.6245 } },
		{ id: 103, rider: mockRiders[2], status: 'booked', location: { latitude: 12.9081, longitude: 77.6476 } },
	]);
	const [activeRide, setActiveRide] = useState(null);
	const [rideStatus, setRideStatus] = useState('idle');

	const bookRide = (ride) => {
		setActiveRide(ride);
		setRideStatus('booked');
	};
	const startRide = () => setRideStatus('in-progress');
	const completeRide = () => setRideStatus('completed');
	const resetRide = () => {
		setActiveRide(null);
		setRideStatus('idle');
	};

	// Update ride status by id
	const updateRideStatus = (rideId, status) => {
		setRides(prevRides => prevRides.map(r => r.id === rideId ? { ...r, status } : r));
	};

	// Get ride location by id
	const getRideLocation = (rideId) => {
		const ride = rides.find(r => r.id === rideId);
		return ride ? ride.location : null;
	};

	return (
		<RideContext.Provider value={{ rides, activeRide, rideStatus, bookRide, startRide, completeRide, resetRide, updateRideStatus, getRideLocation }}>
			{children}
		</RideContext.Provider>
	);
}

export function useRide() {
	return useContext(RideContext);
}
