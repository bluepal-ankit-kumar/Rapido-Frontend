import React, { createContext, useContext, useState } from 'react';
import { mockRiders, mockRides } from '../data/mockData.js';

const RideContext = createContext();

export default RideContext;

export function RideProvider({ children }) {
	// Use mockRides from mockData.js for schema alignment
	const [rides, setRides] = useState(mockRides);
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
