// frontend/src/components/SubjectExamsModal.js
import React, { useState, useEffect } from 'react';
import { getQBankSubjectExams, getMainExamDetails } from '../api'; // getMainExamDetails যোগ করা হয়েছে
import ExamMCQsModal from './ExamMCQsModal'; // MCQ মডাল
import { X } from 'lucide-react';

const SubjectExamsModal = ({ qbankId, subjectId, subjectName, onClose }) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showMCQsModal, setShowMCQsModal] = useState(false);
  const [selectedMainExamId, setSelectedMainExamId] = useState(null); // মূল Exams কালেকশনের ID

  useEffect(() => {
    const fetchExams = async () => {
      setLoading(true);
      try {
        const data = await getQBankSubjectExams(qbankId, subjectId);
        // প্রতিটি সাব-এক্সামের জন্য মূল এক্সামের বিস্তারিত তথ্য আনতে হবে
        const examsWithDetails = await Promise.all(data.map(async (exam) => {
          if (exam.examId) { // যদি examId থাকে তবে মূল কালেকশন থেকে আনুন
            try {
              const mainExamDetails = await getMainExamDetails(exam.examId);
              return { ...exam, mainExamDetails };
            } catch (mainExamErr) {
              console.warn(`Error fetching main exam details for ${exam.examId}:`, mainExamErr);
              return { ...exam, mainExamDetails: null, errorFetchingMain: true }; // ত্রুটির ক্ষেত্রে চিহ্নিত করুন
            }
          }
          return exam; // যদি examId না থাকে
        }));
        setExams(examsWithDetails.filter(exam => exam.mainExamDetails || !exam.examId)); // শুধু সফল বা যাদের examId নেই সেগুলো দেখান
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (qbankId && subjectId) {
      fetchExams();
    }
  }, [qbankId, subjectId]);

  const handleExamClick = (mainExamId) => {
    setSelectedMainExamId(mainExamId);
    setShowMCQsModal(true);
  };

  const handleCloseMCQsModal = () => {
    setShowMCQsModal(false);
    setSelectedMainExamId(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 transition duration-200"
          aria-label="বন্ধ করুন"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
          {subjectName} - পরীক্ষার তালিকা
        </h3>

        {loading ? (
          <p className="text-center text-lg text-gray-600">পরীক্ষার তালিকা লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">পরীক্ষার তালিকা আনতে সমস্যা: {error}</p>
        ) : exams.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              exam.mainExamDetails && ( // শুধুমাত্র যদি মূল পরীক্ষার ডেটা সফলভাবে আসে
                <div
                  key={exam.id}
                  onClick={() => handleExamClick(exam.mainExamDetails.id)} // মূল পরীক্ষার ID পাঠান
                  className="bg-green-50 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 border border-green-200 flex flex-col items-center text-center"
                >
                  <h4 className="text-xl font-semibold text-green-800 mb-2">{exam.mainExamDetails.topicName}</h4>
                  <p className="text-gray-600 text-sm">MCQ সংখ্যা: {exam.mainExamDetails.MCQCount}</p>
                </div>
              )
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">কোনো পরীক্ষা খুঁজে পাওয়া যায়নি।</p>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition duration-300"
          >
            বন্ধ করুন
          </button>
        </div>

        {/* MCQs Modal */}
        {showMCQsModal && (
          <ExamMCQsModal
            examId={selectedMainExamId}
            onClose={handleCloseMCQsModal}
          />
        )}
      </div>
    </div>
  );
};

export default SubjectExamsModal;