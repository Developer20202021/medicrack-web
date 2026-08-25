import React, { useRef, useState, useEffect } from 'react';
import {
  BookText,
  GraduationCap,
  DollarSign,
  Lightbulb,
  Trophy,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  MessageCircle,
  Phone,
  Clock,
  Users,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { getTeachers, getCourses } from '../api'; // নিশ্চিত করুন এই ফাইলগুলো সঠিক পাথে আছে
import { Helmet } from 'react-helmet';
import AOS from 'aos';
import 'aos/dist/aos.css';

// ==== এখানে আপনার তথ্য বসান ====
const WHATSAPP_NUMBER = '8801XXXXXXXXX'; // wa.me লিংকের জন্য, দেশের কোড সহ, '+' বা '0' ছাড়া
const CALL_NUMBER = '+8801XXXXXXXXX'; // tel: লিংকের জন্য
const TODAY_EXAM_TIME = 'রাত ৮:০০ টা';
const TODAY_EXAM_SUBJECT = 'বায়োলজি — কোষ ও এর গঠন';
// ================================

/**
 * পালস্‌ লাইন — সিগনেচার ডিভাইডার।
 * পুরো পেইজ জুড়ে একটি হার্টবিট/ইসিজি রেখা ব্যবহার করা হয়েছে, যা মেডিকেল থিমের
 * সাথে সরাসরি সম্পর্কিত এবং প্রতিটি সেকশনকে "একটি স্পন্দনের" মতো একে অপরের সাথে যুক্ত করে।
 */
const PulseDivider = ({ className = '', tone = '#0E2A47' }) => (
  <div className={`w-full overflow-hidden leading-[0] ${className}`} aria-hidden="true">
    <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="w-full h-8 md:h-10">
      <path
        d="M0 20 H430 L455 6 L478 34 L500 12 L520 20 H1200"
        fill="none"
        stroke={tone}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
    </svg>
  </div>
);

const SectionEyebrow = ({ children, tone = 'navy' }) => {
  const toneClass =
    tone === 'pulse'
      ? 'text-[#E5482F] bg-[#E5482F]/10'
      : tone === 'mint'
      ? 'text-[#0E7D65] bg-[#159F82]/10'
      : 'text-[#0E2A47] bg-[#0E2A47]/8';
  return (
    <span
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm md:text-base font-semibold tracking-wide ${toneClass}`}
    >
      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
      {children}
    </span>
  );
};

const LandingPage = () => {
  const teachersScrollRef = useRef(null);
  const testimonialsScrollRef = useRef(null);

  const [isTeachersPaused, setIsTeachersPaused] = useState(false);
  const [isTestimonialsPaused, setIsTestimonialsPaused] = useState(false);

  const [teachers, setTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(null);

  const [showCourseDetailsModal, setShowCourseDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: false,
      easing: 'ease-out',
    });

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
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = ref.current.children[0]
        ? ref.current.children[0].offsetWidth + 48
        : 0;
      ref.current.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    }
  };

  const escapeHtml = (unsafe) => {
    if (!unsafe) return '';
    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
    setShowCourseDetailsModal(true);
  };

  const handleCloseModal = () => {
    setShowCourseDetailsModal(false);
    setSelectedCourse(null);
  };

  // ফিচার তালিকা — প্রতিদিন ফ্রি পরীক্ষা, নোটিফিকেশন এবং সরাসরি ভাইয়া-আপুদের গাইডলাইনসহ
  const features = [
    {
      icon: Clock,
      color: '#E5482F',
      bg: 'bg-[#E5482F]/10',
      title: 'প্রতিদিন ফ্রি পরীক্ষা',
      desc: 'প্রতিদিন নির্দিষ্ট সময়ে বিষয়ভিত্তিক ফ্রি এক্সাম, রেজাল্ট সাথে সাথেই — কোনো ফি ছাড়াই।',
    },
    {
      icon: Bell,
      color: '#0E2A47',
      bg: 'bg-[#0E2A47]/8',
      title: 'ইনস্ট্যান্ট নোটিফিকেশন',
      desc: 'ক্লাস, পরীক্ষা কিংবা রেজাল্ট — কোনোকিছুই মিস হবে না, সরাসরি নোটিফিকেশন পাবে ফোনে।',
    },
    {
      icon: Users,
      color: '#159F82',
      bg: 'bg-[#159F82]/10',
      title: 'ভাইয়া-আপুদের সরাসরি গাইডলাইন',
      desc: 'মেডিকেলে চান্স পাওয়া বড় ভাইয়া-আপুরা সরাসরি পড়াশোনা ও মানসিক প্রস্তুতিতে পাশে থাকবেন।',
    },
    {
      icon: GraduationCap,
      color: '#0E2A47',
      bg: 'bg-[#0E2A47]/8',
      title: 'অভিজ্ঞ শিক্ষক মণ্ডলী',
      desc: 'দেশের সেরা মেডিকেল কলেজের প্রাক্তন শিক্ষার্থী ও অভিজ্ঞ শিক্ষকরা ক্লাস নেবেন।',
    },
    {
      icon: BookText,
      color: '#D6A84A',
      bg: 'bg-[#D6A84A]/15',
      title: 'সম্পূর্ণ স্টাডি ম্যাটেরিয়াল',
      desc: 'প্রয়োজনীয় সকল লেকচার শিট, বই ও মডেল টেস্ট এক জায়গায় সরবরাহ করা হবে।',
    },
    {
      icon: Lightbulb,
      color: '#E5482F',
      bg: 'bg-[#E5482F]/10',
      title: 'নিয়মিত মক টেস্ট',
      desc: 'নিয়মিত পরীক্ষা ও মডেল টেস্টের মাধ্যমে নিজের প্রস্তুতি যাচাই করার সুযোগ।',
    },
    {
      icon: DollarSign,
      color: '#159F82',
      bg: 'bg-[#159F82]/10',
      title: 'সাশ্রয়ী কোর্স ফি',
      desc: 'সকল শিক্ষার্থীর সামর্থ্যের মধ্যে মানসম্মত প্রস্তুতির সুযোগ নিশ্চিত করা হয়েছে।',
    },
    {
      icon: Trophy,
      color: '#D6A84A',
      bg: 'bg-[#D6A84A]/15',
      title: 'ব্যক্তিগত দিকনির্দেশনা',
      desc: 'প্রতিটি শিক্ষার্থীর দুর্বলতা চিহ্নিত করে আলাদাভাবে দিকনির্দেশনা দেওয়া হয়।',
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-[#FAF6EE] text-[#16202B]">
      <style>
        {`
        @font-face {
          font-family: 'NikoshBan';
          src: url('/fonts/NikoshBan.woff2') format('woff2'),
               url('/fonts/NikoshBan.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }
        .font-bangla {
          font-family: 'NikoshBan', 'Noto Sans Bengali', 'Hind Siliguri', sans-serif;
        }

        @keyframes scrollTeachers {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll-teachers-css {
            animation: scrollTeachers 60s linear infinite;
        }
        .animate-scroll-teachers-css.paused {
            animation-play-state: paused;
        }

        @keyframes scrollTestimonials {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        .animate-scroll-testimonials-css {
            animation: scrollTestimonials 40s linear infinite;
        }
        .animate-scroll-testimonials-css.paused {
            animation-play-state: paused;
        }

        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes ringPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
          70% { box-shadow: 0 0 0 14px rgba(37, 211, 102, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
        }
        .whatsapp-ring { animation: ringPulse 2.2s infinite; }

        @keyframes livedot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        .live-dot { animation: livedot 1.4s ease-in-out infinite; }
        `}
      </style>

      <Helmet>
        <title>মেডিক্র্যাক | মেডিকেল ভর্তি ও SSC-HSC শিক্ষার্থীদের জন্য ফ্রি এক্সাম ও কিউব্যাংক</title>
        <meta
          name="description"
          content="মেডিক্র্যাক: মেডিকেল ভর্তি, SSC ও HSC শিক্ষার্থীদের জন্য প্রতিদিন ফ্রি অনলাইন পরীক্ষা, প্রশ্নব্যাংক, ইনস্ট্যান্ট নোটিফিকেশন এবং মেডিকেলে পড়া ভাইয়া-আপুদের সরাসরি গাইডলাইন।"
        />
        <meta
          name="keywords"
          content="মেডিক্র্যাক, মেডিকেল ভর্তি প্রস্তুতি, SSC, HSC, ফ্রি এক্সাম, কিউব্যাংক, প্রশ্নব্যাংক, মেডিকেল অ্যাপ, অনলাইন কোর্স, এমবিবিএস, বিডিএস"
        />
        <link rel="canonical" href="https://www.medicrack.online/" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />

        <meta property="og:title" content="মেডিক্র্যাক | মেডিকেল ভর্তি ও SSC-HSC শিক্ষার্থীদের জন্য" />
        <meta
          property="og:description"
          content="প্রতিদিন ফ্রি পরীক্ষা, ইনস্ট্যান্ট নোটিফিকেশন এবং মেডিকেলে পড়া ভাইয়া-আপুদের সরাসরি গাইডলাইন — মেডিক্র্যাকের সাথে।"
        />
        <meta property="og:image" content="https://www.medicrack.online/logo192.png" />
        <meta property="og:url" content="https://www.medicrack.online/" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* ===== টপ অ্যানাউন্সমেন্ট বার ===== */}
      <div className="bg-[#0E2A47] text-white text-center py-2 px-4 text-sm md:text-base font-bangla">
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#E5482F] live-dot" />
          আজকের ফ্রি পরীক্ষা শুরু হবে <strong className="text-[#F2C879]">{TODAY_EXAM_TIME}</strong> — এখনই রেজিস্ট্রেশন করো
        </span>
      </div>

      {/* ===== হিরো সেকশন ===== */}
      <section className="relative bg-[#0E2A47] text-white overflow-hidden">
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              "url('https://placehold.co/1920x1000/0E2A47/0E2A47?text=+')",
            backgroundSize: 'cover',
          }}
        />
        {/* আবছা পালস্‌ প্যাটার্ন */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.08]"
          viewBox="0 0 800 600"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 300 H260 L285 250 L315 350 L340 280 L360 300 H800"
            fill="none"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-up">
            <span className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm md:text-base font-bangla mb-6">
              <Sparkles size={16} className="text-[#F2C879]" />
              মেডিকেল ভর্তি ও SSC–HSC প্রস্তুতি
            </span>
            <h1 className="font-bangla text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.35] mb-6">
              তোমার ডাক্তার হওয়ার স্বপ্নের{' '}
              <span className="text-[#F2C879]">প্রতিটি স্পন্দনে</span> আমরা আছি
            </h1>
            <p className="font-bangla text-lg md:text-xl leading-loose text-white/85 mb-8">
              প্রতিদিন ফ্রি পরীক্ষা, ইনস্ট্যান্ট নোটিফিকেশন আর মেডিকেলে পড়া ভাইয়া-আপুদের
              সরাসরি গাইডলাইন — সবকিছু একসাথে, খুবই কম খরচে, তোমার হাতের নাগালে।
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="font-bangla bg-[#E5482F] hover:bg-[#c93c25] transition text-white font-bold text-lg px-8 py-3.5 rounded-full shadow-lg shadow-[#E5482F]/30">
                ফ্রি পরীক্ষায় অংশ নাও
              </button>
              <button className="font-bangla bg-white/10 hover:bg-white/20 border border-white/30 transition text-white font-semibold text-lg px-8 py-3.5 rounded-full">
                কোর্সসমূহ দেখো
              </button>
            </div>
          </div>

          <div data-aos="fade-left" data-aos-delay="150" className="relative">
            <div className="bg-white/95 text-[#16202B] rounded-2xl shadow-2xl p-6 md:p-7 max-w-sm mx-auto font-bangla">
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-2 text-[#E5482F] font-bold text-sm">
                  <span className="w-2 h-2 rounded-full bg-[#E5482F] live-dot" />
                  আজকের ফ্রি পরীক্ষা
                </span>
                <Clock size={20} className="text-[#0E2A47]" />
              </div>
              <p className="text-xl font-bold mb-1">{TODAY_EXAM_SUBJECT}</p>
              <p className="text-[#5B6472] mb-5">সময়: {TODAY_EXAM_TIME} · সম্পূর্ণ ফ্রি</p>
              <button className="w-full bg-[#0E2A47] hover:bg-[#0a2038] transition text-white font-semibold py-3 rounded-xl">
                রিমাইন্ডার সেট করো
              </button>
            </div>
          </div>
        </div>
      </section>

      <PulseDivider tone="#E5482F" className="bg-[#FAF6EE]" />

      {/* ===== মেডিক্র্যাক সম্পর্কে ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <SectionEyebrow>আমাদের সম্পর্কে</SectionEyebrow>
            <h2 className="font-bangla text-3xl md:text-4xl font-bold text-[#0E2A47] mt-4 mb-6 leading-snug">
              মেডিক্র্যাক সম্পর্কে
            </h2>
            <p className="font-bangla text-[#3A4453] text-lg leading-loose mb-4">
              মেডিক্র্যাক এমন একটি প্ল্যাটফর্ম, যা SSC ও HSC শিক্ষার্থীদের পাশাপাশি মেডিকেল
              ভর্তি পরীক্ষার্থীদের স্বপ্ন পূরণে সহায়তা করে। মানসম্মত শিক্ষা সবার জন্য
              সহজলভ্য হওয়া উচিত — এই বিশ্বাস থেকেই আমাদের যাত্রা শুরু।
            </p>
            <p className="font-bangla text-[#3A4453] text-lg leading-loose">
              তাই আমরা কোর্স ফি রেখেছি খুবই কম, প্রতিদিন দিচ্ছি ফ্রি পরীক্ষা, আর
              পাশে রেখেছি মেডিকেলে পড়া ভাইয়া-আপুদের — যেন বাংলাদেশের সব প্রান্তের
              শিক্ষার্থী আমাদের সার্ভিস থেকে উপকৃত হতে পারে।
            </p>
          </div>
          <div className="flex justify-center" data-aos="zoom-in" data-aos-delay="150">
            <img
              src="https://res.cloudinary.com/dc6tqkgdm/image/upload/v1750622984/Gemini_Generated_Image_p1g47xp1g47xp1g4_bfjnaw.png"
              alt="Medical Student with Apron"
              className="rounded-2xl shadow-xl w-full max-w-md object-cover"
            />
          </div>
        </div>
      </section>

      {/* ===== ফিচার গ্রিড ===== */}
      <section className="py-16 md:py-20 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <SectionEyebrow tone="mint">আমাদের ফিচারসমূহ</SectionEyebrow>
          <h2 className="font-bangla text-3xl md:text-4xl font-bold text-[#0E2A47] mt-4 mb-12">
            কেন মেডিক্র্যাক বেছে নেবে?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1.5 text-left border border-black/5"
                  data-aos="zoom-in"
                  data-aos-delay={`${(i % 4) * 100}`}
                >
                  <div className={`w-14 h-14 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                    <Icon size={26} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bangla text-lg font-bold text-[#16202B] mb-2 leading-snug">
                    {f.title}
                  </h3>
                  <p className="font-bangla text-[#5B6472] text-base leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PulseDivider tone="#159F82" className="bg-white" />

      {/* ===== আজকের ফ্রি পরীক্ষা — স্পটলাইট ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="bg-[#0E2A47] rounded-3xl p-8 md:p-12 grid md:grid-cols-2 gap-10 items-center overflow-hidden relative">
            <svg
              className="absolute -right-10 -bottom-10 w-64 h-64 opacity-10"
              viewBox="0 0 200 200"
              aria-hidden="true"
            >
              <circle cx="100" cy="100" r="100" fill="#E5482F" />
            </svg>
            <div className="relative z-10 text-white" data-aos="fade-right">
              <span className="inline-flex items-center gap-2 bg-[#E5482F]/20 text-[#F2977E] px-4 py-1.5 rounded-full text-sm font-bangla font-semibold mb-5">
                <Clock size={16} />
                প্রতিদিন, নির্দিষ্ট সময়ে
              </span>
              <h2 className="font-bangla text-3xl md:text-4xl font-bold mb-5 leading-snug">
                প্রতিদিন ফ্রি পরীক্ষা দাও, নিজের প্রস্তুতি নিজেই যাচাই করো
              </h2>
              <p className="font-bangla text-white/85 text-lg leading-loose mb-6">
                প্রতিদিন একটি নির্দিষ্ট বিষয়ের উপর ফ্রি এক্সাম দেওয়া হয়। পরীক্ষা শেষে
                সাথে সাথেই রেজাল্ট, ভুল উত্তরের ব্যাখ্যা এবং সারা দেশের মধ্যে তোমার
                অবস্থান জানতে পারবে — সম্পূর্ণ বিনামূল্যে।
              </p>
              <button className="font-bangla bg-[#E5482F] hover:bg-[#c93c25] transition text-white font-bold px-7 py-3 rounded-full">
                আজকের পরীক্ষায় অংশ নাও
              </button>
            </div>
            <div className="relative z-10" data-aos="fade-left" data-aos-delay="150">
              <div className="bg-white rounded-2xl p-6 shadow-2xl font-bangla max-w-sm mx-auto">
                <div className="flex items-center gap-2 text-[#E5482F] font-bold text-sm mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#E5482F] live-dot" />
                  আজকের বিষয়
                </div>
                <p className="text-xl font-bold text-[#16202B] mb-1">{TODAY_EXAM_SUBJECT}</p>
                <p className="text-[#5B6472] mb-4">{TODAY_EXAM_TIME} · ৩০ মিনিট · MCQ</p>
                <div className="h-px bg-black/10 my-4" />
                <div className="flex items-center gap-2 text-[#159F82] font-semibold text-sm">
                  <Bell size={16} />
                  রেজিস্ট্রেশন করলে ৩০ মিনিট আগে নোটিফিকেশন পাবে
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== নোটিফিকেশন + ভাইয়া-আপু সেকশন ===== */}
      <section className="py-16 md:py-20 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-8">
          {/* নোটিফিকেশন কার্ড */}
          <div
            className="bg-white rounded-2xl p-8 shadow-md border border-black/5"
            data-aos="fade-up"
          >
            <div className="w-14 h-14 rounded-xl bg-[#0E2A47]/8 flex items-center justify-center mb-5">
              <Bell size={26} className="text-[#0E2A47]" />
            </div>
            <h3 className="font-bangla text-2xl font-bold text-[#0E2A47] mb-3">
              কোনো ক্লাস, পরীক্ষা মিস হবে না
            </h3>
            <p className="font-bangla text-[#5B6472] text-lg leading-loose mb-5">
              নতুন ক্লাস শুরু, ফ্রি পরীক্ষার সময়, রেজাল্ট প্রকাশ কিংবা নতুন কোর্সের
              খবর — সবকিছুই সরাসরি নোটিফিকেশনের মাধ্যমে তোমার ফোনে পৌঁছে যাবে।
            </p>
            <ul className="font-bangla text-[#3A4453] space-y-2">
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                পরীক্ষা শুরুর আগে রিমাইন্ডার
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                রেজাল্ট প্রকাশের সাথে সাথে জানানো
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                নতুন লেকচার শিট আপলোডের খবর
              </li>
            </ul>
          </div>

          {/* ভাইয়া-আপু কার্ড */}
          <div
            className="bg-white rounded-2xl p-8 shadow-md border border-black/5"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            <div className="w-14 h-14 rounded-xl bg-[#159F82]/10 flex items-center justify-center mb-5">
              <Users size={26} className="text-[#159F82]" />
            </div>
            <h3 className="font-bangla text-2xl font-bold text-[#0E2A47] mb-3">
              মেডিকেলের ভাইয়া-আপুরা সরাসরি পাশে
            </h3>
            <p className="font-bangla text-[#5B6472] text-lg leading-loose mb-5">
              যারা নিজেরাই মেডিকেলে চান্স পেয়েছেন, তারাই তোমার প্রশ্নের উত্তর দেবেন,
              পড়াশোনার রুটিন গুছিয়ে দেবেন এবং পরীক্ষার আগের মানসিক চাপ সামলাতেও
              পাশে থাকবেন।
            </p>
            <ul className="font-bangla text-[#3A4453] space-y-2">
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                সরাসরি প্রশ্ন-উত্তর সেশন
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                অভিজ্ঞতা থেকে পড়াশোনার কৌশল
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={20} className="text-[#159F82] shrink-0 mt-0.5" />
                মানসিক সাপোর্ট ও মোটিভেশন
              </li>
            </ul>
          </div>
        </div>
      </section>

      <PulseDivider tone="#0E2A47" className="bg-white" />

      {/* ===== শিক্ষক মণ্ডলী ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <SectionEyebrow>শিক্ষক মণ্ডলী</SectionEyebrow>
          <h2 className="font-bangla text-3xl md:text-4xl font-bold text-[#0E2A47] mt-4 mb-10">
            আমাদের শিক্ষক মণ্ডলী
          </h2>
          {teachersLoading ? (
            <p className="font-bangla text-[#5B6472]" data-aos="fade-in">
              শিক্ষকদের তথ্য লোড হচ্ছে...
            </p>
          ) : teachersError ? (
            <p className="font-bangla text-[#E5482F]" data-aos="fade-in">
              শিক্ষকদের তথ্য আনতে সমস্যা: {teachersError}
            </p>
          ) : teachers.length > 0 ? (
            <div className="relative w-full py-4">
              <div ref={teachersScrollRef} className="flex overflow-x-hidden hide-scrollbar snap-x snap-mandatory pb-4">
                <div
                  className={`inline-flex flex-nowrap space-x-8 ${
                    isTeachersPaused ? 'paused' : 'animate-scroll-teachers-css'
                  }`}
                  onMouseEnter={() => setIsTeachersPaused(true)}
                  onMouseLeave={() => setIsTeachersPaused(false)}
                  style={{ width: 'max-content' }}
                >
                  {[...Array(2)].map((_, i) => (
                    <React.Fragment key={i}>
                      {teachers.map((teacher) => (
                        <div
                          key={teacher.id + '-' + i}
                          className="flex-none w-72 flex flex-col items-center p-6 bg-[#FAF6EE] rounded-2xl shadow-sm snap-center hover:shadow-lg transition duration-300 transform hover:-translate-y-1 border border-black/5"
                          data-aos="fade-right"
                          data-aos-delay={`${i * 50 + 100}`}
                        >
                          <img
                            src={teacher.imageUrl || `https://placehold.co/150x150/0E2A47/FFFFFF?text=শিক্ষক`}
                            alt={teacher.name}
                            className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-[#159F82]/40 shadow-md"
                          />
                          <h3 className="font-bangla text-xl font-semibold text-[#16202B]">{teacher.name}</h3>
                          <p className="font-bangla text-[#159F82] text-sm mb-2">
                            {(teacher.bio || '').split('(')[0].trim()}
                          </p>
                          <p className="font-bangla text-[#5B6472] text-center text-sm leading-relaxed">
                            {teacher.bio}
                          </p>
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2 md:px-4">
                <button
                  onClick={() => scroll(teachersScrollRef, -1)}
                  className="bg-[#0E2A47]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#0E2A47] transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/40 z-10"
                  aria-label="পূর্ববর্তী শিক্ষক"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={() => scroll(teachersScrollRef, 1)}
                  className="bg-[#0E2A47]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#0E2A47] transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/40 z-10"
                  aria-label="পরবর্তী শিক্ষক"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            </div>
          ) : (
            <p className="font-bangla text-[#5B6472]" data-aos="fade-in">
              কোনো শিক্ষক পাওয়া যায়নি।
            </p>
          )}
        </div>
      </section>

      {/* ===== কোর্স সেকশন ===== */}
      <section className="py-16 md:py-20 bg-[#FAF6EE]">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <SectionEyebrow tone="mint">কোর্সসমূহ</SectionEyebrow>
          <h2 className="font-bangla text-3xl md:text-4xl font-bold text-[#0E2A47] mt-4 mb-10">
            আমাদের কোর্সসমূহ
          </h2>
          {coursesLoading ? (
            <p className="font-bangla text-[#5B6472]" data-aos="fade-in">
              কোর্স লোড হচ্ছে...
            </p>
          ) : coursesError ? (
            <p className="font-bangla text-[#E5482F]" data-aos="fade-in">
              কোর্স আনতে সমস্যা: {coursesError}
            </p>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden border border-black/5 transform transition duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  data-aos="zoom-in"
                  data-aos-delay={`${(index % 3) * 100}`}
                >
                  <img
                    src={
                      course.CourseImageUrl ||
                      `https://placehold.co/600x300/0E2A47/FFFFFF?text=${course.CourseName.replace(/\s/g, '+')}`
                    }
                    alt={course.CourseName}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://placehold.co/600x300/0E2A47/FFFFFF?text=${course.CourseName.replace(
                        /\s/g,
                        '+'
                      )}`;
                    }}
                  />
                  <div className="p-6 text-left font-bangla">
                    <h3 className="text-xl font-semibold text-[#16202B] mb-2">{course.CourseName}</h3>
                    <p className="text-[#5B6472] text-sm mb-4 line-clamp-3 leading-relaxed">
                      {course.CourseDescription}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      {course.CoursePrice && course.CoursePrice !== '0' ? (
                        <p className="text-[#159F82] font-bold text-lg">
                          ৳{course.CoursePrice}
                          {course.OverPriceAvailable && course.CourseOverPrice && (
                            <span className="text-[#9AA3AF] line-through ml-2 text-base">
                              ৳{course.CourseOverPrice}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-[#159F82] font-bold text-lg">ফ্রি</p>
                      )}
                      <span className="bg-[#0E2A47]/8 text-[#0E2A47] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {course.CourseCategory}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(course)}
                      className="w-full bg-[#0E2A47] hover:bg-[#0a2038] text-white font-semibold py-2.5 rounded-lg shadow-sm transition duration-300"
                    >
                      বিস্তারিত দেখুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-bangla text-[#5B6472]" data-aos="fade-in">
              কোনো কোর্স পাওয়া যায়নি।
            </p>
          )}
        </div>
      </section>

      <PulseDivider tone="#E5482F" className="bg-white" />

      {/* ===== টেস্টিমোনিয়াল ===== */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 md:px-10 text-center">
          <SectionEyebrow>মতামত</SectionEyebrow>
          <h2 className="font-bangla text-3xl md:text-4xl font-bold text-[#0E2A47] mt-4 mb-10">
            শিক্ষার্থীদের অভিজ্ঞতা
          </h2>
          <div className="relative w-full py-4">
            <div
              ref={testimonialsScrollRef}
              className="flex overflow-x-hidden hide-scrollbar snap-x snap-mandatory pb-4"
            >
              <div
                className={`inline-flex flex-nowrap space-x-8 ${
                  isTestimonialsPaused ? 'paused' : 'animate-scroll-testimonials-css'
                }`}
                onMouseEnter={() => setIsTestimonialsPaused(true)}
                onMouseLeave={() => setIsTestimonialsPaused(false)}
                style={{ width: 'max-content' }}
              >
                {[...Array(2)].map((_, i) => (
                  <React.Fragment key={i}>
                    <div
                      className="flex-none w-80 md:w-96 p-6 bg-[#FAF6EE] rounded-2xl shadow-sm snap-center text-left border border-black/5 font-bangla"
                      data-aos="fade-up"
                      data-aos-delay={`${i * 50 + 100}`}
                    >
                      <p className="text-[#3A4453] italic mb-4 leading-relaxed">
                        মেডিক্র্যাকের ক্লাসগুলো খুবই ইন্টারঅ্যাক্টিভ এবং শিক্ষকরা অনেক যত্ন
                        নিয়ে পড়ান। এখানকার স্বল্প ফি সত্যিই প্রশংসনীয়।
                      </p>
                      <p className="font-semibold text-[#16202B]">— মারিয়া সুলতানা, শিক্ষার্থী</p>
                      <p className="text-[#9AA3AF] text-sm">২০২৪ ব্যাচ</p>
                    </div>
                    <div
                      className="flex-none w-80 md:w-96 p-6 bg-[#FAF6EE] rounded-2xl shadow-sm snap-center text-left border border-black/5 font-bangla"
                      data-aos="fade-up"
                      data-aos-delay={`${i * 50 + 200}`}
                    >
                      <p className="text-[#3A4453] italic mb-4 leading-relaxed">
                        প্রতিদিনের ফ্রি পরীক্ষাগুলো আমার প্রস্তুতি অনেক গুছিয়ে দিয়েছে।
                        নোটিফিকেশনের কারণে কখনো কোনো পরীক্ষা মিস হয়নি।
                      </p>
                      <p className="font-semibold text-[#16202B]">— ফাহিম আহমেদ, শিক্ষার্থী</p>
                      <p className="text-[#9AA3AF] text-sm">২০২৩ ব্যাচ</p>
                    </div>
                    <div
                      className="flex-none w-80 md:w-96 p-6 bg-[#FAF6EE] rounded-2xl shadow-sm snap-center text-left border border-black/5 font-bangla"
                      data-aos="fade-up"
                      data-aos-delay={`${i * 50 + 300}`}
                    >
                      <p className="text-[#3A4453] italic mb-4 leading-relaxed">
                        ভাইয়া-আপুদের কাছ থেকে সরাসরি পরামর্শ নেওয়াটা আমার জন্য সবচেয়ে
                        বড় সাপোর্ট ছিল। মক টেস্টগুলো আমার দুর্বলতা বুঝতে সাহায্য করেছে।
                      </p>
                      <p className="font-semibold text-[#16202B]">— সাবিহা আক্তার, শিক্ষার্থী</p>
                      <p className="text-[#9AA3AF] text-sm">২০২২ ব্যাচ</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="absolute top-1/2 left-0 right-0 flex justify-between transform -translate-y-1/2 px-2 md:px-4">
              <button
                onClick={() => scroll(testimonialsScrollRef, -1)}
                className="bg-[#0E2A47]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#0E2A47] transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/40 z-10"
                aria-label="পূর্ববর্তী প্রশংসাপত্র"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={() => scroll(testimonialsScrollRef, 1)}
                className="bg-[#0E2A47]/80 text-white p-2 rounded-full shadow-lg hover:bg-[#0E2A47] transition focus:outline-none focus:ring-2 focus:ring-[#0E2A47]/40 z-10"
                aria-label="পরবর্তী প্রশংসাপত্র"
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ফাইনাল CTA ===== */}
      <section className="py-16 md:py-20 bg-[#0E2A47] text-white text-center">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <h2 className="font-bangla text-3xl md:text-4xl font-bold mb-5" data-aos="fade-up">
            আজই তোমার যাত্রা শুরু করো
          </h2>
          <p
            className="font-bangla text-lg leading-loose mb-8 text-white/85"
            data-aos="fade-up"
            data-aos-delay="150"
          >
            মেডিক্র্যাকের সাথে যুক্ত হয়ে তোমার মেডিকেল ভর্তি পরীক্ষা কিংবা SSC–HSC
            প্রস্তুতিকে নতুন উচ্চতায় নিয়ে যাও। আমরা তোমার পাশে আছি, প্রতিটি পদক্ষেপে।
          </p>
          <button
            className="font-bangla bg-[#E5482F] hover:bg-[#c93c25] transition text-white font-bold text-lg px-9 py-3.5 rounded-full shadow-lg shadow-[#E5482F]/30"
            data-aos="zoom-in"
            data-aos-delay="300"
          >
            এখনই ভর্তি হও
          </button>
        </div>
      </section>

      {/* ===== কোর্স বিস্তারিত মডাল ===== */}
      {showCourseDetailsModal && selectedCourse && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50"
          data-aos="zoom-in"
          data-aos-duration="300"
        >
          <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative font-bangla">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 bg-black/5 hover:bg-black/10 rounded-full p-2 text-[#16202B] transition duration-200"
              aria-label="মডাল বন্ধ করুন"
            >
              <X size={22} />
            </button>
            <h3 className="text-2xl md:text-3xl font-bold text-[#0E2A47] mb-4 text-center">
              {selectedCourse.CourseName}
            </h3>
            <div className="mb-6">
              <img
                src={
                  selectedCourse.CourseImageUrl ||
                  `https://placehold.co/800x400/0E2A47/FFFFFF?text=${selectedCourse.CourseName.replace(/\s/g, '+')}`
                }
                alt={selectedCourse.CourseName}
                className="w-full rounded-xl object-cover mb-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://placehold.co/800x400/0E2A47/FFFFFF?text=${selectedCourse.CourseName.replace(
                    /\s/g,
                    '+'
                  )}`;
                }}
              />
            </div>
            <div className="prose max-w-none text-[#3A4453] text-base leading-relaxed">
              <div
                dangerouslySetInnerHTML={{
                  __html: escapeHtml(selectedCourse.CourseDescription).replace(/\n/g, '<br/>'),
                }}
              />
              {selectedCourse.whatYouWillLearn && (
                <>
                  <h4 className="text-xl font-semibold text-[#0E2A47] mt-6 mb-3">আপনি যা শিখবেন:</h4>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: escapeHtml(selectedCourse.whatYouWillLearn).replace(/\n/g, '<br/>'),
                    }}
                  />
                </>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between mt-6 mb-4 border-t pt-4 border-black/10">
              {selectedCourse.CoursePrice && selectedCourse.CoursePrice !== '0' ? (
                <p className="text-[#159F82] font-bold text-xl mr-4">
                  মূল্য: ৳{selectedCourse.CoursePrice}
                  {selectedCourse.OverPriceAvailable && selectedCourse.CourseOverPrice && (
                    <span className="text-[#9AA3AF] line-through ml-2 text-base">
                      ৳{selectedCourse.CourseOverPrice}
                    </span>
                  )}
                </p>
              ) : (
                <p className="text-[#159F82] font-bold text-xl mr-4">মূল্য: ফ্রি</p>
              )}
              {selectedCourse.CourseCategory && (
                <span className="bg-[#0E2A47]/8 text-[#0E2A47] text-sm font-semibold px-3 py-1 rounded-full whitespace-nowrap">
                  ক্যাটাগরি: {selectedCourse.CourseCategory}
                </span>
              )}
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={handleCloseModal}
                className="bg-[#5B6472] hover:bg-[#48505c] text-white font-semibold py-2.5 px-6 rounded-lg shadow-sm transition duration-300"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== ফ্লোটিং WhatsApp + কল বাটন ===== */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 font-bangla">
        <a
          href={`tel:${CALL_NUMBER}`}
          className="w-12 h-12 rounded-full bg-[#0E2A47] text-white flex items-center justify-center shadow-lg hover:bg-[#0a2038] transition"
          aria-label="কল করুন"
          title="কল করুন"
        >
          <Phone size={20} />
        </a>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-ring w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#1fbd5a] transition"
          aria-label="হোয়াটসঅ্যাপে মেসেজ করুন"
          title="হোয়াটসঅ্যাপে মেসেজ করুন"
        >
          <MessageCircle size={26} />
        </a>
      </div>
    </div>
  );
};

export default LandingPage;