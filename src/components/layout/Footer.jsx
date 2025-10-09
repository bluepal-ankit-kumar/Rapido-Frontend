import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material';

export default function Footer({ sidebarOpen }) {
  return (
    <footer
      className={`bg-gray-900 text-white w-full mt-8 transition-all duration-300`}
      style={{
        transform: sidebarOpen ? 'translateX(256px)' : 'translateX(0)',
        transition: 'transform 0.3s',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div>
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mr-3">
                <span className="font-bold text-gray-900">R</span>
              </div>
              <span className="font-bold text-2xl">Rapido</span>
            </div>
            <p className="text-gray-400 mb-4">Fast, safe, and affordable rides at your fingertips.</p>
            <p className="text-gray-500 text-sm">Experience seamless transportation with our reliable service.</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Help
                </Link>
              </li>
            </ul>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-300 mb-2">Our Services</h4>
              <p className="text-gray-500 text-sm">
                Bike rides, auto rickshaws, and taxi services available 24/7 in your city.
              </p>
            </div>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <LocationOn className="text-yellow-400 mr-3 mt-1" />
                <div>
                  <p className="text-gray-400">123, Main Street</p>
                  <p className="text-gray-500 text-sm">Bangalore, India</p>
                </div>
              </div>
              <div className="flex items-center">
                <Phone className="text-yellow-400 mr-3" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Email className="text-yellow-400 mr-3" />
                <span className="text-gray-400">support@rapido.bike</span>
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-medium text-gray-300 mb-2">Business Hours</h4>
              <p className="text-gray-500 text-sm">
                Monday to Sunday: 24 hours a day
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Rapido. All rights reserved.
          </div>
       
        </div>
      </div>
    </footer>
  );
}