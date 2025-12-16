// src/pages/ExamPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { getExamMcqs, submitExamResult } from '../api';
import './ExamPage.css';
import katex from 'katex';
import 'katex/dist/katex.min.css';

function ExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [mcqs, setMcqs] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const timerRef = useRef(null);

  const renderLatex = (text) => {
    if (typeof text !== 'string') {
      return text;
    }

    const parts = text.split(/(\$\$[\s\S]*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith('$$') && part.endsWith('**')) {
        const latexCode = part.substring(2, part.length - 2);
        try {
          const html = katex.renderToString(latexCode, {
            throwOnError: false,
            displayMode: false,
          });
          return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (e) {
          console.error("KaTeX রেন্ডার করতে সমস্যা:", e, "কোড:", latexCode);
          return <span key={index} className="latex-error">{`ল্যাটেক্স এরর: ${latexCode}`}</span>;
        }
      } else {
        return <span key={index}>{part}</span>;
      }
    });
  };

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        const { examDetails, mcqs: fetchedMcqs } = await getExamMcqs(examId);
        setExam(examDetails);
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
    if (timeRemaining > 0 && !loading) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0 && !loading && mcqs.length > 0) {
      clearInterval(timerRef.current);
      handleSubmitExam(true);
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
        question: mcq.question,
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-900 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 animate-pulse">পরীক্ষা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-lg max-w-md">
          <p className="text-red-700 dark:text-red-300 text-lg">এরর: {error}</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-lg text-gray-600 dark:text-gray-400">পরীক্ষার বিবরণ পাওয়া যায়নি।</p>
        </div>
      </div>
    );
  }

  const currentMcq = mcqs[currentQuestionIndex];

  return (
    <div className="min-h-screen py-8 px-4 transition-colors duration-300">
      <Helmet>
        <title>ফ্রি মেডিকেল এক্সাম | মেডিক্র্যাক</title>
        <meta name="description" content="মেডিক্র্যাক-এ বিনামূল্যে মেডিকেল পরীক্ষা দিন। আপনার জ্ঞান যাচাই করুন এবং প্রস্তুতির স্তর সম্পর্কে জানুন। সকল মেডিকেল শিক্ষার্থীদের জন্য উন্মুক্ত।" />
        <meta name="keywords" content="ফ্রি এক্সাম, মেডিকেল পরীক্ষা, অনলাইন এক্সাম, মেডিক্র্যাক এক্সাম, মেডিকেল স্টুডেন্ট এক্সাম" />
        <link rel="canonical" href="https://www.yourmedicrackwebsite.com/free-exams" />
      </Helmet>

      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Tiro Bangla', serif" }}>
                {exam.SubjectName} - {exam.topicName}
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>মোট প্রশ্ন: {mcqs.length}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-3 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 px-6 py-4 rounded-xl border-2 border-red-200 dark:border-red-800">
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">সময় বাকি</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono">{formatTime(timeRemaining)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Card */}
        {mcqs.length > 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 sm:p-8">
            {/* Question Number Badge */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">{currentQuestionIndex + 1}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">প্রশ্ন নম্বর</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{currentQuestionIndex + 1} / {mcqs.length}</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs ml-4">
                <div className="flex-1 bg-gray-200 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 h-full transition-all duration-300"
                    style={{ width: `${((currentQuestionIndex + 1) / mcqs.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {Math.round(((currentQuestionIndex + 1) / mcqs.length) * 100)}%
                </span>
              </div>
            </div>

            {/* Question Image */}
            {currentMcq.QuestionImageUrl && currentMcq.QuestionImageUrl !== "No" && (
              <div className="mb-6">
                <img 
                  src={currentMcq.QuestionImageUrl} 
                  alt="Question" 
                  className="max-w-full h-auto rounded-xl shadow-md dark:shadow-2xl dark:shadow-emerald-500/10 mx-auto"
                />
              </div>
            )}

            {/* Question Text */}
            <div className="mb-8 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-xl border border-emerald-100 dark:border-slate-700">
              <p className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100 leading-relaxed" style={{ fontFamily: "'Tiro Bangla', serif" }}>
                {renderLatex(currentMcq.question)}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-4 mb-8">
              {currentMcq.options.map((option, idx) => (
                <button
                  key={idx}
                  className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                    selectedAnswers[currentMcq.MCQID] === option
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 border-emerald-600 dark:border-emerald-500 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-700'
                  }`}
                  onClick={() => handleOptionSelect(currentMcq.MCQID, option)}
                  style={{ fontFamily: "'Tiro Bangla', serif" }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                      selectedAnswers[currentMcq.MCQID] === option
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <div className="flex-1 text-base sm:text-lg font-medium pt-1">
                      {renderLatex(option)}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-800">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                আগের প্রশ্ন
              </button>

              <button
                onClick={() => handleSubmitExam(false)}
                className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 dark:from-green-500 dark:to-emerald-500 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                পরীক্ষা জমা দিন
              </button>

              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(mcqs.length - 1, prev + 1))}
                disabled={currentQuestionIndex === mcqs.length - 1}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold"
              >
                পরের প্রশ্ন
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-lg text-gray-600 dark:text-gray-400">এই পরীক্ষার জন্য কোনো MCQ পাওয়া যায়নি।</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamPage;