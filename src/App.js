// frontend/src/App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
// নিশ্চিত করুন যে এই ফাইলগুলি src/pages/ ডিরেক্টরিতে বিদ্যমান:
import HomePage from './pages/HomePage';
import ExamPage from './pages/ExamPage';
import ResultPage from './pages/ResultPage';
import Footer from './pages/Footer';
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import BlogList from "./pages/BlogList";
import BlogDetail from "./pages/BlogDetail";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import AdmissionForm from './pages/AdmissionForm';
import FAQPage from "./pages/FAQPage";
// নিশ্চিত করুন যে এই ফাইলগুলি src/components/ ডিরেক্টরিতে বিদ্যমান:
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import QBanksPage from './pages/QBanksPage'; // নতুন QBanksPage
import ReactPixel from 'react-facebook-pixel';
// Google analytics
import ReactGA from "react-ga4";
import './App.css';
import AboutUsPage from './pages/AboutUsPage';
import BatchSchedulePage from './pages/BatchSchedulePage';
import MedicrackCourseViewer from './pages/MedicrackCourseViewer';
import SecurePDFViewer from './pages/SecurePDFViewe';

// KaTeX CSS এখন public/index.html থেকে লোড করা হবে, তাই এখানে আর ইম্পোর্ট করার প্রয়োজন নেই।
// import 'katex/dist/katex.min.css';


// --- Facebook Pixel ID সেট করুন ---
const FACEBOOK_PIXEL_ID = '1221381706690641'; // <-- এখানে আপনার আসল Facebook Pixel ID দিন
// ----------------------------------
const API_BASE_URL = 'https://medicrack-web-exam-496984660515.asia-south1.run.app/api';
// আপনার GA4 Measurement ID দিন
const GA_MEASUREMENT_ID = "G-asdfadsf";
ReactGA.initialize(GA_MEASUREMENT_ID);


function getFbClickId() {
  const match = document.cookie.match(/_fbc=([^;]*)/);
  return match ? match[1] : null;
}

function getFbBrowserId() {
  const match = document.cookie.match(/_fbp=([^;]*)/);
  return match ? match[1] : null;
}

const externalId = localStorage.getItem('client_id');

if (typeof window !== 'undefined' && !window.fbq) {


  const fbc = getFbClickId();
  const fbp = getFbBrowserId();

  const advancedMatching = {
    external_id: externalId,
    fbc,
    fbp,
  };


  if (process.env.NODE_ENV === 'production') {
    ReactPixel.init(FACEBOOK_PIXEL_ID, advancedMatching, { autoConfig: true, debug: false });
  } else {
    ReactPixel.init(FACEBOOK_PIXEL_ID, advancedMatching, { autoConfig: true, debug: true });
    console.log("Facebook Pixel initialized in DEV mode.");
  }
}



// --- সংশোধিত কাস্টম হুক: প্রতিটি রাউট চেঞ্জে PageView ট্র্যাক করার জন্য ---
function useFacebookPixelPageView() {
  const location = useLocation();
  const lastPathname = useRef(''); // শেষ ট্র্যাক করা pathname সংরক্ষণ করতে

  useEffect(() => {
    // শুধুমাত্র যদি pathname পরিবর্তিত হয় এবং fbq লোড হয়ে থাকে তাহলে ট্র্যাক করুন
    if (window.fbq && location.pathname !== lastPathname.current) {
      ReactPixel.pageView();
      lastPathname.current = location.pathname; // নতুন pathname সংরক্ষণ করুন
      console.log(`Facebook Pixel: PageView Tracked for: ${location.pathname}`);
    } else if (!window.fbq) {
      console.warn('Facebook Pixel (fbq) not loaded');
    }
  }, [location.pathname]); // শুধুমাত্র location.pathname এর উপর নির্ভর করুন
}
// ------------------------------------------------------------------


// Get all batches where user has access
export const getMyBatches = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/batch/my-batches`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Batch তালিকা আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("Batch তালিকা আনতে এরর:", error);
    throw error;
  }
};

// Today's schedule with automatic batch_id
export const getTodaySchedule = async (batchId, date = null) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const body = { batch_id: batchId };
    if (date) body.date = date;

    const response = await fetch(`${API_BASE_URL}/batch/today-schedule`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(body)
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'আজকের schedule আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("আজকের schedule আনতে এরর:", error);
    throw error;
  }
};

// Schedule history
export const getScheduleHistory = async (batchId, limit = 50) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/batch/schedule-history`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ batch_id: batchId, limit })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Schedule history আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("Schedule history আনতে এরর:", error);
    throw error;
  }
};

// Upcoming schedules
export const getUpcomingSchedules = async (batchId) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('কোনো অথেন্টিকেশন টোকেন পাওয়া যায়নি।');
  }
  try {
    const response = await fetch(`${API_BASE_URL}/batch/upcoming-schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ batch_id: batchId })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Upcoming schedules আনতে ব্যর্থ হয়েছে');
    }
    return data;
  } catch (error) {
    console.error("Upcoming schedules আনতে এরর:", error);
    throw error;
  }
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // স্থানীয় স্টোরেজ থেকে টোকেন চেক করে ব্যবহারকারী লগইন করা আছে কিনা তা যাচাই করা হচ্ছে।
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // সফল লগইন হ্যান্ডেল করার ফাংশন।
  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  // লগআউট হ্যান্ডেল করার ফাংশন।
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  useFacebookPixelPageView();

  return (
    // <Router>
    <div className="app-container">
      {/* Header কম্পোনেন্ট ব্যবহার করা হয়েছে */}
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />

      <main className="app-main">
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <HomePage /> : <AuthForm onLoginSuccess={handleLoginSuccess} />}
          />
          <Route
            path="/home"
            element={<LandingPage />} // ল্যান্ডিং পেজ '/home' রুটে দেখা যাবে
          />
          <Route
            path="/blog"
            element={<BlogList />} // ল্যান্ডিং পেজ '/home' রুটে দেখা যাবে
          />

          <Route path="/post/:id/:titleSlug" element={<BlogDetail />} />

          <Route
            path="/faq"
            element={<FAQPage />}
          />

          <Route
            path="/about-us"
            element={<AboutUsPage />}
          />
          <Route path="/contact" element={<ContactPage />} />
          {/* '/exams' এবং '/results' এর জন্য Route যুক্ত করা হয়েছে, যা Header এ লিঙ্ক করা আছে */}
          <Route
            path="/exams"
            element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/results"
            element={isAuthenticated ? <ResultPage /> : <Navigate to="/" replace />}
          />
          <Route
            path="/exam/:examId"
            element={isAuthenticated ? <ExamPage /> : <Navigate to="/" replace />}
          />
          <Route 
            path="/batches" 
            element={isAuthenticated ? <BatchSchedulePage /> : <Navigate to="/" replace />} 
          />
          <Route
            path="/result/:examId/:userId"
            element={isAuthenticated ? <ResultPage /> : <Navigate to="/" replace />}
          />

          <Route 
            path="/freecourse/medicrack/:userId" 
            element={isAuthenticated ? <MedicrackCourseViewer /> : <Navigate to="/" replace />} 
          />

          <Route path="/qbanks" element={isAuthenticated ? <QBanksPage /> : <Navigate to="/" replace />} />

          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          <Route path="/medicrack/admission-form" element={<AdmissionForm />} />

          <Route path="/pdf-viewer" element={<SecurePDFViewer />} />

          {/* কোনো ম্যাচ না হলে '/' রুটে রিডাইরেক্ট করবে */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer কম্পোনেন্ট */}
      <Footer />
    </div>
    // </Router>
  );
}

export default App;