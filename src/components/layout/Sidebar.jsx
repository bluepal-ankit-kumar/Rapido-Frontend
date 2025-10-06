import React from 'react';
import { Close } from '@mui/icons-material';
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
  // Profile, Help removed
];

const riderLinks = [
  { to: '/rider/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/rider/accept-ride', label: 'Accept Ride', icon: <DirectionsBike /> },
  { to: '/rider/ride-history', label: 'Ride History', icon: <History /> },
  // Profile, Help removed
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/admin/user-management', label: 'Users', icon: <People /> },
  { to: '/admin/ride-management', label: 'Rides', icon: <TwoWheeler /> },
  { to: '/admin/reports', label: 'Reports', icon: <Assessment /> },
  { to: '/admin/ratings-review', label: 'Ratings', icon: <StarRate /> },
  // Help removed
];

export default function Sidebar({ open, onClose }) {
  const { user, userRole } = useAuth();
  const location = useLocation();
  // Normalize role from either context.userRole or user.role
  const normalizedRole = ((userRole || user?.role || '') + '').toUpperCase();
  let links = customerLinks;
  let roleTitle = "Customer";
  if (normalizedRole === 'RIDER') {
    links = riderLinks;
    roleTitle = "Captain";
  } else if (normalizedRole === 'ADMIN') {
    links = adminLinks;
    roleTitle = "Administrator";
  }
  // Sidebar is hidden by default, slides in on all screens when open
  return (
    <>
      {/* Overlay for all screens */}
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-40" onClick={onClose}></div>
      )}
      <aside
        className={`
          fixed z-50 left-0 h-[calc(100vh-64px)] w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          flex-col
        `}
        style={{ display: open ? 'flex' : 'none', top: 64 }}
      >
        {/* Close Button (top right) */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-yellow-500 focus:outline-none"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <Close />
        </button>
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
                  onClick={onClose}
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
      </aside>
    </>
  );
// ...existing code...
}