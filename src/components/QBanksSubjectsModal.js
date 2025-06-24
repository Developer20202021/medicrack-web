// frontend/src/components/QBanksSubjectsModal.js
import React, { useState, useEffect } from 'react';
import { getQBankSubjects } from '../api';
import SubjectExamsModal from './SubjectExamsModal'; // পরবর্তী মডাল
import { X } from 'lucide-react';

const QBanksSubjectsModal = ({ qbankId, qbankName, onClose }) => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showExamsModal, setShowExamsModal] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [selectedSubjectName, setSelectedSubjectName] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const data = await getQBankSubjects(qbankId);
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (qbankId) {
      fetchSubjects();
    }
  }, [qbankId]);

  const handleSubjectClick = (subjectId, subjectName) => {
    setSelectedSubjectId(subjectId);
    setSelectedSubjectName(subjectName);
    setShowExamsModal(true);
  };

  const handleCloseExamsModal = () => {
    setShowExamsModal(false);
    setSelectedSubjectId(null);
    setSelectedSubjectName('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 transition duration-200"
          aria-label="বন্ধ করুন"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
          {qbankName} - বিষয়সমূহ
        </h3>

        {loading ? (
          <p className="text-center text-lg text-gray-600">বিষয় লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">বিষয় আনতে সমস্যা: {error}</p>
        ) : subjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id, subject.name)}
                className="bg-blue-50 p-6 rounded-lg shadow-md cursor-pointer hover:shadow-lg transition transform hover:-translate-y-1 border border-blue-200 flex flex-col items-center text-center"
              >
                <h4 className="text-xl font-semibold text-blue-800 mb-2">{subject.name}</h4>
                <p className="text-gray-600 text-sm">MCQ সংখ্যা: {subject.mcqCount}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">কোনো বিষয় খুঁজে পাওয়া যায়নি।</p>
        )}

        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition duration-300"
          >
            বন্ধ করুন
          </button>
        </div>

        {/* Exams Modal */}
        {showExamsModal && (
          <SubjectExamsModal
            qbankId={qbankId}
            subjectId={selectedSubjectId}
            subjectName={selectedSubjectName}
            onClose={handleCloseExamsModal}
          />
        )}
      </div>
    </div>
  );
};

export default QBanksSubjectsModal;