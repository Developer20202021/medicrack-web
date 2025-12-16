import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Lock, GraduationCap, LogIn, UserPlus, Smartphone } from 'lucide-react';

function AuthForm({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone}`;

    if (isRegistering) {
      try {
        await registerUser(name, email, formattedPhone, password, college);
        alert('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করা হবে।');
        onLoginSuccess();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await loginUser(email, password);
        onLoginSuccess();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMedickrackAppLogin = () => {
    window.open('https://play.google.com/store/apps/details?id=com.education.medicrack&pli=1', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 pt-24 pb-8">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-3">
              {isRegistering ? (
                <UserPlus className="w-8 h-8 text-white" />
              ) : (
                <LogIn className="w-8 h-8 text-white" />
              )}
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              {isRegistering ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}
            </h2>
            <p className="text-emerald-100 text-sm mt-2">
              {isRegistering ? "মেডিক্র্যাকে স্বাগতম" : "আবার স্বাগতম"}
            </p>
          </div>

          {/* Form Section */}
          <div className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm flex items-start space-x-2">
                  <span className="text-red-500 font-bold">⚠</span>
                  <span>{error}</span>
                </div>
              )}
              
              {isRegistering && (
                <>
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
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="আপনার পুরো নাম লিখুন"
                      />
                    </div>
                  </div>

                  {/* College Field */}
                  <div className="space-y-2">
                    <label htmlFor="college" className="block text-sm font-medium text-gray-300">
                      আপনার কলেজ
                    </label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        id="college"
                        value={college}
                        onChange={(e) => setCollege(e.target.value)}
                        required
                        className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                        placeholder="আপনার কলেজের নাম"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  {isRegistering ? "ইমেইল" : "আপনার ইমেইল"}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="example@email.com"
                  />
                </div>
              </div>
              
              {isRegistering && (
                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                    ফোন নম্বর
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      required
                      className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full bg-slate-700/50 border border-slate-600 text-white rounded-lg pl-11 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-emerald-500/50 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>অপেক্ষা করুন...</span>
                  </span>
                ) : (
                  isRegistering ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"
                )}
              </button>
            </form>

            {/* Toggle Mode */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 text-sm">
                {isRegistering ? "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?" : "কোনো অ্যাকাউন্ট নেই?"}{" "}
                <button 
                  onClick={() => setIsRegistering(prev => !prev)}
                  className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors duration-200"
                >
                  {isRegistering ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
                </button>
              </p>
            </div>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate-800/50 text-gray-400">অথবা</span>
              </div>
            </div>

            {/* App Login Button */}
            <button 
              onClick={handleMedickrackAppLogin}
              className="w-full bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <Smartphone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform duration-200" />
              <span>মেডিক্র্যাক অ্যাপ এ লগ ইন করুন</span>
            </button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-gray-500 text-xs mt-6 px-4">
          লগইন করার মাধ্যমে আপনি আমাদের শর্তাবলী এবং গোপনীয়তা নীতি স্বীকার করছেন
        </p>
      </div>
    </div>
  );
}

export default AuthForm;