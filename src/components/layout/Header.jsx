import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import {
  Person,
  History,
  Help,
  TwoWheeler,
  Menu,
  Close,
  Search,
  LocationOn,
  AccountCircle
} from '@mui/icons-material';

export default function Header() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Rapido brand colors
  const brandColor = '#FFC107'; // Yellow
  const darkColor = '#212121';  // Dark gray/black
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
              <TwoWheeler className="text-white text-xl" />
            </div>
            <span className="font-bold text-2xl" style={{ color: darkColor }}>Rapido</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/ride-booking" 
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-500 transition-colors duration-200 font-medium"
            >
              <TwoWheeler fontSize="small" />
              <span>Book Ride</span>
            </Link>
            <Link 
              to="/ride-history" 
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-500 transition-colors duration-200 font-medium"
            >
              <History fontSize="small" />
              <span>History</span>
            </Link>
            <Link 
              to="/profile" 
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-500 transition-colors duration-200 font-medium"
            >
              <Person fontSize="small" />
              <span>Profile</span>
            </Link>
            <Link 
              to="/help" 
              className="flex items-center space-x-1 text-gray-700 hover:text-yellow-500 transition-colors duration-200 font-medium"
            >
              <Help fontSize="small" />
              <span>Help</span>
            </Link>
          </nav>
          
          {/* Location and Search */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-gray-600">
              <LocationOn className="text-yellow-500" fontSize="small" />
              <span className="text-sm">Delhi</span>
            </div>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-8 pr-4 py-1 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-yellow-400 text-sm"
              />
              <Search className="absolute left-3 top-2 text-gray-400" fontSize="small" />
            </div>
          </div>
          
          {/* User Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">Hello, {user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">+91 ******{user.phone?.slice(-4) || '1234'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border-2 border-yellow-400">
                  <span className="font-bold text-gray-700">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-yellow-400 hover:bg-yellow-500 text-white px-5 py-2 rounded-full font-medium transition-colors duration-200 shadow-sm flex items-center space-x-1"
              >
                <AccountCircle fontSize="small" />
                <span>Login</span>
              </Link>
            )}
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Close fontSize="large" /> : <Menu fontSize="large" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/ride-booking" 
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <TwoWheeler fontSize="small" />
                <span>Book Ride</span>
              </Link>
              <Link 
                to="/ride-history" 
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <History fontSize="small" />
                <span>History</span>
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Person fontSize="small" />
                <span>Profile</span>
              </Link>
              <Link 
                to="/help" 
                className="flex items-center space-x-2 text-gray-700 hover:text-yellow-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Help fontSize="small" />
                <span>Help</span>
              </Link>
              
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Hello, {user.name || 'User'}</p>
                  <p className="text-xs text-gray-500">+91 ******{user.phone?.slice(-4) || '1234'}</p>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}