import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  LinkedIn,
  LocationOn,
  Phone,
  Email,
  PlayArrow,
  Apple
} from '@mui/icons-material';

export default function Footer({ sidebarOpen }) {
  // Sidebar width is 256px (w-64) on desktop
  // Slide footer horizontally when sidebar is open (desktop only)
  return (
    <footer
      className={`bg-gray-900 text-white w-full mt-8 transition-all duration-300`}
      style={{
        transform: sidebarOpen ? 'translateX(256px)' : 'translateX(0)',
        transition: 'transform 0.3s',
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center mr-3">
                <span className="font-bold text-gray-900">R</span>
              </div>
              <span className="font-bold text-2xl">Rapido</span>
            </div>
            <p className="text-gray-400 mb-4">Fast, safe, and affordable rides at your fingertips.</p>
            <div className="flex space-x-4">
              {/* Social links can remain as <a> if they point to external URLs */}
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Facebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Twitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <Instagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-yellow-400 transition-colors">
                <LinkedIn />
              </a>
            </div>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> About Us
                </Link>
              </li>
              <li>
                <a href="https://rapido.bike/careers" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Careers
                </a>
              </li>
              <li>
                <a href="https://rapido.bike/blog" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Blog
                </a>
              </li>
              <li>
                <a href="https://rapido.bike/press" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Press
                </a>
              </li>
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Contact Us
                </Link>
              </li>
              <li>
                <a href="https://rapido.bike/faqs" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> FAQs
                </a>
              </li>
              <li>
                <a href="https://rapido.bike/safety" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Safety
                </a>
              </li>
              <li>
                <a href="https://rapido.bike/support" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="mr-2">›</span> Support Center
                </a>
              </li>
            </ul>
          </div>
          
          {/* Contact & Download */}
          <div>
            <h3 className="font-bold text-lg mb-4 text-yellow-400">Contact & Download</h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-start">
                <LocationOn className="text-yellow-400 mr-2 mt-1" fontSize="small" />
                <span className="text-gray-400">123, Main Street, Bangalore, India</span>
              </div>
              <div className="flex items-center">
                <Phone className="text-yellow-400 mr-2" fontSize="small" />
                <span className="text-gray-400">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Email className="text-yellow-400 mr-2" fontSize="small" />
                <span className="text-gray-400">support@rapido.bike</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Download Our App</h4>
              <div className="flex flex-col space-y-2">
                <a href="https://apple.com/app-store" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-colors">
                  <Apple className="mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Download on the</div>
                    <div className="text-sm font-medium">App Store</div>
                  </div>
                </a>
                <a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center bg-gray-800 hover:bg-gray-700 rounded-lg p-2 transition-colors">
                  <PlayArrow className="mr-2" />
                  <div className="text-left">
                    <div className="text-xs text-gray-400">Get it on</div>
                    <div className="text-sm font-medium">Google Play</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-800">
        <div className="max-w-screen-xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Rapido. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link to="/privacy-policy" className="text-gray-500 hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-500 hover:text-yellow-400 transition-colors">Terms of Service</Link>
            <Link to="/cookie-policy" className="text-gray-500 hover:text-yellow-400 transition-colors">Cookie Policy</Link>
            <Link to="/sitemap" className="text-gray-500 hover:text-yellow-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}