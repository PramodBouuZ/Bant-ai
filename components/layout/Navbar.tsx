
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../contexts/SettingsContext';
import { UserRole } from '../../types';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, userRole, logout } = useAuth();
  const { settings } = useSettings();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  let dashboardLink = '/';
  if (userRole === UserRole.ADMIN) {
    dashboardLink = '/admin-dashboard';
  } else if (userRole === UserRole.VENDOR) {
    dashboardLink = '/vendor-dashboard';
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600 flex items-center" aria-label={`${settings.appName} Home`}>
          {settings.logoUrl && <img src={settings.logoUrl} alt="Logo" className="h-10 w-auto mr-2 object-contain" />}
          {settings.showAppName && settings.appName}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="Home">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="About Us">About Us</Link>
          <Link to="/faq" className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="FAQ">FAQ</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="Contact Us">Contact Us</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/post-requirement" className="text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium" aria-label="Post Requirement">Post Requirement</Link>
              <Link to={dashboardLink} className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="Dashboard">Dashboard</Link>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200" aria-label="Login">Login</Link>
              <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors duration-200" aria-label="Sign Up">Sign Up</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMobileMenu}
            className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-2"
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-white border-t border-gray-200`}
        aria-hidden={!isMobileMenuOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link to="/" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="Home">Home</Link>
          <Link to="/about" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="About Us">About Us</Link>
          <Link to="/faq" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="FAQ">FAQ</Link>
          <Link to="/contact" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="Contact Us">Contact Us</Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/post-requirement" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="Post Requirement">Post Requirement</Link>
              <Link to={dashboardLink} onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="Dashboard">Dashboard</Link>
              <button
                onClick={() => { logout(); toggleMobileMenu(); }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600 mt-2"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={toggleMobileMenu} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50" aria-label="Login">Login</Link>
              <Link to="/signup" onClick={toggleMobileMenu} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-blue-600 hover:bg-blue-700 mt-2" aria-label="Sign Up">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
