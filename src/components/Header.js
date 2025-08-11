import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // React Router DOM থেকে Link ইম্পোর্ট করা হয়েছে
import { Menu, X } from 'lucide-react'; // মোবাইল মেনুর জন্য আইকন

/**
 * Medicrack এর হেডার কম্পোনেন্ট।
 *
 * @param {object} props - কম্পোনেন্টের প্রপস।
 * @param {boolean} props.isAuthenticated - ব্যবহারকারী লগইন করা আছে কিনা তা নির্দেশ করে।
 * @param {function} props.onLogout - লগআউট করার ফাংশন।
 * @returns {JSX.Element} হেডার কম্পোনেন্ট।
 */
const Header = ({ isAuthenticated, onLogout }) => {
  // মোবাইল মেনু খোলা আছে কিনা তা ট্র্যাক করার জন্য স্টেট।
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // মোবাইল মেনু টগল করার ফাংশন।
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#17202a] text-white p-4 md:px-8 shadow-md font-['Inter']">
      <div className=" container mx-auto flex justify-between items-center">
        {/* লোগো বা টাইটেল - ক্লিক করলে হোম পেজে যাবে */}
        {/* 'whitespace-nowrap overflow-hidden text-ellipsis' ক্লাসগুলো সরানো হয়েছে যাতে টাইটেলটি পুরো দেখা যায় */}
        <Link to="/home" className="text-white text-2xl md:text-3xl font-bold flex-shrink-0">
          <h1 className="text-white">মেডিক্র্যাক</h1>
        </Link>

        {/* ডেস্কটপ নেভিগেশন - বড় স্ক্রিনের জন্য */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/home" className="text-white hover:text-emerald-400 transition duration-300">Home</Link>
          <Link to="/exams" className="text-white hover:text-emerald-400 transition duration-300">Exam</Link>
         <Link to="/faq" className="text-white hover:text-emerald-400 transition duration-300">FAQ</Link>
          <Link to="/about-us" className="text-white hover:text-emerald-400 transition duration-300">About</Link>
          <Link to="/contact" className="text-white hover:text-emerald-400 transition duration-300">Contact</Link>
          <Link to="/qbanks" className="text-white hover:text-emerald-400 transition duration-300">QBank</Link>
          <Link to="/privacy-policy" className="text-white hover:text-emerald-400 transition duration-300">Privacy Policy</Link>
          <Link to="/blog" className="text-white hover:text-emerald-400 transition duration-300">Blog</Link>
          <Link to="/medicrack/admission-form" className="text-white hover:text-emerald-400 transition duration-300">Admission</Link>
          {/* আপনার যদি অন্য কোন পেজ থাকে, এখানে Link যুক্ত করতে পারেন */}
        </nav>

        {/* অথেন্টিকেশন বাটন (লগআউট যদি লগইন করা থাকে) এবং মোবাইল মেনু বাটন */}
        <div className="flex items-center">
          {isAuthenticated ? (
            <button
              onClick={onLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out text-sm md:text-base flex-shrink-0 mr-4 md:mr-0"
            >
              লগআউট
            </button>
          ) : (
            // যদি লগইন করা না থাকে, তাহলে লগইন বাটন দেখান।
            // আপনার App.js অনুযায়ী, '/' রুটেই AuthForm দেখানো হয়, তাই এখানে আলাদা লগইন বাটন নাও লাগতে পারে।
            // তবুও একটি উদাহরণ হিসেবে রাখলাম।
            <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-300 ease-in-out text-sm md:text-base flex-shrink-0 mr-4 md:mr-0">
              লগইন
            </Link>
          )}

          {/* মোবাইল মেনু টগল বাটন - শুধুমাত্র ছোট স্ক্রিনে দেখা যাবে */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* মোবাইল মেনু কন্টেন্ট - মোবাইল মেনু খোলা থাকলে দেখা যাবে */}
      {isMobileMenuOpen && (
        <nav className="md:hidden bg-[#17202a] pb-4 pt-2 border-t border-gray-700">
          <ul className="flex flex-col items-center space-y-3">
            <li><Link to="/home" className="block text-white hover:text-emerald-400 transition duration-300 py-2" onClick={toggleMobileMenu}>Home</Link></li>
            <li><Link to="/exams" className="block text-white hover:text-emerald-400 transition duration-300 py-2" onClick={toggleMobileMenu}>Exam</Link></li>
            <li> <Link to="/faq" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>FAQ</Link></li>
            <li> <Link to="/about-us" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>About</Link></li>
            <li> <Link to="/contact" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Contact</Link></li>
            <li> <Link to="/qbanks" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>QBank</Link></li>
            <li> <Link to="/privacy-policy" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Privacy Policy</Link></li>
            <li> <Link to="/blog" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Blog</Link></li>
             <Link to="/medicrack/admission-form" className="text-white hover:text-emerald-400 transition duration-300" onClick={toggleMobileMenu}>Admission</Link>
            {/* আপনার অন্যান্য মোবাইল নেভিগেশন লিঙ্ক এখানে যোগ করুন */}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;
