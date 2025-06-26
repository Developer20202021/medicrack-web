import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { renderEditorJsContent } from '../components/renderContent'; // আপনার renderContent.js ফাইলটি ইম্পোর্ট করুন
import DOMPurify from 'dompurify'; // স্যানিটাইজেশনের জন্য

function BlogDetail() {
    const { id } = useParams(); // URL থেকে পোস্ট ID পান
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [headersForSidebar, setHeadersForSidebar] = useState([]); // সাইডবারের জন্য হেডারগুলি সংরক্ষণের জন্য স্টেট
    const [headerIdMap, setHeaderIdMap] = useState({}); // আসল ব্লক ইনডেক্স থেকে হেডার ID ম্যাপ করার জন্য স্টেট
    const [isMobile, setIsMobile] = useState(false); // মোবাইল ডিভাইসের জন্য স্টেট

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

                // প্রতিটি ব্লকের উপর লুপ চালান এবং হেডারগুলি এক্সট্রাক্ট করুন ও ID তৈরি করুন
                (data.content?.blocks || []).forEach((block, originalIndex) => {
                    if (block.type === 'header') {
                        const rawText = block.data.text || '';
                        // HTML entities (like &nbsp;) and multiple spaces are handled in renderContent.js
                        // Here, we just do a basic trim for ID generation
                        const cleanedTextForId = rawText
                            .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space for ID generation
                            .replace(/\s+/g, ' ')    // Replace multiple spaces with single space
                            .trim();

                        // হেডারের জন্য একটি অনন্য এবং স্থিতিশীল ID তৈরি করুন, যাতে শুধুমাত্র বৈধ অক্ষর থাকে
                        const headerId = `header-${originalIndex}-${cleanedTextForId.toLowerCase().replace(/[^a-z0-9-]+/g, '').substring(0, 50)}`; 

                        tempHeadersForSidebar.push({
                            text: cleanedTextForId, // Cleaned text for sidebar display
                            level: block.data.level,
                            id: headerId // অনন্য ID
                        });
                        // renderContent.js-এ সহজ লুকআপের জন্য ম্যাপে ID সংরক্ষণ করুন
                        tempHeaderIdMap[originalIndex] = { id: headerId }; 
                    }
                });

                setHeadersForSidebar(tempHeadersForSidebar);
                setHeaderIdMap(tempHeaderIdMap);

                // console.log('Post data received in BlogDetail:', data);
                // console.log('Content blocks received:', data.content?.blocks);
                // console.log('Generated Headers for Sidebar:', tempHeadersForSidebar);
                // console.log('Generated Header ID Map:', tempHeaderIdMap);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching post:", err);
                setError(err.message || "পোস্ট লোড করতে সমস্যা হয়েছে।");
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    // স্ক্রল ইভেন্ট লিসেনার যুক্ত করার জন্য useEffect
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 300);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // উইন্ডোর সাইজ চেক করার জন্য useEffect
    useEffect(() => {
        const checkMobile = () => {
            // 768px এর নিচে মোবাইল স্ক্রিন হিসেবে ধরে নিচ্ছি
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile(); // কম্পোনেন্ট মাউন্ট হওয়ার সময় একবার চেক করুন
        window.addEventListener('resize', checkMobile); // রিসাইজ ইভেন্টে চেক করুন
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // উপরে স্ক্রল করার ফাংশন
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // নির্দিষ্ট হেডারে স্ক্রল করার ফাংশন
    const scrollToHeader = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80; // আপনার ফিক্সড হেডার/ন্যাভবারের উচ্চতা অনুযায়ী এটি পরিবর্তন করুন
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({
                top: elementPosition - headerOffset,
                behavior: 'smooth'
            });
        } else {
            console.warn(`Element with ID "${id}" not found for scrolling.`);
        }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>পোস্ট লোড হচ্ছে...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>এরর: {error}</div>;
    if (!post) return <div style={{ textAlign: 'center', padding: '20px' }}>পোস্ট পাওয়া যায়নি।</div>;

    const sanitizedTitle = DOMPurify.sanitize(post.title || '');

    return (
        <div style={{
            padding: '20px',
            maxWidth: isMobile ? '100%' : '1200px', // মোবাইল হলে ফুল উইডথ, ডেস্কটপ হলে 1200px
            margin: '0 auto',
            fontFamily: "'Tiro Bangla', serif",
            position: 'relative',
            display: 'flex', // ফ্লেক্সবক্স ব্যবহার করা হয়েছে
            flexDirection: isMobile ? 'column' : 'row', // মোবাইল হলে কলাম, ডেস্কটপ হলে রো
            justifyContent: 'space-between', // কন্টেন্ট এবং সাইডবারকে আলাদা করতে
            gap: '30px' // কন্টেন্ট এবং সাইডবারের মধ্যে ব্যবধান
        }}>
            {/* মূল কন্টেন্ট এরিয়া */}
            <div style={{
                flex: isMobile ? 'none' : 3, // মোবাইল হলে ফ্লেক্স প্রপার্টি নিষ্ক্রিয়, ডেস্কটপ হলে 3
                minWidth: 0, // ফ্লেক্স আইটেম overflow প্রতিরোধ করতে
                maxWidth: isMobile ? '100%' : 'auto', // মোবাইল হলে 100% উইডথ
            }}>
                <button
                    onClick={() => navigate(-1)} // এক ধাপ পিছনে যান
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '1em',
                        transition: 'background-color 0.3s ease',
                        marginBottom: '20px',
                    }}
                >
                    &larr; সব পোস্ট দেখুন
                </button>

                <h1 style={{ color: '#333', marginBottom: '20px', fontSize: '1.7em' }}>{sanitizedTitle}</h1>
                <p style={{ fontSize: '0.9em', color: '#888', marginBottom: '30px' }}>
                    প্রকাশিত: {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'সময় অজানা'}
                </p>

                <div
                    style={{
                        border: '1px solid #eee',
                        padding: '20px',
                        marginBottom: '20px',
                        borderRadius: '8px',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                        backgroundColor: '#fff',
                    }}
                >
                    {/* Editor.js কন্টেন্ট রেন্ডার করার জন্য renderEditorJsContent ব্যবহার করুন */}
                    {post.content && post.content.blocks && (
                        <div dangerouslySetInnerHTML={{ __html: renderEditorJsContent(post.content.blocks, headerIdMap) }} style={{ lineHeight: '1.6' }} />
                    )}
                </div>
            </div>

            {/* হেডারগুলির জন্য সাইডবার (মোবাইল ডিভাইসে লুকানো থাকবে) */}
            {!isMobile && ( // isMobile সত্য হলে এই div রেন্ডার হবে না
                <div style={{
                    flex: 1, // সাইডবারের জন্য ফ্লেক্স আইটেম
                    position: 'sticky', // স্ক্রল করার সময় স্থির থাকবে
                    top: '20px', // উপরে থেকে কিছুটা নিচে শুরু হবে
                    alignSelf: 'flex-start', // কন্টেন্টের উপরে এলাইন করবে
                    padding: '20px',
                    borderLeft: '1px solid #eee', // বাম পাশে একটি বর্ডার
                    backgroundColor: '#f9f9f9',
                    borderRadius: '8px',
                    maxHeight: 'calc(100vh - 40px)', // ভিউপোর্ট হাইটের ওপর ভিত্তি করে ম্যাক্স হাইট
                    overflowY: 'auto' // কন্টেন্ট বেশি হলে স্ক্রলবার দেখাবে
                }}>
                    <h3 style={{ color: '#555', marginBottom: '15px', marginTop: '0' }}>সূচিপত্র</h3>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {headersForSidebar.map(header => (
                            <li key={header.id} style={{ marginBottom: '10px' }}>
                                <a
                                    href={`#${header.id}`}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        scrollToHeader(header.id);
                                    }}
                                    style={{
                                        marginTop:'20px',
                                        textDecoration: 'none',
                                        color: '#000000',
                                        fontSize: `1.2em`, // হেডার লেভেল অনুযায়ী ফন্ট সাইজ
                                        fontWeight: header.level < 3 ? 'bold' : 'normal',
                                        display: 'block',
                                        paddingLeft: `${(header.level - 1) * 15}px`, // লেভেল অনুযায়ী ইনডেন্টেশন
                                    }}
                                >
                                    {DOMPurify.sanitize(header.text, { USE_PROFILES: { html: true } })} {/* এখানেও স্যানিটাইজেশন নিশ্চিত করুন */}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* ফ্লোটিং উপরে স্ক্রল করার বাটন */}
            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: 'fixed',
                        bottom: '30px',
                        right: '30px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        width: '40px',
                        height: '40px',
                        fontSize: '1.5em',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                        transition: 'background-color 0.3s ease, opacity 0.3s ease',
                        zIndex: 1000,
                        opacity: showScrollButton ? 1 : 0,
                        visibility: showScrollButton ? 'visible' : 'hidden'
                    }}
                >
                    &uarr;
                </button>
            )}
        </div>
    );
}

export default BlogDetail;
