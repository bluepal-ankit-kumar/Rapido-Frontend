import React, { useState, useRef } from 'react'; 
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

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-50 to-gray-100 shadow-lg backdrop-blur-sm bg-opacity-90">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Sidebar Toggle */}
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 rounded-full hover:bg-gray-200 transition-all duration-300 transform hover:scale-105" 
              onClick={onSidebarToggle} 
              aria-label="Open sidebar"
            >
              <Menu className="text-yellow-500 text-xl" />
            </button>
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110">
                <TwoWheeler className="text-white text-2xl" />
              </div>
              <span className="font-bold text-2xl" style={{ color: darkColor }}>Rapido</span>
            </Link>
          </div>
          
          {/* Right Nav: About, Help (only for customers), User Section */}
          <div className="flex items-center space-x-8">
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-yellow-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
            >
              About
            </Link>
            
            {/* Only show Help link to logged-in customers */}
            {user && userRole === 'CUSTOMER' && (
              <Link 
                to="/help" 
                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-300 relative after:content-[''] after:absolute after:w-0 after:h-0.5 after:bg-yellow-500 after:left-0 after:-bottom-1 after:transition-all after:duration-300 hover:after:w-full"
              >
                Help
              </Link>
            )}
            
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown((open) => !open)}
                  className="flex items-center space-x-2 group focus:outline-none"
                  aria-label="Open profile dropdown"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border-2 border-yellow-400 group-hover:border-yellow-500 transition-all duration-300 shadow-md group-hover:shadow-lg transform group-hover:scale-105">
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
                      {userRole === 'RIDER' ? <RiderProfile /> : <Profile />}
                    </div>
                  </div>
                </CSSTransition>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 flex items-center space-x-2"
              >
                <AccountCircle fontSize="small" />
                <span>Login</span>
              </Link>
            )}
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-gray-700 focus:outline-none p-2 rounded-full hover:bg-gray-200 transition-all duration-300" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <Close fontSize="large" className="text-yellow-500" /> : <Menu fontSize="large" className="text-yellow-500" />}
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-fadeIn">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/about" 
                className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-100"
              >
                About
              </Link>
              
              {/* Only show Help link to logged-in customers in mobile menu */}
              {user && userRole === 'CUSTOMER' && (
                <Link 
                  to="/help" 
                  className="text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-100"
                >
                  Help
                </Link>
              )}
              
              {user && (
                <button
                  onClick={() => { setProfileDropdown((open) => !open); setMobileMenuOpen(false); }}
                  className="text-left text-gray-700 hover:text-yellow-500 font-medium transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-100"
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