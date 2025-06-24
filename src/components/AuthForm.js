// frontend/src/components/AuthForm.js
import React, { useState } from 'react';
import { loginUser, registerUser } from '../api'; // registerUser ইম্পোর্ট করুন
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';

function AuthForm({ onLoginSuccess }) {
  const [isRegistering, setIsRegistering] = useState(false); // রেজিস্ট্রেশন মোড
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // ফোন নম্বরের শুরুতে +88 যোগ করুন
    // যদি ফোন নম্বর থাকে এবং এটি +88 দিয়ে শুরু না হয়
    const formattedPhone = phone.startsWith('+88') ? phone : `+88${phone}`;

    if (isRegistering) {
      try {
        // রেজিস্টার ফাংশনে ফরম্যাট করা ফোন নম্বর পাঠান
        await registerUser(name, email, formattedPhone, password, college);
        alert('রেজিস্ট্রেশন সফল হয়েছে! এখন লগইন করা হবে।');
        onLoginSuccess();
      } catch (err) {
        setError(err.message);
      }
    } else { // লগইন মোড
      try {
        await loginUser(email, password);
        onLoginSuccess();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleMedickrackAppLogin = () => {
    window.open('https://play.google.com/store/apps/details?id=com.education.medicrack&pli=1', '_blank');
  };

  return (
    <div className="auth-form-container">
      <h2>{isRegistering ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}</h2>
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        
        {isRegistering && (
          <>
            <div className="form-group">
              <label htmlFor="name">আপনার নাম:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="college">আপনার কলেজ:</label>
              <input
                type="text"
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email">{isRegistering ? "ইমেইল:" : "আপনার ইমেইল:"}</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {isRegistering && (
            <div className="form-group">
              <label htmlFor="phone">ফোন নম্বর:</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="উদাহরণ: 01XXXXXXXXX"
                required
              />
            </div>
        )}

        <div className="form-group">
          <label htmlFor="password">পাসওয়ার্ড:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          {isRegistering ? "রেজিস্ট্রেশন করুন" : "লগইন করুন"}
        </button>
      </form>

      <p className="toggle-mode">
        {isRegistering ? "ইতিমধ্যে একটি অ্যাকাউন্ট আছে?" : "কোনো অ্যাকাউন্ট নেই?"}{" "}
        <span onClick={() => setIsRegistering(prev => !prev)}>
          {isRegistering ? "লগইন করুন" : "রেজিস্ট্রেশন করুন"}
        </span>
      </p>

      <p className="or-divider">অথবা</p>
      <button onClick={handleMedickrackAppLogin} className="app-login-button">
        মেডিক্র্যাক অ্যাপ এ লগ ইন করুন
      </button>
    </div>
  );
}

export default AuthForm;