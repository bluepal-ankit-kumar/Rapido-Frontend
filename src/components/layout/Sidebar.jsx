import React from 'react';
import { Close, Payment } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
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
  ExitToApp,
} from '@mui/icons-material';

const customerLinks = [
  { to: '/', label: 'Home', icon: <Home /> },
  { to: '/ride-booking', label: 'Book Ride', icon: <TwoWheeler /> },
  // { to: '/ride-history', label: 'History', icon: <History /> },
  { to: '/help', label: 'Help', icon: <Help /> },
];

const riderLinks = [
  { to: '/rider/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/rider/accept-ride',label: 'Accept Ride', icon: <DirectionsBike /> },
  // { to: '/rider/ride-history', label: 'Ride History', icon: <History /> },
  // { to: '/rider/profile', label: 'Profile', icon: <Person /> },
  // { to: '/rider/help', label: 'Help', icon: <Help /> },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: <Dashboard /> },
  { to: '/admin/user-management', label: 'Users', icon: <People /> },
  { to: '/admin/ride-management', label: 'Rides', icon: <TwoWheeler /> },
  { to: '/admin/help-management', label: 'Help Management', icon: <SupportAgent /> },
];

export default function Sidebar({ open, onClose }) {
  const { user, userRole } = useAuth();
  const location = useLocation();
  const normalizedRole = ((userRole || user?.role || '') + '').toUpperCase();
  let links = customerLinks;
  let roleTitle = 'Customer';
  if (normalizedRole === 'RIDER') {
    links = riderLinks;
    roleTitle = 'Captain';
  } else if (normalizedRole === 'ADMIN') {
    links = adminLinks;
    roleTitle = 'Administrator';
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 backdrop-blur-sm transition-opacity duration-300" onClick={onClose}></div>
      )}
      <aside
        className={`
          fixed z-50 left-0 h-[calc(100vh-64px)] w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-100 shadow-xl transform transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          flex-col
        `}
        style={{ display: open ? 'flex' : 'none', top: 64 }}
      >
        {/* <button
          className="absolute top-4 right-4 text-gray-400 hover:text-yellow-500 focus:outline-none p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
          onClick={onClose}
          aria-label="Close sidebar"
        >
          <Close />
        </button> */}
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg">
              <span className="font-bold text-white text-lg">R</span>
            </div>
            <div>
              <h1 className="font-bold text-2xl text-gray-900">Rapido</h1>
              <p className="text-sm text-gray-500 mt-0.5">{roleTitle} Portal</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          <ul className="space-y-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  state={link.to === '/payment' ? { amount: 10.0 } : undefined} // Default amount for standalone payment
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    location.pathname === link.to
                      ? 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 font-medium shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  onClick={onClose}
                >
                  <span
                    className={`${
                      location.pathname === link.to 
                        ? 'text-yellow-500' 
                        : 'text-gray-400 group-hover:text-yellow-500'
                    }`}
                  >
                    {link.icon}
                  </span>
                  <span className="font-medium">{link.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}