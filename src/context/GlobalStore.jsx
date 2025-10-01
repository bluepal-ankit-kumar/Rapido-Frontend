import React, { createContext, useContext, useState } from 'react';

// Minimal global mock store for rides + rider wallet
const GlobalContext = createContext(null);

export function GlobalProvider({ children }) {
	// Mock single ride used across pages
	const [rides, setRides] = useState({
		201: {
			id: 201,
			status: 'ongoing', // 'ongoing' | 'cancelled' | 'completed'
			stage: 'toCustomer', // 'toCustomer' | 'toDestination' | 'completed'
			driver: {
				name: 'Rajesh Kumar',
				rating: 4.8,
				vehicle: 'Toyota Innova',
				licensePlate: 'KA-01-AB-1234',
				phone: '+91 98765 43210',
				location: [12.9750, 77.5900],
			},
			customer: {
				name: 'John Doe',
				location: [12.9716, 77.5946],
			},
			pickup: 'MG Road',
			drop: 'Koramangala',
			otp: '1234', // mock OTP
			fare: 150, // mock fare
			progress: 0, // percentage for toDestination
		}
	});

	const [wallet, setWallet] = useState({
		balance: 500.00
	});

	// track simple payments
	const [payments, setPayments] = useState({}); // { [rideId]: { amount, method, id, status } }

	function getRide(rideId) {
		return rides[rideId];
	}

	function cancelRide(rideId) {
		setRides(prev => ({
			...prev,
			[rideId]: {
				...prev[rideId],
				status: 'cancelled',
			}
		}));
	}

	function reachCustomer(rideId) {
		setRides(prev => ({
			...prev,
			[rideId]: {
				...prev[rideId],
				stage: 'toDestination',
				status: 'ongoing',
			}
		}));
	}

	function updateProgress(rideId, value) {
		setRides(prev => ({
			...prev,
			[rideId]: {
				...prev[rideId],
				progress: value,
			}
		}));
	}

	function completeRide(rideId) {
		const ride = rides[rideId];
		if (!ride) return;
		setRides(prev => ({
			...prev,
			[rideId]: {
				...prev[rideId],
				status: 'completed',
				stage: 'completed',
				progress: 100,
			}
		}));
		// credit wallet with fare
		setWallet(prev => ({
			...prev,
			balance: +(prev.balance + (ride.fare || 0)).toFixed(2)
		}));
	}

	function addToWallet(amount) {
		setWallet(prev => ({
			...prev,
			balance: +(prev.balance + Number(amount)).toFixed(2)
		}));
	}

	function withdrawFromWallet(amount) {
		setWallet(prev => ({
			...prev,
			balance: +(prev.balance - Number(amount)).toFixed(2)
		}));
	}

	function recordPayment(rideId, payment) {
		setPayments(prev => ({
			...prev,
			[rideId]: {
				...(prev[rideId] || {}),
				...payment,
				status: payment.status || 'PAID'
			}
		}));
		// mark ride as paid if exists
		setRides(prev => ({
			...prev,
			[rideId]: prev[rideId] ? { ...prev[rideId], paid: true } : prev[rideId]
		}));
	}

	return (
		<GlobalContext.Provider value={{
			getRide,
			cancelRide,
			reachCustomer,
			completeRide,
			updateProgress,
			wallet,
			addToWallet,
			withdrawFromWallet,
			rides, // expose for debugging/iteration if needed
			payments,
			recordPayment
		}}>
			{children}
		</GlobalContext.Provider>
	);
}

export function useGlobalStore() {
	const ctx = useContext(GlobalContext);
	if (!ctx) throw new Error('useGlobalStore must be used within GlobalProvider');
	return ctx;
}
