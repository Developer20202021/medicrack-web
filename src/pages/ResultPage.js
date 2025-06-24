// src/pages/ResultPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getExamResult } from '../api'; // api.js থেকে ইম্পোর্ট
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Icons
import './ResultPage.css';
import katex from 'katex'; // KaTeX ইম্পোর্ট করুন
import 'katex/dist/katex.min.css'; // KaTeX CSS ইম্পোর্ট করুন, এটি খুবই জরুরি

function ResultPage() {
  const { examId, userId } = useParams();
  const navigate = useNavigate();
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // নতুন ফাংশন: ল্যাটেক্স কোডকে HTML এ কনভার্ট করা
  const renderLatex = (text) => {
    // text যদি স্ট্রিং না হয়, তাহলে সরাসরি text ফেরত দিন
    if (typeof text !== 'string') {
      return text;
    }

    // রেগুলার এক্সপ্রেশন ব্যবহার করে $$...** প্যাটার্ন খুঁজুন
    // এবং সেগুলোকে KaTeX দিয়ে রেন্ডার করুন
    const parts = text.split(/(\$\$[\s\S]*?\*\*)/g); // $$ এবং ** দ্বারা চিহ্নিত অংশগুলো আলাদা করুন

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('**')) {
        const latexCode = part.substring(2, part.length - 2); // $$ এবং ** বাদ দিয়ে ল্যাটেক্স কোড নিন
        try {
          // KaTeX ব্যবহার করে ল্যাটেক্সকে HTML এ কনভার্ট করুন
          // displayMode: true করলে এটি ব্লক-লেভেল রেন্ডার করবে, যা প্রশ্নের জন্য ভালো হতে পারে।
          // যদি ইনলাইন চান, তাহলে false রাখুন।
          const html = katex.renderToString(latexCode, {
            throwOnError: false, // এরর হলেও রেন্ডার করার চেষ্টা করবে
            displayMode: true,  // ডিসপ্লে মোড (এটি সাধারণত গণিতের প্রশ্নের জন্য ভালো)
          });
          // dangerouslySetInnerHTML ব্যবহার করে HTML রেন্ডার করুন
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          console.error("KaTeX রেন্ডার করতে সমস্যা:", e, "কোড:", latexCode);
          // এরর হলে কাঁচা কোড দেখান এবং স্টাইল দিন যাতে সহজেই বোঝা যায়
          return <span key={index} className="latex-error" style={{ color: 'red', fontWeight: 'bold' }}>{`ল্যাটেক্স এরর: ${latexCode}`}</span>;
        }
      } else {
        return <span key={index}>{part}</span>; // সাধারণ টেক্সট
      }
    });
  };

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const fetchedResult = await getExamResult(examId, userId);
        setExamResult(fetchedResult);
      } catch (err) {
        console.error("ফলাফল আনতে সমস্যা:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [examId, userId]);

  if (loading) {
    return <div className="loading-container">ফলাফল লোড হচ্ছে...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')} className="back-to-home-button">
          হোমপেজে ফিরে যান
        </button>
      </div>
    );
  }

  if (!examResult) {
    return null; // Should not happen if error is handled
  }

  return (
    <div className="result-page-container">
      {/* নতুন ওয়ার্নিং মেসেজ */}
      <div className="medicrack-app-promo">
        <p>
          পজিশন দেখতে হলে আপনাকে **Medicrack** অ্যাপ প্লেস্টোর থেকে ডাউনলোড করতে হবে।
          সেখানে অনেক ফিচার পাবেন, যেমন: **রুটিন, নামাজের সময়, Course, Free Exam, Paid Exam, Q Bank এবং মেডিকেল প্রস্তুতির সম্পূর্ণ গাইডলাইন।**
        </p>
        <a
          href="https://play.google.com/store/apps/details?id=com.education.medicrack&pli=1"
          target="_blank"
          rel="noopener noreferrer"
          className="download-app-button"
        >
          প্লেস্টোর থেকে ডাউনলোড করুন
        </a>
      </div>
      {/* --- */}

      <h1>আপনার পরীক্ষার ফলাফল</h1>
      <div className="result-summary">
        <p>পরীক্ষার নাম: <strong>{examResult.examName}</strong></p>
        <p>মোট প্রশ্ন: <strong>{examResult.totalQuestions}</strong></p>
        <p>সঠিক উত্তর: <span className="correct">{examResult.correctAnswers}</span></p>
        <p>ভুল উত্তর: <span className="wrong">{examResult.wrongAnswers}</span></p>
        <p>আপনার প্রাপ্ত নম্বর: <strong className="total-marks">{examResult.totalMarks}</strong></p>
        <p>জমা দেওয়ার সময়: {new Date(examResult.submittedAt).toLocaleString()}</p>
      </div>

      <div className="answer-review-section">
        <h2>আপনার উত্তরগুলো পর্যালোচনা করুন</h2>
        {examResult.userAnswers.map((answer, index) => (
          <div key={index} className={`answer-card ${answer.isCorrect ? 'correct-answer-card' : 'wrong-answer-card'}`}>
            {/* এখানে renderLatex ব্যবহার করা হয়েছে */}
            <p className="question-text"><strong>প্রশ্ন {index + 1}:</strong> {renderLatex(answer.question)}</p>
            <p className="your-answer">
              আপনার উত্তর: <strong>{renderLatex(answer.selectedAnswer || 'উত্তর দেননি')}</strong>
              {answer.isCorrect ? (
                <FaCheckCircle className="icon correct-icon" />
              ) : (
                <FaTimesCircle className="icon wrong-icon" />
              )}
            </p>
            {!answer.isCorrect && (
              <p className="correct-answer">সঠিক উত্তর: <strong>{renderLatex(answer.correctAnswer)}</strong></p>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/')} className="back-to-home-button">
        হোমপেজে ফিরে যান
      </button>
    </div>
  );
}

export default ResultPage;