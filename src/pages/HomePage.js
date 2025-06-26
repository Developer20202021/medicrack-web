// frontend/src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { getExams, getExamResult, getUniqueSubjects } from '../api'; // api.js থেকে ইম্পোর্ট
import { Link, useNavigate } from 'react-router-dom';
import './HomePage.css'; // আপনার হোমপেজ স্টাইলের জন্য
import { Helmet } from 'react-helmet';

function HomePage() {
  const [exams, setExams] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [infoMessage, setInfoMessage] = useState('');
  const [showIdInputModal, setShowIdInputModal] = useState(false);
  const [tempExamId, setTempExamId] = useState(null);
  const [guestUserId, setGuestUserId] = useState('');
  
  // --- নতুন স্টেট ---
  const [subjects, setSubjects] = useState([]); // ইউনিক সাবজেক্ট নাম স্টোর করার জন্য
  const [selectedSubject, setSelectedSubject] = useState('All Subjects'); // নির্বাচিত সাবজেক্ট, ডিফল্ট 'All Subjects'
  const [currentPage, setCurrentPage] = useState(1); // বর্তমান পেজ
  const [totalPages, setTotalPages] = useState(1); // মোট পেজ সংখ্যা
  const examsPerPage = 10; // প্রতি পেজে কতগুলো পরীক্ষা দেখাবে

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        // প্রথমে অনন্য সাবজেক্টগুলো আনুন
        const fetchedSubjects = await getUniqueSubjects();
        // 'All Subjects' অপশন যোগ করুন এবং সর্ট করে নিন
        setSubjects(['All Subjects', ...fetchedSubjects.sort()]); 
        
        // তারপর নির্বাচিত সাবজেক্ট এবং পেজিনেশন অনুযায়ী পরীক্ষাগুলো আনুন
        const fetchedExamsData = await getExams(
          selectedSubject === 'All Subjects' ? null : selectedSubject, 
          currentPage, 
          examsPerPage
        );
        setExams(fetchedExamsData.exams);
        setTotalPages(fetchedExamsData.totalPages);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [selectedSubject, currentPage]); // নির্বাচিত সাবজেক্ট বা পেজ পরিবর্তন হলে রি-ফেচ করুন

  const handleResultCheck = async (examId) => {
    const userId = localStorage.getItem('userId');

    if (!userId) {
      setTempExamId(examId);
      setGuestUserId('');
      setShowIdInputModal(true);
      return;
    }

    try {
      await getExamResult(examId, userId);
      navigate(`/result/${examId}/${userId}`);
    } catch (err) {
      setInfoMessage(err.message + " আপনি হয়তো এই পরীক্ষাটি দেননি।");
      setShowInfoModal(true);
    }
  };

  const checkResultWithGuestId = async () => {
    if (!guestUserId.trim()) {
      setInfoMessage("দয়া করে আপনার ইউজার আইডি লিখুন।");
      setShowInfoModal(true);
      return;
    }

    try {
      await getExamResult(tempExamId, guestUserId.trim());
      setShowIdInputModal(false);
      navigate(`/result/${tempExamId}/${guestUserId.trim()}`);
    } catch (err) {
      setInfoMessage(err.message + " এই ইউজার আইডি দিয়ে কোনো ফলাফল পাওয়া যায়নি অথবা আপনি এই পরীক্ষাটি দেননি।");
      setShowInfoModal(true);
    }
  };

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
    setCurrentPage(1); // ফিল্টার পরিবর্তন হলে পেজ 1 এ সেট করুন
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) {
    return <div className="loading-container">তথ্য লোড হচ্ছে...</div>;
  }

  if (error) {
    return <div className="error-container">এরর: {error}</div>;
  }

  return (
    <div className="home-page-container">

      <Helmet>
        <title>ফ্রি মেডিকেল এক্সাম | মেডিক্র্যাক</title>
        <meta name="description" content="মেডিক্র্যাক-এ বিনামূল্যে মেডিকেল পরীক্ষা দিন। আপনার জ্ঞান যাচাই করুন এবং প্রস্তুতির স্তর সম্পর্কে জানুন। সকল মেডিকেল শিক্ষার্থীদের জন্য উন্মুক্ত।" />
        <meta name="keywords" content="ফ্রি এক্সাম, মেডিকেল পরীক্ষা, অনলাইন এক্সাম, মেডিক্র্যাক এক্সাম, মেডিকেল স্টুডেন্ট এক্সাম" />
        <link rel="canonical" href="https://www.yourmedicrackwebsite.com/free-exams" />
      </Helmet>


      <h1>মেডিক্র্যাক পরীক্ষাগুলো</h1>

      {/* Warning Message */}
      <div className="warning-message">
        সকল ফিচার পেতে **Medicrack** অ্যাপটি প্লেস্টোর থেকে ডাউনলোড করুন এবং আপনার ইমেল ও পাসওয়ার্ড দিয়ে লগইন করুন।
      </div>
      
      {/* Subject Filter Dropdown */}
      <div className="filter-section">
        <label htmlFor="subject-select">বিষয় নির্বাচন করুন:</label>
        <select id="subject-select" value={selectedSubject} onChange={handleSubjectChange}>
          {subjects.map(subject => (
            <option key={subject} value={subject}>{subject}</option>
          ))}
        </select>
      </div>
      
      <div className="exam-list">
        {exams.length > 0 ? (
          exams.map(exam => (
            <div key={exam.id} className="exam-card">
              <h2>{exam.SubjectName} - {exam.topicName}</h2>
              <p>ক্লাস: {exam.ClassName}</p>
              <p>MCQ সংখ্যা: {exam.MCQCount}</p>
              <p>সময়: {exam.ExamHour} ঘণ্টা {exam.ExamMinute} মিনিট</p>
              <p>নেগেটিভ মার্কস: {exam.NegativeMarks > 0 ? exam.NegativeMarks : 'নেই'}</p>
              <div className="card-actions">
                <Link to={`/exam/${exam.id}`} className="start-exam-button">
                  পরীক্ষা দিন
                </Link>
                <button onClick={() => handleResultCheck(exam.id)} className="view-result-button">
                  রেজাল্ট
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="no-exams">এই ফিল্টারের জন্য কোনো পরীক্ষা পাওয়া যায়নি।</p>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="pagination-controls">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            আগের পেজ
          </button>
          <span>পেজ {currentPage} এর {totalPages}</span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            পরের পেজ
          </button>
        </div>
      )}

      {/* Info Modal */}
      {showInfoModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>তথ্য</h3>
            <p>{infoMessage}</p>
            <div className="modal-actions">
              <button className="primary" onClick={() => setShowInfoModal(false)}>বন্ধ করুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Guest User ID Input Modal */}
      {showIdInputModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>রেজাল্ট দেখার জন্য ইউজার আইডি দিন</h3>
            <p>আপনার ইউজার আইডি (যেমন: গেস্ট মোডে পরীক্ষা দেওয়ার সময় পাওয়া আইডি) লিখুন।</p>
            <input
              type="text"
              placeholder="আপনার ইউজার আইডি লিখুন"
              value={guestUserId}
              onChange={(e) => setGuestUserId(e.target.value)}
            />
            <div className="modal-actions">
              <button className="primary" onClick={checkResultWithGuestId}>রেজাল্ট দেখুন</button>
              <button className="secondary" onClick={() => setShowIdInputModal(false)}>বাতিল করুন</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default HomePage;