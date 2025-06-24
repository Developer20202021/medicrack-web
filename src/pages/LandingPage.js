import React, { useRef, useState, useEffect } from 'react';
import { BookText, GraduationCap, DollarSign, Lightbulb, Trophy, ChevronLeft, ChevronRight, X } from 'lucide-react'; // X icon for close button
import { getTeachers, getCourses } from '../api';

const LandingPage = () => {
  // স্ক্রলযোগ্য কন্টেইনারগুলির জন্য রেফ
  const teachersScrollRef = useRef(null);
  const testimonialsScrollRef = useRef(null);

  // হোভারের উপর অ্যানিমেশন থামানোর জন্য স্টেট
  const [isTeachersPaused, setIsTeachersPaused] = useState(false);
  const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

  // শিক্ষকদের ডেটার জন্য স্টেট
  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState(null);

  // কোর্সের ডেটার জন্য স্টেট
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  // কোর্সের বিস্তারিত পপ-আপের জন্য নতুন স্টেট
  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null); // যে কোর্সটির বিস্তারিত দেখা হবে

  useEffect(() => {
    const fetchTeachersData = async () => {
      try {
        const data = await getTeachers();
        setTeachers(data);
      } catch (err) {
        setTeachersError(err.message);
      } finally {
        setTeachersLoading(false);
      }
    };

    const fetchCoursesData = async () => {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        setCoursesError(err.message);
      } finally {
        setCoursesLoading(false);
      }
    };

    fetchTeachersData();
    fetchCoursesData();
  }, []); // খালি ডিপেন্ডেন্সি অ্যারে মানে এটি মাউন্ট হওয়ার পর একবারই চলবে

  // ম্যানুয়াল স্ক্রল ফাংশন
  const scroll = (ref, direction) => {
    if (ref.current) {
      // প্রথম চাইল্ডের প্রস্থ + গ্যাপের (teachers এর জন্য w-80, testimonials এর জন্য w-96, space-x-12 = 48px) উপর ভিত্তি করে স্ক্রল অ্যামাউন্ট হিসাব করুন
      const scrollAmount = ref.current.children[0] ? ref.current.children[0].offsetWidth + 48 : 0; // চাইল্ড আছে কিনা তা চেক করুন
      ref.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

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

  // বিস্তারিত বাটন ক্লিক হ্যান্ডলার
  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowCourseDetailsModal(true);
  };

  // মডাল বন্ধ করার হ্যান্ডলার
  const handleCloseModal = () => {
    setShowCourseDetailsModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Inter']">
      {/* হিরো সেকশন */}
      <section className="relative h-[600px] flex items-center justify-center text-center text-white bg-cover bg-center rounded-b-2xl shadow-lg mx-4 md:mx-auto md:max-w-7xl"
        style={{
          backgroundImage: "url('https://placehold.co/1920x800/0A3D62/FFFFFF?text=Medicrack+Success+Dream')",
          backgroundColor: '#0A3D62', // ফলব্যাক ব্যাকগ্রাউন্ড কালার
        }}>
        <div className="absolute inset-0 bg-black opacity-60 rounded-b-2xl"></div> {/* টেক্সট ভালোভাবে পড়ার জন্য ওভারলে */}
        <div className="relative z-10 p-8 max-w-4xl mx-auto rounded-xl shadow-2xl bg-opacity-80 backdrop-blur-sm transform transition-all duration-500 ease-in-out hover:scale-105">
          <h1 className="text-4xl text-white md:text-6xl font-extrabold mb-4 leading-tight drop-shadow-lg">মেডিক্র্যাক আপনার ডাক্তার হওয়ার স্বপ্নের প্রথম ধাপ</h1>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            মেডিকেল ভর্তি পরীক্ষার সেরা প্রস্তুতি, সেরা শিক্ষায়তনিকদের সাথে, <br className="hidden md:block"/>
            খুবই কম খরচে আপনার হাতের নাগালে।
          </p>

        </div>
      </section>

      {/* মেডিক্র্যাক সম্পর্কে সেকশন (এখানে কোন পরিবর্তন নেই) */}
      <section className="py-16 bg-white shadow-inner mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl">
        <div className="container mx-auto px-6 lg:px-8 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 border-l-4 border-emerald-500 pl-4">মেডিক্র্যাক সম্পর্কে</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-4">
              মেডিক্র্যাক এমন একটি প্রতিষ্ঠান যা এইচএসসি পাশ করা শিক্ষার্থীদের মেডিকেল কলেজে ভর্তির স্বপ্ন পূরণে সহায়তা করে।
              আমরা বিশ্বাস করি, মানসম্মত শিক্ষা সকলের জন্য সহজলভ্য হওয়া উচিত।
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              এই কারণেই আমরা অত্যন্ত কম কোর্স ফি নির্ধারণ করেছি, যেনো বাংলাদেশের সকল প্রান্তের শিক্ষার্থীরা
              আমাদের সার্ভিস থেকে উপকৃত হতে পারে। আমাদের লক্ষ্য আপনাদের স্বপ্নকে বাস্তবে রূপ দেওয়া।
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <img
              src="https://res.cloudinary.com/dc6tqkgdm/image/upload/v1750622984/Gemini_Generated_Image_p1g47xp1g47xp1g4_bfjnaw.png" // এখানে নতুন ছবির URL যোগ করা হয়েছে
              alt="Medical Student with Apron"
              className="rounded-xl shadow-lg w-full max-w-lg object-cover transform transition duration-300 hover:scale-105"
            />
          </div>
        </div>
      </section>

      {/* কেন আমাদের বেছে নেবেন সেকশন (এখানে কোন পরিবর্তন নেই) */}
      <section className="py-16 bg-gray-100 mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">কেন মেডিক্র্যাক বেছে নেবেন?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* ফিচার ১ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <GraduationCap size={48} className="text-blue-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">অভিজ্ঞ শিক্ষক মণ্ডলী</h3>
              <p className="text-gray-600 text-center text-base">দেশের সেরা মেডিকেল কলেজের প্রাক্তন শিক্ষার্থী এবং অভিজ্ঞ শিক্ষকরা ক্লাস নিবেন।</p>
            </div>
            {/* ফিচার ২ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <BookText size={48} className="text-green-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">সম্পূর্ণ স্টাডি ম্যাটেরিয়াল</h3>
              <p className="text-gray-600 text-center text-base">মেডিকেল ভর্তির জন্য প্রয়োজনীয় সকল লেকচার শীট, বই, ও মডেল টেস্ট সরবরাহ করা হবে।</p>
            </div>
            {/* ফিচার ৩ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <Lightbulb size={48} className="text-yellow-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">নিয়মিত মক টেস্ট</h3>
              <p className="text-gray-600 text-center text-base">নিয়মিত পরীক্ষা ও মডেল টেস্টের মাধ্যমে নিজেকে যাচাই করার সুযোগ।</p>
            </div>
            {/* ফিচার ৪ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <DollarSign size={48} className="text-red-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">সাশ্রয়ী কোর্স ফি</h3>
              <p className="text-gray-600 text-center text-base">সকল ছাত্রছাত্রীর সামর্থ্যের মধ্যে মানসম্মত প্রস্তুতির সুযোগ।</p>
            </div>
            {/* ফিচার ৫ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <Trophy size={48} className="text-purple-500 mb-4" />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">ব্যক্তিগত দিকনির্দেশনা</h3>
              <p className="text-gray-600 text-center text-base">শিক্ষার্থীদের ব্যক্তিগত দুর্বলতা চিহ্নিত করে বিশেষ দিকনির্দেশনা দেওয়া হবে।</p>
            </div>
            {/* ফিচার ৬ */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2 flex flex-col items-center border border-gray-200">
              <img
                src="https://placehold.co/48x48/6B7280/FFFFFF?text=🎯"
                alt="লক্ষ্য আইকন"
                className="mb-4"
              />
              <h3 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">সর্বোচ্চ সাফল্যের হার</h3>
              <p className="text-gray-600 text-center text-base">আমাদের শিক্ষার্থীদের সফলতার হার সর্বোচ্চ, যা আমাদের গর্ব।</p>
            </div>
          </div>
        </div>
      </section>

      {/* আমাদের শিক্ষক মণ্ডলী সেকশন (ডাইনামিক ডেটা সহ) */}
      <section className="py-16 bg-white mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl shadow-lg">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 border-l-4 border-emerald-500 pl-4 inline-block">আমাদের শিক্ষক মণ্ডলী</h2>
          {teachersLoading ? (
            <p>শিক্ষকদের তথ্য লোড হচ্ছে...</p>
          ) : teachersError ? (
            <p className="text-red-500">শিক্ষকদের তথ্য আনতে সমস্যা: {teachersError}</p>
          ) : teachers.length > 0 ? (
            <div className="relative w-full py-4">
              <div
                ref={teachersScrollRef}
                className="flex overflow-x-hidden hide-scrollbar snap-x snap-mandatory pb-4"
              >
                <div
                  className={`inline-flex flex-nowrap space-x-12 ${isTeachersPaused ? 'paused' : 'animate-scroll-teachers-css'}`}
                  onMouseEnter={() => setIsTeachersPaused(true)}
                  onMouseLeave={() => setIsTeachersPaused(false)}
                  style={{ width: 'max-content' }}
                >
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      {teachers.map(teacher => (
                        <div key={teacher.id + '-' + i} className="flex-none w-80 flex flex-col items-center p-6 bg-gray-50 rounded-xl shadow-md snap-center hover:shadow-xl transition duration-300 transform hover:-translate-y-1">
                          <img src={teacher.imageUrl || `https://placehold.co/150x150/0A3D62/FFFFFF?text=শিক্ষক`} alt={teacher.name} className="w-36 h-36 rounded-full object-cover mb-4 border-4 border-emerald-400 shadow-md" />
                          <h3 className="text-xl font-semibold text-gray-800">{teacher.name}</h3>
                          <p className="text-emerald-600 text-sm mb-2">{(teacher.bio || '').split('(')[0].trim()}</p>
                          <p className="text-gray-600 text-center text-sm">{teacher.bio}</p>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
                <button
                  onClick={() => scroll(teachersScrollRef, -1)}
                  className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-100 transition focus:outline-none focus:ring-2 focus:ring-gray-600 z-10"
                  aria-label="পূর্ববর্তী শিক্ষক"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={() => scroll(teachersScrollRef, 1)}
                  className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-100 transition focus:outline-none focus:ring-2 focus:ring-gray-600 z-10"
                  aria-label="পরবর্তী শিক্ষক"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          ) : (
            <p>কোনো শিক্ষক পাওয়া যায়নি।</p>
          )}
        </div>
      </section>

      {/* কোর্স সেকশন (ডাইনামিক ডেটা সহ) */}
      <section className="py-16 bg-gray-100 mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl shadow-lg">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 border-l-4 border-emerald-500 pl-4 inline-block">আমাদের কোর্সসমূহ</h2>
          {coursesLoading ? (
            <p>কোর্স লোড হচ্ছে...</p>
          ) : coursesError ? (
            <p className="text-red-500">কোর্স আনতে সমস্যা: {coursesError}</p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {courses.map(course => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition duration-300 hover:scale-105">
                  <img
                    src={course.CourseImageUrl || `https://placehold.co/600x300/9CA3AF/FFFFFF?text=${course.CourseName.replace(/\s/g, '+')}`}
                    alt={course.CourseName}
                    className="w-full h-48 object-cover"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/600x300/9CA3AF/FFFFFF?text=${course.CourseName.replace(/\s/g, '+')}`; }}
                  />
                  <div className="p-6 text-left">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{course.CourseName}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{course.CourseDescription}</p>
                    <div className="flex items-center justify-between mb-4">
                      {course.CoursePrice && course.CoursePrice !== "0" ? (
                        <p className="text-emerald-600 font-bold text-lg">
                          ৳{course.CoursePrice}
                          {course.OverPriceAvailable && course.CourseOverPrice && (
                            <span className="text-gray-500 line-through ml-2">৳{course.CourseOverPrice}</span>
                          )}
                        </p>
                      ) : (
                        <p className="text-emerald-600 font-bold text-lg">ফ্রি</p>
                      )}
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">{course.CourseCategory}</span>
                    </div>
                    {/* বিস্তারিত দেখার জন্য বাটন */}
                    <button
                      onClick={() => handleViewDetails(course)}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-md shadow-md transition duration-300 transform hover:scale-105"
                    >
                      বিস্তারিত দেখুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>কোনো কোর্স পাওয়া যায়নি।</p>
          )}
          {/* <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 mt-10">
            বিস্তারিত কোর্স দেখুন
          </button> */}
        </div>
      </section>

      {/* শিক্ষার্থীদের অভিজ্ঞতা সেকশন */}
      <section className="py-16 bg-white mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl shadow-lg">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12 border-l-4 border-emerald-500 pl-4 inline-block">শিক্ষার্থীদের অভিজ্ঞতা</h2>
          <div className="relative w-full py-4">
            <div
              ref={testimonialsScrollRef}
              className="flex overflow-x-hidden hide-scrollbar snap-x snap-mandatory pb-4"
            >
              <div
                className={`inline-flex flex-nowrap space-x-12 ${isTestimonialsPaused ? 'paused' : 'animate-scroll-testimonials-css'}`}
                onMouseEnter={() => setIsTestimonialsPaused(true)}
                onMouseLeave={() => setIsTestimonialsPaused(false)}
                style={{ width: 'max-content' }}
              >
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    {/* প্রশংসাপত্র ১ */}
                    <div className="flex-none w-96 p-6 bg-gray-50 rounded-xl shadow-md snap-center text-left border border-gray-200">
                      <p className="text-gray-700 italic mb-4">"মেডিক্র্যাকের ক্লাসগুলো খুবই ইন্টারঅ্যাক্টিভ এবং শিক্ষকরা অনেক যত্ন নিয়ে পড়ান। এখানকার স্বল্প ফি সত্যিই প্রশংসনীয়।"</p>
                      <p className="font-semibold text-gray-800">- মারিয়া সুলতানা, শিক্ষার্থী</p>
                      <p className="text-gray-500 text-sm">২০২৪ ব্যাচ</p>
                    </div>
                    {/* প্রশংসাপত্র ২ */}
                    <div className="flex-none w-96 p-6 bg-gray-50 rounded-xl shadow-md snap-center text-left border border-gray-200">
                      <p className="text-gray-700 italic mb-4">"আমি ভাবতেও পারিনি এত কম খরচে এত ভালো মানের প্রস্তুতি নিতে পারব। মেডিক্র্যাক আমার স্বপ্ন পূরণের পথ খুলে দিয়েছে।"</p>
                      <p className="font-semibold text-gray-800">- ফাহিম আহমেদ, শিক্ষার্থী</p>
                      <p className="text-gray-500 text-sm">২০২৩ ব্যাচ</p>
                    </div>
                    {/* প্রশংসাপত্র ৩ */}
                    <div className="flex-none w-96 p-6 bg-gray-50 rounded-xl shadow-md snap-center text-left border border-gray-200">
                      <p className="text-gray-700 italic mb-4">"মেডিক্র্যাকের মক টেস্টগুলো আমাকে আমার দুর্বলতা বুঝতে সাহায্য করেছে এবং আমি দ্রুত উন্নতি করতে পেরেছি।"</p>
                      <p className="font-semibold text-gray-800">- সাবিহা আক্তার, শিক্ষার্থী</p>
                      <p className="text-gray-500 text-sm">২০২২ ব্যাচ</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-4">
              <button
                onClick={() => scroll(testimonialsScrollRef, -1)}
                className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-100 transition focus:outline-none focus:ring-2 focus:ring-gray-600 z-10"
                aria-label="পূর্ববর্তী প্রশংসাপত্র"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={() => scroll(testimonialsScrollRef, 1)}
                className="bg-gray-800 bg-opacity-70 text-white p-2 rounded-full shadow-lg hover:bg-opacity-100 transition focus:outline-none focus:ring-2 focus:ring-gray-600 z-10"
                aria-label="পরবর্তী প্রশংসাপত্র"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* কল টু অ্যাকশন সেকশন */}
      <section className="py-16 bg-emerald-700 text-white text-center mt-8 md:mt-12 rounded-xl mx-4 md:mx-auto md:max-w-7xl shadow-lg mb-8">
        <div className="container mx-auto px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 drop-shadow-md">আজই আপনার যাত্রা শুরু করুন!</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            মেডিক্র্যাকের সাথে যুক্ত হয়ে আপনার মেডিকেল ভর্তি পরীক্ষার প্রস্তুতিকে এক নতুন উচ্চতায় নিয়ে যান।
            আমরা আপনার পাশে আছি, আপনার স্বপ্ন পূরণের পথে।
          </p>
          <button className="bg-white text-emerald-700 font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 transform hover:bg-gray-200 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-75">
            এখনই ভর্তি হোন
          </button>
        </div>
      </section>

      {/* কোর্স বিস্তারিত দেখার মডাল */}
      {showCourseDetailsModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600 transition duration-200"
              aria-label="মডাল বন্ধ করুন"
            >
              <X size={24} />
            </button>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
              {selectedCourse.CourseName}
            </h3>
            <div className="mb-6">
                <img
                    src={selectedCourse.CourseImageUrl || `https://placehold.co/800x400/9CA3AF/FFFFFF?text=${selectedCourse.CourseName.replace(/\s/g, '+')}`}
                    alt={selectedCourse.CourseName}
                    className="w-full rounded-lg object-cover mb-4"
                    onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/800x400/9CA3AF/FFFFFF?text=${selectedCourse.CourseName.replace(/\s/g, '+')}`; }}
                />
            </div>
            {/* কোর্সের বিস্তারিত বর্ণনা এখানে */}
            <div className="prose max-w-none text-gray-700"> {/* Tailwind Typography Plugin থাকলে সুন্দর দেখাবে */}
                {/* HTML কন্টেন্ট রেন্ডার করার জন্য, যদি description HTML ফরম্যাটে থাকে */}
                <div dangerouslySetInnerHTML={{ __html: escapeHtml(selectedCourse.CourseDescription).replace(/\n/g, '<br/>') }} />
                {selectedCourse.whatYouWillLearn && (
                    <>
                        <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">আপনি যা শিখবেন:</h4>
                        <div dangerouslySetInnerHTML={{ __html: escapeHtml(selectedCourse.whatYouWillLearn).replace(/\n/g, '<br/>') }} />
                    </>
                )}
            </div>
            
            <div className="flex flex-wrap items-center justify-between mt-6 mb-4 border-t pt-4 border-gray-200">
                {selectedCourse.CoursePrice && selectedCourse.CoursePrice !== "0" ? (
                    <p className="text-emerald-600 font-bold text-xl mr-4">
                        মূল্য: ৳{selectedCourse.CoursePrice}
                        {selectedCourse.OverPriceAvailable && selectedCourse.CourseOverPrice && (
                            <span className="text-gray-500 line-through ml-2 text-base">৳{selectedCourse.CourseOverPrice}</span>
                        )}
                    </p>
                ) : (
                    <p className="text-emerald-600 font-bold text-xl mr-4">মূল্য: ফ্রি</p>
                )}
                {selectedCourse.CourseCategory && (
                    <span className="bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                        ক্যাটাগরি: {selectedCourse.CourseCategory}
                    </span>
                )}
            </div>
            
            {/* আরও বিস্তারিত তথ্য যোগ করতে পারেন */}
            <div className="flex justify-center mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition duration-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;