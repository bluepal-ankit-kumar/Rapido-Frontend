// import React, { createContext, useContext, useState, useEffect } from 'react';
// import RideService from '../services/RideService.js';

// const RideContext = createContext();

// export default RideContext;

// export function RideProvider({ children }) {
//   // Only customer-relevant state
//   const [activeRide, setActiveRide] = useState(null);
//   const [rideStatus, setRideStatus] = useState('idle');

// 	const bookRide = async (rideRequest) => {
// 		try {
// 			const response = await RideService.bookRide(rideRequest);
// 			setActiveRide(response.data);
// 			setRideStatus('booked');
// 		} catch (error) {
// 			console.error('Failed to book ride:', error);
// 		}
// 	};
// 	const startRide = async (rideId) => {
// 		try {
// 			await RideService.updateRideStatus(rideId, 'in-progress');
// 			setRideStatus('in-progress');
// 		} catch (error) {
// 			console.error('Failed to start ride:', error);
// 		}
// 	};
// 	const completeRide = async (rideId) => {
// 		try {
// 			await RideService.updateRideStatus(rideId, 'completed');
// 			setRideStatus('completed');
// 		} catch (error) {
// 			console.error('Failed to complete ride:', error);
// 		}
// 	};
// 	const resetRide = () => {
// 		setActiveRide(null);
// 		setRideStatus('idle');
// 	};

// 	// Get ride location by id (from backend)
// 	const getRideLocation = async (rideId) => {
// 		try {
// 			const response = await RideService.getRideLocation(rideId);
// 			return response.data;
// 		} catch (error) {
// 			console.error('Failed to get ride location:', error);
// 			return null;
// 		}
// 	};

// 		return (
// 			<RideContext.Provider value={{ activeRide, rideStatus, bookRide, startRide, completeRide, resetRide, getRideLocation }}>
// 				{children}
// 			</RideContext.Provider>
// 		);
// }

// export function useRide() {
// 	return useContext(RideContext);
// }



import React, { createContext, useContext, useState, useEffect } from 'react';
import RideService from '../services/RideService.js';

const RideContext = createContext();

export function RideProvider({ children }) {
  // Customer state
  const [activeRide, setActiveRide] = useState(null);
  const [rideStatus, setRideStatus] = useState('idle');
  // Driver state
  const [driverRideId, setDriverRideId] = useState(null);

  const bookRide = async (rideRequest) => {
    try {
      const response = await RideService.bookRide(rideRequest);
      setActiveRide(response.data);
      setRideStatus('booked');
    } catch (error) {
      console.error('Failed to book ride:', error);
      throw error;
    }
  };

  const startRide = async (rideId) => {
    try {
      await RideService.updateRideStatus(rideId, 'in-progress');
      setRideStatus('in-progress');
    } catch (error) {
      console.error('Failed to start ride:', error);
      throw error;
    }
  };

  const completeRide = async (rideId) => {
    try {
      await RideService.updateRideStatus(rideId, 'completed');
      setRideStatus('completed');
    } catch (error) {
      console.error('Failed to complete ride:', error);
      throw error;
    }
  };

  const resetRide = () => {
    setActiveRide(null);
    setRideStatus('idle');
    setDriverRideId(null); // Reset driver state too
  };

  const getRideLocation = async (rideId) => {
    try {
      const response = await RideService.getRideLocation(rideId);
      return response.data;
    } catch (error) {
      console.error('Failed to get ride location:', error);
      return null;
    }
  };

  return (
    <RideContext.Provider
      value={{
        activeRide,
        rideStatus,
        bookRide,
        startRide,
        completeRide,
        resetRide,
        getRideLocation,
        driverRideId,
        setDriverRideId,
      }}
    >
      {children}
    </RideContext.Provider>
  );
}

export function useRide() {
  return useContext(RideContext);
}