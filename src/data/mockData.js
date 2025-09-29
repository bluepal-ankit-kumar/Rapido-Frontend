// Mock users array for registration and login
export const mockUsers = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    email: 'admin@rapido.com',
    phone: '9999999999',
    user_type: 'ADMIN',
    rating: 0,
    created_at: '2025-09-01T10:00:00',
    updated_at: '2025-09-01T10:00:00'
  },
  {
    id: 2,
    username: 'testuser',
    password: 'user123',
    email: 'user@rapido.com',
    phone: '8888888888',
    user_type: 'CUSTOMER',
    rating: 4.7,
    created_at: '2025-09-01T10:00:00',
    updated_at: '2025-09-01T10:00:00'
  },
  {
    id: 3,
    username: 'testrider',
    password: 'rider123',
    email: 'rider@rapido.com',
    phone: '7777777777',
    user_type: 'DRIVER',
    rating: 4.8,
    created_at: '2025-09-01T10:00:00',
    updated_at: '2025-09-01T10:00:00'
  }
];

export const mockProfiles = [
  {
    id: 1,
    user_id: 2,
    full_name: 'Test User',
    address: '123, MG Road, Bangalore',
    documents: { id_proof: 'url', license: null },
    fcm_token: 'token123'
  },
  {
    id: 2,
    user_id: 3,
    full_name: 'Test Rider',
    address: '456, Koramangala, Bangalore',
    documents: { id_proof: 'url', license: 'url' },
    fcm_token: 'token456'
  }
];

export const mockVehicles = [
  {
    id: 1,
    driver_id: 3,
    vehicle_type: 'BIKE',
    vehicle_number: 'KA01AB1234',
    model: 'Honda Activa',
    color: 'Black',
    capacity: 2,
    verified: true
  }
];

export const mockRides = [
  {
    id: 1,
    request_id: 101,
    rider_id: 2,
    driver_id: 3,
    pickup_location: { lat: 12.9716, lon: 77.5946, name: 'MG Road' },
    dropoff_location: { lat: 12.9352, lon: 77.6245, name: 'Koramangala' },
    start_time: '2025-09-20T10:30:00',
    end_time: '2025-09-20T10:45:00',
    status: 'COMPLETED',
    fare: 120.00,
    distance: 5.2,
    duration: 15,
    cancel_reason: null,
    created_at: '2025-09-20T10:25:00',
    driver: { name: 'Test Rider', rating: 4.8, vehicle_type: 'BIKE' },
    rider: { name: 'Test User' },
    rating: 5
  }
];

export const mockPayments = [
  {
    id: 1,
    ride_id: 1,
    amount: 120.00,
    payment_method: 'UPI',
    status: 'SUCCESS',
    transaction_id: 'TXN123456',
    created_at: '2025-09-20T10:46:00'
  }
];

export const mockNotifications = [
  {
    id: 1,
    user_id: 2,
    title: 'Ride Completed',
    message: 'Your ride to Koramangala is completed.',
    type: 'PUSH',
    status: 'SENT',
    sent_at: '2025-09-20T10:46:00'
  }
];

export const mockRatings = [
  {
    id: 1,
    ride_id: 1,
    rater_id: 2,
    ratee_id: 3,
    score: 5,
    feedback: 'Great ride!',
    created_at: '2025-09-20T10:50:00'
  }
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
