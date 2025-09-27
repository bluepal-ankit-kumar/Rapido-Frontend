import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import {
  Dashboard,
  TwoWheeler,
  History,
  Person,
  Help,
  People,
  DirectionsBike,
  Assessment,
  StarRate,
  SupportAgent,
  Home,
  ExitToApp
} from '@mui/icons-material';

const customerLinks = [
  { to: '/', label: 'Home', icon: <Home /> },
  { to: '/ride-booking', label: 'Book Ride', icon: <TwoWheeler /> },
  { to: '/ride-history', label: 'History', icon: <History /> },
  { to: '/profile', label: 'Profile', icon: <Person /> },
  { to: '/help', label: 'Help', icon: <Help /> },
];

const riderLinks = [
  { to: '/rider/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/rider/accept-ride', label: 'Accept Ride', icon: <DirectionsBike /> },
  { to: '/rider/ride-history', label: 'Ride History', icon: <History /> },
  { to: '/rider/profile', label: 'Profile', icon: <Person /> },
  { to: '/rider/help', label: 'Help', icon: <Help /> },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/admin/user-management', label: 'Users', icon: <People /> },
  { to: '/admin/ride-management', label: 'Rides', icon: <TwoWheeler /> },
  { to: '/admin/reports', label: 'Reports', icon: <Assessment /> },
  { to: '/admin/ratings-review', label: 'Ratings', icon: <StarRate /> },
  { to: '/admin/help-management', label: 'Help', icon: <SupportAgent /> },
];

export default function Sidebar() {
  const { user, userRole, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  let links = customerLinks;
  let roleTitle = "Customer";
  
  if (userRole === 'rider') {
    links = riderLinks;
    roleTitle = "Captain";
  } else if (userRole === 'admin') {
    links = adminLinks;
    roleTitle = "Administrator";
  }
  
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
            <span className="font-bold text-gray-900">R</span>
          </div>
          <div>
            <h1 className="font-bold text-xl text-gray-900">Rapido</h1>
            <p className="text-xs text-gray-500">{roleTitle} Portal</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  location.pathname === link.to 
                    ? 'bg-yellow-50 text-yellow-600 font-medium' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`${
                  location.pathname === link.to ? 'text-yellow-500' : 'text-gray-400'
                }`}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        {user ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="font-bold text-gray-700">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email || 'user@example.com'}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors duration-200"
            >
              <ExitToApp fontSize="small" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center w-full px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Login
          </Link>
        )}
      </div>
    </aside>
  );
}