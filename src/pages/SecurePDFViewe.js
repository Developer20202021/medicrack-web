import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SecurePDFViewer = () => {
  const location = useLocation();
  const { fileId, email } = location.state || {};
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPDF = async () => {
      try {
        setLoading(true);
        const apiUrl = `https://medicrack-pdf-upload-view-496984660515.asia-south1.run.app/api/pdf-view/${fileId}?email=${encodeURIComponent(email)}`;
        
        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error('PDF load করতে সমস্যা হয়েছে');
        }
        
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (fileId && email) {
      fetchPDF();
    }

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [fileId, email]);

  // Enhanced print and save protection
  useEffect(() => {
    const preventPrint = (e) => {
      e.preventDefault();
      e.stopImmediatePropagation();
      alert('⚠️ Print এবং Download disabled আছে!');
      return false;
    };

    const handleKeyDown = (e) => {
      // Disable Ctrl+P, Cmd+P (Print)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.keyCode === 80)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        alert('⚠️ Print disabled আছে!');
        return false;
      }
      // Disable Ctrl+S, Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.keyCode === 83)) {
        e.preventDefault();
        e.stopImmediatePropagation();
        alert('⚠️ Save disabled আছে!');
        return false;
      }
      // Disable F12, Ctrl+Shift+I (DevTools)
      if (e.keyCode === 123 || ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74))) {
        e.preventDefault();
        return false;
      }
    };

    // Multiple layers of print protection
    window.addEventListener('beforeprint', preventPrint, true);
    window.addEventListener('afterprint', preventPrint, true);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    // Override window.print completely
    const originalPrint = window.print;
    window.print = function() {
      alert('⚠️ Print functionality disabled আছে!');
      return false;
    };

    // Hide print button in PDF viewer if possible
    const style = document.createElement('style');
    style.innerHTML = `
      @media print {
        html, body { display: none !important; visibility: hidden !important; }
      }
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('beforeprint', preventPrint, true);
      window.removeEventListener('afterprint', preventPrint, true);
      window.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keydown', handleKeyDown, true);
      window.print = originalPrint;
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Prevent mailto links
  useEffect(() => {
    const preventMailto = (e) => {
      if (e.target.tagName === 'A' && e.target.href && e.target.href.startsWith('mailto:')) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    document.addEventListener('click', preventMailto, true);
    
    return () => {
      document.removeEventListener('click', preventMailto, true);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-700 border-t-blue-500"></div>
          <p className="mt-6 text-gray-300 text-lg font-medium">PDF লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="bg-red-950 border-2 border-red-700 rounded-xl p-8 max-w-md shadow-2xl">
          <div className="flex items-center mb-4">
            <svg className="w-8 h-8 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-red-400 font-bold text-xl">Error</h3>
          </div>
          <p className="text-red-300 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-gray-950 overflow-hidden">
      {/* PDF Viewer */}
      <iframe
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Viewer"
        style={{ border: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Watermark Overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 9999 }}>
        {/* Center HUGE Watermark - Main Protection */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="transform rotate-[-45deg] text-white font-black opacity-15 select-none px-12 py-8 rounded-3xl shadow-2xl"
            style={{
              fontSize: '5rem',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(147, 51, 234, 0.4) 100%)',
              backdropFilter: 'blur(8px)',
              textShadow: '0 4px 20px rgba(0,0,0,0.5)',
              letterSpacing: '0.1em',
              lineHeight: '1.2'
            }}
          >
            {email}
          </div>
        </div>

        {/* Secondary Watermarks - Diagonal Pattern */}
        <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] text-blue-400 text-3xl font-bold opacity-10 select-none">
          {email}
        </div>
        <div className="absolute top-1/4 right-1/4 transform translate-x-1/2 -translate-y-1/2 rotate-[30deg] text-purple-400 text-3xl font-bold opacity-10 select-none">
          {email}
        </div>
        <div className="absolute bottom-1/4 left-1/4 transform -translate-x-1/2 translate-y-1/2 rotate-[30deg] text-purple-400 text-3xl font-bold opacity-10 select-none">
          {email}
        </div>
        <div className="absolute bottom-1/4 right-1/4 transform translate-x-1/2 translate-y-1/2 rotate-[-30deg] text-blue-400 text-3xl font-bold opacity-10 select-none">
          {email}
        </div>

        {/* Top Left */}
        <div className="absolute top-6 left-6 bg-gradient-to-br from-gray-900/95 to-gray-800/95 text-blue-300 px-5 py-3 rounded-xl text-sm font-mono shadow-2xl border-2 border-blue-700/50">
          <span className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="font-bold">{email}</span>
          </span>
        </div>
        
        {/* Top Right */}
        <div className="absolute top-6 right-6 bg-gradient-to-bl from-gray-800/95 to-gray-900/95 text-blue-300 px-5 py-3 rounded-xl text-sm font-mono shadow-2xl border-2 border-blue-700/50">
          <span className="flex items-center gap-2">
            <span className="font-bold">{email}</span>
            <span className="text-lg">🔒</span>
          </span>
        </div>
        
        {/* Bottom Left */}
        <div className="absolute bottom-6 left-6 bg-gradient-to-tr from-gray-900/95 to-gray-800/95 text-blue-300 px-5 py-3 rounded-xl text-sm font-mono shadow-2xl border-2 border-purple-700/50">
          <span className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <span className="font-bold">{email}</span>
          </span>
        </div>
        
        {/* Bottom Right */}
        <div className="absolute bottom-6 right-6 bg-gradient-to-tl from-gray-800/95 to-gray-900/95 text-blue-300 px-5 py-3 rounded-xl text-sm font-mono shadow-2xl border-2 border-purple-700/50">
          <span className="flex items-center gap-2">
            <span className="font-bold">{email}</span>
            <span className="text-lg">🔒</span>
          </span>
        </div>

        {/* Top Center */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-900/90 to-purple-900/90 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border-2 border-blue-500">
          <span className="flex items-center gap-2">
            <span>📄</span>
            <span>PROTECTED DOCUMENT</span>
            <span className="text-blue-300">•</span>
            <span className="text-blue-200">{email}</span>
          </span>
        </div>

        {/* Bottom Center */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-900/90 to-orange-900/90 text-white px-8 py-3 rounded-full text-sm font-bold shadow-2xl border-2 border-red-500">
          <span className="flex items-center gap-2">
            <span>⚠️</span>
            <span>PRINT & DOWNLOAD DISABLED</span>
            <span className="text-yellow-300">•</span>
            <span className="text-yellow-200">{email}</span>
          </span>
        </div>

        {/* Middle Left */}
        <div className="absolute top-1/2 left-6 transform -translate-y-1/2 bg-gradient-to-r from-indigo-900/80 to-blue-900/80 text-white px-4 py-6 rounded-xl text-xs font-mono shadow-2xl border-2 border-indigo-500 rotate-[-90deg] origin-center">
          {email}
        </div>

        {/* Middle Right */}
        <div className="absolute top-1/2 right-6 transform -translate-y-1/2 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white px-4 py-6 rounded-xl text-xs font-mono shadow-2xl border-2 border-indigo-500 rotate-[90deg] origin-center">
          {email}
        </div>
      </div>
      
      {/* Protection Layer */}
      <div 
        className="absolute inset-0 pointer-events-none select-none"
        onContextMenu={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{ 
          zIndex: 9998,
          background: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(59, 130, 246, 0.02) 20px, rgba(59, 130, 246, 0.02) 40px)'
        }}
      />

      {/* Enhanced CSS Protection */}
      <style>{`
        @media print {
          html, body, * { 
            display: none !important; 
            visibility: hidden !important;
            opacity: 0 !important;
          }
        }
        
        iframe {
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          user-select: none !important;
          pointer-events: auto !important;
        }

        a[href^="mailto:"] {
          pointer-events: none !important;
          cursor: default !important;
        }

        @page {
          size: 0;
          margin: 0;
        }
      `}</style>
    </div>
  );
};

export default SecurePDFViewer;