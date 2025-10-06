import React, { useState, useRef } from 'react'; // useEffect has been removed
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth.js';
import {
  TwoWheeler,
  Menu,
  Close,
  AccountCircle
} from '@mui/icons-material';
import { CSSTransition } from 'react-transition-group';
import '../../styles/profileDropdown.css';

import Profile from "../../pages/Customer/Profile";
import RiderProfile from "../../pages/Rider/RiderProfile";

export default function Header({ onSidebarToggle }) {
  const { user, userRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  const darkColor = '#212121';

  // The useEffect for handleClickOutside has been removed.
  
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-2">
            <button className="mr-2" onClick={onSidebarToggle} aria-label="Open sidebar">
              <Menu className="text-yellow-400" />
            </button>
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center">
                <TwoWheeler className="text-white text-xl" />
              </div>
              <span className="font-bold text-2xl" style={{ color: darkColor }}>Rapido</span>
            </Link>
          </div>
          {/* Right Nav: About, Help, User Section */}
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-gray-700 hover:text-yellow-400 font-medium">About</Link>
            <Link to="/help" className="text-gray-700 hover:text-yellow-400 font-medium">Help</Link>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown((open) => !open)}
                  className="flex items-center space-x-2 group focus:outline-none"
                  aria-label="Open profile dropdown"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gray-200 flex items-center justify-center border-2 border-yellow-400 group-hover:border-yellow-500 transition-colors">
                    <span className="font-bold text-gray-700">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'P'}
                    </span>
                  </div>
                
                </button>
                <CSSTransition
                  in={profileDropdown}
                  timeout={200}
                  classNames="profile-dropdown"
                  unmountOnExit
                  nodeRef={dropdownRef}
                >
                  <div ref={dropdownRef} className="profile-dropdown absolute right-0 mt-2 bg-white rounded-xl shadow-xl z-50 border border-gray-100 animate-fade-in overflow-hidden">
                    <div className="flex flex-col h-full w-full justify-center items-center">
                      {userRole === 'rider' ? <RiderProfile /> : <Profile />}
                    </div>
                  </div>
                </CSSTransition>
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
              <Link to="/about" className="text-gray-700 hover:text-yellow-500 font-medium">About</Link>
              <Link to="/help" className="text-gray-700 hover:text-yellow-500 font-medium">Help</Link>
              {user && (
                <button
                  onClick={() => { setProfileDropdown((open) => !open); setMobileMenuOpen(false); }}
                  className="text-left text-gray-700 hover:text-yellow-500 font-medium"
                >
                  My Profile
                </button>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}