import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = ({ isAuthenticated, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userId, setUserId] = useState('');

  // localStorage থেকে userId লোড করুন
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, [isAuthenticated]); // isAuthenticated পরিবর্তন হলে আবার চেক করবে

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#17202a] text-white p-4 md:px-8 shadow-md font-['Inter']">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-white text-2xl md:text-3xl font-bold flex-shrink-0">
          <h1 className="text-white">মেডিক্র্যাক</h1>
        </Link>

        {/* ডেস্কটপ নেভিগেশন */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-white hover:text-emerald-400 transition duration-300">Home</Link>
          <Link to="/exams" className="text-white hover:text-emerald-400 transition duration-300">Exam</Link>
          <Link to="/faq" className="text-white hover:text-emerald-400 transition duration-300">FAQ</Link>
          <Link to="/about-us" className="text-white hover:text-emerald-400 transition duration-300">About</Link>
          <Link to="/contact" className="text-white hover:text-emerald-400 transition duration-300">Contact</Link>
          <Link to="/qbanks" className="text-white hover:text-emerald-400 transition duration-300">QBank</Link>
          
          {/* নতুন Free Course লিংক - শুধুমাত্র লগইন থাকলে এবং userId থাকলে দেখাবে */}
          {isAuthenticated && userId && (
            <Link 
              to={`/freecourse/medicrack/${userId}`} 
              className="text-white hover:text-emerald-400 transition duration-300"
            >
              Free Course
            </Link>
          )}
          
          <Link to="/privacy-policy" className="text-white hover:text-emerald-400 transition duration-300">Privacy Policy</Link>
          <Link to="/blog" className="text-white hover:text-emerald-400 transition duration-300">Blog</Link>
          <Link to="/medicrack/admission-form" className="text-white hover:text-emerald-400 transition duration-300">Admission</Link>
        </nav>

        {/* অথেন্টিকেশন বাটন এবং মোবাইল মেনু বাটন */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out text-sm md:text-base flex-shrink-0 mr-4 md:mr-0"
            >
              লগআউট
            </button>
          ) : (
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out text-sm md:text-base flex-shrink-0 mr-4 md:mr-0">
              লগইন
            </Link>
          )}

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#17202a] pb-4 pt-2 border-t border-gray-700">
          <ul className="flex flex-col items-center space-y-3">
            <li><Link to="/home" className="block text-white hover:text-emerald-400 transition duration-300 py-2" onClick={toggleMobileMenu}>Home</Link></li>
            <li><Link to="/exams" className="block text-white hover:text-emerald-400 transition duration-300 py-2" onClick={toggleMobileMenu}>Exam</Link></li>
            <li><Link to="/faq" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>FAQ</Link></li>
            <li><Link to="/about-us" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>About</Link></li>
            <li><Link to="/contact" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Contact</Link></li>
            <li><Link to="/qbanks" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>QBank</Link></li>
            
            {/* মোবাইলে নতুন Free Course লিংক */}
            {isAuthenticated && userId && (
              <li>
                <Link 
                  to={`/freecourse/medicrack/${userId}`} 
                  className="text-white hover:text-emerald-400 transition duration-300" 
                  onClick={toggleMobileMenu}
                >
                  Free Course
                </Link>
              </li>
            )}
            
            <li><Link to="/privacy-policy" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Privacy Policy</Link></li>
            <li><Link to="/blog" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Blog</Link></li>
            <li><Link to="/medicrack/admission-form" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Admission</Link></li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;