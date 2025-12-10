import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MedicrackCourseViewer = () => {
    const { userId } = useParams();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedSubject, setSelectedSubject] = useState(null);
    const [selectedContent, setSelectedContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPdf, setShowPdf] = useState(false);
    const [progress, setProgress] = useState({});
    const [lastViewed, setLastViewed] = useState(null);

    const API_BASE_URL = 'https://medicrack-pdf-upload-view-496984660515.asia-south1.run.app/api';
    
    const userEmail = userId ? `${userId}@medicrack.online` : '';

    useEffect(() => {
        if (userId) {
            const savedProgress = localStorage.getItem(`medicrack_progress_${userId}`);
            const savedLastViewed = localStorage.getItem(`medicrack_last_viewed_${userId}`);

            if (savedProgress) {
                setProgress(JSON.parse(savedProgress));
            }
            if (savedLastViewed) {
                setLastViewed(JSON.parse(savedLastViewed));
            }
        }
    }, [userId]);

    useEffect(() => {
        const fetchCourses = async () => {
            if (!userId) return;

            try {
                setLoading(true);
                const response = await fetch(`${API_BASE_URL}/courses`);
                const data = await response.json();

                if (data.success) {
                    setCourses(data.courses);

                    if (lastViewed && data.courses.length > 0) {
                        const course = data.courses.find(c => c.id === lastViewed.courseId);
                        if (course) {
                            setSelectedCourse(course);
                            const subject = course.subjects?.find(s => s.id === lastViewed.subjectId);
                            if (subject) {
                                setSelectedSubject(subject);
                                const content = subject.contents?.find(c => c.id === lastViewed.contentId);
                                if (content) {
                                    setSelectedContent(content);
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error fetching courses:', error);
                alert('কোর্স লোড করতে সমস্যা হয়েছে');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, [userId, lastViewed]);

    const saveProgress = (courseId, subjectId, contentId, completed = false) => {
        const key = `${courseId}_${subjectId}_${contentId}`;
        const newProgress = { ...progress, [key]: completed };
        setProgress(newProgress);
        localStorage.setItem(`medicrack_progress_${userId}`, JSON.stringify(newProgress));

        const lastViewedData = { courseId, subjectId, contentId };
        setLastViewed(lastViewedData);
        localStorage.setItem(`medicrack_last_viewed_${userId}`, JSON.stringify(lastViewedData));
    };

    const calculateProgress = (course) => {
        if (!course || !course.subjects) return 0;

        let totalContent = 0;
        let completedContent = 0;

        course.subjects.forEach(subject => {
            if (subject.contents) {
                subject.contents.forEach(content => {
                    totalContent++;
                    const key = `${course.id}_${subject.id}_${content.id}`;
                    if (progress[key]) {
                        completedContent++;
                    }
                });
            }
        });

        return totalContent > 0 ? Math.round((completedContent / totalContent) * 100) : 0;
    };

    const calculateSubjectDuration = (subject) => {
        if (!subject || !subject.contents) return '0 মিনিট';

        const totalMinutes = subject.contents.reduce((sum, content) => {
            return sum + (content.durationMinutes || 0);
        }, 0);

        if (totalMinutes < 60) {
            return `${totalMinutes} মিনিট`;
        }

        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (minutes === 0) {
            return `${hours} ঘন্টা`;
        }

        return `${hours} ঘন্টা ${minutes} মিনিট`;
    };

    const handleContentClick = (course, subject, content) => {
        setSelectedCourse(course);
        setSelectedSubject(subject);
        setSelectedContent(content);
        setShowPdf(false);
        saveProgress(course.id, subject.id, content.id, false);
    };

    const markAsCompleted = () => {
        if (selectedCourse && selectedSubject && selectedContent) {
            saveProgress(selectedCourse.id, selectedSubject.id, selectedContent.id, true);
        }
    };

    if (!userId) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center p-4">
                <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center border border-gray-700">
                    <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-4xl">⚠️</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">ইউজার আইডি পাওয়া যায়নি</h1>
                    <p className="text-gray-400">অনুগ্রহ করে সঠিক URL ব্যবহার করুন</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-300 text-lg">লোড হচ্ছে...</p>
                </div>
            </div>
        );
    }

    if (!selectedCourse) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
                {/* Info Section - No Header */}
                <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-gray-700 p-6">
                    <div className="max-w-6xl mx-auto">
                        <p className="text-gray-300 text-sm mb-2">স্বাগতম</p>
                        <p className="text-emerald-400 font-medium">{userEmail}</p>
                        {lastViewed && courses.length > 0 && (
                            <button
                                onClick={() => {
                                    const course = courses.find(c => c.id === lastViewed.courseId);
                                    if (course) {
                                        setSelectedCourse(course);
                                        const subject = course.subjects?.find(s => s.id === lastViewed.subjectId);
                                        if (subject) {
                                            setSelectedSubject(subject);
                                            const content = subject.contents?.find(c => c.id === lastViewed.contentId);
                                            if (content) {
                                                setSelectedContent(content);
                                            }
                                        }
                                    }
                                }}
                                className="mt-3 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 px-4 py-2 rounded-lg text-sm transition text-emerald-300"
                            >
                                ⏮️ শেষবার যেখানে ছিলেন
                            </button>
                        )}
                    </div>
                </div>

                {/* Courses Grid */}
                <div className="max-w-6xl mx-auto p-4 md:p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">আপনার কোর্সসমূহ</h2>

                    {courses.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-50">📚</div>
                            <p className="text-gray-400 text-lg">কোন কোর্স পাওয়া যায়নি</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {courses.map((course) => {
                                const progressPercent = calculateProgress(course);

                                return (
                                    <div
                                        key={course.id}
                                        onClick={() => setSelectedCourse(course)}
                                        className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition hover:scale-105 hover:shadow-2xl border border-gray-700 hover:border-emerald-500/50"
                                    >
                                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 text-white">
                                            <div className="text-4xl mb-3">📖</div>
                                            <h3 className="text-xl font-bold mb-2">{course.courseName}</h3>
                                            <p className="text-emerald-100 text-sm">
                                                {course.durationDays || 0} দিন • {course.durationHours || 0} ঘন্টা
                                            </p>
                                        </div>

                                        <div className="p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-400">অগ্রগতি</span>
                                                <span className="text-sm font-bold text-emerald-400">{progressPercent}%</span>
                                            </div>
                                            <div className="w-full bg-gray-700 rounded-full h-2">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${progressPercent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (!selectedSubject) {
        return (
            <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
                {/* Navigation Section */}
                <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-gray-700 p-6">
                    <div className="max-w-6xl mx-auto">
                        <button
                            onClick={() => setSelectedCourse(null)}
                            className="flex items-center text-gray-300 hover:text-white mb-4 hover:bg-gray-700/50 px-3 py-2 rounded-lg transition"
                        >
                            <span className="mr-2">←</span> পিছনে যান
                        </button>
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{selectedCourse.courseName}</h1>
                    </div>
                </div>

                {/* Subjects List */}
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    <h2 className="text-2xl font-bold text-white mb-6">বিষয় নির্বাচন করুন</h2>

                    {!selectedCourse.subjects || selectedCourse.subjects.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4 opacity-50">📚</div>
                            <p className="text-gray-400 text-lg">কোন বিষয় পাওয়া যায়নি</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {selectedCourse.subjects.map((subject) => {
                                const contentCount = subject.contents?.length || 0;
                                const duration = calculateSubjectDuration(subject);

                                return (
                                    <div
                                        key={subject.id}
                                        onClick={() => setSelectedSubject(subject)}
                                        className="bg-gradient-to-br from-gray-800 to-slate-800 rounded-xl shadow-xl overflow-hidden cursor-pointer transform transition hover:scale-102 hover:shadow-2xl border border-gray-700 hover:border-blue-500/50"
                                    >
                                        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-5 text-white">
                                            <div className="flex items-center">
                                                <div className="bg-white/20 p-3 rounded-lg mr-4">
                                                    <span className="text-2xl">📚</span>
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold mb-1">{subject.subjectName}</h3>
                                                    <div className="flex flex-wrap gap-3 text-sm">
                                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                                            📝 {contentCount} টি লেকচার
                                                        </span>
                                                        <span className="bg-white/20 px-3 py-1 rounded-full">
                                                            ⏱️ {duration}
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-3xl ml-2">→</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
            {/* Navigation Bar */}
            <div className="bg-gradient-to-r from-slate-800 to-gray-800 border-b border-gray-700 p-4 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={() => {
                            setSelectedSubject(null);
                            setSelectedContent(null);
                        }}
                        className="flex items-center text-gray-300 hover:text-white mb-2 hover:bg-gray-700/50 px-3 py-1 rounded-lg transition text-sm"
                    >
                        <span className="mr-2">←</span> পিছনে যান
                    </button>
                    <h1 className="text-lg md:text-xl font-bold text-white">{selectedSubject.subjectName}</h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
                    {/* Content List */}
                    <div className="lg:col-span-1 order-2 lg:order-1 bg-gray-800 lg:shadow-2xl lg:rounded-lg lg:my-6 lg:border lg:border-gray-700 max-h-[500px] lg:max-h-[calc(100vh-120px)] overflow-y-auto">
                        <div className="p-4 bg-gradient-to-r from-slate-800 to-gray-800 sticky top-0 z-10 border-b border-gray-700">
                            <h2 className="font-bold text-white text-lg">লেকচার লিস্ট</h2>
                            <p className="text-sm text-gray-400 mt-1">
                                মোট {selectedSubject.contents?.length || 0} টি লেকচার
                            </p>
                        </div>

                        <div className="divide-y divide-gray-700">
                            {selectedSubject.contents && selectedSubject.contents.length > 0 ? (
                                selectedSubject.contents.map((content, index) => {
                                    const isCompleted = progress[`${selectedCourse.id}_${selectedSubject.id}_${content.id}`];
                                    const isActive = selectedContent?.id === content.id;

                                    return (
                                        <div
                                            key={content.id}
                                            onClick={() => handleContentClick(selectedCourse, selectedSubject, content)}
                                            className={`p-4 cursor-pointer transition ${isActive
                                                    ? 'bg-blue-500/20 border-l-4 border-blue-500'
                                                    : 'hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <div className="flex items-start space-x-3">
                                                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isCompleted
                                                        ? 'bg-emerald-500 text-white'
                                                        : isActive
                                                            ? 'bg-blue-500 text-white'
                                                            : 'bg-gray-700 text-gray-300'
                                                    }`}>
                                                    {isCompleted ? '✓' : index + 1}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className={`font-semibold text-sm mb-1 ${isActive ? 'text-blue-400' : 'text-gray-200'
                                                        }`}>
                                                        {content.lectureName}
                                                    </h3>

                                                    <div className="flex flex-wrap gap-2 text-xs">
                                                        {content.youtubeUrl && (
                                                            <span className="bg-red-500/20 text-red-400 px-2 py-1 rounded-full border border-red-500/30">
                                                                🎥 ভিডিও
                                                            </span>
                                                        )}
                                                        {content.pdfFileId && (
                                                            <span className="bg-orange-500/20 text-orange-400 px-2 py-1 rounded-full border border-orange-500/30">
                                                                📄 PDF
                                                            </span>
                                                        )}
                                                        {content.durationMinutes > 0 && (
                                                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-full border border-emerald-500/30">
                                                                ⏱️ {content.durationMinutes} মিনিট
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-8 text-center text-gray-400">
                                    কোন লেকচার পাওয়া যায়নি
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Video/PDF Viewer */}
                    <div className="lg:col-span-2 order-1 lg:order-2">
                        {selectedContent ? (
                            <div className="bg-gray-800 lg:shadow-2xl lg:rounded-lg lg:my-6 overflow-hidden lg:border lg:border-gray-700">
                                {/* Content Header */}
                                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4">
                                    <h2 className="text-xl font-bold mb-2">{selectedContent.lectureName}</h2>
                                    <div className="flex flex-wrap gap-2 text-sm">
                                        {selectedContent.durationMinutes > 0 && (
                                            <span className="bg-white/20 px-3 py-1 rounded-full">
                                                ⏱️ {selectedContent.durationMinutes} মিনিট
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* YouTube Video */}
                                {selectedContent.youtubeUrl && !showPdf && (
                                    <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                                        <iframe
                                            src={selectedContent.youtubeUrl}
                                            className="absolute top-0 left-0 w-full h-full"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title={selectedContent.lectureName}
                                        ></iframe>
                                    </div>
                                )}

                                {/* PDF Viewer */}
                                {selectedContent.pdfFileId && showPdf && (
                                    <div className="relative w-full bg-gray-900" style={{ height: '70vh', minHeight: '400px' }}>
                                        <iframe
                                            src={`${API_BASE_URL}/pdf-view/${selectedContent.pdfFileId}?email=${encodeURIComponent(userEmail)}`}
                                            className="w-full h-full border-0"
                                            title="PDF Viewer"
                                            sandbox="allow-same-origin allow-scripts"
                                        ></iframe>
                                    </div>
                                )}

                                {/* No content available */}
                                {!selectedContent.youtubeUrl && !selectedContent.pdfFileId && (
                                    <div className="p-12 text-center text-gray-400">
                                        <div className="text-6xl mb-4 opacity-50">📭</div>
                                        <p>এই লেকচারে কোন কন্টেন্ট নেই</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="p-4 space-y-3 bg-gradient-to-br from-gray-800 to-slate-800">
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        {selectedContent.youtubeUrl && (
                                            <button
                                                onClick={() => setShowPdf(false)}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${!showPdf
                                                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                    }`}
                                            >
                                                🎥 ভিডিও দেখুন
                                            </button>
                                        )}

                                        {selectedContent.pdfFileId && (
                                            <button
                                                onClick={() => setShowPdf(true)}
                                                className={`flex-1 py-3 rounded-lg font-semibold transition ${showPdf
                                                        ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg shadow-orange-500/50'
                                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                                                    }`}
                                            >
                                                📄 PDF দেখুন
                                            </button>
                                        )}
                                    </div>

                                    <button
                                        onClick={markAsCompleted}
                                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition transform hover:scale-105"
                                    >
                                        ✓ সম্পন্ন হিসেবে চিহ্নিত করুন
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-800 lg:shadow-2xl lg:rounded-lg lg:my-6 p-12 text-center lg:border lg:border-gray-700">
                                <div className="text-6xl mb-4 opacity-50">📚</div>
                                <p className="text-gray-400 text-lg">একটি লেকচার নির্বাচন করুন</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicrackCourseViewer;