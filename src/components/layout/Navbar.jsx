import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  TwoWheeler,
  History,
  Person,
  Help,
} from '@mui/icons-material';

const navLinks = [
  { to: '/', label: 'Home', icon: <Home /> },
  { to: '/ride-booking', label: 'Book Ride', icon: <TwoWheeler /> },
  { to: '/ride-history', label: 'History', icon: <History /> },
  { to: '/profile', label: 'Profile', icon: <Person /> },
  { to: '/help', label: 'Help', icon: <Help /> },
];

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-3 shadow-lg z-50">
      <ul className="flex justify-between w-full max-w-md mx-auto">
        {navLinks.map(link => (
          <li key={link.to} className="flex-1">
            <Link
              to={link.to}
              className={`flex flex-col items-center justify-center px-1 py-1 rounded-lg transition-all duration-200 ${
                location.pathname === link.to 
                  ? 'text-yellow-400 bg-yellow-50' 
                  : 'text-gray-500 hover:text-yellow-400'
              }`}
            >
              <span className={`text-xl mb-1 ${
                location.pathname === link.to ? 'text-yellow-400' : 'text-gray-400'
              }`}>
                {link.icon}
              </span>
              <span className={`text-xs font-medium ${
                location.pathname === link.to ? 'text-yellow-400' : 'text-gray-600'
              }`}>
                {link.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}