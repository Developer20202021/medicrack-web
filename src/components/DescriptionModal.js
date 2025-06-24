// frontend/src/components/DescriptionModal.js
import React from 'react';
import { X } from 'lucide-react';

const DescriptionModal = ({ title, description, onClose }) => {
  // HTML এস্কেপ করার জন্য হেল্পার ফাংশন
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
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 transition duration-200"
          aria-label="বন্ধ করুন"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center border-b pb-4">
          {title} - বিস্তারিত
        </h3>

        <div className="prose max-w-none"> {/* Tailwind এর 'prose' ক্লাস ব্যবহার করতে পারেন যদি আপনার tailwind.config.js এ @tailwindcss/typography প্লাগইন যোগ করা থাকে */}
          <p className="text-gray-700 leading-relaxed" 
             dangerouslySetInnerHTML={{ __html: escapeHtml(description).replace(/\n/g, '<br/>') }}>
          </p>
        </div>

        <div className="flex justify-center mt-8">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition duration-300"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionModal;
