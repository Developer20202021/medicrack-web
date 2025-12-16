import React, { useState } from 'react';
import { Mail, Phone, MapPin, User, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

// কাস্টম পপআপ কম্পোনেন্ট
const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 md:p-10 rounded-2xl shadow-2xl border border-emerald-500/30 max-w-md w-full transform animate-scaleIn">
        <div className="flex justify-center mb-6">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-4 rounded-full">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-emerald-400 mb-4 text-center">সফল!</h2>
        <p className="text-gray-300 text-center text-lg mb-8 leading-relaxed">{message}</p>
        <button 
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-105"
        >
          বন্ধ করুন
        </button>
      </div>
    </div>
  );
};

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('https://medicrack-web-exam-496984660515.asia-south1.run.app/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setShowPopup(true);
      } else {
        const errorData = await response.json();
        setStatus('error');
        alert(`মেসেজ পাঠাতে সমস্যা হয়েছে: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error('মেসেজ পাঠানোর সময় এরর:', error);
      setStatus('error');
      alert('নেটওয়ার্ক এরর অথবা সার্ভার উপলব্ধ নেই। অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-5xl w-full">
        {/* Main Container */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-700/50 overflow-hidden">
          
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              আমাদের সাথে যোগাযোগ করুন
            </h1>
            <p className="text-emerald-100 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              আপনার যদি কোনো প্রশ্ন, মন্তব্য বা পরামর্শ থাকে, তাহলে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
              আমরা আপনার মেসেজের উত্তর দিতে প্রস্তুত।
            </p>
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              
              {/* Contact Form */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Send className="w-6 h-6 text-emerald-400 mr-3" />
                  মেসেজ পাঠান
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      আপনার নাম
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="আপনার পুরো নাম লিখুন"
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      আপনার ইমেইল
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="আপনার ইমেইল ঠিকানা দিন"
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div className="space-y-2">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300">
                      বিষয়
                    </label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        placeholder="আপনার মেসেজের বিষয়"
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                      />
                    </div>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-2">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300">
                      আপনার মেসেজ
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="এখানে আপনার মেসেজ লিখুন..."
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 resize-vertical"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    disabled={status === 'loading'}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {status === 'loading' ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>মেসেজ পাঠান</span>
                      </>
                    )}
                  </button>

                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                      <span>মেসেজ পাঠাতে সমস্যা হয়েছে।</span>
                    </div>
                  )}
                </form>
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <Phone className="w-6 h-6 text-emerald-400 mr-3" />
                  অন্যান্য যোগাযোগের তথ্য
                </h2>
                
                <div className="space-y-6">
                  {/* Email Card */}
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                        <Mail className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">ইমেইল</h3>
                        <a 
                          href="mailto:medicrack.official@gmail.com"
                          className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 break-all"
                        >
                          medicrack.official@gmail.com
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Phone Card */}
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                        <Phone className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">ফোন</h3>
                        <a 
                          href="tel:+8801961766621"
                          className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                        >
                          +880 1961 766621
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Address Card */}
                  <div className="bg-slate-700/30 border border-slate-600/50 rounded-xl p-6 hover:border-emerald-500/50 transition-all duration-300 group">
                    <div className="flex items-start space-x-4">
                      <div className="bg-gradient-to-br from-emerald-500 to-teal-500 p-3 rounded-lg group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                        <MapPin className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">ঠিকানা</h3>
                        <p className="text-gray-300">আফতাবনগর, ঢাকা, বাংলাদেশ</p>
                      </div>
                    </div>
                  </div>

                  {/* Info Box */}
                  <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-6 mt-8">
                    <p className="text-gray-300 text-sm leading-relaxed">
                      আমরা সাধারণত <span className="text-emerald-400 font-semibold">২৪ ঘন্টার মধ্যে</span> আপনার মেসেজের উত্তর দিয়ে থাকি। 
                      জরুরি বিষয়ের জন্য সরাসরি ফোন করুন।
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <SuccessPopup
          message="আপনার মেসেজ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
          onClose={handleClosePopup}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.7); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
}

export default ContactPage;