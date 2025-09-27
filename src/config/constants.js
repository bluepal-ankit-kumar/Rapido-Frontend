// constants.js
// App-wide constants for Rapido Frontend

// App Information
export const APP_NAME = 'Rapido';
export const APP_VERSION = '1.0.0';
export const SUPPORT_EMAIL = 'support@rapido.com';
export const SUPPORT_PHONE = '+91 8067697777';
export const HELP_CENTER_URL = 'https://rapido.com/help';

// Default Location (Bangalore)
export const DEFAULT_LOCATION = { 
  lat: 12.9716, 
  lng: 77.5946,
  address: 'Bangalore, Karnataka, India'
};

// Vehicle Types
export const VEHICLE_TYPES = [
  { id: 'bike', name: 'Bike', icon: '🚲', baseFare: 25, perKm: 10 },
  { id: 'auto', name: 'Auto', icon: '🛺', baseFare: 35, perKm: 15 },
  { id: 'cab', name: 'Cab', icon: '🚕', baseFare: 50, perKm: 20 }
];

// Ride Status
export const RIDE_STATUS = {
  REQUESTED: 'REQUESTED',
  ACCEPTED: 'ACCEPTED',
  ARRIVING: 'ARRIVING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

// Payment Methods
export const PAYMENT_METHODS = [
  { id: 'cash', name: 'Cash', icon: '💵' },
  { id: 'wallet', name: 'Rapido Wallet', icon: '👛' },
  { id: 'upi', name: 'UPI', icon: '📱' },
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' }
];

// User Roles
export const USER_ROLES = {
  CUSTOMER: 'customer',
  RIDER: 'rider',
  ADMIN: 'admin'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password'
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/update-profile',
    CHANGE_PASSWORD: '/api/user/change-password'
  },
  RIDE: {
    BOOK: '/api/ride/book',
    CANCEL: '/api/ride/cancel',
    HISTORY: '/api/ride/history',
    DETAILS: '/api/ride/details',
    TRACK: '/api/ride/track',
    RATE: '/api/ride/rate'
  },
  RIDER: {
    NEARBY: '/api/rider/nearby',
    ACCEPT_RIDE: '/api/rider/accept-ride',
    COMPLETE_RIDE: '/api/rider/complete-ride',
    STATUS: '/api/rider/status'
  },
  PAYMENT: {
    METHODS: '/api/payment/methods',
    ADD_METHOD: '/api/payment/add-method',
    REMOVE_METHOD: '/api/payment/remove-method',
    TRANSACTION_HISTORY: '/api/payment/transactions'
  },
  WALLET: {
    BALANCE: '/api/wallet/balance',
    ADD_MONEY: '/api/wallet/add-money',
    TRANSACTIONS: '/api/wallet/transactions'
  },
  NOTIFICATION: {
    LIST: '/api/notifications',
    READ: '/api/notifications/read',
    DELETE: '/api/notifications/delete'
  }
};

// Local Storage Keys
export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'rapido_auth_token',
  REFRESH_TOKEN: 'rapido_refresh_token',
  USER_DATA: 'rapido_user_data',
  USER_PREFERENCES: 'rapido_user_preferences',
  LAST_LOCATION: 'rapido_last_location'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection and try again.',
  AUTH_ERROR: 'Authentication failed. Please login again.',
  PERMISSION_DENIED: 'You do not have permission to perform this action.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_INPUT: 'Invalid input. Please check your data.',
  RIDE_NOT_FOUND: 'Ride not found.',
  PAYMENT_FAILED: 'Payment failed. Please try again.',
  LOCATION_ERROR: 'Unable to get your location. Please enable location services.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  REGISTRATION_SUCCESS: 'Registration successful! Please login.',
  PASSWORD_RESET_SENT: 'Password reset link sent to your email.',
  PASSWORD_CHANGED: 'Password changed successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  RIDE_BOOKED: 'Ride booked successfully!',
  RIDE_CANCELLED: 'Ride cancelled successfully!',
  PAYMENT_SUCCESSFUL: 'Payment successful!',
  MONEY_ADDED: 'Money added to wallet successfully!'
};

// Time Constants
export const TIME_CONSTANTS = {
  OTP_EXPIRY: 5 * 60 * 1000, // 5 minutes in milliseconds
  TOKEN_REFRESH: 15 * 60 * 1000, // 15 minutes in milliseconds
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds
  RIDE_TIMEOUT: 2 * 60 * 1000, // 2 minutes in milliseconds
  NOTIFICATION_DURATION: 5 * 1000 // 5 seconds in milliseconds
};

// Map Configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 15,
  MIN_ZOOM: 3,
  MAX_ZOOM: 18,
  TILE_LAYER_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
};

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  DASHBOARD: '/dashboard',
  RIDE_BOOKING: '/ride-booking',
  RIDE_HISTORY: '/ride-history',
  RIDE_DETAILS: '/ride-details/:id',
  PROFILE: '/profile',
  WALLET: '/wallet',
  PAYMENT_METHODS: '/payment-methods',
  SETTINGS: '/settings',
  HELP: '/help',
  ABOUT: '/about',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  NOT_FOUND: '/not-found'
};

// Social Media Links
export const SOCIAL_MEDIA = {
  FACEBOOK: 'https://facebook.com/rapido',
  TWITTER: 'https://twitter.com/rapido',
  INSTAGRAM: 'https://instagram.com/rapido',
  LINKEDIN: 'https://linkedin.com/company/rapido',
  YOUTUBE: 'https://youtube.com/rapido'
};

// App Store Links
export const APP_STORE_LINKS = {
  ANDROID: 'https://play.google.com/store/apps/details?id=com.rapido.customer',
  IOS: 'https://apps.apple.com/in/app/rapido-bike-taxi/id1075745554'
};

// FAQ Categories
export const FAQ_CATEGORIES = [
  'General',
  'Booking a Ride',
  'Payment',
  'Safety',
  'Account',
  'Refunds',
  'Technical Issues'
];

// Rating Scale
export const RATING_SCALE = {
  MIN: 1,
  MAX: 5,
  STEP: 0.5
};

// Max Values
export const MAX_VALUES = {
  OTP_LENGTH: 6,
  PASSWORD_LENGTH: 8,
  PHONE_LENGTH: 10,
  ADDRESS_LENGTH: 100,
  REVIEW_LENGTH: 500,
  FILE_SIZE: 5 * 1024 * 1024 // 5MB
};

// Image URLs
export const IMAGE_URLS = {
  LOGO: '/images/logo.png',
  LOGO_DARK: '/images/logo-dark.png',
  FAVICON: '/images/favicon.ico',
  DEFAULT_AVATAR: '/images/default-avatar.png',
  DEFAULT_VEHICLE: '/images/default-vehicle.png',
  BANNER: '/images/banner.jpg'
};

// Feature Flags
export const FEATURE_FLAGS = {
  ENABLE_WALLET: true,
  ENABLE_SCHEDULED_RIDES: true,
  ENABLE_RIDE_SHARING: false,
  ENABLE_MULTI_CITY: false,
  ENABLE_ADVANCED_SEARCH: true,
  ENABLE_PUSH_NOTIFICATIONS: true,
  ENABLE_LIVE_CHAT: false
};