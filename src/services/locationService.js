import { mockRiders } from '../data/mockData';

export function getNearbyRiders(userLocation, vehicleType) {
  // Filter by vehicleType (mock proximity)
  return mockRiders.filter(r => r.type === vehicleType);
}

export function sendRiderLocation(riderId, location) {
  // Simulate sending location
  return { success: true };
}
