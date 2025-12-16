import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 9;

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page')) || 1;
        setCurrentPage(page);
    }, [location.search]);

    const fetchPosts = useCallback(async (page) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://medicrack-web-exam-496984660515.asia-south1.run.app/api/posts?page=${page}&per_page=${postsPerPage}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setPosts(data.posts);
            setTotalPages(data.total_pages);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching posts:", err);
            setError("পোস্ট লোড করতে সমস্যা হয়েছে।");
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPosts(currentPage);
        navigate(`?page=${currentPage}`, { replace: true });
    }, [currentPage, fetchPosts, navigate]);

    function customSlugify(text) {
        return text
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\u0980-\u09FF\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    }

    const handleViewPost = (id, title) => {
        const titleSlug = customSlugify(title);
        navigate(`/post/${id}/${titleSlug}`);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center py-20 px-4  duration-300">
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
            <div className="min-h-screen  flex items-center justify-center py-20 px-4 transition-colors duration-300">
                <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 p-6 rounded-lg max-w-md">
                    <p className="text-red-700 dark:text-red-300 text-lg">এরর: {error}</p>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen  flex items-center justify-center py-20 px-4 transition-colors duration-300">
                <div className="text-center">
                    <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-lg text-gray-600 dark:text-gray-400">কোনো পোস্ট পাওয়া যায়নি।</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 dark:from-emerald-400 dark:to-teal-500 rounded-2xl shadow-lg mb-6 transform hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                        </svg>
                    </div>
                    
                    <h2 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mb-4" style={{ fontFamily: "'Tiro Bangla', serif" }}>
                        সাম্প্রতিক ব্লগ পোস্ট
                    </h2>
                    
                    <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 mx-auto rounded-full"></div>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {posts.map((post) => {
                        const firstImage = post.content?.blocks?.find(block => block.type === 'image');
                        const imageUrl = firstImage?.data?.file?.url;

                        return (
                            <div
                                key={post.id}
                                onClick={() => handleViewPost(post.id, post.title)}
                                className="group bg-white dark:bg-slate-900 rounded-2xl shadow-lg dark:shadow-2xl border border-gray-200 dark:border-slate-800 overflow-hidden transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl dark:hover:shadow-emerald-500/20 hover:-translate-y-1 cursor-pointer flex flex-col"
                            >
                                {imageUrl && (
                                    <div className="relative w-full h-48 overflow-hidden">
                                        <img 
                                            src={imageUrl} 
                                            alt={post.title} 
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                )}
                                
                                <div className="p-6 flex-grow flex flex-col">
                                    <h2 
                                        className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2" 
                                        style={{ fontFamily: "'Tiro Bangla', serif" }}
                                    >
                                        {post.title}
                                    </h2>
                                    
                                    {post.content && post.content.blocks && post.content.blocks.length > 0 && (
                                        <div
                                            dangerouslySetInnerHTML={{
                                                __html: renderPreviewContent(post.content.blocks),
                                            }}
                                            className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4 flex-grow line-clamp-3"
                                            style={{ fontFamily: "'Tiro Bangla', serif" }}
                                        />
                                    )}
                                    
                                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-4 pt-4 border-t border-gray-200 dark:border-slate-800">
                                        <div className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            <span>{post.timestamp ? new Date(post.timestamp).toLocaleDateString('bn-BD') : 'সময় অজানা'}</span>
                                        </div>
                                    </div>
                                    
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewPost(post.id, post.title);
                                        }}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 dark:from-emerald-500 dark:to-teal-500 dark:hover:from-emerald-600 dark:hover:to-teal-600 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        বিস্তারিত পড়ুন
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center mt-12 gap-2 flex-wrap">
                        {[...Array(totalPages)].map((_, index) => (
                            <button
                                key={index + 1}
                                onClick={() => handlePageChange(index + 1)}
                                className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${
                                    currentPage === index + 1
                                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-500 dark:to-teal-500 text-white shadow-lg scale-110'
                                        : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 shadow-sm'
                                }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// পোস্টের প্রিভিউ দেখানোর জন্য একটি ছোট ইউটিলিটি ফাংশন
const renderPreviewContent = (blocks) => {
    if (!blocks || blocks.length === 0) return '';
    
    let previewText = '';
    for (const block of blocks) {
        if (block.type === 'paragraph' && block.data && block.data.text) {
            previewText += block.data.text + ' ';
        }
    }
    
    if (previewText.length > 50) {
        return `<p>${previewText.substring(0, 50)}...</p>`;
    }
    return `<p>${previewText}</p>`;
};

export default BlogList;