import React from 'react';
import { Target, Eye, Handshake, Lightbulb, DollarSign, Trophy, Users, Heart, Award, Sparkles } from 'lucide-react';

/**
 * Medicrack এর 'আমাদের সম্পর্কে' পেজ কম্পোনেন্ট।
 * এই পেজটি Medicrack এর লক্ষ্য, ভিশন, মূল্যবোধ এবং দল সম্পর্কে তথ্য প্রদান করে।
 */
const AboutUsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Inter'] py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-7xl mx-auto">

        {/* Hero Section */}
        <section className="text-center mb-16 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-500/50">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                মেডিক্র্যাক
              </span>
              : আপনার সাফল্যের গল্প বুনতে আমরা প্রতিজ্ঞাবদ্ধ
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              আমরা মেডিকেল ভর্তি পরীক্ষার প্রস্তুতির জন্য একটি নির্ভরযোগ্য প্ল্যাটফর্ম তৈরি করেছি, যেখানে মানসম্মত শিক্ষা সকলের জন্য সহজলভ্য।
            </p>
          </div>
        </section>

        {/* Mission and Vision Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {/* Mission Card */}
          <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 lg:p-10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-emerald-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-6 shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">আমাদের লক্ষ্য</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                মেডিকেল ভর্তিচ্ছু শিক্ষার্থীদের জন্য সবচেয়ে কার্যকর এবং সাশ্রয়ী অনলাইন প্রস্তুতি প্রদান করা, যাতে তারা তাদের ডাক্তার হওয়ার স্বপ্ন পূরণ করতে পারে।
              </p>
            </div>
          </div>

          {/* Vision Card */}
          <div className="group relative bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 lg:p-10 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-indigo-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-6 shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
                <Eye className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">আমাদের ভিশন</h2>
              <p className="text-lg text-gray-300 leading-relaxed">
                একটি শক্তিশালী শিক্ষামূলক ইকোসিস্টেম তৈরি করা যেখানে প্রতিটি শিক্ষার্থী তাদের পূর্ণ সম্ভাবনা উপলব্ধি করতে পারে এবং দেশের স্বাস্থ্যসেবা খাতে অবদান রাখতে পারে।
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 inline-block">
              আমাদের মূল্যবোধ
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Value 1 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:border-emerald-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <Handshake className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">মানসম্মত শিক্ষা</h3>
                <p className="text-gray-300 text-base leading-relaxed">আমরা সর্বদা সেরা মানের শিক্ষাদান নিশ্চিত করি।</p>
              </div>
            </div>

            {/* Value 2 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-red-500/20 transition-all duration-300 hover:scale-105 hover:border-red-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-red-500/50 transition-all duration-300">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">সাশ্রয়ী মূল্য</h3>
                <p className="text-gray-300 text-base leading-relaxed">সকলের জন্য সুলভ মূল্যে শিক্ষা পৌঁছে দেওয়া।</p>
              </div>
            </div>

            {/* Value 3 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 hover:scale-105 hover:border-yellow-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-yellow-500/50 transition-all duration-300">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">উদ্ভাবনী পদ্ধতি</h3>
                <p className="text-gray-300 text-base leading-relaxed">আধুনিক ও কার্যকর শিক্ষাদান পদ্ধতি ব্যবহার করি।</p>
              </div>
            </div>

            {/* Value 4 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-pink-500/20 transition-all duration-300 hover:scale-105 hover:border-pink-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-pink-500/50 transition-all duration-300">
                  <Heart className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">শিক্ষার্থী-কেন্দ্রিকতা</h3>
                <p className="text-gray-300 text-base leading-relaxed">শিক্ষার্থীদের চাহিদা ও সফলতাকে প্রাধান্য দেই।</p>
              </div>
            </div>

            {/* Value 5 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-xl shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">শ্রেষ্ঠত্বের সাধনা</h3>
                <p className="text-gray-300 text-base leading-relaxed">আমরা শেখার এবং শেখানোর উভয় ক্ষেত্রেই শ্রেষ্ঠত্বের সাধনা করি।</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team Section */}
        <section>
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-4 shadow-lg shadow-emerald-500/50">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              আমাদের দল
            </h2>
            <div className="h-1 w-32 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full mb-6"></div>
            <p className="text-center text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              আমাদের অভিজ্ঞ এবং নিবেদিত দল Medicrack-কে সফল করতে অক্লান্ত পরিশ্রম করে যাচ্ছে।
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Team Member 1 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:border-emerald-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://res.cloudinary.com/dc6tqkgdm/image/upload/v1747448074/04_2_bdb672.jpg"
                    alt="প্রতিষ্ঠাতা"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-emerald-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">মাহাদী হাসান</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-emerald-400 mr-1" />
                  <p className="text-emerald-400 text-sm font-medium">প্রতিষ্ঠাতা ও সিইও</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">এমবিবিএস দিনাজপুর মেডিকেল কলেজ। মেডিকেল শিক্ষায় ৫ বছরের বেশি অভিজ্ঞতা নিয়ে Medicrack প্রতিষ্ঠা করেছেন।</p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:scale-105 hover:border-blue-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://placehold.co/150x150/3B82F6/FFFFFF?text=CTO"
                    alt="CTO"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">আসলাম হোসেন</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-indigo-500/20 border border-blue-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-blue-400 mr-1" />
                  <p className="text-blue-400 text-sm font-medium">CTO</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">CSE RUET আমাদের প্ল্যাটফর্মের প্রযুক্তিগত দিকগুলি তত্ত্বাবধান করেন।</p>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105 hover:border-purple-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://placehold.co/150x150/A855F7/FFFFFF?text=CMO"
                    alt="CMO"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-purple-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">মুশফিক অহন</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-purple-400 mr-1" />
                  <p className="text-purple-400 text-sm font-medium">শিক্ষা প্রধান ও CMO</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">EEE AUST কোর্স কারিকুলাম ডিজাইন ও মান নিয়ন্ত্রণের দায়িত্বে আছেন।</p>
              </div>
            </div>

            {/* Team Member 4 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-teal-500/20 transition-all duration-300 hover:scale-105 hover:border-teal-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://placehold.co/150x150/14B8A6/FFFFFF?text=MAA"
                    alt="Medical Advisor"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">রাফায়েতুল হউক রওনক</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-teal-400 mr-1" />
                  <p className="text-teal-400 text-sm font-medium">Medical Admission Advisor</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">MBBS RCMC শিক্ষার্থীদের পড়াশোনা, মানসিক চাপ মোকাবিলা করে থাকেন</p>
              </div>
            </div>

            {/* Team Member 5 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-rose-500/20 transition-all duration-300 hover:scale-105 hover:border-rose-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-rose-500 to-pink-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://placehold.co/150x150/F43F5E/FFFFFF?text=SRM"
                    alt="Relations Manager"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-rose-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">সুরাইয়া আক্তার</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-rose-500/20 to-pink-500/20 border border-rose-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-rose-400 mr-1" />
                  <p className="text-rose-400 text-sm font-medium">Student Relations Manager</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">Accounting NU শিক্ষার্থীদের অভিযোগ শোনা, তাদের সমস্যা সমাধান করে থাকেন।</p>
              </div>
            </div>

            {/* Team Member 6 */}
            <div className="group bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 rounded-2xl shadow-xl hover:shadow-amber-500/20 transition-all duration-300 hover:scale-105 hover:border-amber-500/50">
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full blur-md opacity-50 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <img
                    src="https://placehold.co/150x150/F59E0B/FFFFFF?text=COO"
                    alt="COO"
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-amber-500 shadow-lg"
                  />
                </div>
                <h3 className="text-xl font-semibold text-white mb-1">শাকিল হাসান</h3>
                <div className="inline-flex items-center bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 px-3 py-1 rounded-full mb-3">
                  <Award className="w-4 h-4 text-amber-400 mr-1" />
                  <p className="text-amber-400 text-sm font-medium">Chief Operating Officer (COO)</p>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">Mathematics NU দৈনন্দিন কার্যক্রম,আর্থিক ব্যবস্থাপনা,ব্যয়ের হিসাব করে থাকেন।</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutUsPage;