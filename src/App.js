// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import FAQPage from "./pages/FAQPage";
// নিশ্চিত করুন যে এই ফাইলগুলি src/components/ ডিরেক্টরিতে বিদ্যমান:
import AuthForm from './components/AuthForm';
import Header from './components/Header';
import QBanksPage from './pages/QBanksPage'; // নতুন QBanksPage

import './App.css';
import AboutUsPage from './pages/AboutUsPage';
// KaTeX CSS এখন public/index.html থেকে লোড করা হবে, তাই এখানে আর ইম্পোর্ট করার প্রয়োজন নেই।
// import 'katex/dist/katex.min.css';

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

  return (
    <Router>
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

             <Route path="/post/:id" element={<BlogDetail />} />
            <Route
              path="/faq"
              element={<FAQPage />} // ল্যান্ডিং পেজ '/home' রুটে দেখা যাবে
            />

            <Route
              path="/about-us"
              element={<AboutUsPage />} // ল্যান্ডিং পেজ '/home' রুটে দেখা যাবে
            />
             <Route path="/contact" element={<ContactPage />} />
            {/* '/exams' এবং '/results' এর জন্য Route যুক্ত করা হয়েছে, যা Header এ লিঙ্ক করা আছে */}
            <Route
              path="/exams"
              element={isAuthenticated ? <HomePage /> : <Navigate to="/" replace />} // HomePage-কে আপাতত পরীক্ষার লিস্ট হিসেবে ধরে নিলাম
            />
             <Route
              path="/results"
              element={isAuthenticated ? <ResultPage /> : <Navigate to="/" replace />} // ResultPage-কে ফলাফলের পেজ হিসেবে ধরে নিলাম
            />
            <Route
              path="/exam/:examId"
              element={isAuthenticated ? <ExamPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/result/:examId/:userId"
              element={isAuthenticated ? <ResultPage /> : <Navigate to="/" replace />}
            />

             <Route path="/qbanks" element={isAuthenticated ?<QBanksPage />: <Navigate to="/" replace />} />

             <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            {/* কোনো ম্যাচ না হলে '/' রুটে রিডাইরেক্ট করবে */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Footer কম্পোনেন্ট */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
