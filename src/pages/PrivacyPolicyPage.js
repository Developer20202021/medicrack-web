import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Mail, Phone, User, Monitor, Settings, Zap, Shield, Lock, Eye, FileText } from 'lucide-react';

const PrivacyPolicyPage = () => {
  const [openAccordion, setOpenAccordion] = useState(null);
  const [activeSection, setActiveSection] = useState('section-1');
  const sectionRefs = useRef({});

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });

    return () => {
      Object.keys(sectionRefs.current).forEach((key) => {
        if (sectionRefs.current[key]) {
          observer.unobserve(sectionRefs.current[key]);
        }
      });
    };
  }, []);

  const scrollToSection = (id) => {
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 font-['Hind_Siliguri'] text-gray-300 pt-24 pb-12">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full mb-6 shadow-lg shadow-emerald-500/50">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              মেডিক্র্যাকের গোপনীয়তা নীতি
            </span>
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <FileText className="w-5 h-5" />
            <p>কার্যকরী তারিখ: 24 জুন, 2025</p>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sticky Navigation Sidebar */}
          <aside className="lg:w-1/4 lg:sticky top-24 self-start">
            <nav className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-emerald-400" />
                বিষয়সূচি
              </h3>
              <ul className="space-y-2">
                {[
                  { id: 'section-1', label: '১. তথ্য সংগ্রহ' },
                  { id: 'section-2', label: '২. তথ্য ব্যবহার' },
                  { id: 'section-3', label: '৩. তথ্য শেয়ার' },
                  { id: 'section-4', label: '৪. আপনার অধিকার' },
                  { id: 'section-5', label: '৫. ডেটা সুরক্ষা' },
                  { id: 'section-6', label: '৬. শিশুদের গোপনীয়তা' },
                  { id: 'section-7', label: '৭. নীতি পরিবর্তন' },
                  { id: 'section-8', label: '৮. যোগাযোগ' },
                ].map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(item.id);
                      }}
                      className={`block py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${
                        activeSection === item.id
                          ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg transform translate-x-1'
                          : 'text-gray-300 hover:bg-slate-700/50 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="lg:w-3/4 space-y-8">
            {/* Introduction */}
            <section className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <Lock className="w-8 h-8 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h2 className="text-2xl font-bold text-white mb-4">স্বাগতম</h2>
                  <p className="text-lg leading-relaxed text-gray-300">
                    মেডিক্র্যাক ("আমরা", "আমাদের") মেডিকেল ভর্তি পরীক্ষা, নবম-দশম ও একাদশ-দ্বাদশ শ্রেণীর শিক্ষার্থীদের জন্য একটি সুরক্ষিত ও নির্ভরযোগ্য প্ল্যাটফর্ম। আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব সহকারে বিবেচনা করি। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষা করি যখন আপনি আমাদের পরিষেবা ব্যবহার করেন। আমাদের প্ল্যাটফর্ম সকল বয়সের শিক্ষার্থীদের জন্য উন্মুক্ত, এবং আমরা আপনার ডেটার সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।
                  </p>
                </div>
              </div>
            </section>

            {/* Section 1 */}
            <section
              id="section-1"
              ref={(el) => (sectionRefs.current['section-1'] = el)}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-4 text-emerald-400 border-b border-slate-700 pb-4">
                ১. আমরা কোন তথ্য সংগ্রহ করি?
              </h2>
              <p className="mb-6 text-gray-300 leading-relaxed">
                আমরা আপনার কাছ থেকে বিভিন্ন ধরনের তথ্য সংগ্রহ করি, যা আমাদের পরিষেবা প্রদান এবং উন্নত করতে সহায়তা করে।
              </p>
              <div className="space-y-4">
                <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-700/30">
                  <button
                    className="w-full text-left p-5 bg-slate-700/50 hover:bg-slate-700/70 flex justify-between items-center transition-all duration-300"
                    onClick={() => toggleAccordion(0)}
                  >
                    <span className="font-semibold text-lg text-white">
                      ক. ব্যক্তিগতভাবে শনাক্তকরণযোগ্য তথ্য (PII)
                    </span>
                    <ChevronDown
                      className={`w-6 h-6 text-emerald-400 transform transition-transform duration-300 ${
                        openAccordion === 0 ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      openAccordion === 0 ? 'max-h-[1000px]' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="p-5 border-t border-slate-700/50">
                      <p className="mb-4 text-gray-300">
                        আপনি যখন আমাদের পরিষেবা ব্যবহার করেন, যেমন নিবন্ধন করেন, কোর্সে ভর্তি হন, বা আমাদের সাথে যোগাযোগ করেন, তখন আমরা আপনার কাছ থেকে নিম্নলিখিত ব্যক্তিগত তথ্য সংগ্রহ করতে পারি:
                      </p>
                      <ul className="space-y-3 pl-4">
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">পরিচয় ও যোগাযোগ তথ্য:</strong> নাম, ইমেইল, মোবাইল, ঠিকানা।</div>
                        </li>
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">শিক্ষাগত তথ্য:</strong> কলেজের নাম, HSC/SSC বোর্ড, GPA, রোল, বছর, ইত্যাদি।</div>
                        </li>
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">পারিবারিক তথ্য:</strong> পিতার নাম, পেশা, মোবাইল, মাতার নাম।</div>
                        </li>
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">অন্যান্য ব্যক্তিগত তথ্য:</strong> জন্ম তারিখ, লিঙ্গ, স্বপ্ন, ইত্যাদি।</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-700/30">
                  <button
                    className="w-full text-left p-5 bg-slate-700/50 hover:bg-slate-700/70 flex justify-between items-center transition-all duration-300"
                    onClick={() => toggleAccordion(1)}
                  >
                    <span className="font-semibold text-lg text-white">খ. ব্যবহার ও ডিভাইস তথ্য</span>
                    <ChevronDown
                      className={`w-6 h-6 text-emerald-400 transform transition-transform duration-300 ${
                        openAccordion === 1 ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-500 ease-in-out ${
                      openAccordion === 1 ? 'max-h-[1000px]' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="p-5 border-t border-slate-700/50">
                      <p className="mb-4 text-gray-300">
                        আপনি যখন আমাদের পরিষেবা ব্যবহার করেন, তখন স্বয়ংক্রিয়ভাবে কিছু তথ্য সংগ্রহ করা হয়:
                      </p>
                      <ul className="space-y-3 pl-4">
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">ব্যবহারের ডেটা:</strong> অ্যাক্সেস সময়, দেখা পৃষ্ঠা, IP ঠিকানা, ব্রাউজার।</div>
                        </li>
                        <li className="flex gap-3 text-gray-300">
                          <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2"></div>
                          <div><strong className="text-white">কুকিজ ও ট্র্যাকিং প্রযুক্তি:</strong> আপনার অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়।</div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section
              id="section-2"
              ref={(el) => (sectionRefs.current['section-2'] = el)}
              className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl"
            >
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">
                ২. আমরা কিভাবে আপনার তথ্য ব্যবহার করি?
              </h2>
              <div className="space-y-5">
                {[
                  { icon: User, title: 'পরিষেবা প্রদান ও রক্ষণাবেক্ষণ', desc: 'আপনাকে আমাদের পরিষেবা সরবরাহ করতে, অ্যাকাউন্ট পরিচালনা করতে এবং এটি চালু রাখতে।' },
                  { icon: Mail, title: 'আপনার সাথে যোগাযোগ', desc: 'পরিষেবা সংক্রান্ত আপডেট, নিরাপত্তা সতর্কতা এবং সহায়ক মেসেজ পাঠাতে।' },
                  { icon: Settings, title: 'পরিষেবা উন্নত করা', desc: 'আমাদের পরিষেবা বিশ্লেষণ ও উন্নত করতে, নতুন ফিচার তৈরি করতে।' },
                  { icon: Monitor, title: 'ব্যক্তিগতকৃত অভিজ্ঞতা', desc: 'আপনার ব্যবহারের উপর ভিত্তি করে কন্টেন্ট কাস্টমাইজ করতে।' },
                  { icon: Zap, title: 'নিরাপত্তা ও জালিয়াতি প্রতিরোধ', desc: 'অননুমোদিত অ্যাক্সেস থেকে সুরক্ষা নিশ্চিত করতে।' },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <strong className="text-white block mb-1">{item.title}:</strong>
                        <p className="text-gray-300">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 3-8 */}
            <section id="section-3" ref={(el) => (sectionRefs.current['section-3'] = el)} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">৩. তথ্য শেয়ার করা</h2>
              <p className="text-gray-300 leading-relaxed">আমরা আপনার ব্যক্তিগত ডেটার সর্বোচ্চ গোপনীয়তা বজায় রাখি। আপনার সম্মতি ছাড়া, অথবা আমাদের শিক্ষামূলক পরিষেবা সরাসরি প্রদান ও এর রক্ষণাবেক্ষণের জন্য (যেমন: ক্লাউড হোস্টিং, পেমেন্ট প্রসেসিং) অত্যাবশ্যক না হলে, আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে শেয়ার করি না। এমনকি এই অত্যাবশ্যকীয় পরিষেবা প্রদানকারীদের ক্ষেত্রেও আমরা কঠোর গোপনীয়তা চুক্তি মেনে চলি। আপনার ডেটা কখনো বিক্রি বা ভাড়া দেওয়া হয় না।</p>
            </section>

            <section id="section-4" ref={(el) => (sectionRefs.current['section-4'] = el)} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">৪. আপনার অধিকার</h2>
              <p className="mb-6 text-gray-300">আপনি আপনার ব্যক্তিগত তথ্য সম্পর্কে নিম্নলিখিত অধিকারগুলো ভোগ করেন:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  { title: 'অ্যাক্সেসের অধিকার', desc: 'আপনার তথ্য অ্যাক্সেস করার অধিকার।' },
                  { title: 'সংশোধনের অধিকার', desc: 'ভুল তথ্য সংশোধন করার অধিকার।' },
                  { title: 'মুছে ফেলার অধিকার', desc: 'আপনার তথ্য মুছে ফেলার অধিকার।' },
                  { title: 'আপত্তির অধিকার', desc: 'তথ্য প্রক্রিয়াকরণে আপত্তি জানানোর অধিকার।' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-700/30 p-5 rounded-xl border border-slate-700/50 hover:border-emerald-500/50 transition-all">
                    <strong className="text-white block mb-2">{item.title}</strong>
                    <p className="text-gray-300 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="section-5" ref={(el) => (sectionRefs.current['section-5'] = el)} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">৫. ডেটা সুরক্ষা</h2>
              <p className="text-gray-300 leading-relaxed">আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষাকে সর্বোচ্চ অগ্রাধিকার দিই। আপনার ডেটা অত্যন্ত সুরক্ষিত রাখতে আমরা অত্যাধুনিক প্রশাসনিক, প্রযুক্তিগত এবং শারীরিক নিরাপত্তা ব্যবস্থা গ্রহণ করি। যদিও ইন্টারনেটের মাধ্যমে ডেটা ট্রান্সমিশনের কোনো পদ্ধতিই 100% সুরক্ষিত নয়, আমরা আপনার তথ্যের সুরক্ষায় সর্বোচ্চ চেষ্টা করি এবং নিয়মিত আমাদের নিরাপত্তা প্রোটোকল পর্যালোচনা ও উন্নত করি।</p>
            </section>

            <section id="section-6" ref={(el) => (sectionRefs.current['section-6'] = el)} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">৬. শিশুদের গোপনীয়তা</h2>
              <p className="text-gray-300 leading-relaxed">আমাদের মেডিক্র্যাক প্ল্যাটফর্ম সকল বয়সের শিক্ষার্থীর জন্য উন্মুক্ত, এবং আমরা বিশ্বাস করি প্রতিটি শিশুরই মানসম্মত শিক্ষা পাওয়ার অধিকার আছে। তাই, আমাদের পরিষেবা শিশুদের জন্য কোনো বাধা তৈরি করে না। আমরা শিশুদের ব্যক্তিগত তথ্যের সুরক্ষায় অত্যন্ত সতর্ক এবং সর্বোচ্চ নিরাপত্তা ব্যবস্থা গ্রহণ করি। আমরা কেবল সেই তথ্য সংগ্রহ করি যা আমাদের শিক্ষামূলক পরিষেবা প্রদানের জন্য একান্ত প্রয়োজন এবং কঠোর গোপনীয়তা বজায় রাখি।</p>
            </section>

            <section id="section-7" ref={(el) => (sectionRefs.current['section-7'] = el)} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400 border-b border-slate-700 pb-4">৭. এই নীতির পরিবর্তন</h2>
              <p className="text-gray-300 leading-relaxed">আমরা সময়ে সময়ে আমাদের গোপনীয়তা নীতি আপডেট করতে পারি। যেকোনো পরিবর্তন এই পৃষ্ঠায় পোস্ট করা হবে এবং কার্যকর তারিখ আপডেট করা হবে। আমরা আপনাকে যেকোনো বড় পরিবর্তনের বিষয়ে ইমেইল বা আমাদের পরিষেবার মাধ্যমে অবহিত করব। এই গোপনীয়তা নীতি পর্যায়ক্রমে পর্যালোচনা করা আপনার দায়িত্ব।</p>
            </section>

            <section id="section-8" ref={(el) => (sectionRefs.current['section-8'] = el)} className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 p-6 md:p-8 rounded-2xl shadow-2xl">
              <h2 className="text-3xl font-bold mb-6 text-emerald-400">৮. যোগাযোগ</h2>
              <p className="mb-6 text-gray-300">এই গোপনীয়তা নীতি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:</p>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Mail className="w-6 h-6 text-emerald-400" />
                  <div>
                    <strong className="text-white block">ইমেইল:</strong>
                    <a href="mailto:medicrack.official@gmail.com" className="text-emerald-400 hover:text-emerald-300">
                      medicrack.official@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <Phone className="w-6 h-6 text-emerald-400" />
                  <div>
                    <strong className="text-white block">ফোন:</strong>
                    <span className="text-gray-300">+8801961766621</span>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;