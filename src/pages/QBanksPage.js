// frontend/src/pages/QBanksPage.js
import React, { useState, useEffect } from 'react';
import { getQBanks } from '../api';
import QBanksSubjectsModal from '../components/QBanksSubjectsModal';
import DescriptionModal from '../components/DescriptionModal'; // নতুন ডেসক্রিপশন মডাল কম্পোনেন্ট
import { X } from 'lucide-react'; // X icon for close button

const QBanksPage = () => {
  const [qbanks, setQBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(6); // প্রতি পেজে কয়টি QBank দেখাবেন

  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [selectedQBankId, setSelectedQBankId] = useState(null);
  const [selectedQBankName, setSelectedQBankName] = useState('');

  // নতুন স্টেট যোগ করা হয়েছে ডেসক্রিপশন মডালের জন্য
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [selectedQBankDescription, setSelectedQBankDescription] = useState('');
  const [selectedDescriptionModalTitle, setSelectedDescriptionModalTitle] = useState('');


  useEffect(() => {
    fetchQBanks(currentPage);
  }, [currentPage]);

  const fetchQBanks = async (page) => {
    setLoading(true);
    try {
      const data = await getQBanks(page, perPage);
      setQBanks(data.qbanks);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleReadClick = (qbankId, qbankName) => {
    setSelectedQBankId(qbankId);
    setSelectedQBankName(qbankName);
    setShowSubjectsModal(true);
  };

  const handleCloseSubjectsModal = () => {
    setShowSubjectsModal(false);
    setSelectedQBankId(null);
    setSelectedQBankName('');
  };

  // নতুন ফাংশন: বিস্তারিত দেখুন বাটনে ক্লিক করলে
  const handleViewDetailsClick = (qbankName, qbankDescription) => {
    setSelectedDescriptionModalTitle(qbankName);
    setSelectedQBankDescription(qbankDescription);
    setShowDescriptionModal(true);
  };

  const handleCloseDescriptionModal = () => {
    setShowDescriptionModal(false);
    setSelectedQBankDescription('');
    setSelectedDescriptionModalTitle('');
  };

  // HTML এস্কেপ করার জন্য হেল্পার ফাংশন (আগের মতোই আছে)
  const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-gray-900 text-center mb-10 border-b-4 border-emerald-500 pb-4 inline-block">
          আমাদের প্রশ্নব্যাংকসমূহ
        </h1>

        {loading ? (
          <p className="text-center text-lg text-gray-600">প্রশ্নব্যাংক লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">প্রশ্নব্যাংক আনতে সমস্যা: {error}</p>
        ) : qbanks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {qbanks.map((qbank) => (
                <div key={qbank.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition duration-300 hover:scale-105 hover:shadow-xl">
                  <img
                    src={qbank.imageUrl || `https://placehold.co/600x300/F0F4F8/3B82F6?text=${qbank.name.replace(/\s/g, '+')}`}
                    alt={qbank.name}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x300/F0F4F8/3B82F6?text=${qbank.name.replace(/\s/g, '+')}`; }}
                  />
                  <div className="p-6">
                    <h2 className="text-sm font-semibold text-gray-800 mb-2 truncate">{qbank.name}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3" dangerouslySetInnerHTML={{ __html: escapeHtml(qbank.description).replace(/\n/g, '<br/>') }}></p>
                    <div className="flex items-center justify-between mb-4">
                      {qbank.price === 0 ? (
                        <p className="text-emerald-600 font-bold text-lg">ফ্রি</p>
                      ) : (
                        <p className="text-emerald-600 font-bold text-lg">
                          ৳{qbank.price}
                          {qbank.overPriceAvailable && qbank.overPrice && (
                            <span className="text-gray-500 line-through ml-2">৳{qbank.overPrice}</span>
                          )}
                        </p>
                      )}
                      <span className="text-sm text-gray-500">বিক্রিত: {qbank.totalBuy || 0}</span>
                    </div>

                    {/* এখানে বাটন লজিক পরিবর্তন করা হয়েছে */}
                    {qbank.price === 0 ? (
                      <button
                        onClick={() => handleReadClick(qbank.id, qbank.name)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                      >
                        পড়ুন
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewDetailsClick(qbank.name, qbank.description)}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                      >
                        বিস্তারিত দেখুন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  পূর্ববর্তী
                </button>
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1
                        ? 'bg-emerald-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition`}
                  >
                    {index + 1}
                  </button>
                ))}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  পরবর্তী
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-center text-lg text-gray-600">কোনো প্রশ্নব্যাংক পাওয়া যায়নি।</p>
        )}

        {/* Subjects Modal */}
        {showSubjectsModal && (
          <QBanksSubjectsModal
            qbankId={selectedQBankId}
            qbankName={selectedQBankName}
            onClose={handleCloseSubjectsModal}
          />
        )}

        {/* Description Modal */}
        {showDescriptionModal && (
          <DescriptionModal
            title={selectedDescriptionModalTitle}
            description={selectedQBankDescription}
            onClose={handleCloseDescriptionModal}
          />
        )}
      </div>
    </div>
  );
};

export default QBanksPage;
