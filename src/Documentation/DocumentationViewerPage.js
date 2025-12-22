// frontend/src/pages/DocumentationViewerPage.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const DocumentationViewerPage = () => {
  const { docId } = useParams();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const docData = sessionStorage.getItem('currentDoc');
    if (docData) {
      setDoc(JSON.parse(docData));
      setLoading(false);
    } else {
      setError('Documentation not found');
      setLoading(false);
    }
  }, [docId]);

  useEffect(() => {
    if (doc && iframeRef.current) {
      renderInIframe();
    }
  }, [doc]);

  // Fullscreen toggle function
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Enter fullscreen
      const elem = containerRef.current;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const renderInIframe = () => {
    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // HTML content তৈরি করি
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${doc.title}</title>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      width: 100%;
      min-height: 100vh;
    }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel" data-type="module">
    const { useState, useEffect } = React;
    
    // Lucide React Icons (inline করা হয়েছে - প্রয়োজনীয় icons)
    const Scissors = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('circle', {cx: "6", cy: "6", r: "3"}), React.createElement('path', {d: "M8.12 8.12 12 12"}), React.createElement('path', {d: "M20 4 8.12 15.88"}), React.createElement('circle', {cx: "6", cy: "18", r: "3"}), React.createElement('path', {d: "M14.8 14.8 20 20"}));
    
    const Link2 = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M9 17H7A5 5 0 0 1 7 7h2"}), React.createElement('path', {d: "M15 7h2a5 5 0 1 1 0 10h-2"}), React.createElement('line', {x1: "8", x2: "16", y1: "12", y2: "12"}));
    
    const Dna = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m10 16 1.5 1.5"}), React.createElement('path', {d: "m14 8-1.5-1.5"}), React.createElement('path', {d: "M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"}), React.createElement('path', {d: "m16.5 10.5 1 1"}), React.createElement('path', {d: "m17 6-2.891-2.891"}), React.createElement('path', {d: "M2 15c6.667-6 13.333 0 20-6"}), React.createElement('path', {d: "m20 9 .891.891"}), React.createElement('path', {d: "M3.109 14.109 4 15"}), React.createElement('path', {d: "m6.5 12.5 1 1"}), React.createElement('path', {d: "m7 18 2.891 2.891"}), React.createElement('path', {d: "M9 22c1.798-1.998 2.518-3.995 2.807-5.993"}));
    
    const Beaker = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M4.5 3h15"}), React.createElement('path', {d: "M6 3v16a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V3"}), React.createElement('path', {d: "M6 14h12"}));
    
    const CheckCircle = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M22 11.08V12a10 10 0 1 1-5.93-9.14"}), React.createElement('path', {d: "m9 11 3 3L22 4"}));
    
    const AlertCircle = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('circle', {cx: "12", cy: "12", r: "10"}), React.createElement('line', {x1: "12", x2: "12", y1: "8", y2: "12"}), React.createElement('line', {x1: "12", x2: "12.01", y1: "16", y2: "16"}));
    
    const ChevronRight = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m9 18 6-6-6-6"}));
    
    const BookOpen = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"}), React.createElement('path', {d: "M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"}));
    
    const FlaskConical = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"}), React.createElement('path', {d: "M8.5 2h7"}), React.createElement('path', {d: "M7 16h10"}));

    const ChevronRight = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m9 18 6-6-6-6"}));
    
    const ChevronDown = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "m6 9 6 6 6-6"}));
    
    const Droplet = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"}));
    
    const Move = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('polyline', {points: "5 9 2 12 5 15"}), React.createElement('polyline', {points: "9 5 12 2 15 5"}), React.createElement('polyline', {points: "15 19 12 22 9 19"}), React.createElement('polyline', {points: "19 9 22 12 19 15"}), React.createElement('line', {x1: "2", x2: "22", y1: "12", y2: "12"}), React.createElement('line', {x1: "12", x2: "12", y1: "2", y2: "22"}));
    
    const Baby = (props) => React.createElement('svg', {...props, xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round"}, React.createElement('path', {d: "M9 12h.01"}), React.createElement('path', {d: "M15 12h.01"}), React.createElement('path', {d: "M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"}), React.createElement('path', {d: "M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"}));
    
    // User এর code
    ${doc.code.replace(/import\s+.*?from\s+['"].*?['"]\s*;?\s*/g, '').replace(/export\s+default\s+/g, '')}
    
    // Component টি খুঁজে render করি
    const componentNames = ${JSON.stringify(
      doc.code.match(/(?:const|let|var|function)\s+([A-Z][a-zA-Z0-9_]*)/g)?.map(m => 
        m.replace(/(?:const|let|var|function)\s+/, '').trim()
      ) || []
    )};
    
    let ComponentToRender = null;
    for (let name of componentNames) {
      if (typeof eval(name) === 'function') {
        ComponentToRender = eval(name);
        break;
      }
    }
    
    if (ComponentToRender) {
      const root = ReactDOM.createRoot(document.getElementById('root'));
      root.render(React.createElement(ComponentToRender));
    } else {
      document.getElementById('root').innerHTML = '<div style="padding: 2rem; text-align: center; color: #dc2626;"><h2>Component not found</h2><p>Could not load the documentation component.</p></div>';
    }
  </script>
</body>
</html>
    `;

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Loading documentation...</p>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <BookOpen className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Documentation Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load documentation'}</p>
          <button
            onClick={() => window.close()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close Tab
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50 relative">
      {/* Fullscreen Toggle Button */}
      <button
        onClick={toggleFullscreen}
        className={`fixed ${isFullscreen ? 'top-4 right-4' : 'top-20 right-4'} z-50 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg shadow-lg transition-all`}
        title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen'}
      >
        {isFullscreen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
            <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
            <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
            <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 3H5a2 2 0 0 0-2 2v3"/>
            <path d="M21 8V5a2 2 0 0 0-2-2h-3"/>
            <path d="M3 16v3a2 2 0 0 0 2 2h3"/>
            <path d="M16 21h3a2 2 0 0 0 2-2v-3"/>
          </svg>
        )}
      </button>

      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          minHeight: '100vh',
          border: 'none',
          display: 'block'
        }}
        title="Documentation Viewer"
      />
    </div>
  );
};

export default DocumentationViewerPage;