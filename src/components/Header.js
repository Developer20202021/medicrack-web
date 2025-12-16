import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, GraduationCap } from 'lucide-react';

/**
 * Medicrack এর হেডার কম্পোনেন্ট।
 *
 * @param {object} props - কম্পোনেন্টের প্রপস।
 * @param {boolean} props.isAuthenticated - ব্যবহারকারী লগইন করা আছে কিনা তা নির্দেশ করে।
 * @param {function} props.onLogout - লগআউট করার ফাংশন।
 * @returns {JSX.Element} হেডার কম্পোনেন্ট।
 */
const Header = ({ isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link check করার function
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Link এর className generate করার function
  const getLinkClassName = (path) => {
    const baseClass = "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200";
    if (isActive(path)) {
      return `${baseClass} bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg`;
    }
    return `${baseClass} text-gray-300 hover:text-white hover:bg-slate-700/50`;
  };

  // Mobile link এর className
  const getMobileLinkClassName = (path) => {
    const baseClass = "block px-4 py-3 rounded-lg transition-all duration-200";
    if (isActive(path)) {
      return `${baseClass} bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium shadow-lg`;
    }
    return `${baseClass} text-gray-300 hover:text-white hover:bg-slate-700/50`;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md bg-opacity-95 text-white shadow-2xl border-b border-slate-700/50 font-['Inter']">
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo Section */}
        <Link to="/home" className="flex items-center space-x-3 group flex-shrink-0">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            মেডিক্র্যাক
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <Link to="/home" className={getLinkClassName('/home')}>
            Home
          </Link>
          <Link to="/exams" className={getLinkClassName('/exams')}>
            Exam
          </Link>
          <Link to="/batches" className={getLinkClassName('/batches')}>
            Batches
          </Link>
          <Link to="/qbanks" className={getLinkClassName('/qbanks')}>
            QBank
          </Link>
          <Link to="/blog" className={getLinkClassName('/blog')}>
            Blog
          </Link>
          <Link to="/faq" className={getLinkClassName('/faq')}>
            FAQ
          </Link>
          <Link to="/about-us" className={getLinkClassName('/about-us')}>
            About
          </Link>
          <Link to="/contact" className={getLinkClassName('/contact')}>
            Contact
          </Link>
          <Link to="/privacy-policy" className={getLinkClassName('/privacy-policy')}>
            Privacy Policy
          </Link>
          <Link to="/medicrack/admission-form" className={getLinkClassName('/medicrack/admission-form')}>
            Admission
          </Link>
        </nav>

        {/* Right Section - Auth Button & Mobile Toggle */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="hidden md:block bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              লগআউট
            </button>
          ) : (
            <Link 
              to="/" 
              className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              লগইন
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden text-white p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
          <ul className="flex flex-col py-4 px-4 space-y-2">
            <li>
              <Link 
                to="/home" 
                className={getMobileLinkClassName('/home')}
                onClick={toggleMobileMenu}
              >
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/exams" 
                className={getMobileLinkClassName('/exams')}
                onClick={toggleMobileMenu}
              >
                Exam
              </Link>
            </li>
            <li>
              <Link 
                to="/batches" 
                className={getMobileLinkClassName('/batches')}
                onClick={toggleMobileMenu}
              >
                Batches
              </Link>
            </li>
            <li>
              <Link 
                to="/qbanks" 
                className={getMobileLinkClassName('/qbanks')}
                onClick={toggleMobileMenu}
              >
                QBank
              </Link>
            </li>
            <li>
              <Link 
                to="/blog" 
                className={getMobileLinkClassName('/blog')}
                onClick={toggleMobileMenu}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link 
                to="/faq" 
                className={getMobileLinkClassName('/faq')}
                onClick={toggleMobileMenu}
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link 
                to="/about-us" 
                className={getMobileLinkClassName('/about-us')}
                onClick={toggleMobileMenu}
              >
                About
              </Link>
            </li>
            <li>
              <Link 
                to="/contact" 
                className={getMobileLinkClassName('/contact')}
                onClick={toggleMobileMenu}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link 
                to="/privacy-policy" 
                className={getMobileLinkClassName('/privacy-policy')}
                onClick={toggleMobileMenu}
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link 
                to="/medicrack/admission-form" 
                className={getMobileLinkClassName('/medicrack/admission-form')}
                onClick={toggleMobileMenu}
              >
                Admission
              </Link>
            </li>
            
            {/* Mobile Auth Button */}
            {isAuthenticated ? (
              <li className="pt-2">
                <button
                  onClick={() => {
                    onLogout();
                    toggleMobileMenu();
                  }}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300"
                >
                  লগআউট
                </button>
              </li>
            ) : (
              <li className="pt-2">
                <Link 
                  to="/" 
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 text-center"
                  onClick={toggleMobileMenu}
                >
                  লগইন
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;