import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';

/**
 * FAQ (Frequently Asked Questions) পেজ কম্পোনেন্ট।
 * ব্যবহারকারীরা প্রশ্নগুলিতে ক্লিক করে উত্তর দেখতে বা লুকাতে পারবে।
 */
const FAQPage = () => {
  // একটি স্টেট যা বর্তমানে খোলা থাকা FAQ আইটেমের ইনডেক্স রাখে।
  // null মানে কোনো আইটেম খোলা নেই।
  const [openIndex, setOpenIndex] = useState(null);

  // FAQ প্রশ্ন এবং উত্তরগুলির ডেটা।
  const faqData = [
    {
      question: "মেডিক্র্যাক কী?",
      answer: "মেডিক্র্যাক এমন একটি অনলাইন প্ল্যাটফর্ম যা শিক্ষার্থীদের মেডিকেল ও ডেন্টাল কলেজে ভর্তি পরীক্ষার জন্য পূর্ণাঙ্গ প্রস্তুতি নিতে সাহায্য করে।"
    },
    {
      question: "মেডিক্র্যাকে কী কী কোর্স অফার করা হয়?",
      answer: "আমরা মেডিকেল ভর্তি পরীক্ষার জন্য জীববিজ্ঞান, রসায়ন, পদার্থবিজ্ঞান, ইংরেজি এবং সাধারণ জ্ঞান সহ সকল প্রয়োজনীয় বিষয়ের উপর কোর্স অফার করি।"
    },
    {
      question: "কোর্স ফি কত এবং কিভাবে পরিশোধ করব?",
      answer: "আমাদের কোর্স ফি খুবই সাশ্রয়ী। বিস্তারিত কোর্স ফি এবং পরিশোধের পদ্ধতি আমাদের 'কোর্সসমূহ' সেকশনে বা রেজিস্ট্রেশন প্রক্রিয়া চলাকালীন জানতে পারবেন।"
    },
    {
      question: "শিক্ষকরা কারা?",
      answer: "আমাদের শিক্ষকরা দেশের স্বনামধন্য মেডিকেল কলেজের প্রাক্তন শিক্ষার্থী এবং অভিজ্ঞ শিক্ষাবিদ, যারা মেডিকেল ভর্তি পরীক্ষার সিলেবাস সম্পর্কে গভীর জ্ঞান রাখেন।"
    },
    {
      question: "কোর্স ম্যাটেরিয়াল কিভাবে পাবো?",
      answer: "কোর্সের সাথে সম্পর্কিত সকল লেকচার শীট, অনুশীলন প্রশ্ন এবং মডেল টেস্ট অনলাইন পোর্টালে ডিজিটাল ফরম্যাটে উপলব্ধ থাকবে, যা আপনারা ডাউনলোড করে নিতে পারবেন।"
    },
    {
      question: "মক টেস্টের সুবিধা আছে কি?",
      answer: "হ্যাঁ, আমরা নিয়মিত মক টেস্টের আয়োজন করি। এই পরীক্ষাগুলির মাধ্যমে শিক্ষার্থীরা তাদের প্রস্তুতি যাচাই করতে পারবে এবং দুর্বলতা চিহ্নিত করে উন্নতির সুযোগ পাবে।"
    },
    {
      question: "মোবাইল থেকে মেডিক্র্যাক ব্যবহার করা যাবে কি?",
      answer: "হ্যাঁ, আমাদের প্ল্যাটফর্ম সম্পূর্ণরূপে মোবাইল-রেসপনসিভ। যেকোনো স্মার্টফোন বা ট্যাবলেট থেকে আপনারা ক্লাস করতে এবং পরীক্ষার অংশগ্রহণ করতে পারবেন।"
    },
    {
      question: "আমার প্রশ্ন থাকলে কিভাবে সাপোর্ট পাবো?",
      answer: "আপনার যেকোনো প্রশ্নের জন্য আমাদের ডেডিকেটেড সাপোর্ট টিম রয়েছে। ক্লাস চলাকালীন লাইভ চ্যাট, ইমেইল বা আমাদের সাপোর্ট নম্বরে যোগাযোগ করে সহায়তা নিতে পারবেন।"
    }
  ];

  // একটি FAQ আইটেমে ক্লিক করার জন্য হ্যান্ডলার।
  // এটি ক্লিক করা আইটেমটির উত্তর দেখাবে বা লুকাবে।
  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-4">
            সাধারণ জিজ্ঞাসা
          </h1>
          
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mx-auto rounded-full mb-4"></div>
          
          <p className="text-gray-600 dark:text-gray-500 text-lg max-w-2xl mx-auto">
            মেডিক্র্যাক সম্পর্কে আপনার সকল প্রশ্নের উত্তর এখানে পাবেন
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className="group bg-white dark:bg-slate-900 rounded-2xl shadow-md dark:shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all duration-300 hover:shadow-xl dark:hover:shadow-emerald-500/20 hover:-translate-y-1"
            >
              <button
                className="flex justify-between items-center w-full p-5 sm:p-6 text-left transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:ring-opacity-50 rounded-2xl"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index ? "true" : "false"}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white pr-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                  {item.question}
                </span>
                
                <div className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300 ${
                  openIndex === index 
                    ? 'bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 shadow-lg' 
                    : 'bg-gray-100 dark:bg-slate-800 group-hover:bg-gray-200 dark:group-hover:bg-slate-700'
                }`}>
                  {openIndex === index ? (
                    <Minus size={20} className="text-white" />
                  ) : (
                    <Plus size={20} className="text-gray-600 dark:text-gray-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors" />
                  )}
                </div>
              </button>
              
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="px-5 sm:px-6 pb-5 sm:pb-6 pt-2 border-t border-gray-100 dark:border-slate-800 animate-fade-in"
                >
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-xl p-4 sm:p-5 border dark:border-slate-700">
                    <p className="text-gray-700 dark:text-gray-400 leading-relaxed text-sm sm:text-base">
                      {item.answer}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA Section */}
        <div className="mt-12 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 rounded-2xl p-8 text-center shadow-xl">
          <h3 className="text-2xl font-bold text-white mb-3">
            আরও প্রশ্ন আছে?
          </h3>
          <p className="text-emerald-50 dark:text-white/90 mb-6">
            আমাদের সাপোর্ট টিম সবসময় আপনাকে সাহায্য করতে প্রস্তুত
          </p>
          <button className="bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 border dark:border-slate-700">
            যোগাযোগ করুন
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FAQPage;