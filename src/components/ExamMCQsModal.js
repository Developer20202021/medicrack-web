// frontend/src/components/ExamMCQsModal.js
import React, { useState, useEffect } from 'react';
import { getMainExamMCQs } from '../api';
import { X } from 'lucide-react';
import { InlineMath, BlockMath } from 'react-katex'; // KaTeX কম্পোনেন্ট
import 'katex/dist/katex.min.css'; // KaTeX এর CSS ইম্পোর্ট

const ExamMCQsModal = ({ examId, onClose }) => {
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMCQs = async () => {
      setLoading(true);
      try {
        const data = await getMainExamMCQs(examId);
        setMcqs(data.mcqs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchMCQs();
    }
  }, [examId]);

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

  // LaTeX এবং সাধারণ টেক্সট রেন্ডার করার জন্য নতুন হেল্পার ফাংশন
  const renderLatex = (text) => {
    if (!text) return null;

    // LaTeX ব্লক এবং সাধারণ টেক্সট আলাদা করার জন্য রেজেক্স
    const parts = text.split(/(\$\$[\s\S]*?\*\*)/g); // $$...** প্যাটার্ন দিয়ে স্প্লিট করা হয়েছে

    return parts.map((part, i) => {
      if (part.startsWith('$$') && part.endsWith('**')) {
        // LaTeX কোড থেকে $$ এবং ** সরান
        const latexCode = part.substring(2, part.length - 2).trim();
        // এটি ব্লক ম্যাথ (BlockMath) হিসেবে রেন্ডার হবে যদি LaTeX কোড একাধিক লাইন বা ডিসপ্লে স্টাইলে থাকে
        // অন্যথায় InlineMath ব্যবহার করতে পারেন। এখানে সরলতার জন্য BlockMath ব্যবহার করা হয়েছে।
        return <BlockMath key={i} math={latexCode} />;
      } else {
        // সাধারণ HTML টেক্সট এস্কেপ করে রেন্ডার করুন
        return <span key={i} dangerouslySetInnerHTML={{ __html: escapeHtml(part).replace(/\n/g, '<br/>') }}></span>;
      }
    });
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
          MCQ সমূহ
        </h3>

        {loading ? (
          <p className="text-center text-lg text-gray-600">MCQ লোড হচ্ছে...</p>
        ) : error ? (
          <p className="text-center text-lg text-red-500">MCQ আনতে সমস্যা: {error}</p>
        ) : mcqs.length > 0 ? (
          <div className="space-y-8">
            {mcqs.map((mcq, index) => (
              <div key={mcq.MCQID || index} className="bg-gray-50 p-6 rounded-lg shadow-md border border-gray-200">
                <p className="font-semibold text-lg text-gray-800 mb-3">
                  {index + 1}. {renderLatex(mcq.question)} {/* এখানে renderLatex ব্যবহার করা হয়েছে */}
                </p>
                {mcq.QuestionImageUrl && mcq.selectedQuestionImageUrl !== "No" && (
                  <img src={mcq.QuestionImageUrl} alt="Question" className="w-full h-auto max-h-60 object-contain mb-4 rounded-md" />
                )}
                <div className="space-y-2">
                  {mcq.options && mcq.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className={`p-3 rounded-md transition duration-200 ${
                        option === mcq.answer
                          ? 'bg-emerald-100 text-emerald-800 border-l-4 border-emerald-500 font-medium'
                          : 'bg-white text-gray-700 border border-gray-200'
                      }`}
                    >
                      {String.fromCharCode(65 + optIndex)}. {renderLatex(option)} {/* এখানেও renderLatex ব্যবহার করা হয়েছে */}
                    </div>
                  ))}
                </div>
                {(mcq.Description || mcq.DescriptionImageUrl) && (
                    <div className="mt-4 p-4 bg-yellow-50 rounded-md border border-yellow-200">
                        <p className="font-semibold text-yellow-800 mb-2">ব্যাখ্যা:</p>
                        {mcq.Description && mcq.Description !== "none" && (
                            <p className="text-gray-700 text-sm">{renderLatex(mcq.Description)}</p> 
                        )}
                        {mcq.DescriptionImageUrl && mcq.selectedDrescriptionImageUrl !== "No" && (
                            <img src={mcq.DescriptionImageUrl} alt="Description" className="w-full h-auto max-h-60 object-contain mt-3 rounded-md" />
                        )}
                    </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-lg text-gray-600">কোনো MCQ খুঁজে পাওয়া যায়নি।</p>
        )}

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

export default ExamMCQsModal;
