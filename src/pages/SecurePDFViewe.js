import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const SecurePDFViewer = () => {
  // Mock data for demonstration - replace with actual router data
  const location = useLocation();
  const { fileId, email } = location.state || {};
  
  const [pdfUrl, setPdfUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const iframeRef = useRef(null);

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

  // Hide PDF viewer buttons after iframe loads
  useEffect(() => {
    if (!pdfUrl || !iframeRef.current) return;

    const iframe = iframeRef.current;
    
    const hideButtons = () => {
      try {
        // Try to access iframe content (works for same-origin)
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        
        if (iframeDoc) {
          // Inject CSS to hide print/download buttons
          const style = iframeDoc.createElement('style');
          style.textContent = `
            /* Hide print button */
            button[title*="Print"],
            button[title*="print"],
            #print,
            .print,
            [data-l10n-id="print"],
            #printButton,
            
            /* Hide download button */
            button[title*="Download"],
            button[title*="download"],
            #download,
            .download,
            [data-l10n-id="download"],
            #downloadButton,
            
            /* Hide save button */
            button[title*="Save"],
            #save,
            .save,
            
            /* Chrome PDF viewer specific */
            #download-button,
            #print-button,
            cr-icon-button[iron-icon="cr:file-download"],
            cr-icon-button[iron-icon="cr:print"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              pointer-events: none !important;
            }
          `;
          iframeDoc.head?.appendChild(style);
        }
      } catch (e) {
        // Cross-origin restriction - can't access iframe content
        console.log('Cannot access iframe content due to CORS');
      }
    };

    iframe.addEventListener('load', hideButtons);
    
    return () => {
      iframe.removeEventListener('load', hideButtons);
    };
  }, [pdfUrl]);

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

    window.addEventListener('beforeprint', preventPrint, true);
    window.addEventListener('afterprint', preventPrint, true);
    window.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keydown', handleKeyDown, true);

    const originalPrint = window.print;
    window.print = function() {
      alert('⚠️ Print functionality disabled আছে!');
      return false;
    };

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
        ref={iframeRef}
        src={pdfUrl}
        className="w-full h-full"
        title="PDF Viewer"
        style={{ border: 'none' }}
        onContextMenu={(e) => e.preventDefault()}
      />
      
      {/* Watermark Overlay */}
      <div className="pointer-events-none absolute inset-0" style={{ zIndex: 9999 }}>
        {/* Center Watermark - Subtle and Elegant */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="transform rotate-[-45deg] text-white font-bold select-none"
            style={{
              fontSize: 'clamp(1.5rem, 5vw, 3rem)',
              opacity: 0.06,
              textShadow: '0 2px 10px rgba(0,0,0,0.3)',
              letterSpacing: '0.15em',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '90vw',
              padding: '1rem'
            }}
          >
            {email}
          </div>
        </div>

        {/* Repeating Pattern - Very Subtle */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute transform rotate-[-45deg] text-blue-300 font-medium select-none"
            style={{
              top: `${15 + i * 15}%`,
              left: `${10 + (i % 2) * 40}%`,
              fontSize: 'clamp(0.7rem, 2vw, 1rem)',
              opacity: 0.04,
              whiteSpace: 'nowrap'
            }}
          >
            {email}
          </div>
        ))}

        {/* Corner Badges - Clean and Minimal */}
        <div className="hidden sm:block absolute top-3 left-3 bg-gray-900/70 backdrop-blur-sm text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500/20">
          <span className="flex items-center gap-1.5">
            <span className="text-sm">🔒</span>
            <span className="hidden md:inline truncate max-w-[150px]">{email}</span>
          </span>
        </div>
        
        <div className="hidden sm:block absolute top-3 right-3 bg-gray-900/70 backdrop-blur-sm text-blue-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-500/20">
          <span className="flex items-center gap-1.5">
            <span className="hidden md:inline truncate max-w-[150px]">{email}</span>
            <span className="text-sm">🔒</span>
          </span>
        </div>
        
        <div className="hidden sm:block absolute bottom-3 left-3 bg-gray-900/70 backdrop-blur-sm text-purple-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/20">
          <span className="flex items-center gap-1.5">
            <span className="text-sm">🔒</span>
            <span className="hidden md:inline truncate max-w-[150px]">{email}</span>
          </span>
        </div>
        
        <div className="hidden sm:block absolute bottom-3 right-3 bg-gray-900/70 backdrop-blur-sm text-purple-400 px-3 py-1.5 rounded-lg text-xs font-medium border border-purple-500/20">
          <span className="flex items-center gap-1.5">
            <span className="hidden md:inline truncate max-w-[150px]">{email}</span>
            <span className="text-sm">🔒</span>
          </span>
        </div>

        {/* Top Center - Protected Badge */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 bg-blue-900/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-blue-400/30 shadow-lg">
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline">📄</span>
            <span className="hidden md:inline"></span>
            <span className="md:hidden">🔒</span>
            <span className="hidden sm:inline text-blue-200 truncate max-w-[120px] sm:max-w-[200px]">{email}</span>
          </span>
        </div>

        {/* Bottom Center - Warning Badge */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-red-900/60 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-xs font-semibold border border-red-400/30 shadow-lg">
          <span className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="hidden sm:inline"></span>
            <span className="sm:hidden"></span>
            <span className="hidden md:inline text-yellow-200 truncate max-w-[120px] sm:max-w-[200px]">{email}</span>
          </span>
        </div>

        {/* Side Badges - Hidden on Mobile */}
        <div className="hidden lg:block absolute top-1/2 left-3 transform -translate-y-1/2 bg-indigo-900/50 backdrop-blur-sm text-white px-2 py-3 rounded-lg text-xs font-mono border border-indigo-500/20 rotate-[-90deg] origin-center">
          <span className="truncate max-w-[100px] block">{email}</span>
        </div>

        <div className="hidden lg:block absolute top-1/2 right-3 transform -translate-y-1/2 bg-indigo-900/50 backdrop-blur-sm text-white px-2 py-3 rounded-lg text-xs font-mono border border-indigo-500/20 rotate-[90deg] origin-center">
          <span className="truncate max-w-[100px] block">{email}</span>
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
          background: 'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(59, 130, 246, 0.01) 30px, rgba(59, 130, 246, 0.01) 60px)'
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