import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';


function BlogList() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const postsPerPage = 9; // প্রতি সারিতে 3টি কার্ড দেখাতে 9টি পোস্ট প্রয়োজন হতে পারে, আপনার API এর per_page এর সাথে মিলিয়ে নিন

    const navigate = useNavigate();
    const location = useLocation();

    // URL থেকে পেজ নাম্বার নিয়ে আসার জন্য
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
    }, []); // postsPerPage is a constant, so it's removed from dependencies

    useEffect(() => {
        fetchPosts(currentPage);
        // URL এ পেজ নাম্বার আপডেট করুন
        navigate(`?page=${currentPage}`, { replace: true });
    }, [currentPage, fetchPosts, navigate]);


function customSlugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')         // space to -
    .replace(/[^\u0980-\u09FF\w\-]+/g, '') // বাংলা + eng অক্ষর বাদে সব মুছে ফেলো
    .replace(/\-\-+/g, '-')       // multiple dash to single
    .replace(/^-+/, '')           // trim starting -
    .replace(/-+$/, '');          // trim ending -
}

    const handleViewPost = (id, title) => {
        const titleSlug = customSlugify(title);
        navigate(`/post/${id}/${titleSlug}`); // পোস্ট দেখার জন্য BlogDetail পেজে নেভিগেট করুন
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '20px' }}>পোস্ট লোড হচ্ছে...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '20px', color: 'red' }}>এরর: {error}</div>;
    if (posts.length === 0) return <div style={{ textAlign: 'center', padding: '20px' }}>কোনো পোস্ট পাওয়া যায়নি।</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>


            <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px', fontSize:'1.7em',fontFamily: "'Tiro Bangla', serif", }}>সাম্প্রতিক ব্লগ পোস্ট</h2>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', // 3 কলামের জন্য
                gap: '20px',
                justifyContent: 'center'
            }}>
                {posts.map((post) => {
                    const firstImage = post.content?.blocks?.find(block => block.type === 'image');
                    const imageUrl = firstImage?.data?.file?.url;

                    return (
                        <div
                            key={post.id}
                            onClick={() => handleViewPost(post.id)} // Add onClick to the entire card
                            style={{
                                border: '1px solid #eee',
                                fontFamily: "'Tiro Bangla', serif",
                                borderRadius: '12px', // Increased border-radius for softer corners
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)', // Slightly more pronounced shadow
                                backgroundColor: '#fff',
                                overflow: 'hidden', // ইমেজ যাতে কার্ডের বাইরে না যায়
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'transform 0.2s ease-in-out',
                                cursor: 'pointer', // Indicate it's clickable
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            {imageUrl && (
                                <div style={{ width: '100%', height: '200px', overflow: 'hidden' }}>
                                    <img 
                                        src={imageUrl} 
                                        alt={post.title} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover',borderRadius: '12px',marginTop: '10px' }} 
                                    />
                                </div>
                            )}
                            <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                                <h2 style={{ color: '#000000', marginBottom: '10px', fontSize: '1.5em' }}>{post.title}</h2>
                                {post.content && post.content.blocks && post.content.blocks.length > 0 && (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: renderPreviewContent(post.content.blocks),
                                        }}
                                        style={{ lineHeight: '1.6', color: '#555', marginBottom: '15px' }}
                                    />
                                )}
                                <p style={{ fontSize: '0.85em', color: '#888', marginTop: 'auto' }}>
                                    প্রকাশিত: {post.timestamp ? new Date(post.timestamp).toLocaleString() : 'সময় অজানা'}
                                </p>
                                {/* The Read More button is placed here with styles to push it to the bottom */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent the card's onClick from firing when the button is clicked
                                        handleViewPost(post.id, post.title);
                                    }}
                                    style={{
                                        display: 'block', // Changed to block to take full width
                                        width: '100%', // Take full width of its container
                                        padding: '10px 15px',
                                        marginTop: '15px',
                                        border: '1px solid #28a745',
                                        backgroundColor: '#fff',
                                        color: '#28a745',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontSize: '0.9em',
                                        transition: 'background-color 0.3s ease, color 0.3s ease',
                                        textAlign: 'center',
                                        alignSelf: 'flex-end', // Pushes the button to the bottom within the flex container
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#28a745';
                                        e.currentTarget.style.color = 'white';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fff';
                                        e.currentTarget.style.color = '#28a745';
                                    }}
                                >
                                    Read More
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination Controls */}
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            padding: '10px 15px',
                            margin: '0 5px',
                            backgroundColor: currentPage === index + 1 ? '#28a745' : '#f0f0f0',
                            color: currentPage === index + 1 ? 'white' : '#333',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1em',
                            transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
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
        // অন্যান্য ব্লকের ধরন যোগ করতে পারেন যদি প্রয়োজন হয়
        // যেমন: if (block.type === 'header') { previewText += block.data.text + ' '; }
    }
    
    // 200 অক্ষর পর্যন্ত টেক্সট ট্রাঙ্কেট করা
    if (previewText.length > 50) {
        return `<p>${previewText.substring(0, 50)}...</p>`;
    }
    return `<p>${previewText}</p>`;
};

export default BlogList;