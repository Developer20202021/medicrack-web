import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Calendar, User, BookOpen, ExternalLink } from 'lucide-react';

const DocumentationViewer = ({ batchId, apiBaseUrl = 'https://medicrack-web-exam-496984660515.asia-south1.run.app' }) => {
  const [documentation, setDocumentation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchDocumentation();
  }, [batchId, selectedSubject]);

  const fetchDocumentation = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `${apiBaseUrl}/api/documentation/${batchId}/active`;
      if (selectedSubject !== 'all') {
        url += `?subject=${encodeURIComponent(selectedSubject)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch documentation');
      }

      const data = await response.json();
      setDocumentation(data.documentation || []);
      
      const uniqueSubjects = [...new Set(data.documentation.map(doc => doc.subject))];
      setSubjects(uniqueSubjects);
      
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching documentation:', err);
    } finally {
      setLoading(false);
    }
  };

  const openDocumentation = (doc) => {
    // Documentation data কে sessionStorage এ save করি
    sessionStorage.setItem('currentDoc', JSON.stringify(doc));
    
    // নতুন tab এ open করি
    window.open(`/documentation/${doc.id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-slate-300">Loading documentation...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-slate-900 min-h-screen">
        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-red-300">
          <p className="font-bold">Error loading documentation:</p>
          <p className="mt-1">{error}</p>
          <button
            onClick={fetchDocumentation}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            📚 Documentation Library
          </h1>
          <p className="text-slate-400">
            {documentation.length} documentation{documentation.length !== 1 ? 's' : ''} available
          </p>
        </div>

        <div className="mb-6 flex items-center gap-4">
          <label className="text-white font-medium">Filter by Subject:</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 bg-slate-800 text-white border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-slate-600"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>

        {documentation.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 border border-slate-700 rounded-lg">
            <BookOpen className="mx-auto h-12 w-12 text-slate-500 mb-4" />
            <p className="text-slate-400 text-lg">No documentation found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {documentation.map((doc) => (
              <div
                key={doc.id}
                className="bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:border-slate-600 transition-all"
              >
                <div
                  className="p-4 bg-gradient-to-r from-slate-800 to-slate-800/80 border-b border-slate-700 cursor-pointer hover:bg-slate-700/50 transition-colors"
                  onClick={() => openDocumentation(doc)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        {doc.title}
                        <ExternalLink className="h-5 w-5 text-blue-400" />
                      </h2>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{doc.subject}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(doc.saveTime).toLocaleDateString('bn-BD')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      Open →
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentationViewer;