import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router';

const Gallery = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('ফটো গ্যালারী');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');

    // Tab mapping object
    const tabMapping = {
        'photo': 'ফটো গ্যালারী',
        'video': 'ভিডিও গ্যালারি'
    };

    // Reverse mapping for URL generation
    const reverseTabMapping = {
        'ফটো গ্যালারী': 'photo',
        'ভিডিও গ্যালারি': 'video'
    };

    // Effect to handle URL parameters and set active tab
    useEffect(() => {
        const tabParam = searchParams.get('tab');
        if (tabParam && tabMapping[tabParam]) {
            setActiveTab(tabMapping[tabParam]);
        }
    }, [searchParams, location]);

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        // Update URL parameter
        setSearchParams({ tab: reverseTabMapping[tab] });
    };

    // Mock API call - replace with your actual API endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace this with your actual API calls
                // const photoResponse = await fetch('/api/photos');
                // const photoData = await photoResponse.json();
                setImages([
                    {
                        id: 1,
                        url: '/api/placeholder/400/300',
                        caption: 'প্রেস ক্লাবের বার্ষিক সাধারণ সভা ২০২৪',
                        category: 'Events',
                        date: '২০২৪-০১-১৫'
                    },
                    {
                        id: 2,
                        url: '/api/placeholder/400/300',
                        caption: 'নতুন সদস্য অভ্যর্থনা অনুষ্ঠান',
                        category: 'Ceremonies',
                        date: '২০২৪-০২-১০'
                    },
                    {
                        id: 3,
                        url: '/api/placeholder/400/300',
                        caption: 'জাতীয় সংবাদপত্র দিবস উদযাপন',
                        category: 'National Days',
                        date: '২০২৪-০৩-২১'
                    },
                    {
                        id: 4,
                        url: '/api/placeholder/400/300',
                        caption: 'সাংবাদিক নিরাপত্তা বিষয়ক সেমিনার',
                        category: 'Seminars',
                        date: '২০২৪-০৪-০৫'
                    },
                    {
                        id: 5,
                        url: '/api/placeholder/400/300',
                        caption: 'আন্তর্জাতিক নারী দিবস পালন',
                        category: 'National Days',
                        date: '২০২৪-০৩-০৮'
                    },
                    {
                        id: 6,
                        url: '/api/placeholder/400/300',
                        caption: 'কমিটি সদস্যদের সাথে মতবিনিময় সভা',
                        category: 'Meetings',
                        date: '২০২৪-০৫-১২'
                    }
                ]);

                // const videoResponse = await fetch('/api/videos');
                // const videoData = await videoResponse.json();
                setVideos([
                    {
                        id: 1,
                        thumbnail: '/api/placeholder/400/300',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        title: 'প্রেস ক্লাবের বার্ষিক সভার হাইলাইট',
                        description: 'প্রেস ক্লাবের ২০২৪ সালের বার্ষিক সাধারণ সভার গুরুত্বপূর্ণ মুহূর্তসমূহ',
                        category: 'Events',
                        date: '২০২৪-০১-১৫',
                        duration: '১৫:৩০'
                    },
                    {
                        id: 2,
                        thumbnail: '/api/placeholder/400/300',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        title: 'সাংবাদিক প্রশিক্ষণ কর্মশালা',
                        description: 'তরুণ সাংবাদিকদের জন্য আয়োজিত প্রশিক্ষণ কর্মশালার সম্পূর্ণ ভিডিও',
                        category: 'Training',
                        date: '২০২৪-০২-২০',
                        duration: '৪৫:২০'
                    },
                    {
                        id: 3,
                        thumbnail: '/api/placeholder/400/300',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        title: 'জাতীয় প্রেস দিবস উদযাপন',
                        description: 'জাতীয় প্রেস দিবস উপলক্ষে আয়োজিত বিশেষ অনুষ্ঠান',
                        category: 'National Days',
                        date: '২০২৪-০৩-২১',
                        duration: '৩২:১৫'
                    },
                    {
                        id: 4,
                        thumbnail: '/api/placeholder/400/300',
                        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                        title: 'প্রেস ক্লাব ভবনের উদ্বোধনী অনুষ্ঠান',
                        description: 'নতুন প্রেস ক্লাব ভবনের উদ্বোধনী অনুষ্ঠানের সম্পূর্ণ কভারেজ',
                        category: 'Ceremonies',
                        date: '২০২৪-০৪-১০',
                        duration: '২৮:৪৫'
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabs = ['ফটো গ্যালারী', 'ভিডিও গ্যালারি'];

    // Get unique categories for filter based on active tab
    const getCategories = () => {
        const data = activeTab === 'ফটো গ্যালারী' ? images : videos;
        return ['All', ...new Set(data.map(item => item.category))];
    };

    // Filter data based on selected category and active tab
    const getFilteredData = () => {
        const data = activeTab === 'ফটো গ্যালারী' ? images : videos;
        return filter === 'All' ? data : data.filter(item => item.category === filter);
    };

    const categories = getCategories();
    const filteredData = getFilteredData();

    const openModal = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const currentIndex = filteredData.findIndex(item => item.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredData.length;
        setSelectedImage(filteredData[nextIndex]);
    };

    const prevImage = () => {
        const currentIndex = filteredData.findIndex(item => item.id === selectedImage.id);
        const prevIndex = currentIndex === 0 ? filteredData.length - 1 : currentIndex - 1;
        setSelectedImage(filteredData[prevIndex]);
    };

    const getCategoryName = (category) => {
        const categoryNames = {
            'Events': 'ইভেন্ট',
            'Ceremonies': 'অনুষ্ঠান',
            'National Days': 'জাতীয় দিবস',
            'Seminars': 'সেমিনার',
            'Meetings': 'সভা',
            'Training': 'প্রশিক্ষণ',
            'Sports': 'ক্রীড়া'
        };
        return categoryNames[category] || category;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        গ্যালারি
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">প্রেস ক্লাবের স্মরণীয় মুহূর্তসমূহ</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-6 py-3 font-medium text-sm md:text-base ${
                                    activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="mb-8">
                    <div className="flex flex-wrap justify-center gap-2">
                        {categories.map(category => (
                            <button
                                key={category}
                                onClick={() => setFilter(category)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                                    filter === category
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 shadow-md'
                                }`}
                            >
                                {category === 'All' ? 'সবগুলো' : getCategoryName(category)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {activeTab === 'ফটো গ্যালারী' ? images.length : videos.length}
                        </div>
                        <div className="text-sm text-gray-600">
                            {activeTab === 'ফটো গ্যালারী' ? 'মোট ছবি' : 'মোট ভিডিও'}
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
                        <div className="text-sm text-gray-600">ক্যাটাগরি</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{filteredData.length}</div>
                        <div className="text-sm text-gray-600">ফিল্টার করা</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">২০২৪</div>
                        <div className="text-sm text-gray-600">বর্তমান বছর</div>
                    </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {activeTab === 'ফটো গ্যালারী' ? (
                        // Photo Gallery
                        filteredData.map((image) => (
                            <div
                                key={image.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => openModal(image)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={image.url}
                                        alt={image.caption}
                                        className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="300" fill="#E5E7EB"/>
<rect x="150" y="100" width="100" height="80" rx="8" fill="#9CA3AF"/>
<circle cx="170" cy="120" r="8" fill="#E5E7EB"/>
<path d="M160 140l10 10 20-20 20 30H150l10-20z" fill="#E5E7EB"/>
</svg>`)}`;
                                        }}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                            {image.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                        {image.caption}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {getCategoryName(image.category)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        // Video Gallery
                        filteredData.map((video) => (
                            <div
                                key={video.id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={video.thumbnail}
                                        alt={video.title}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="300" fill="#1F2937"/>
<circle cx="200" cy="150" r="30" fill="#4B5563"/>
<path d="M190 135l20 15-20 15V135z" fill="#9CA3AF"/>
</svg>`)}`;
                                        }}
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-black bg-opacity-60 rounded-full p-4">
                                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M8 5v10l8-5-8-5z"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                            {video.duration}
                                        </span>
                                    </div>
                                    <div className="absolute bottom-2 left-2">
                                        <span className="bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                                            {video.date}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                        {video.title}
                                    </h3>
                                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                        {video.description}
                                    </p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {getCategoryName(video.category)}
                                        </span>
                                        <a
                                            href={video.videoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                                        >
                                            দেখুন
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* No content message */}
                {filteredData.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">
                            {activeTab === 'ফটো গ্যালারী' ? '📷' : '🎥'}
                        </div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            {activeTab === 'ফটো গ্যালারী' ? 'কোনো ছবি পাওয়া যায়নি' : 'কোনো ভিডিও পাওয়া যায়নি'}
                        </h3>
                        <p className="text-gray-500">এই ক্যাটাগরিতে কোনো কন্টেন্ট নেই।</p>
                    </div>
                )}

                {/* Modal for full-size image (only for photos) */}
                {selectedImage && activeTab === 'ফটো গ্যালারী' && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
                        <div className="relative max-w-4xl max-h-full">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
                            >
                                ✕
                            </button>
                            
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                            >
                                ‹
                            </button>
                            
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                            >
                                ›
                            </button>

                            <img
                                src={selectedImage.url}
                                alt={selectedImage.caption}
                                className="max-w-full max-h-[80vh] object-contain rounded-lg"
                                onError={(e) => {
                                    e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="800" height="600" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="800" height="600" fill="#374151"/>
<rect x="300" y="200" width="200" height="160" rx="16" fill="#6B7280"/>
<circle cx="340" cy="240" r="16" fill="#9CA3AF"/>
<path d="M320 280l20 20 40-40 40 60H300l20-40z" fill="#9CA3AF"/>
<text x="400" y="420" text-anchor="middle" fill="#9CA3AF" font-size="24">ছবি লোড হচ্ছে না</text>
</svg>`)}`;
                                }}
                            />
                            
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                <h3 className="text-white font-medium text-lg mb-2">{selectedImage.caption}</h3>
                                <div className="flex justify-between items-center text-sm text-gray-300">
                                    <span>{selectedImage.date}</span>
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                        {getCategoryName(selectedImage.category)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Gallery;