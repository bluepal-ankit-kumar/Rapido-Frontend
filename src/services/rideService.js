const rides = [
	{ id: 1, user: 'John Doe', pickup: 'MG Road', drop: 'Koramangala', date: '2025-09-20', status: 'Completed' },
	{ id: 2, user: 'Jane Smith', pickup: 'Indiranagar', drop: 'HSR Layout', date: '2025-09-22', status: 'Completed' },
];

export function getRides() {
	return rides;
}

export function bookRide(user, pickup, drop, type) {
	const newRide = { id: rides.length + 1, user, pickup, drop, type, date: new Date().toISOString().slice(0,10), status: 'Confirmed' };
	rides.push(newRide);
	return newRide;
}

export function updateRideStatus(id, status) {
	const ride = rides.find(r => r.id === id);
	if (ride) ride.status = status;
	return ride;
}
