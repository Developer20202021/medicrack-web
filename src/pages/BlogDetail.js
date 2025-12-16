import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { renderEditorJsContent } from '../components/renderContent';
import DOMPurify from 'dompurify';

function BlogDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [headersForSidebar, setHeadersForSidebar] = useState([]);
    const [headerIdMap, setHeaderIdMap] = useState({});
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`https://medicrack-web-exam-496984660515.asia-south1.run.app/api/posts/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("পোস্ট খুঁজে পাওয়া যায়নি।");
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPost(data);

                const tempHeadersForSidebar = [];
                const tempHeaderIdMap = {};

                (data.content?.blocks || []).forEach((block, originalIndex) => {
                    if (block.type === 'header') {
                        const rawText = block.data.text || '';
                        const cleanedTextForId = rawText
                            .replace(/&nbsp;/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();

                        const headerId = `header-${originalIndex}-${cleanedTextForId.toLowerCase().replace(/[^a-z0-9-]+/g, '').substring(0, 50)}`;

                        tempHeadersForSidebar.push({
                            text: cleanedTextForId,
                            level: block.data.level,
                            id: headerId
                        });
                        tempHeaderIdMap[originalIndex] = { id: headerId };
                    }
                });

                setHeadersForSidebar(tempHeadersForSidebar);
                setHeaderIdMap(tempHeaderIdMap);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message || "পোস্ট লোড করতে সমস্যা হয়েছে।");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const scrollToHeader = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: 'smooth'
            });
        } else {
            console.warn(`Element with ID "${id}" not found for scrolling.`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
                <div className="text-center">
                    <div className="relative inline-block">
                        <div className="w-16 h-16 border-4 border-emerald-200 dark:border-emerald-900 rounded-full"></div>
                        <div className="w-16 h-16 border-4 border-emerald-600 dark:border-emerald-400 border-t-transparent rounded-full animate-spin absolute top-0"></div>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 mt-6 animate-pulse">পোস্ট লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-lg max-w-md">
                    <p className="text-red-700 dark:text-red-300 text-lg">এরর: {error}</p>
                </div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 flex items-center justify-center py-20 px-4 transition-colors duration-300">
                <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg text-gray-600 dark:text-gray-400">পোস্ট পাওয়া যায়নি।</p>
                </div>
            </div>
        );
    }

    const sanitizedTitle = DOMPurify.sanitize(post.title || '');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-950 dark:via-slate-900 dark:to-gray-950 py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div 
                className={`mx-auto ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}
                style={{ fontFamily: "'Tiro Bangla', serif" }}
            >
                <div className={`flex ${isMobile ? 'flex-col' : 'flex-row'} gap-8`}>
                    
                    {/* Main Content Area */}
                    <div className={`${isMobile ? 'w-full' : 'flex-[3]'} min-w-0`}>
                        
                        {/* Back Button */}
                        <button
                            onClick={() => navigate(-1)}
                            className="group flex items-center gap-2 px-5 py-3 bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-700 transition-all duration-300 shadow-sm hover:shadow-md mb-6 font-semibold"
                        >
                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            সব পোস্ট দেখুন
                        </button>

                        {/* Post Title */}
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
                            {sanitizedTitle}
                        </h1>

                        {/* Post Meta */}
                        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-500 mb-8 pb-6 border-b border-gray-200 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">
                                    প্রকাশিত: {post.timestamp ? new Date(post.timestamp).toLocaleDateString('bn-BD') : 'সময় অজানা'}
                                </span>
                            </div>
                        </div>

                        {/* Post Content */}
                        <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 sm:p-8 lg:p-10">
                            {post.content && post.content.blocks && (
                                <div 
                                    dangerouslySetInnerHTML={{ __html: renderEditorJsContent(post.content.blocks, headerIdMap) }} 
                                    className="prose dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-emerald-600 dark:prose-a:text-emerald-400 prose-strong:text-gray-900 dark:prose-strong:text-white prose-img:rounded-xl"
                                    style={{ lineHeight: '1.8' }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Sidebar - Table of Contents */}
                    {!isMobile && headersForSidebar.length > 0 && (
                        <div className="flex-1 min-w-0">
                            <div className="sticky top-8 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-lg dark:shadow-2xl p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200 dark:border-slate-800">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-lg flex items-center justify-center">
                                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">সূচিপত্র</h3>
                                </div>
                                
                                <ul className="space-y-2">
                                    {headersForSidebar.map(header => (
                                        <li key={header.id}>
                                            <a
                                                href={`#${header.id}`}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    scrollToHeader(header.id);
                                                }}
                                                className={`block py-2 px-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-200 ${
                                                    header.level < 3 ? 'font-semibold' : 'font-normal'
                                                }`}
                                                style={{
                                                    paddingLeft: `${(header.level - 1) * 15 + 12}px`,
                                                    fontSize: header.level === 1 ? '1.1em' : header.level === 2 ? '1em' : '0.95em'
                                                }}
                                            >
                                                <span className="flex items-start gap-2">
                                                    <span className="text-emerald-600 dark:text-emerald-400 mt-1">•</span>
                                                    <span dangerouslySetInnerHTML={{ 
                                                        __html: DOMPurify.sanitize(header.text, { USE_PROFILES: { html: true } })
                                                    }} />
                                                </span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Scroll to Top Button */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-br from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white rounded-2xl shadow-xl hover:shadow-2xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 z-50"
                    style={{
                        opacity: showScrollButton ? 1 : 0,
                        visibility: showScrollButton ? 'visible' : 'hidden'
                    }}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                </button>
            )}
        </div>
    );
}

export default BlogDetail;