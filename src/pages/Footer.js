import React from 'react';
import { Facebook, Instagram, Youtube, Mail, Phone } from 'lucide-react'; // Icons for social media and contact

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10 font-['Inter']">
      <div className="container mx-auto px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* About Medicrack */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-4">মেডিক্র্যাক</h3>
          <p className="text-gray-400 text-sm">
            বাংলাদেশের সকল ছাত্রছাত্রীর জন্য সাশ্রয়ী মূল্যে মানসম্মত মেডিকেল ভর্তি প্রস্তুতি প্রদান।
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 md:mb-0">
          <h3 className="text-xl font-semibold mb-4">গুরুত্বপূর্ণ লিঙ্ক</h3>
          <ul className="text-gray-400 space-y-2">
            {/* এখানে সঠিক URL দিন অথবা যদি লিঙ্ক না হয়, তবে <button> ব্যবহার করুন */}
            <li><a href="/home" className="hover:text-emerald-500 transition duration-300">হোম</a></li>
            <li><a href="/about-us" className="hover:text-emerald-500 transition duration-300">আমাদের সম্পর্কে</a></li>
            <li><a href="/exams" className="hover:text-emerald-500 transition duration-300">এক্সামসমূহ</a></li>
            <li><a href="/contact" className="hover:text-emerald-500 transition duration-300">যোগাযোগ</a></li>
          </ul>
        </div>

        {/* Contact & Social Media */}
        <div>
          <h3 className="text-xl font-semibold mb-4">যোগাযোগ করুন</h3>
          <div className="flex items-center text-gray-400 mb-2">
            <Mail size={18} className="mr-2 text-emerald-400" />
            <span>medicrack.official@gmail.com</span> {/* Placeholder Email */}
          </div>
          <div className="flex items-center text-gray-400 mb-4">
            <Phone size={18} className="mr-2 text-emerald-400" />
            <span>+8801961766621</span> {/* Placeholder Phone Number */}
          </div>

          <h3 className="text-xl font-semibold mb-4 mt-6">আমাদের সাথে যুক্ত থাকুন</h3>
          <div className="flex space-x-4">
            <a href="https://www.facebook.com/profile.php?id=61569906780171" target='_blank' rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition duration-300" aria-label="Facebook">
              <Facebook size={24} />
            </a>
            {/* এখানেও সঠিক Instagram এবং YouTube URL দিন, অথবা যদি লিঙ্ক না হয়, তবে <button> ব্যবহার করুন */}
            <a href="https://www.facebook.com/profile.php?id=61569906780171" target='_blank' rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition duration-300" aria-label="Instagram">
              <Instagram size={24} />
            </a>
            <a href="https://www.youtube.com/@MediCrackOnline" target='_blank' rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-500 transition duration-300" aria-label="YouTube">
              <Youtube size={24} />
            </a>
            {/* Add more social media icons as needed */}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} মেডিক্র্যাক। সর্বস্বত্ব সংরক্ষিত।
      </div>
    </footer>
  );
};

export default Footer;