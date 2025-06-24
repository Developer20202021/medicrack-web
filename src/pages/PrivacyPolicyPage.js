import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, Mail, MapPin, Phone, User, Monitor, Settings, Zap } from 'lucide-react'; // Lucide icons for visual cues

const PrivacyPolicyPage = () => {
  // Accordion State
  const [openAccordion, setOpenAccordion] = useState(null); // Tracks which accordion item is open

  // Navigation Highlighting State
  const [activeSection, setActiveSection] = useState('section-1');
  const sectionRefs = useRef({});

  // Function to toggle accordion
  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // Effect for Navigation Highlighting based on scroll position
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-30% 0px -70% 0px', // Adjust these values to control when the section becomes active
      threshold: 0, // Even a tiny bit of the section in view
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe each section
    Object.keys(sectionRefs.current).forEach((key) => {
      if (sectionRefs.current[key]) {
        observer.observe(sectionRefs.current[key]);
      }
    });

    return () => {
      // Clean up observer on component unmount
      Object.keys(sectionRefs.current).forEach((key) => {
        if (sectionRefs.current[key]) {
          observer.unobserve(sectionRefs.current[key]);
        }
      });
    };
  }, []);

  // Helper to scroll to section
  const scrollToSection = (id) => {
    const sectionElement = document.getElementById(id);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-['Hind_Siliguri'] text-slate-700">
      <style>
        {`
        .active-nav {
            background-color: #10b981; /* emerald-500 */
            color: white;
            transform: translateX(4px);
        }
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.5s ease-in-out;
        }
        .accordion-content.open {
            max-height: 1000px; /* Adjust as needed */
        }
        `}
      </style>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800">মেডিক্র্যাকের গোপনীয়তা নীতি</h1>
          <p className="text-slate-500 mt-2">কার্যকরী তারিখ: 24 জুন, 2025</p>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sticky Navigation Sidebar */}
          <aside className="md:w-1/4 lg:w-1/5 md:sticky top-8 self-start">
            <nav className="bg-white rounded-lg shadow-md p-4">
              <ul className="space-y-2">
                <li>
                  <a
                    href="#section-1"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-1'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-1' ? 'active-nav' : ''}`}
                  >
                    ১. তথ্য সংগ্রহ
                  </a>
                </li>
                <li>
                  <a
                    href="#section-2"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-2'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-2' ? 'active-nav' : ''}`}
                  >
                    ২. তথ্য ব্যবহার
                  </a>
                </li>
                <li>
                  <a
                    href="#section-3"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-3'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-3' ? 'active-nav' : ''}`}
                  >
                    ৩. তথ্য শেয়ার
                  </a>
                </li>
                <li>
                  <a
                    href="#section-4"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-4'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-4' ? 'active-nav' : ''}`}
                  >
                    ৪. আপনার অধিকার
                  </a>
                </li>
                <li>
                  <a
                    href="#section-5"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-5'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-5' ? 'active-nav' : ''}`}
                  >
                    ৫. ডেটা সুরক্ষা
                  </a>
                </li>
                <li>
                  <a
                    href="#section-6"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-6'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-6' ? 'active-nav' : ''}`}
                  >
                    ৬. শিশুদের গোপনীয়তা
                  </a>
                </li>
                <li>
                  <a
                    href="#section-7"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-7'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-7' ? 'active-nav' : ''}`}
                  >
                    ৭. নীতি পরিবর্তন
                  </a>
                </li>
                <li>
                  <a
                    href="#section-8"
                    onClick={(e) => { e.preventDefault(); scrollToSection('section-8'); }}
                    className={`block py-2 px-4 rounded-md font-semibold text-slate-600 hover:bg-slate-100 transition-all duration-300 ${activeSection === 'section-8' ? 'active-nav' : ''}`}
                  >
                    ৮. যোগাযোগ
                  </a>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="md:w-3/4 lg:w-4/5 space-y-12">
            {/* Introduction */}
            <section className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg leading-relaxed">মেডিক্র্যাক ("আমরা", "আমাদের") মেডিকেল ভর্তি পরীক্ষা, নবম-দশম ও একাদশ-দ্বাদশ শ্রেণীর শিক্ষার্থীদের জন্য একটি সুরক্ষিত ও নির্ভরযোগ্য প্ল্যাটফর্ম। আমরা আপনার গোপনীয়তাকে সর্বোচ্চ গুরুত্ব সহকারে বিবেচনা করি। এই গোপনীয়তা নীতি ব্যাখ্যা করে যে আমরা কীভাবে আপনার তথ্য সংগ্রহ করি, ব্যবহার করি এবং সুরক্ষা করি যখন আপনি আমাদের পরিষেবা ব্যবহার করেন। আমাদের প্ল্যাটফর্ম সকল বয়সের শিক্ষার্থীদের জন্য উন্মুক্ত, এবং আমরা আপনার ডেটার সর্বোচ্চ নিরাপত্তা নিশ্চিত করি।</p>
            </section>

            {/* Section 1: What We Collect */}
            <section id="section-1" ref={(el) => (sectionRefs.current['section-1'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">১. আমরা কোন তথ্য সংগ্রহ করি?</h2>
              <p className="mb-6">আমরা আপনার কাছ থেকে বিভিন্ন ধরনের তথ্য সংগ্রহ করি, যা আমাদের পরিষেবা প্রদান এবং উন্নত করতে সহায়তা করে।</p>
              <div className="space-y-4">
                {/* Accordion Item 1 */}
                <div className="border rounded-lg">
                  <button
                    className="accordion-header w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition"
                    onClick={() => toggleAccordion(0)}
                  >
                    <span className="font-semibold text-lg">ক. ব্যক্তিগতভাবে শনাক্তকরণযোগ্য তথ্য (PII)</span>
                    <ChevronDown className={`w-6 h-6 transform transition-transform ${openAccordion === 0 ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  <div className={`accordion-content ${openAccordion === 0 ? 'open' : ''}`}>
                    <div className="p-4 border-t">
                      <p className="mb-4">আপনি যখন আমাদের পরিষেবা ব্যবহার করেন, যেমন নিবন্ধন করেন, কোর্সে ভর্তি হন, বা আমাদের সাথে যোগাযোগ করেন, তখন আমরা আপনার কাছ থেকে নিম্নলিখিত ব্যক্তিগত তথ্য সংগ্রহ করতে পারি:</p>
                      <ul className="list-disc list-inside space-y-2 pl-4">
                        <li><strong>পরিচয় ও যোগাযোগ তথ্য:</strong> নাম, ইমেইল, মোবাইল, ঠিকানা।</li>
                        <li><strong>শিক্ষাগত তথ্য:</strong> কলেজের নাম, HSC/SSC বোর্ড, GPA, রোল, বছর, ইত্যাদি।</li>
                        <li><strong>পারিবারিক তথ্য:</strong> পিতার নাম, পেশা, মোবাইল, মাতার নাম।</li>
                        <li><strong>অন্যান্য ব্যক্তিগত তথ্য:</strong> জন্ম তারিখ, লিঙ্গ, স্বপ্ন, ইত্যাদি।</li>
                      </ul>
                    </div>
                  </div>
                </div>
                {/* Accordion Item 2 */}
                <div className="border rounded-lg">
                  <button
                    className="accordion-header w-full text-left p-4 bg-slate-50 hover:bg-slate-100 flex justify-between items-center transition"
                    onClick={() => toggleAccordion(1)}
                  >
                    <span className="font-semibold text-lg">খ. ব্যবহার ও ডিভাইস তথ্য</span>
                    <ChevronDown className={`w-6 h-6 transform transition-transform ${openAccordion === 1 ? 'rotate-180' : 'rotate-0'}`} />
                  </button>
                  <div className={`accordion-content ${openAccordion === 1 ? 'open' : ''}`}>
                    <div className="p-4 border-t">
                      <p className="mb-4">আপনি যখন আমাদের পরিষেবা ব্যবহার করেন, তখন স্বয়ংক্রিয়ভাবে কিছু তথ্য সংগ্রহ করা হয়:</p>
                      <ul className="list-disc list-inside space-y-2 pl-4">
                       
                        <li><strong>ব্যবহারের ডেটা:</strong> অ্যাক্সেস সময়, দেখা পৃষ্ঠা, IP ঠিকানা, ব্রাউজার।</li>
                        <li><strong>কুকিজ ও ট্র্যাকিং প্রযুক্তি:</strong> আপনার অভিজ্ঞতা উন্নত করতে ব্যবহৃত হয়।</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: How We Use Information */}
            <section id="section-2" ref={(el) => (sectionRefs.current['section-2'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">২. আমরা কিভাবে আপনার তথ্য ব্যবহার করি?</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <User className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div><strong className="font-semibold">পরিষেবা প্রদান ও রক্ষণাবেক্ষণ:</strong> আপনাকে আমাদের পরিষেবা সরবরাহ করতে, অ্যাকাউন্ট পরিচালনা করতে এবং এটি চালু রাখতে।</div>
                </div>
                <div className="flex items-start gap-4">
                  <Mail className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div><strong className="font-semibold">আপনার সাথে যোগাযোগ:</strong> পরিষেবা সংক্রান্ত আপডেট, নিরাপত্তা সতর্কতা এবং সহায়ক মেসেজ পাঠাতে।</div>
                </div>
                <div className="flex items-start gap-4">
                  <Settings className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div><strong className="font-semibold">পরিষেবা উন্নত করা:</strong> আমাদের পরিষেবা বিশ্লেষণ ও উন্নত করতে, নতুন ফিচার তৈরি করতে।</div>
                </div>
                <div className="flex items-start gap-4">
                  <Monitor className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div><strong className="font-semibold">ব্যক্তিগতকৃত অভিজ্ঞতা:</strong> আপনার ব্যবহারের উপর ভিত্তি করে কন্টেন্ট কাস্টমাইজ করতে।</div>
                </div>
                <div className="flex items-start gap-4">
                  <Zap className="h-6 w-6 text-emerald-500 mt-1 flex-shrink-0" />
                  <div><strong className="font-semibold">নিরাপত্তা ও জালিয়াতি প্রতিরোধ:</strong> অননুমোদিত অ্যাক্সেস থেকে সুরক্ষা নিশ্চিত করতে।</div>
                </div>
              </div>
            </section>

            {/* Section 3: Information Sharing */}
            <section id="section-3" ref={(el) => (sectionRefs.current['section-3'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">৩. তথ্য শেয়ার করা</h2>
              <p className="leading-relaxed">আমরা আপনার ব্যক্তিগত ডেটার সর্বোচ্চ গোপনীয়তা বজায় রাখি। আপনার সম্মতি ছাড়া, অথবা আমাদের শিক্ষামূলক পরিষেবা সরাসরি প্রদান ও এর রক্ষণাবেক্ষণের জন্য (যেমন: ক্লাউড হোস্টিং, পেমেন্ট প্রসেসিং) অত্যাবশ্যক না হলে, আমরা আপনার ব্যক্তিগত তথ্য কোনো তৃতীয় পক্ষের সাথে শেয়ার করি না। এমনকি এই অত্যাবশ্যকীয় পরিষেবা প্রদানকারীদের ক্ষেত্রেও আমরা কঠোর গোপনীয়তা চুক্তি মেনে চলি। আপনার ডেটা কখনো বিক্রি বা ভাড়া দেওয়া হয় না।</p>
            </section>

            {/* Section 4: Your Rights */}
            <section id="section-4" ref={(el) => (sectionRefs.current['section-4'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">৪. আপনার অধিকার</h2>
              <p className="mb-6">আপনি আপনার ব্যক্তিগত তথ্য সম্পর্কে নিম্নলিখিত অধিকারগুলো ভোগ করেন:</p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg"><strong>অ্যাক্সেসের অধিকার:</strong> আপনার তথ্য অ্যাক্সেস করার অধিকার।</div>
                <div className="bg-slate-50 p-4 rounded-lg"><strong>সংশোধনের অধিকার:</strong> ভুল তথ্য সংশোধন করার অধিকার।</div>
                <div className="bg-slate-50 p-4 rounded-lg"><strong>মুছে ফেলার অধিকার:</strong> আপনার তথ্য মুছে ফেলার অধিকার।</div>
                <div className="bg-slate-50 p-4 rounded-lg"><strong>আপত্তির অধিকার:</strong> তথ্য প্রক্রিয়াকরণে আপত্তি জানানোর অধিকার।</div>
              </div>
            </section>

            {/* Section 5: Data Security */}
            <section id="section-5" ref={(el) => (sectionRefs.current['section-5'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">৫. ডেটা সুরক্ষা</h2>
              <p className="leading-relaxed">আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষাকে সর্বোচ্চ অগ্রাধিকার দিই। আপনার ডেটা অত্যন্ত সুরক্ষিত রাখতে আমরা অত্যাধুনিক প্রশাসনিক, প্রযুক্তিগত এবং শারীরিক নিরাপত্তা ব্যবস্থা গ্রহণ করি। যদিও ইন্টারনেটের মাধ্যমে ডেটা ট্রান্সমিশনের কোনো পদ্ধতিই 100% সুরক্ষিত নয়, আমরা আপনার তথ্যের সুরক্ষায় সর্বোচ্চ চেষ্টা করি এবং নিয়মিত আমাদের নিরাপত্তা প্রোটোকল পর্যালোচনা ও উন্নত করি।</p>
            </section>

            {/* Section 6: Children's Privacy */}
            <section id="section-6" ref={(el) => (sectionRefs.current['section-6'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">৬. শিশুদের গোপনীয়তা</h2>
              <p className="leading-relaxed">আমাদের মেডিক্র্যাক প্ল্যাটফর্ম সকল বয়সের শিক্ষার্থীর জন্য উন্মুক্ত, এবং আমরা বিশ্বাস করি প্রতিটি শিশুরই মানসম্মত শিক্ষা পাওয়ার অধিকার আছে। তাই, আমাদের পরিষেবা শিশুদের জন্য কোনো বাধা তৈরি করে না। আমরা শিশুদের ব্যক্তিগত তথ্যের সুরক্ষায় অত্যন্ত সতর্ক এবং সর্বোচ্চ নিরাপত্তা ব্যবস্থা গ্রহণ করি। আমরা কেবল সেই তথ্য সংগ্রহ করি যা আমাদের শিক্ষামূলক পরিষেবা প্রদানের জন্য একান্ত প্রয়োজন এবং কঠোর গোপনীয়তা বজায় রাখি।</p>
            </section>

            {/* Section 7: Policy Changes */}
            <section id="section-7" ref={(el) => (sectionRefs.current['section-7'] = el)} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4 text-emerald-600 border-b pb-2">৭. এই নীতির পরিবর্তন</h2>
              <p className="leading-relaxed">আমরা সময়ে সময়ে আমাদের গোপনীয়তা নীতি আপডেট করতে পারি। যেকোনো পরিবর্তন এই পৃষ্ঠায় পোস্ট করা হবে এবং কার্যকর তারিখ আপডেট করা হবে। আমরা আপনাকে যেকোনো বড় পরিবর্তনের বিষয়ে ইমেইল বা আমাদের পরিষেবার মাধ্যমে অবহিত করব। এই গোপনীয়তা নীতি পর্যায়ক্রমে পর্যালোচনা করা আপনার দায়িত্ব।</p>
            </section>

            {/* Section 8: Contact */}
            <section id="section-8" ref={(el) => (sectionRefs.current['section-8'] = el)} className="bg-emerald-50 p-6 rounded-lg shadow-md border-l-4 border-emerald-500">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700">৮. যোগাযোগ</h2>
              <p className="mb-4">এই গোপনীয়তা নীতি সম্পর্কে আপনার কোনো প্রশ্ন থাকলে, অনুগ্রহ করে আমাদের সাথে যোগাযোগ করুন:</p>
              <div className="space-y-2">
                <p className="flex items-center gap-2"><Mail className="h-5 w-5 text-emerald-600" /> <strong>ইমেইল:</strong> <a href="mailto:medicrack.official@gmail.com" className="text-emerald-600 hover:underline">medicrack.official@gmail.com</a></p>
              
                <p className="flex items-center gap-2"><Phone className="h-5 w-5 text-emerald-600" /> <strong>ফোন:</strong> +8801961766621</p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
