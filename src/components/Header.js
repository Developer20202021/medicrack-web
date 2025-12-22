import React, { useState, useEffect } from 'react';
import { Menu, X, GraduationCap } from 'lucide-react';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // localStorage থেকে userId লোড করুন
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [isAuthenticated]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY) {
        // উপরে scroll করছে
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // নিচে scroll করছে এবং 100px এর বেশি scroll হয়েছে
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link check করার function
  const isActive = (path) => {
    return window.location.pathname === path;
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
    <header 
      className={`fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 backdrop-blur-md bg-opacity-95 text-white shadow-2xl border-b border-slate-700/50 font-['Inter'] transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto flex justify-between items-center px-4 md:px-8 py-4">
        {/* Logo Section */}
        <a href="/home" className="flex items-center space-x-3 group flex-shrink-0">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            মেডিক্র্যাক
          </h1>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          <a href="/home" className={getLinkClassName('/home')}>
            Home
          </a>
          <a href="/exams" className={getLinkClassName('/exams')}>
            Exam
          </a>
          <a href="/batches" className={getLinkClassName('/batches')}>
            Batches
          </a>
          <a href="/qbanks" className={getLinkClassName('/qbanks')}>
            QBank
          </a>
          {/* Free Course Link - শুধুমাত্র লগইন থাকলে এবং userId থাকলে */}
          {isAuthenticated && userId && (
            <a 
              href={`/freecourse/medicrack/${userId}`} 
              className={getLinkClassName(`/freecourse/medicrack/${userId}`)}
            >
              Free Course
            </a>
          )}
          <a href="/blog" className={getLinkClassName('/blog')}>
            Blog
          </a>
          <a href="/faq" className={getLinkClassName('/faq')}>
            FAQ
          </a>
          <a href="/about-us" className={getLinkClassName('/about-us')}>
            About
          </a>
          <a href="/contact" className={getLinkClassName('/contact')}>
            Contact
          </a>
          <a href="/privacy-policy" className={getLinkClassName('/privacy-policy')}>
            Privacy Policy
          </a>
          <a href="/medicrack/admission-form" className={getLinkClassName('/medicrack/admission-form')}>
            Admission
          </a>
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
            <a 
              href="/" 
              className="hidden md:block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 transform hover:scale-105 text-sm"
            >
              লগইন
            </a>
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
              <a 
                href="/home" 
                className={getMobileLinkClassName('/home')}
                onClick={toggleMobileMenu}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="/exams" 
                className={getMobileLinkClassName('/exams')}
                onClick={toggleMobileMenu}
              >
                Exam
              </a>
            </li>
            <li>
              <a 
                href="/batches" 
                className={getMobileLinkClassName('/batches')}
                onClick={toggleMobileMenu}
              >
                Batches
              </a>
            </li>
            <li>
              <a 
                href="/qbanks" 
                className={getMobileLinkClassName('/qbanks')}
                onClick={toggleMobileMenu}
              >
                QBank
              </a>
            </li>
            {/* Mobile Free Course Link */}
            {isAuthenticated && userId && (
              <li>
                <a 
                  href={`/freecourse/medicrack/${userId}`} 
                  className={getMobileLinkClassName(`/freecourse/medicrack/${userId}`)}
                  onClick={toggleMobileMenu}
                >
                  Free Course
                </a>
              </li>
            )}
            <li>
              <a 
                href="/blog" 
                className={getMobileLinkClassName('/blog')}
                onClick={toggleMobileMenu}
              >
                Blog
              </a>
            </li>
            <li>
              <a 
                href="/faq" 
                className={getMobileLinkClassName('/faq')}
                onClick={toggleMobileMenu}
              >
                FAQ
              </a>
            </li>
            <li>
              <a 
                href="/about-us" 
                className={getMobileLinkClassName('/about-us')}
                onClick={toggleMobileMenu}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="/contact" 
                className={getMobileLinkClassName('/contact')}
                onClick={toggleMobileMenu}
              >
                Contact
              </a>
            </li>
            <li>
              <a 
                href="/privacy-policy" 
                className={getMobileLinkClassName('/privacy-policy')}
                onClick={toggleMobileMenu}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="/medicrack/admission-form" 
                className={getMobileLinkClassName('/medicrack/admission-form')}
                onClick={toggleMobileMenu}
              >
                Admission
              </a>
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
                <a 
                  href="/" 
                  className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 text-center"
                  onClick={toggleMobileMenu}
                >
                  লগইন
                </a>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;