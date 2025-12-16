import React, { useState, useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
import sha256 from 'crypto-js/sha256';

// Functions to get Facebook cookie values
function getFbClickId() {
  const match = document.cookie.match(/_fbc=([^;]*)/);
  return match ? match[1] : null;
}

function getFbBrowserId() {
  const match = document.cookie.match(/_fbp=([^;]*)/);
  return match ? match[1] : null;
}

// Main application component
const AdmissionForm = () => {
  // Form field states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [course, setCourse] = useState('HSC27');

  // UI state
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check for existing UID in local storage on component mount
  useEffect(() => {
    const existingUid = localStorage.getItem('mediquack_uid');
    if (existingUid) {
      setIsSubmitted(true);
      setMessage('আপনি ইতিমধ্যে এই ফর্মটি সাবমিট করেছেন।');
    }
  }, []);

  // Handle real-time phone number change and validation
  const handlePhoneChange = (e) => {
    const inputPhone = e.target.value;
    setPhone(inputPhone);

    // Regular expression for +88 and 11-digit numbers
    const phoneRegex = /^(?:\+88)?01\d{9}$/;

    if (inputPhone.length === 0) {
      setPhoneError('');
    } else if (!phoneRegex.test(inputPhone)) {
      setPhoneError('সঠিক ১১ ডিজিটের ফোন নম্বর দিন (যেমন: +88017xxxxxxxx অথবা 017xxxxxxxx)।');
    } else {
      setPhoneError('');
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Check for phone number validation error before submitting
    if (phoneError) {
      setIsLoading(false);
      return; 
    }

    // API endpoint for the Flask server. Adjust if your server URL is different.
    const apiUrl = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api/submit_form';
    
    // Get Facebook cookie values
    const fbc = getFbClickId();
    const fbp = getFbBrowserId();

    const formData = { 
      name, 
      phone, 
      course,
      fbc,
      fbp,
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Save the UID to local storage on successful submission
        localStorage.setItem('mediquack_uid', result.uid);
        
          const userData = {
              ph: sha256(phone.replace(/\D/g, '')).toString(),
              fn: sha256(name.trim().toLowerCase()).toString(),
              country: sha256("bd").toString(),
              external_id: result.uid,
              fbc:fbc,
              fbp:fbp,
            };
        
        ReactPixel.track('Lead', {
            value: 0.0,
            currency: 'BDT',
            content_name: course,
            status: 'submitted',
            event_id: result.uid,
          }, userData );

        setIsSubmitted(true);
        setMessage('ফর্ম সাবমিশন সফল হয়েছে!');
        console.log('Submission successful:', result);
      } else {
        // Handle server errors or duplicate submissions
        setError(result.error || 'ফর্ম সাবমিট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-2xl dark:shadow-emerald-500/10 border border-gray-200 dark:border-slate-800 w-full max-w-lg space-y-6 transform transition-all duration-300 hover:scale-[1.01]">
        
        {/* Warning Message */}
        {!isSubmitted && (
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border-l-4 border-yellow-500 dark:border-yellow-400 p-4 rounded-r-lg shadow-sm" role="alert">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-yellow-800 dark:text-yellow-200 font-medium leading-relaxed">
                তুমি যদি <span className="font-bold">ফ্রি প্রশ্নব্যাংক</span> পেতে চাও, তবে নিচের ফর্মটি পূরণ করো।
              </p>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl shadow-lg mb-4 transform hover:rotate-6 transition-transform duration-300">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400">
            মেডিক্র্যাক বায়োলজি একাডেমি
          </h1>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-5 rounded-xl shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-blue-900 dark:text-blue-200">মাহাদী হাসান</h2>
            </div>
            <div className="space-y-1 text-sm text-blue-800 dark:text-blue-300">
              <p className="font-semibold">MBBS (অধ্যয়নরত) দিনাজপুর মেডিকেল কলেজ</p>
              <p>বুয়েট এবং ঢাবিতে চান্স প্রাপ্ত</p>
              <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <span className="font-semibold">01961766621</span>
              </div>
              <p className="text-xs pt-1">5 বছর+ পড়ানোর অভিজ্ঞতা</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <svg className="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <p className="text-sm font-medium">
              বৈরাগীর মোড়, জয়পুরহাট
            </p>
          </div>
        </div>

        {/* Conditional rendering based on submission status */}
        {isSubmitted ? (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-8 rounded-2xl text-center flex flex-col items-center justify-center space-y-4">
            {/* Success Icon with Animation */}
            <div className="relative">
              <div className="absolute inset-0 bg-green-400 dark:bg-green-500 rounded-full animate-ping opacity-75"></div>
              <svg
                className="relative w-20 h-20 text-green-600 dark:text-green-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="font-bold text-xl text-green-800 dark:text-green-200">{message}</p>
            <p className="text-sm text-green-700 dark:text-green-300">আপনার তথ্য সফলভাবে সংরক্ষিত হয়েছে</p>
            
            <a 
              href="https://chat.whatsapp.com/CGVLQZfUgk50AzyUaTATUU"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-green-600 dark:border-green-500 rounded-xl shadow-lg text-lg font-bold text-white transition-all duration-300 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 focus:outline-none focus:ring-4 focus:ring-green-300 dark:focus:ring-green-800 transform hover:scale-105 active:scale-95"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp গ্রুপে যোগ দিন
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                আপনার নাম
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all"
                  placeholder="আপনার নাম লিখুন"
                />
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                আপনার ফোন নাম্বার
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className={`block w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm transition-all ${
                    phoneError 
                      ? 'border-red-500 dark:border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-red-50 dark:bg-red-900/20' 
                      : 'border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400'
                  } text-gray-900 dark:text-gray-100`}
                  placeholder="উদাহরণ: 017xxxxxxxx"
                />
              </div>
              {phoneError && (
                <div className="mt-2 flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{phoneError}</span>
                </div>
              )}
            </div>

            {/* Course Selection */}
            <div>
              <label htmlFor="course" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                কোর্স নির্বাচন করুন
              </label>
              <div className="relative">
                <select
                  id="course"
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="block w-full px-4 py-3 pr-10 border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 transition-all appearance-none cursor-pointer"
                >
                  <option value="HSC27">HSC 27</option>
                  <option value="HSC26">HSC 26</option>
                  <option value="Medical Admission">Medical Admission</option>
                  <option value="Medical Re-admission">Medical Re-admission</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-r-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-red-700 dark:text-red-300 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || phoneError}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 border-2 border-transparent rounded-xl shadow-lg text-lg font-bold text-white transition-all duration-300 ${
                isLoading || phoneError
                  ? 'bg-gray-400 dark:bg-gray-700 cursor-not-allowed opacity-60'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 focus:outline-none focus:ring-4 focus:ring-emerald-300 dark:focus:ring-emerald-800 transform hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  সাবমিট করা হচ্ছে...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  ফর্ম সাবমিট করুন
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdmissionForm;