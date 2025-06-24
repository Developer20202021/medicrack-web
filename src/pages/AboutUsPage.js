import React from 'react';
import { Target, Eye, Handshake, Lightbulb, DollarSign, Trophy, Users } from 'lucide-react'; // DollarSign এবং Trophy আইকন ইম্পোর্ট করা হয়েছে

/**
 * Medicrack এর 'আমাদের সম্পর্কে' পেজ কম্পোনেন্ট।
 * এই পেজটি Medicrack এর লক্ষ্য, ভিশন, মূল্যবোধ এবং দল সম্পর্কে তথ্য প্রদান করে।
 */
const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 lg:p-10 border border-gray-100 mt-8">

        {/* Hero Section for About Us */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-800 mb-6 leading-tight">
            মেডিক্র্যাক: আপনার সাফল্যের গল্প বুনতে আমরা প্রতিজ্ঞাবদ্ধ
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            আমরা মেডিকেল ভর্তি পরীক্ষার প্রস্তুতির জন্য একটি নির্ভরযোগ্য প্ল্যাটফর্ম তৈরি করেছি, যেখানে মানসম্মত শিক্ষা সকলের জন্য সহজলভ্য।
          </p>
        </section>

        {/* Mission and Vision Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-8 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
            <Target size={60} className="mb-4 text-white" />
            <h2 className="text-3xl font-bold mb-3">আমাদের লক্ষ্য</h2>
            <p className="text-lg opacity-90">
              মেডিকেল ভর্তিচ্ছু শিক্ষার্থীদের জন্য সবচেয়ে কার্যকর এবং সাশ্রয়ী অনলাইন প্রস্তুতি প্রদান করা, যাতে তারা তাদের ডাক্তার হওয়ার স্বপ্ন পূরণ করতে পারে।
            </p>
          </div>
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white p-8 rounded-xl shadow-md flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
            <Eye size={60} className="mb-4 text-white" />
            <h2 className="text-3xl font-bold mb-3">আমাদের ভিশন</h2>
            <p className="text-lg opacity-90">
              একটি শক্তিশালী শিক্ষামূলক ইকোসিস্টেম তৈরি করা যেখানে প্রতিটি শিক্ষার্থী তাদের পূর্ণ সম্ভাবনা উপলব্ধি করতে পারে এবং দেশের স্বাস্থ্যসেবা খাতে অবদান রাখতে পারে।
            </p>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10 border-b-4 border-blue-500 pb-4 inline-block mx-auto">
            আমাদের মূল্যবোধ
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center transition duration-300 hover:shadow-md">
              <Handshake size={40} className="text-green-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">মানসম্মত শিক্ষা</h3>
              <p className="text-gray-600 text-base">আমরা সর্বদা সেরা মানের শিক্ষাদান নিশ্চিত করি।</p>
            </div>
            {/* Value 2 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center transition duration-300 hover:shadow-md">
              <DollarSign size={40} className="text-red-600 mb-3" /> {/* DollarSign কম্পোনেন্ট হিসেবে ব্যবহার করা হয়েছে */}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">সাশ্রয়ী মূল্য</h3>
              <p className="text-gray-600 text-base">সকলের জন্য সুলভ মূল্যে শিক্ষা পৌঁছে দেওয়া।</p>
            </div>
            {/* Value 3 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center transition duration-300 hover:shadow-md">
              <Lightbulb size={40} className="text-yellow-600 mb-3" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">উদ্ভাবনী পদ্ধতি</h3>
              <p className="text-gray-600 text-base">আধুনিক ও কার্যকর শিক্ষাদান পদ্ধতি ব্যবহার করি।</p>
            </div>
            {/* Value 4 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center transition duration-300 hover:shadow-md">
              {/* Note: If you want to use the Heart icon, you need to import it from 'lucide-react' */}
              {/* <Heart size={40} className="text-pink-600 mb-3" /> */}
              <img src="https://placehold.co/40x40/FF69B4/FFFFFF?text=❤" alt="Heart Icon" className="mb-3" /> {/* Using placeholder for Heart icon as it was not imported previously */}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">শিক্ষার্থী-কেন্দ্রিকতা</h3>
              <p className="text-gray-600 text-base">শিক্ষার্থীদের চাহিদা ও সফলতাকে প্রাধান্য দেই।</p>
            </div>
            {/* Value 5 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center text-center transition duration-300 hover:shadow-md">
              <Trophy size={40} className="text-purple-600 mb-3" /> {/* Trophy কম্পোনেন্ট হিসেবে ব্যবহার করা হয়েছে */}
              <h3 className="text-xl font-semibold text-gray-700 mb-2">শ্রেষ্ঠত্বের সাধনা</h3>
              <p className="text-gray-600 text-base">আমরা শেখার এবং শেখানোর উভয় ক্ষেত্রেই শ্রেষ্ঠত্বের সাধনা করি।</p>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 mb-10 border-b-4 border-emerald-500 pb-4 inline-block mx-auto">
            আমাদের দল
          </h2>
          <p className="text-center text-gray-600 text-lg mb-10 max-w-3xl mx-auto">
            আমাদের অভিজ্ঞ এবং নিবেদিত দল Medicrack-কে সফল করতে অক্লান্ত পরিশ্রম করে যাচ্ছে।
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://res.cloudinary.com/dc6tqkgdm/image/upload/v1747448074/04_2_bdb672.jpg"
                alt="প্রতিষ্ঠাতা"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">মাহাদী হাসান</h3>
              <p className="text-emerald-600 text-md mb-2">প্রতিষ্ঠাতা ও সিইও</p>
              <p className="text-gray-600 text-sm">এমবিবিএস দিনাজপুর মেডিকেল কলেজ। মেডিকেল শিক্ষায় ৫ বছরের বেশি অভিজ্ঞতা নিয়ে Medicrack প্রতিষ্ঠা করেছেন।</p>
            </div>
            {/* Team Member 2 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://placehold.co/150x150/A3A3A3/FFFFFF?text=CTO"
                alt="CTO"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">আসলাম হোসেন</h3>
              <p className="text-emerald-600 text-md mb-2">প্রধান প্রযুক্তি কর্মকর্তা (CTO)</p>
              <p className="text-gray-600 text-sm">CSE RUET আমাদের প্ল্যাটফর্মের প্রযুক্তিগত দিকগুলি তত্ত্বাবধান করেন।</p>
            </div>
            {/* Team Member 3 */}
            <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://placehold.co/150x150/A3A3A3/FFFFFF?text=CMO"
                alt="শিক্ষা প্রধান"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">মুশফিক অহন</h3>
              <p className="text-emerald-600 text-md mb-2">শিক্ষা প্রধান এবং CMO</p>
              <p className="text-gray-600 text-sm">EEE AUST কোর্স কারিকুলাম ডিজাইন ও মান নিয়ন্ত্রণের দায়িত্বে আছেন।</p>
            </div>

        <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://placehold.co/150x150/A3A3A3/FFFFFF?text=MAA"
                alt="শিক্ষা প্রধান"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">রাফায়েতুল হউক রওনক</h3>
              <p className="text-emerald-600 text-md mb-2">Medical Admission Advisor</p>
              <p className="text-gray-600 text-sm">MBBS RCMC শিক্ষার্থীদের পড়াশোনা, মানসিক চাপ মোকাবিলা করে থাকেন</p>
            </div>

        
        <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://placehold.co/150x150/A3A3A3/FFFFFF?text=শিক্ষা+প্রধান"
                alt="শিক্ষা প্রধান"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">সুরাইয়া আক্তার</h3>
              <p className="text-emerald-600 text-md mb-2">Student Relations Manager</p>
              <p className="text-gray-600 text-sm">Accounting NU শিক্ষার্থীদের অভিযোগ শোনা, তাদের সমস্যা সমাধান করে থাকেন।</p>
            </div>


        
        <div className="bg-gray-100 p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center text-center transform transition duration-300 hover:scale-105">
              <img
                src="https://placehold.co/150x150/A3A3A3/FFFFFF?text=শিক্ষা+প্রধান"
                alt="শিক্ষা প্রধান"
                className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-400 shadow-md"
              />
              <h3 className="text-xl font-semibold text-gray-800">শাকিল হাসান</h3>
              <p className="text-emerald-600 text-md mb-2">Chief Operating Officer (COO)</p>
              <p className="text-gray-600 text-sm">Mathematics NU দৈনন্দিন কার্যক্রম,আর্থিক ব্যবস্থাপনা,ব্যয়ের হিসাব করে থাকেন।</p>
            </div>


          </div>

        </section>

      </div>
    </div>
  );
};

export default AboutUsPage;
