// Mock users array for registration and login
export const mockUsers = [
  { name: 'Admin', email: 'admin@rapido.com', password: 'admin123', role: 'admin', verified: true },
  { name: 'Test User', email: 'user@rapido.com', password: 'user123', role: 'customer', verified: true },
  { name: 'Test Rider', email: 'rider@rapido.com', password: 'rider123', role: 'rider', verified: true }
];
// mockData.js

export const mockAvailableVehicles = [
  { id: 1, type: 'Bike', name: 'Rapido Bike' },
  { id: 2, type: 'Auto', name: 'Rapido Auto' },
  { id: 3, type: 'Car', name: 'Rapido Car' },
];


export const mockRiders = [
  { id: 101, name: 'Rider One', type: 'Bike', rating: 4.8, location: [12.9721, 77.5933], distance: 2.1, eta: 5 },
  { id: 102, name: 'Rider Two', type: 'Auto', rating: 4.6, location: [12.9750, 77.5990], distance: 3.5, eta: 7 },
  { id: 103, name: 'Rider Three', type: 'Car', rating: 4.9, location: [12.9700, 77.5900], distance: 1.2, eta: 4 },
  { id: 104, name: 'Rider Four', type: 'Bike', rating: 4.7, location: [12.9735, 77.5955], distance: 2.8, eta: 6 },
];
