// src/pages/ExamPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getExamMcqs, submitExamResult } from '../api';
import './ExamPage.css';
import katex from 'katex'; // KaTeX ইম্পোর্ট করুন
import 'katex/dist/katex.min.css'; // KaTeX CSS ইম্পোর্ট করুন, এটি খুবই জরুরি

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null); // পরীক্ষার মেটাডেটা
  const [mcqs, setMcqs] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  // নতুন ফাংশন: ল্যাটেক্স কোডকে HTML এ কনভার্ট করা
  const renderLatex = (text) => {
    if (typeof text !== 'string') {
      return text;
    }

    // রেগুলার এক্সপ্রেশন ব্যবহার করে $$...** প্যাটার্ন খুঁজুন
    // এবং সেগুলোকে KaTeX দিয়ে রেন্ডার করুন
    // ** এর আগে সম্ভাব্য কোনো ক্যারেক্টার না থাকে তা নিশ্চিত করতে
    // এবং $$ এর পরে শুরু হয়, সেভাবে প্যাটার্ন তৈরি করা হয়েছে।
    // [\s\S]*? এটি নতুন লাইন সহ যেকোনো ক্যারেক্টার ম্যাচ করার জন্য
    const parts = text.split(/(\$\$[\s\S]*?\*\*)/g);

    return parts.map((part, index) => {
      // শুধুমাত্র `$$` দিয়ে শুরু এবং `**` দিয়ে শেষ হওয়া অংশগুলো প্রক্রিয়া করুন
      if (part.startsWith('$$') && part.endsWith('**')) {
        const latexCode = part.substring(2, part.length - 2); // $$ এবং ** বাদ দিয়ে ল্যাটেক্স কোড নিন
        try {
          // KaTeX ব্যবহার করে ল্যাটেক্সকে HTML এ কনভার্ট করুন
          // যেহেতু আপনি $$...** প্যাটার্নকে একক ল্যাটেক্স এক্সপ্রেশন হিসেবে দেখছেন,
          // এটি ইনলাইন মোডে রেন্ডার করাই বেশি অর্থপূর্ণ হবে।
          const html = katex.renderToString(latexCode, {
            throwOnError: false, // এরর হলেও রেন্ডার করার চেষ্টা করবে
            displayMode: false,  // ইনলাইন মোড
          });
          // dangerouslySetInnerHTML ব্যবহার করে HTML রেন্ডার করুন
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          console.error("KaTeX রেন্ডার করতে সমস্যা:", e, "কোড:", latexCode);
          return <span key={index} className="latex-error" style={{ color: 'red' }}>{`ল্যাটেক্স এরর: ${latexCode}`}</span>; // এরর হলে কাঁচা কোড দেখান
        }
      } else {
        return <span key={index}>{part}</span>; // সাধারণ টেক্সট
      }
    });
  };

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const { examDetails, mcqs: fetchedMcqs } = await getExamMcqs(examId); // ডেস্ট্রাকচারিং করে ডেটা নিন
        setExam(examDetails); // পরীক্ষার বিস্তারিত তথ্য সেট করুন
        setMcqs(fetchedMcqs);
        setTimeRemaining((examDetails.ExamHour * 60 + examDetails.ExamMinute) * 60);

      } catch (err) {
        setError(err.message);
        console.error("পরীক্ষা ডেটা আনতে সমস্যা:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExamData();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining > 0 && !loading) { // নিশ্চিত করুন যে ডেটা লোড হয়েছে
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !loading && mcqs.length > 0) {
      clearInterval(timerRef.current);
      handleSubmitExam(true); // Auto-submit
    }
    return () => clearInterval(timerRef.current);
  }, [timeRemaining, loading, mcqs.length]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (mcqId, option) => {
    setSelectedAnswers(prevAnswers => ({
      ...prevAnswers,
      [mcqId]: option,
    }));
  };

  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (!exam || !mcqs.length) {
      alert("পরীক্ষার প্রশ্ন লোড হয়নি অথবা কোনো প্রশ্ন নেই।");
      return;
    }

    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("লগইন না করলে পরীক্ষা জমা দিতে পারবেন না।");
      navigate('/');
      return;
    }

    let correctAnswers = 0;
    let wrongAnswers = 0;
    const userAnswers = [];

    mcqs.forEach(mcq => {
      const selectedOption = selectedAnswers[mcq.MCQID];
      const isCorrect = selectedOption === mcq.answer;
      userAnswers.push({
        mcqId: mcq.MCQID,
        question: mcq.question, // মূল প্রশ্ন (ল্যাটেক্স সহ)
        selectedAnswer: selectedOption || null,
        correctAnswer: mcq.answer,
        isCorrect: isCorrect,
      });

      if (isCorrect) {
        correctAnswers++;
      } else if (selectedOption) {
        wrongAnswers++;
      }
    });

    const totalMarks = correctAnswers - (wrongAnswers * exam.NegativeMarks);

    const resultData = {
      examName: exam.topicName,
      userId: userId,
      correctAnswers,
      wrongAnswers,
      totalMarks: parseFloat(totalMarks.toFixed(2)),
      userAnswers,
      isAutoSubmitted: isAutoSubmit,
      totalQuestions: mcqs.length,
    };

    try {
      await submitExamResult(examId, resultData);
      clearInterval(timerRef.current);
      alert(`পরীক্ষা সম্পন্ন হয়েছে! আপনার প্রাপ্ত নম্বর: ${totalMarks.toFixed(2)}`);
      navigate(`/result/${examId}/${userId}`);
    } catch (err) {
      setError(err.message);
      alert(`ফলাফল জমা দিতে সমস্যা: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="loading-container">পরীক্ষা লোড হচ্ছে...</div>;
  }

  if (error) {
    return <div className="error-container">এরর: {error}</div>;
  }

  if (!exam) {
    return <div className="error-container">পরীক্ষার বিবরণ পাওয়া যায়নি।</div>;
  }

  const currentMcq = mcqs[currentQuestionIndex];

  return (
    <div className="exam-page-container">

    <Helmet>
        <title>ফ্রি মেডিকেল এক্সাম | মেডিক্র্যাক</title>
        <meta name="description" content="মেডিক্র্যাক-এ বিনামূল্যে মেডিকেল পরীক্ষা দিন। আপনার জ্ঞান যাচাই করুন এবং প্রস্তুতির স্তর সম্পর্কে জানুন। সকল মেডিকেল শিক্ষার্থীদের জন্য উন্মুক্ত।" />
        <meta name="keywords" content="ফ্রি এক্সাম, মেডিকেল পরীক্ষা, অনলাইন এক্সাম, মেডিক্র্যাক এক্সাম, মেডিকেল স্টুডেন্ট এক্সাম" />
        <link rel="canonical" href="https://www.yourmedicrackwebsite.com/free-exams" />
      </Helmet>

      <div className="exam-header">
        <h2>{exam.SubjectName} - {exam.topicName}</h2>
        <div className="timer">সময় বাকি: {formatTime(timeRemaining)}</div>
      </div>

      {mcqs.length > 0 ? (
        <div className="question-card">
          <p className="question-number">প্রশ্ন {currentQuestionIndex + 1} / {mcqs.length}</p>
          {currentMcq.QuestionImageUrl && currentMcq.QuestionImageUrl !== "No" && (
            <img src={currentMcq.QuestionImageUrl} alt="Question" className="question-image" />
          )}
          {/* এখানে renderLatex ব্যবহার করা হচ্ছে */}
          <p className="question-text">{renderLatex(currentMcq.question)}</p>

          <div className="options-container">
            {currentMcq.options.map((option, idx) => (
              <button
                key={idx}
                className={`option-button ${selectedAnswers[currentMcq.MCQID] === option ? 'selected' : ''}`}
                onClick={() => handleOptionSelect(currentMcq.MCQID, option)}
              >
                {/* এখানেও renderLatex ব্যবহার করা হচ্ছে */}
                {renderLatex(option)}
              </button>
            ))}
          </div>

          <div className="navigation-buttons">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="nav-button"
            >
              আগের প্রশ্ন
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
              disabled={currentQuestionIndex === mcqs.length - 1}
              className="nav-button"
            >
              পরের প্রশ্ন
            </button>
          </div>

          <button onClick={() => handleSubmitExam(false)} className="submit-exam-button">
            পরীক্ষা জমা দিন
          </button>
        </div>
      ) : (
        <div className="no-mcqs">এই পরীক্ষার জন্য কোনো MCQ পাওয়া যায়নি।</div>
      )}
    </div>
  );
}

export default ExamPage;