import React, { useState, useEffect } from 'react';
import { MessageCircle, Clock, User, CheckCircle, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'https://medicrack-web-exam-496984660515.asia-south1.run.app';

const ProblemShareStudent = ({ batchId }) => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userComments, setUserComments] = useState({});
  const [showWarning, setShowWarning] = useState(false);
  const [acceptedWarning, setAcceptedWarning] = useState(false);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchProblems();
  }, [batchId]);

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/problems/${batchId}`);
      const data = await response.json();
      
      if (data.success) {
        setProblems(data.problems);
        
        const commentChecks = {};
        for (const problem of data.problems) {
          const hasCommented = await checkUserComment(problem.id);
          commentChecks[problem.id] = hasCommented;
        }
        setUserComments(commentChecks);
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      alert('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const checkUserComment = async (problemId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/problems/${batchId}/${problemId}/check-comment/${userId}`
      );
      const data = await response.json();
      return data.hasCommented;
    } catch (error) {
      console.error('Error checking comment:', error);
      return false;
    }
  };

  const handleCommentSubmit = async (problemId) => {
    if (!comment.trim()) {
      alert('Please enter a comment');
      return;
    }

    if (!userId) {
      alert('User not logged in');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch(
        `${API_BASE_URL}/api/problems/${batchId}/${problemId}/comment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: userId,
            comment: comment.trim()
          })
        }
      );

      const data = await response.json();

      if (data.success) {
        alert('Comment submitted successfully!');
        setComment('');
        setSelectedProblem(null);
        setAcceptedWarning(false);
        
        setUserComments(prev => ({
          ...prev,
          [problemId]: true
        }));
      } else {
        alert(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddCommentClick = (problemId) => {
    setSelectedProblem(problemId);
    setShowWarning(true);
    setAcceptedWarning(false);
  };

  const handleWarningAccept = () => {
    setShowWarning(false);
    setAcceptedWarning(true);
  };

  const handleWarningCancel = () => {
    setShowWarning(false);
    setSelectedProblem(null);
    setComment('');
    setAcceptedWarning(false);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 px-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
        <p className="text-gray-400 text-sm sm:text-base">Loading problems...</p>
      </div>
    );
  }

  if (problems.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 px-4 sm:px-8">
        <AlertTriangle className="mx-auto mb-4 text-gray-600" size={48} />
        <h3 className="text-xl sm:text-2xl text-gray-300 mb-2 font-semibold">No Active Problems</h3>
        <p className="text-gray-500 text-sm sm:text-base">There are no problems shared at the moment.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Problem Share</h1>
        <p className="text-sm sm:text-base lg:text-lg text-gray-400">Share your thoughts on current problems</p>
      </div>

      {/* Warning Modal - Fixed for mobile */}
      {showWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 sm:p-6 rounded-t-2xl">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="bg-white rounded-full p-2 sm:p-3 flex-shrink-0">
                  <AlertTriangle className="text-red-600" size={24} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-white">⚠️ গুরুত্বপূর্ণ সতর্কতা</h2>
                  <p className="text-red-100 text-xs sm:text-sm mt-1">অনুগ্রহ করে মনোযোগ সহকারে পড়ুন</p>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-8">
              <div className="bg-red-900 bg-opacity-20 border-2 border-red-600 border-opacity-30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-red-400 mb-3 sm:mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} />
                  কমেন্ট করার আগে অবশ্যই পড়ুন
                </h3>
                
                <div className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">১</div>
                    <p className="text-gray-300 leading-relaxed"><strong className="text-white">সত্য ও সঠিক তথ্য দিন:</strong> শুধুমাত্র সত্য এবং সঠিক তথ্য শেয়ার করুন। কোনো ভুল বা মিথ্যা তথ্য প্রদান করবেন না।</p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">২</div>
                    <p className="text-gray-300 leading-relaxed"><strong className="text-white">সম্মানজনক ভাষা ব্যবহার করুন:</strong> কোনো অশ্লীল, অসম্মানজনক বা আপত্তিকর ভাষা ব্যবহার করবেন না।</p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">৩</div>
                    <p className="text-gray-300 leading-relaxed"><strong className="text-white">প্রাসঙ্গিক কমেন্ট করুন:</strong> শুধুমাত্র সমস্যার সাথে সম্পর্কিত মন্তব্য করুন। অপ্রাসঙ্গিক বা স্পাম কমেন্ট করবেন না।</p>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">৪</div>
                    <p className="text-gray-300 leading-relaxed"><strong className="text-white">ব্যক্তিগত আক্রমণ নিষিদ্ধ:</strong> কাউকে ব্যক্তিগতভাবে আক্রমণ বা হয়রানি করবেন না।</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-red-900 to-red-800 text-white rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 shadow-lg">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <AlertTriangle size={24} />
                  <h3 className="text-lg sm:text-xl font-bold">⛔ শাস্তির বিধান</h3>
                </div>
                <div className="bg-white bg-opacity-20 rounded-lg p-3 sm:p-4 border-2 border-white border-opacity-30">
                  <p className="text-sm sm:text-base lg:text-lg font-bold leading-relaxed">
                    যদি আপনি কোনো ভুল, মিথ্যা, অশ্লীল, অপ্রাসঙ্গিক বা আপত্তিকর কমেন্ট করেন, তাহলে আপনাকে এই কোর্স থেকে <span className="text-yellow-300 text-base sm:text-lg lg:text-xl">সারাজীবনের জন্য স্থায়ীভাবে বহিষ্কার (BAN)</span> করা হবে এবং কোনো রিফান্ড প্রদান করা হবে না।
                  </p>
                </div>
              </div>

              <div className="bg-blue-900 bg-opacity-20 border-2 border-blue-600 border-opacity-30 rounded-xl p-4 sm:p-5">
                <p className="text-blue-300 leading-relaxed text-sm sm:text-base">
                  <strong className="text-blue-200">দয়া করে নিশ্চিত করুন:</strong> আপনি উপরের সকল নিয়মকানুন পড়েছেন এবং বুঝেছেন। আপনার কমেন্ট সত্যবাদী, সম্মানজনক এবং প্রাসঙ্গিক হবে।
                </p>
              </div>
            </div>

            <div className="bg-gray-900 px-4 sm:px-8 py-4 sm:py-6 rounded-b-2xl flex flex-col sm:flex-row gap-3 sm:gap-4 border-t border-gray-700">
              <button
                onClick={handleWarningCancel}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm sm:text-base text-gray-300 bg-gray-800 border-2 border-gray-700 transition-all hover:bg-gray-700 hover:border-gray-600"
              >
                বাতিল করুন
              </button>
              <button
                onClick={handleWarningAccept}
                className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold text-sm sm:text-base text-white bg-gradient-to-r from-green-600 to-green-700 transition-all hover:from-green-700 hover:to-green-800 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <CheckCircle size={18} />
                আমি বুঝেছি এবং সম্মত
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Problems Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-6">
        {problems.map((problem) => (
          <div 
            key={problem.id} 
            className={`bg-gray-800 rounded-xl p-4 sm:p-6 shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 border-2 ${
              problem.isSolved 
                ? 'border-green-500 bg-gradient-to-b from-green-900 from-opacity-10 to-gray-800' 
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <div className="flex justify-between items-start mb-3 sm:mb-4 gap-3">
              <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-white flex-1 break-words">{problem.title}</h2>
              {problem.isSolved && (
                <span className="flex items-center gap-1 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0">
                  <CheckCircle size={14} />
                  Solved
                </span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base break-words">{problem.description}</p>

            <div className="flex gap-3 sm:gap-6 mb-3 sm:mb-4 flex-wrap text-xs sm:text-sm text-gray-500">
              <span className="flex items-center gap-1 sm:gap-2">
                <User size={14} className="flex-shrink-0" />
                <span className="truncate">{problem.createdBy}</span>
              </span>
              <span className="flex items-center gap-1 sm:gap-2">
                <Clock size={14} className="flex-shrink-0" />
                <span className="truncate">{formatDate(problem.createdAt)}</span>
              </span>
            </div>

            {problem.isSolved && problem.solutionNote && (
              <div className="bg-blue-900 bg-opacity-20 border-l-4 border-blue-500 p-3 sm:p-4 rounded-lg mb-3 sm:mb-4">
                <div className="flex items-center gap-2 text-blue-400 mb-2 text-xs sm:text-sm font-semibold">
                  <CheckCircle size={14} className="flex-shrink-0" />
                  <span className="truncate">Solution by {problem.solvedBy}</span>
                </div>
                <p className="text-blue-300 leading-relaxed text-sm sm:text-base break-words">{problem.solutionNote}</p>
              </div>
            )}

            {!problem.isSolved && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-700">
                {userComments[problem.id] ? (
                  <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-green-900 bg-opacity-20 border border-green-600 border-opacity-30 rounded-lg text-green-400 font-medium text-xs sm:text-sm">
                    <CheckCircle size={18} className="flex-shrink-0" />
                    <span>You have already commented on this problem</span>
                  </div>
                ) : (
                  <>
                    {selectedProblem === problem.id && acceptedWarning ? (
                      <div className="flex flex-col gap-3 sm:gap-4">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts on this problem..."
                          rows="4"
                          disabled={submitting}
                          className="w-full px-3 py-2 bg-gray-900 border-2 border-gray-700 rounded-lg text-sm sm:text-base text-white placeholder-gray-500 resize-y transition-colors focus:outline-none focus:border-blue-500 disabled:bg-gray-800 disabled:cursor-not-allowed"
                        />
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <button
                            onClick={() => {
                              setSelectedProblem(null);
                              setComment('');
                              setAcceptedWarning(false);
                            }}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-sm text-gray-300 bg-gray-900 border-2 border-gray-700 transition-all hover:bg-gray-800 hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleCommentSubmit(problem.id)}
                            className="w-full sm:w-auto px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 flex items-center justify-center gap-2 transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg disabled:bg-blue-800 disabled:cursor-not-allowed disabled:transform-none"
                            disabled={submitting || !comment.trim()}
                          >
                            {submitting ? (
                              <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                Submitting...
                              </>
                            ) : (
                              <>
                                <MessageCircle size={16} />
                                Submit
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAddCommentClick(problem.id)}
                        className="w-full px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg font-semibold text-sm text-white bg-blue-600 flex items-center justify-center gap-2 transition-all hover:bg-blue-700 hover:-translate-y-0.5 hover:shadow-lg"
                      >
                        <MessageCircle size={16} />
                        Add Your Comment
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemShareStudent;