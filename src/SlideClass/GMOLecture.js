import React, { useState } from 'react';
import { Scissors, Link2, Dna, Beaker, CheckCircle, AlertCircle } from 'lucide-react';

export default function GMOLecture() {
  const [activeStep, setActiveStep] = useState(null);
  const [showEnzyme, setShowEnzyme] = useState('both');

  const steps = [
    {
      num: 1,
      title: "Desired Gene আলাদা করা (Gene Isolation)",
      desc: "যে বৈশিষ্ট্য চাই (যেমন: Insulin তৈরির ক্ষমতা), সেই gene টি donor organism (মানুষ) থেকে Restriction Enzyme দিয়ে কেটে নেওয়া হয়।",
      visual: "মানুষের DNA ──✂── Insulin Gene (কাটা হলো)"
    },
    {
      num: 2,
      title: "Vector (Plasmid) কাটা",
      desc: "Vector: DNA বহনকারী মাধ্যম। সবচেয়ে জনপ্রিয় হলো Plasmid (ব্যাক্টেরিয়ার ছোট বৃত্তাকার DNA)। একই Restriction Enzyme দিয়ে Plasmid এও কাটা হয় - যাতে একই ধরনের Sticky Ends তৈরি হয়।",
      visual: "Plasmid (বৃত্তাকার) ──✂── খোলা হলো",
      hasImage: true
    },
    {
      num: 3,
      title: "Gene এবং Vector জোড়া লাগানো (Ligation)",
      desc: "এখন DNA Ligase Enzyme ব্যবহার করে Insulin gene কে কাটা Plasmid এর ভেতরে ঢুকিয়ে জোড়া লাগানো হয়।",
      visual: "Insulin Gene + Plasmid ──🔗── Recombinant Plasmid",
      hasImage: true
    },
    {
      num: 4,
      title: "Transformation (ব্যাক্টেরিয়ায় ঢোকানো)",
      desc: "Recombinant Plasmid কে E. coli bacteria এর ভেতরে ঢুকানো হয় (Heat shock বা Electroporation পদ্ধতিতে)।",
      visual: "এই প্রক্রিয়াকে বলে Transformation",
      hasImage: true
    },
    {
      num: 5,
      title: "Selection (সফল ব্যাক্টেরিয়া বাছাই)",
      desc: "সব bacteria তে Plasmid ঢোকে না। তাই Antibiotic Resistance Marker ব্যবহার করে সফল bacteria গুলো চিনে নেওয়া হয়।",
      visual: "Ampicillin যুক্ত medium এ শুধু সফল bacteria বাঁচবে!"
    },
    {
      num: 6,
      title: "Cloning & Expression (বংশবৃদ্ধি ও প্রোটিন তৈরি)",
      desc: "সফল bacteria গুলোকে Bioreactor এ culture করা হয়। এরা দ্রুত বিভাজিত হয়ে লক্ষ কোটি কপি তৈরি করে।",
      visual: "সবগুলো bacteria এখন Human Insulin protein তৈরি করতে থাকে!"
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 cursor-default">
      <style>{`
        * { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red" stroke="black" stroke-width="1"><circle cx="18" cy="18" r="14"/></svg>') 12 12, auto !important; }
        button, a, [role="button"], .clickable { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="gold" stroke="black" stroke-width="1"><path d="M12 2 L15 8 L22 9 L17 14 L18 21 L12 18 L6 21 L7 14 L2 9 L9 8 Z"/></svg>') 14 14, pointer !important; }
      `}</style>
      <div className="max-w-6xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl p-8 border border-gray-700">
        
        {/* Header */}
        <div className="text-center border-b-4 border-blue-400 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
            <Dna className="w-10 h-10 text-purple-400" />
            GMO তৈরির প্রক্রিয়া
          </h1>
          <p className="text-lg text-gray-300 mt-2">Recombinant DNA Technology</p>
        </div>

        {/* GMO Definition */}
        <div className="bg-gray-700 border-l-4 border-blue-400 p-6 rounded-lg mb-8">
          <h3 className="text-xl font-bold text-cyan-400 mb-3">GMO কী?</h3>
          <p className="text-gray-200 leading-relaxed">
            <strong className="text-white">GMO (Genetically Modified Organism)</strong> হলো এমন জীব যার DNA-তে কৃত্রিমভাবে অন্য জীবের জিন যুক্ত করা হয়েছে, যাতে নতুন বৈশিষ্ট্য আসে। 
            <span className="bg-orange-500 text-white px-3 py-1 rounded ml-2 font-bold">যেমন: BT Cotton, Golden Rice, Insulin-producing Bacteria</span>
          </p>
        </div>

        {/* Enzyme Selection Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => setShowEnzyme('restriction')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              showEnzyme === 'restriction' 
                ? 'bg-red-600 text-white scale-105 shadow-lg shadow-red-500/50' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Scissors className="inline mr-2" /> Restriction Enzyme
          </button>
          <button
            onClick={() => setShowEnzyme('ligase')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              showEnzyme === 'ligase' 
                ? 'bg-green-600 text-white scale-105 shadow-lg shadow-green-500/50' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <Link2 className="inline mr-2" /> DNA Ligase
          </button>
          <button
            onClick={() => setShowEnzyme('both')}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              showEnzyme === 'both' 
                ? 'bg-purple-600 text-white scale-105 shadow-lg shadow-purple-500/50' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            দুটোই দেখাও
          </button>
        </div>

        {/* Enzyme Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {(showEnzyme === 'restriction' || showEnzyme === 'both') && (
            <div className="bg-gradient-to-br from-purple-700 to-purple-900 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105 border border-purple-500">
              <div className="flex items-center gap-3 mb-4">
                <Scissors className="w-8 h-8" />
                <h3 className="text-2xl font-bold">Restriction Enzyme 🔪</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>অপর নাম:</strong> Molecular Scissors (আণবিক কাঁচি)</p>
                <p><strong>কাজ:</strong> DNA কে নির্দিষ্ট স্থানে কেটে টুকরো করা</p>
                <p><strong>উৎস:</strong> Bacteria থেকে পাওয়া যায়</p>
                <p><strong>উদাহরণ:</strong> EcoRI, BamHI, HindIII</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg mt-4">
                <p className="font-bold mb-2">🎯 কীভাবে কাটে?</p>
                <p className="text-sm">এটি Recognition Site বা Palindromic Sequence চিনে কাটে। উভয় strand একই sequence হয় কিন্তু বিপরীত দিক থেকে পড়লে।</p>
              </div>
            </div>
          )}

          {(showEnzyme === 'ligase' || showEnzyme === 'both') && (
            <div className="bg-gradient-to-br from-green-700 to-green-900 text-white p-6 rounded-xl shadow-lg transform transition hover:scale-105 border border-green-500">
              <div className="flex items-center gap-3 mb-4">
                <Link2 className="w-8 h-8" />
                <h3 className="text-2xl font-bold">DNA Ligase 🔗</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>অপর নাম:</strong> Molecular Glue (আণবিক আঠা)</p>
                <p><strong>কাজ:</strong> কাটা DNA এর টুকরোগুলো জোড়া লাগানো</p>
                <p><strong>উৎস:</strong> E. coli bacteria এবং T4 bacteriophage</p>
                <p><strong>উদাহরণ:</strong> T4 DNA Ligase</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg mt-4">
                <p className="font-bold mb-2">🎯 কীভাবে জোড়া লাগায়?</p>
                <p className="text-sm">DNA এর sugar-phosphate backbone এর মধ্যে phosphodiester bond তৈরি করে দুটি টুকরো জুড়ে দেয়।</p>
              </div>
            </div>
          )}
        </div>

        {/* DNA Cutting Visualization */}
        <div className="bg-gray-700 border-4 border-cyan-500 p-6 rounded-xl mb-8">
          <h3 className="text-2xl font-bold text-center text-cyan-400 mb-4">🔬 EcoRI দিয়ে DNA কাটা</h3>
          <div className="bg-gray-900 text-cyan-300 p-4 rounded-lg font-mono text-center mb-4 tracking-widest border border-cyan-500">
            5'---GAATTC---3'<br />
            3'---CTTAAG---5'
          </div>
          <p className="text-4xl text-center my-4">✂️ কাটার পর ✂️</p>
          <div className="bg-gray-900 text-cyan-300 p-4 rounded-lg font-mono text-center mb-4 tracking-widest border border-cyan-500">
            5'---G&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AATTC---3'<br />
            3'---CTTAA&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;G---5'
          </div>
          <div className="bg-red-900 border-l-4 border-red-500 p-4 rounded">
            <p className="text-red-200 font-bold text-center">
              এই ধরনের কাটাকে বলে <span className="bg-orange-500 text-white px-2 py-1 rounded">"Sticky Ends"</span> (আঠালো প্রান্ত)<br />
              কারণ এরা সহজেই অন্য DNA এর সাথে জুড়তে পারে!
            </p>
          </div>
        </div>

        {/* Important Note */}
        <div className="bg-green-900 border-l-4 border-green-400 p-4 rounded mb-8">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <strong className="text-green-300">📌 গুরুত্বপূর্ণ:</strong>
              <p className="text-green-200 mt-1">Sticky Ends থাকলে DNA Ligase সহজে জোড়া লাগাতে পারে। কিছু enzyme "Blunt Ends" তৈরি করে - সেখানে জোড়া লাগানো কঠিন।</p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <h2 className="text-3xl font-bold text-red-400 border-l-4 border-red-500 pl-4 mb-6">
          🧫 ব্যাক্টেরিয়ায় GMO তৈরির সম্পূর্ণ প্রক্রিয়া
        </h2>

        <div className="space-y-4 mb-8">
          {steps.map((step) => (
            <div
              key={step.num}
              className={`bg-gray-700 border-2 border-yellow-500 rounded-lg p-5 transition-all clickable ${
                activeStep === step.num ? 'ring-4 ring-yellow-400 scale-105' : 'hover:shadow-lg hover:shadow-yellow-500/30'
              }`}
              onClick={() => setActiveStep(activeStep === step.num ? null : step.num)}
            >
              <div className="flex items-start gap-4">
                <div className="bg-yellow-500 text-black w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                  {step.num}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-cyan-400 mb-2">{step.title}</h3>
                  <p className="text-gray-200 leading-relaxed mb-3">{step.desc}</p>
                  <div className="bg-gray-900 text-cyan-300 px-4 py-2 rounded font-mono text-sm border border-cyan-500">
                    {step.visual}
                  </div>
                  
                  {/* Visual Diagrams */}
                  {step.hasImage && step.num === 2 && (
                    <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-purple-500">
                      <svg viewBox="0 0 400 200" className="w-full h-auto">
                        {/* Circular Plasmid */}
                        <circle cx="100" cy="100" r="60" fill="none" stroke="#8b5cf6" strokeWidth="4"/>
                        <text x="100" y="105" textAnchor="middle" fill="#a78bfa" fontSize="14" fontWeight="bold">Plasmid</text>
                        
                        {/* Scissors */}
                        <text x="180" y="105" fontSize="40">✂️</text>
                        
                        {/* Cut Plasmid (Linear) */}
                        <line x1="250" y1="100" x2="370" y2="100" stroke="#8b5cf6" strokeWidth="4"/>
                        <text x="250" y="90" fill="#22d3ee" fontSize="12">5'</text>
                        <text x="360" y="90" fill="#22d3ee" fontSize="12">3'</text>
                        <text x="310" y="130" textAnchor="middle" fill="#fbbf24" fontSize="12" fontWeight="bold">Sticky Ends</text>
                        
                        {/* Restriction Site Label */}
                        <text x="100" y="180" textAnchor="middle" fill="#f87171" fontSize="11" fontWeight="bold">Recognition Site এ কাটা</text>
                      </svg>
                    </div>
                  )}
                  
                  {step.hasImage && step.num === 3 && (
                    <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-green-500">
                      <svg viewBox="0 0 450 220" className="w-full h-auto">
                        {/* Gene Fragment */}
                        <rect x="30" y="30" width="100" height="30" fill="#f59e0b" stroke="#fb923c" strokeWidth="2" rx="5"/>
                        <text x="80" y="50" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">Insulin Gene</text>
                        <text x="30" y="25" fill="#22d3ee" fontSize="10">5'</text>
                        <text x="120" y="25" fill="#22d3ee" fontSize="10">3'</text>
                        
                        {/* Plus Sign */}
                        <text x="155" y="55" fontSize="30" fill="#10b981">+</text>
                        
                        {/* Linear Plasmid */}
                        <line x1="200" y1="45" x2="320" y2="45" stroke="#8b5cf6" strokeWidth="4"/>
                        <text x="200" y="35" fill="#22d3ee" fontSize="10">5'</text>
                        <text x="310" y="35" fill="#22d3ee" fontSize="10">3'</text>
                        <text x="260" y="70" textAnchor="middle" fill="#a78bfa" fontSize="11">Cut Plasmid</text>
                        
                        {/* Arrow Down */}
                        <text x="220" y="110" fontSize="35">⬇️</text>
                        <text x="180" y="115" fill="#10b981" fontSize="12" fontWeight="bold">DNA Ligase</text>
                        
                        {/* Recombinant Circular Plasmid */}
                        <circle cx="225" cy="170" r="40" fill="none" stroke="#10b981" strokeWidth="4"/>
                        <rect x="205" y="155" width="40" height="15" fill="#f59e0b" stroke="#fb923c" strokeWidth="1" rx="2"/>
                        <text x="225" y="210" textAnchor="middle" fill="#4ade80" fontSize="12" fontWeight="bold">Recombinant DNA</text>
                      </svg>
                    </div>
                  )}
                  
                  {step.hasImage && step.num === 4 && (
                    <div className="mt-4 bg-gray-900 p-4 rounded-lg border border-blue-500">
                      <svg viewBox="0 0 450 200" className="w-full h-auto">
                        {/* Recombinant Plasmid */}
                        <circle cx="80" cy="100" r="35" fill="none" stroke="#10b981" strokeWidth="3"/>
                        <rect x="65" y="90" width="30" height="10" fill="#f59e0b" stroke="#fb923c" strokeWidth="1" rx="1"/>
                        <text x="80" y="150" textAnchor="middle" fill="#4ade80" fontSize="11" fontWeight="bold">rDNA</text>
                        
                        {/* Arrow */}
                        <text x="140" y="110" fontSize="40">➡️</text>
                        <text x="130" y="85" fill="#fbbf24" fontSize="10" fontWeight="bold">Heat Shock</text>
                        <text x="130" y="140" fill="#fbbf24" fontSize="9">Electroporation</text>
                        
                        {/* Bacteria (Rod shape) */}
                        <ellipse cx="280" cy="100" rx="60" ry="35" fill="#1e40af" stroke="#3b82f6" strokeWidth="3"/>
                        <text x="280" y="105" textAnchor="middle" fill="#93c5fd" fontSize="12" fontWeight="bold">E. coli</text>
                        
                        {/* Plasmid inside bacteria */}
                        <circle cx="300" cy="95" r="12" fill="none" stroke="#10b981" strokeWidth="2"/>
                        <rect x="294" y="90" width="12" height="5" fill="#f59e0b" rx="1"/>
                        
                        {/* Success indicator */}
                        <text x="280" y="160" textAnchor="middle" fill="#22d3ee" fontSize="11" fontWeight="bold">Transformed Bacteria ✓</text>
                        
                        {/* Arrow to success */}
                        <text x="370" y="110" fontSize="35">→</text>
                        <text x="395" y="105" fontSize="30">✅</text>
                      </svg>
                    </div>
                  )}
                  
                  {step.num === 3 && (
                    <p className="mt-3 text-sm text-gray-300">
                      এই নতুন Plasmid কে বলে <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">Recombinant DNA</span> বা <span className="bg-orange-500 text-white px-2 py-1 rounded font-bold">rDNA</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <h2 className="text-3xl font-bold text-red-400 border-l-4 border-red-500 pl-4 mb-6">
          📊 দুটি Enzyme এর তুলনা
        </h2>
        
        <div className="overflow-x-auto mb-8">
          <table className="w-full border-2 border-gray-600">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border-2 border-gray-600 p-3 text-left">বৈশিষ্ট্য</th>
                <th className="border-2 border-gray-600 p-3 text-left">Restriction Enzyme</th>
                <th className="border-2 border-gray-600 p-3 text-left">DNA Ligase</th>
              </tr>
            </thead>
            <tbody className="text-gray-200">
              <tr className="bg-gray-700">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">প্রধান কাজ</td>
                <td className="border-2 border-gray-600 p-3">DNA কাটা (cutting)</td>
                <td className="border-2 border-gray-600 p-3">DNA জোড়া লাগানো (joining)</td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">উৎস</td>
                <td className="border-2 border-gray-600 p-3">Bacteria (প্রতিরক্ষা ব্যবস্থা)</td>
                <td className="border-2 border-gray-600 p-3">E. coli, T4 phage</td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">চেনার পদ্ধতি</td>
                <td className="border-2 border-gray-600 p-3">Palindromic sequence চেনে</td>
                <td className="border-2 border-gray-600 p-3">Sticky/Blunt ends চেনে</td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">Bond ভাঙ্গা/তৈরি</td>
                <td className="border-2 border-gray-600 p-3">Phosphodiester bond ভাঙ্গে</td>
                <td className="border-2 border-gray-600 p-3">Phosphodiester bond তৈরি করে</td>
              </tr>
              <tr className="bg-gray-700">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">উদাহরণ</td>
                <td className="border-2 border-gray-600 p-3">EcoRI, BamHI, HindIII</td>
                <td className="border-2 border-gray-600 p-3">T4 DNA Ligase</td>
              </tr>
              <tr className="bg-gray-800">
                <td className="border-2 border-gray-600 p-3 font-bold text-white">প্রয়োজনীয় উপাদান</td>
                <td className="border-2 border-gray-600 p-3">Mg²⁺ ion</td>
                <td className="border-2 border-gray-600 p-3">ATP এবং Mg²⁺ ion</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Example Box */}
        <div className="bg-gray-700 border-2 border-dashed border-orange-500 p-6 rounded-lg mb-8">
          <h3 className="text-2xl font-bold text-orange-400 mb-4 flex items-center gap-2">
            <Beaker className="w-7 h-7" />
            🌾 বাস্তব উদাহরণ: Golden Rice
          </h3>
          <p className="mb-3 text-gray-200"><strong className="text-white">সমস্যা:</strong> সাধারণ চালে Vitamin A নেই</p>
          <p className="font-bold mb-2 text-white">সমাধান:</p>
          <ul className="list-disc list-inside space-y-2 text-gray-200 ml-4">
            <li>Daffodil গাছ থেকে <strong className="text-white">Beta-carotene তৈরির gene</strong> নেওয়া হয় (Restriction Enzyme দিয়ে)</li>
            <li>ধানের plasmid এ gene টি ঢোকানো হয় (Ligase দিয়ে)</li>
            <li>Modified plasmid দিয়ে ধান গাছ তৈরি করা হয়</li>
            <li>ফলাফল: <span className="bg-orange-500 text-white px-3 py-1 rounded font-bold">Golden Rice</span> - যাতে Vitamin A আছে!</li>
          </ul>
        </div>

        {/* Key Points */}
        <h2 className="text-3xl font-bold text-red-400 border-l-4 border-red-500 pl-4 mb-6">
          🎯 লেকচারের জন্য Key Points
        </h2>
        
        <div className="bg-green-900 border-l-4 border-green-400 p-6 rounded mb-8">
          <ol className="space-y-3 text-gray-200">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span><strong className="text-white">Restriction Enzyme = Molecular Scissors</strong> - DNA কাটে, Sticky/Blunt ends তৈরি করে</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span><strong className="text-white">DNA Ligase = Molecular Glue</strong> - DNA জোড়া লাগায়</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span>দুটি enzyme-ই <strong className="text-white">আবশ্যক</strong> - একটা ছাড়া GMO তৈরি অসম্ভব!</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span>Same enzyme দিয়ে donor DNA ও vector কাটতে হবে (compatible ends এর জন্য)</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span>ব্যাক্টেরিয়া তে implement সহজ কারণ: দ্রুত বংশবৃদ্ধি, সহজ genetic manipulation</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
              <span>Vector হিসেবে Plasmid সবচেয়ে জনপ্রিয়</span>
            </li>
          </ol>
        </div>

        {/* Memory Trick */}
        <div className="bg-gradient-to-r from-pink-600 to-red-600 text-white p-8 rounded-xl text-center shadow-lg border border-pink-400">
          <h2 className="text-3xl font-bold mb-4">মনে রাখার সূত্র</h2>
          <p className="text-2xl font-bold mb-3">"কাটো → জোড়ো → ঢোকাও → বাছাই → বাড়াও"</p>
          <p className="text-lg">Restriction → Ligation → Transformation → Selection → Cloning</p>
        </div>
      </div>
    </div>
  );
}