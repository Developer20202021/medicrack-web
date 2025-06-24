import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react'; // Plus এবং Minus আইকন ইম্পোর্ট করা হয়েছে

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
    <div className="min-h-screen bg-gray-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100 mt-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-gray-800 mb-10 border-b-4 border-emerald-500 pb-4 inline-block mx-auto">
          সাধারণ জিজ্ঞাসা (FAQ)
        </h1>

        <div className="space-y-6">
          {faqData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
              <button
                className="flex justify-between items-center w-full p-4 sm:p-5 text-left bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 rounded-lg"
                onClick={() => toggleFAQ(index)}
                aria-expanded={openIndex === index ? "true" : "false"}
                aria-controls={`faq-answer-${index}`}
              >
                <span className="text-lg font-semibold text-gray-800">{item.question}</span>
                {openIndex === index ? (
                  <Minus size={24} className="text-emerald-600" />
                ) : (
                  <Plus size={24} className="text-gray-600" />
                )}
              </button>
              {openIndex === index && (
                <div
                  id={`faq-answer-${index}`}
                  className="p-4 sm:p-5 border-t border-gray-200 bg-white text-gray-700 leading-relaxed animate-fade-in"
                >
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
