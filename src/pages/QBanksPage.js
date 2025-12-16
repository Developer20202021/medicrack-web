import React, { useState, useEffect } from 'react';
import { getQBanks } from '../api';
import QBanksSubjectsModal from '../components/QBanksSubjectsModal';
import DescriptionModal from '../components/DescriptionModal';
import { X } from 'lucide-react';
import { Helmet } from 'react-helmet';

const QBanksPage = () => {
  const [qbanks, setQBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(6);

  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [selectedQBankId, setSelectedQBankId] = useState(null);
  const [selectedQBankName, setSelectedQBankName] = useState('');

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 font-['Inter'] py-12 px-4 transition-colors duration-300">
      
      <Helmet>
        <title>মেডিকেল প্রশ্নব্যাঙ্ক (QBank) | মেডিক্র্যাক</title>
        <meta name="description" content="মেডিক্র্যাকের বিশাল মেডিকেল প্রশ্নব্যাঙ্ক থেকে বিনামূল্যে প্রশ্ন পড়ুন। আপনার মেডিকেল জ্ঞানকে আরও শক্তিশালী করুন।" />
        <meta name="keywords" content="কিউব্যাঙ্ক, প্রশ্নব্যাঙ্ক, মেডিকেল প্রশ্ন, ফ্রি কিউব্যাঙ্ক, মেডিক্র্যাক কিউব্যাঙ্ক, মেডিকেল স্টাডি মেটেরিয়াল" />
        <link rel="canonical" href="https://www.yourmedicrackwebsite.com/qbank" />
      </Helmet>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-4">
            মেডিক্র্যাক প্রশ্নব্যাংকসমূহ
          </h1>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mx-auto rounded-full"></div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-900 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 animate-pulse">মেডিক্র্যাক প্রশ্নব্যাংক লোড হচ্ছে...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-lg">
            <p className="text-red-700 dark:text-red-300 text-lg">মেডিক্র্যাক প্রশ্নব্যাংক আনতে সমস্যা: {error}</p>
          </div>
        ) : qbanks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {qbanks.map((qbank) => (
                <div 
                  key={qbank.id} 
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700 transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl dark:hover:shadow-emerald-500/10 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={qbank.imageUrl || `https://placehold.co/600x300/F0F4F8/3B82F6?text=${qbank.name.replace(/\s/g, '+')}`}
                      alt={qbank.name}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => { 
                        e.target.onerror = null; 
                        e.target.src = `https://placehold.co/600x300/F0F4F8/3B82F6?text=${qbank.name.replace(/\s/g, '+')}`; 
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-3 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {qbank.name}
                    </h2>
                    
                    <p 
                      className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed" 
                      dangerouslySetInnerHTML={{ 
                        __html: escapeHtml(qbank.description).replace(/\n/g, '<br/>') 
                      }}
                    ></p>
                    
                    <div className="flex items-center justify-between mb-5 pb-5 border-b border-gray-200 dark:border-gray-700">
                      {qbank.price === 0 ? (
                        <div className="flex items-center">
                          <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm rounded-full">
                            ফ্রি
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col">
                          <div className="flex items-baseline gap-2">
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                              ৳{qbank.price}
                            </span>
                            {qbank.overPriceAvailable && qbank.overPrice && (
                              <span className="text-gray-500 dark:text-gray-500 line-through text-sm">
                                ৳{qbank.overPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                        <span className="text-sm font-medium">{qbank.totalBuy || 0}</span>
                      </div>
                    </div>

                    {qbank.price === 0 ? (
                      <button
                        onClick={() => handleReadClick(qbank.id, qbank.name)}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        পড়ুন
                      </button>
                    ) : (
                      <button
                        onClick={() => handleViewDetailsClick(qbank.name, qbank.description)}
                        className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-500 dark:hover:from-indigo-600 dark:hover:to-purple-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                      >
                        বিস্তারিত দেখুন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
                >
                  পূর্ববর্তী
                </button>
                
                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all duration-200 ${
                        currentPage === index + 1
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white shadow-lg scale-110'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-5 py-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm hover:shadow"
                >
                  পরবর্তী
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-gray-700">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-lg text-gray-600 dark:text-gray-400">কোনো প্রশ্নব্যাংক পাওয়া যায়নি।</p>
            </div>
          </div>
        )}

        {/* Modals */}
        {showSubjectsModal && (
          <QBanksSubjectsModal
            qbankId={selectedQBankId}
            qbankName={selectedQBankName}
            onClose={handleCloseSubjectsModal}
          />
        )}

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