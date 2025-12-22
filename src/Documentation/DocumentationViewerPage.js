// frontend/src/pages/DocumentationViewerPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Calendar, User } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const DocumentationViewerPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [babel, setBabel] = useState(null);
  const [error, setError] = useState(null);

  // Load Babel Standalone
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
    script.async = true;
    script.onload = () => {
      setBabel(window.Babel);
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    // sessionStorage থেকে documentation data নিই
    const docData = sessionStorage.getItem('currentDoc');
    if (docData) {
      setDoc(JSON.parse(docData));
      setLoading(false);
    } else {
      setError('Documentation not found');
      setLoading(false);
    }
  }, [docId]);

  const renderReactComponent = (code) => {
    if (!babel) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading...</span>
        </div>
      );
    }

    try {
      // Import statements remove করি
      let cleanedCode = code
        .replace(/import\s+React\s*,?\s*\{[^}]*\}\s*from\s+['"]react['"]\s*;?\s*/g, '')
        .replace(/import\s+\{[^}]*\}\s*from\s+['"]react['"]\s*;?\s*/g, '')
        .replace(/import\s+\*\s+as\s+\w+\s+from\s+['"]lucide-react['"]\s*;?\s*/g, '')
        .replace(/import\s+\{[^}]*\}\s*from\s+['"]lucide-react['"]\s*;?\s*/g, '')
        .replace(/export\s+default\s+/g, '');

      // JSX কে JavaScript এ transform করি
      const transformedCode = babel.transform(cleanedCode, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;

      // Component wrapper
      const ComponentWrapper = () => {
        try {
          // Global scope এ React এবং hooks expose করি
          const localReact = React;
          const localUseState = useState;
          const localUseEffect = useEffect;

          // Transformed code execute করি
          const componentFunction = new Function(
            'React',
            'useState', 
            'useEffect',
            'Scissors',
            'Link2',
            'Dna',
            'Beaker',
            'CheckCircle',
            'AlertCircle',
            'Calendar',
            'User',
            'BookOpen',
            'ArrowLeft',
            `
            ${transformedCode}
            
            // Component খুঁজে return করি
            if (typeof GMOLecture !== 'undefined') return GMOLecture;
            if (typeof DocumentationManager !== 'undefined') return DocumentationManager;
            
            // First capital letter function খুঁজি
            for (let key in this) {
              if (typeof this[key] === 'function' && /^[A-Z]/.test(key)) {
                return this[key];
              }
            }
            
            return null;
            `
          );

          const Component = componentFunction(
            localReact,
            localUseState,
            localUseEffect,
            LucideIcons.Scissors,
            LucideIcons.Link2,
            LucideIcons.Dna,
            LucideIcons.Beaker,
            LucideIcons.CheckCircle,
            LucideIcons.AlertCircle,
            LucideIcons.Calendar,
            LucideIcons.User,
            LucideIcons.BookOpen,
            LucideIcons.ArrowLeft
          );

          if (!Component) {
            return (
              <div className="bg-yellow-50 border border-yellow-300 rounded p-4 text-yellow-800">
                <p className="font-bold">⚠️ Component not found</p>
                <p className="text-sm mt-1">Make sure your component is exported correctly</p>
              </div>
            );
          }

          return <Component />;
        } catch (err) {
          console.error('Component execution error:', err);
          return (
            <div className="bg-red-50 border border-red-300 rounded p-4 text-red-700">
              <p className="font-bold">Error rendering content:</p>
              <p className="text-sm mt-1">{err.message}</p>
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-medium hover:underline">Show error details</summary>
                <pre className="text-xs mt-2 overflow-auto bg-red-100 p-2 rounded max-h-40">{err.stack}</pre>
              </details>
            </div>
          );
        }
      };

      return <ComponentWrapper />;
    } catch (error) {
      console.error('Error in renderReactComponent:', error);
      return (
        <div className="bg-red-50 border border-red-300 rounded p-4 text-red-700">
          <p className="font-bold">Error transforming code:</p>
          <p className="text-sm mt-1">{error.message}</p>
        </div>
      );
    }
  };

  if (loading || !babel) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">
          {!babel ? 'Loading compiler...' : 'Loading documentation...'}
        </p>
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
    <div className="min-h-screen">
      {/* Header */}
      {/* <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => window.close()}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Close</span>
            </button>
            
            <div className="flex-1 mx-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-1">{doc.title}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{doc.subject}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="rounded-lg overflow-hidden">
          {renderReactComponent(doc.code)}
        </div>
      </div>
    </div>
  );
};

export default DocumentationViewerPage;