import React, { useState, useEffect } from 'react';

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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // API endpoint for the Flask server. Adjust if your server URL is different.
    const apiUrl = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api/submit_form';
    
    // Get Facebook cookie values
    const fbc = getFbClickId();
    const fbp = getFbBrowserId();

    const formData = { 
      name, 
      phone, 
      course,
      fbc, // Include fbc in the form data
      fbp, // Include fbp in the form data
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
        setIsSubmitted(true);
        setMessage('ফর্ম সাবমিশন সফল হয়েছে!');
        console.log('Submission successful:', result);
      } else {
        // Handle server errors or duplicate submissions
        setError(result.error || 'ফর্ম সাবমিট করতে সমস্যা হয়েছে।');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg space-y-6 transform transition-all duration-300 hover:scale-[1.01]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">মেডিক্র্যাক বায়োলজি একাডেমি</h1>
          
          <div className="bg-blue-50 text-blue-900 p-4 rounded-lg mt-4 font-serif shadow-inner">
            <h2 className="text-lg md:text-xl font-bold mb-1">মাহাদী হাসান</h2>
            <p className="text-sm md:text-base leading-snug">
              MBBS(অধ্যয়নরত) দিনাজপুর মেডিকেল কলেজ<br/>
              বুয়েট এবং ঢাবিতে চান্স প্রাপ্ত, ফোনঃ 01961766621<br/>
              5 বছর+ পড়ানোর অভিজ্ঞতা।
            </p>
          </div>
          
          <p className="mt-6 text-gray-600 leading-relaxed font-sans">
            প্রিয় শিক্ষার্থী, আমি আছি তোমার জেলায় বৈরাগীর মোড়, জয়পুরহাটে 
          </p>
        </div>

        {/* Conditional rendering based on submission status */}
        {isSubmitted ? (
          <div className="p-6 bg-green-100 text-green-700 rounded-lg border border-green-300 text-center flex flex-col items-center justify-center">
            {/* Success Icon */}
            <svg
              className="w-16 h-16 text-green-500 animate-pulse mb-4"
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
            <p className="font-semibold text-lg">{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                আপনার নাম
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="আপনার নাম লিখুন"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                আপনার ফোন নাম্বার
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="উদাহরণ: 017xxxxxxxx"
              />
            </div>

            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                কোর্স নির্বাচন করুন
              </label>
              <select
                id="course"
                name="course"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="HSC27">HSC 27</option>
                <option value="HSC26">HSC 26</option>
                <option value="Medical Admission">Medical Admission</option>
                <option value="Medical Re-admission">Medical Re-admission</option>
              </select>
            </div>

            {error && (
              <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-300 text-sm">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white transition-all duration-300 ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transform hover:scale-105'
              }`}
            >
              {isLoading ? 'সাবমিট করা হচ্ছে...' : 'ফর্ম সাবমিট করুন'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdmissionForm;
