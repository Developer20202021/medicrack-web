// src/pages/ContactPage.js
import React, { useState } from 'react';
import './ContactPage.css'; // স্টাইলিং এর জন্য CSS ফাইল

// কাস্টম পপআপ কম্পোনেন্ট
const SuccessPopup = ({ message, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2 className="popup-title">সফল!</h2>
        <p className="popup-message">{message}</p>
        <button onClick={onClose} className="popup-close-button">বন্ধ করুন</button>
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
  const [status, setStatus] = useState(''); // ফর্ম সাবমিট স্ট্যাটাস (যেমন: 'loading', 'success', 'error')
  const [showPopup, setShowPopup] = useState(false); // পপআপের ভিজিবিলিটি নিয়ন্ত্রণ করতে

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
      // API এন্ডপয়েন্ট: আপনার ফ্লাস্ক অ্যাপের URL এখানে দিন
      // মনে রাখবেন, প্রোডাকশনে এই URL পরিবর্তন করতে হতে পারে
      const response = await fetch('https://flask-api-496984660515.asia-south1.run.appapi/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', subject: '', message: '' }); // ফর্ম রিসেট করুন
        setShowPopup(true); // সফল হলে পপআপ দেখান
      } else {
        const errorData = await response.json();
        setStatus('error');
        alert(`মেসেজ পাঠাতে সমস্যা হয়েছে: ${errorData.error || response.statusText}`); // এরর হলে আপাতত alert থাকুক
      }
    } catch (error) {
      console.error('মেসেজ পাঠানোর সময় এরর:', error);
      setStatus('error');
      alert('নেটওয়ার্ক এরর অথবা সার্ভার উপলব্ধ নেই। অনুগ্রহ করে আবার চেষ্টা করুন।'); // নেটওয়ার্ক এরর হলে alert থাকুক
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // পপআপ বন্ধ করুন
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-page-container">
        <h1 className="contact-title">আমাদের সাথে যোগাযোগ করুন</h1>
        <p className="contact-description">
          আপনার যদি কোনো প্রশ্ন, মন্তব্য বা পরামর্শ থাকে, তাহলে নির্দ্বিধায় আমাদের সাথে যোগাযোগ করুন।
          আমরা আপনার মেসেজের উত্তর দিতে প্রস্তুত।
        </p>

        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">আপনার নাম:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="আপনার পুরো নাম লিখুন"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">আপনার ইমেইল:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="আপনার ইমেইল ঠিকানা দিন"
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject">বিষয়:</label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              placeholder="আপনার মেসেজের বিষয়"
            />
          </div>

          <div className="form-group">
            <label htmlFor="message">আপনার মেসেজ:</label>
            <textarea
              id="message"
              name="message"
              rows="6"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="এখানে আপনার মেসেজ লিখুন..."
            ></textarea>
          </div>

          <button type="submit" className="submit-button" disabled={status === 'loading'}>
            {status === 'loading' ? 'পাঠানো হচ্ছে...' : 'মেসেজ পাঠান'}
          </button>

          {/* এই অংশটি বাদ দেওয়া হয়েছে কারণ পপআপ ব্যবহার করা হচ্ছে */}
          {/* {status === 'success' && <p className="status-message success">মেসেজ সফলভাবে পাঠানো হয়েছে!</p>} */}
          {status === 'error' && <p className="status-message error">মেসেজ পাঠাতে সমস্যা হয়েছে।</p>}
        </form>

        <div className="contact-info">
          <h2>অন্যান্য যোগাযোগের তথ্য</h2>
          <p>ইমেইল: <a href="mailto:info@medicrack.com">medicrack.official@gmail.com</a></p>
          <p>ফোন: +8801961766621</p>
          <p>ঠিকানা: ঢাকা, বাংলাদেশ</p>
        </div>
      </div>

      {/* সফলতার পপআপ */}
      {showPopup && (
        <SuccessPopup
          message="আপনার মেসেজ সফলভাবে পাঠানো হয়েছে! আমরা শীঘ্রই আপনার সাথে যোগাযোগ করব।"
          onClose={handleClosePopup}
        />
      )}
    </div>
  );
}

export default ContactPage;