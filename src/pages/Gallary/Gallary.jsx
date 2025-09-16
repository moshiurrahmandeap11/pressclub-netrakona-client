import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router';

const Gallery = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('ফটো গ্যালারী');
    const [galleryData, setGalleryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
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
        setFilter('All'); // Reset filter when switching tabs
        setSearchParams({ tab: reverseTabMapping[tab] });
    };

    // Fetch gallery data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/gallery');
                if (!response.ok) {
                    throw new Error('Failed to fetch gallery data');
                }
                const data = await response.json();
                setGalleryData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gallery data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabs = ['ফটো গ্যালারী', 'ভিডিও গ্যালারি'];

    // Get unique categories for filter based on active tab
    const getCategories = () => {
        const data = galleryData.filter(item => item.type === reverseTabMapping[activeTab]);
        return ['All', ...new Set(data.map(item => item.category))];
    };

    // Filter data based on selected category and active tab
    const getFilteredData = () => {
        const data = galleryData.filter(item => item.type === reverseTabMapping[activeTab]);
        return filter === 'All' ? data : data.filter(item => item.category === filter);
    };

    const openModal = (item) => {
        setSelectedItem(item);
    };

    const closeModal = () => {
        setSelectedItem(null);
    };

    const nextItem = () => {
        const filteredData = getFilteredData();
        const currentIndex = filteredData.findIndex(item => item._id === selectedItem._id);
        const nextIndex = (currentIndex + 1) % filteredData.length;
        setSelectedItem(filteredData[nextIndex]);
    };

    const prevItem = () => {
        const filteredData = getFilteredData();
        const currentIndex = filteredData.findIndex(item => item._id === selectedItem._id);
        const prevIndex = currentIndex === 0 ? filteredData.length - 1 : currentIndex - 1;
        setSelectedItem(filteredData[prevIndex]);
    };

    const getCategoryName = (category) => {
        const categoryNames = {
            'ইভেন্ট': 'ইভেন্ট',
            'অনুষ্ঠান': 'অনুষ্ঠান',
            'জাতীয় দিবস': 'জাতীয় দিবস',
            'সেমিনার': 'সেমিনার',
            'সভা': 'সভা'
        };
        return categoryNames[category] || category;
    };

    // Extract YouTube video ID from URL
    const getYouTubeVideoId = (url) => {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return match ? match[1] : null;
    };

    // Get thumbnail URL for videos
    const getVideoThumbnail = (url) => {
        const videoId = getYouTubeVideoId(url);
        return videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : `data:image/svg+xml;base64,${btoa(`<svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="400" height="300" fill="#1F2937"/>
<circle cx="200" cy="150" r="30" fill="#4B5563"/>
<path d="M190 135l20 15-20 15V135z" fill="#9CA3AF"/>
</svg>`)}`;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    const categories = getCategories();
    const filteredData = getFilteredData();

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        গ্যালারি
                    </h1>
                    <div className="w-full h-1 bg-blue-600 mx-auto"></div>
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">
                            {galleryData.filter(item => item.type === reverseTabMapping[activeTab]).length}
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
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {activeTab === 'ফটো গ্যালারী' ? (
                        // Photo Gallery
                        filteredData.map((image) => (
                            <div
                                key={image._id}
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
                                            {new Date(image.date).toLocaleDateString('bn-BD')}
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
                                key={video._id}
                                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                                onClick={() => openModal(video)}
                            >
                                <div className="relative overflow-hidden">
                                    <img
                                        src={getVideoThumbnail(video.url)}
                                        alt={video.caption}
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
                                            {new Date(video.date).toLocaleDateString('bn-BD')}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                        {video.caption}
                                    </h3>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                            {getCategoryName(video.category)}
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation(); // Prevent card click
                                                openModal(video);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
                                        >
                                            দেখুন
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* No content message */}
                {filteredData.length === 0 && (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-medium text-gray-600 mb-2">
                            {activeTab === 'ফটো গ্যালারী' ? 'কোনো ছবি পাওয়া যায়নি' : 'কোনো ভিডিও পাওয়া যায়নি'}
                        </h3>
                        <p className="text-gray-500">এই ক্যাটাগরিতে কোনো কন্টেন্ট নেই।</p>
                    </div>
                )}

                {/* Modal for photos and videos */}
                {selectedItem && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
                        <div className="relative max-w-4xl max-h-[80vh]">
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 transition-colors z-10"
                            >
                                ✕
                            </button>
                            <button
                                onClick={prevItem}
                                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                            >
                                ‹
                            </button>
                            <button
                                onClick={nextItem}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                            >
                                ›
                            </button>
                            {activeTab === 'ফটো গ্যালারী' ? (
                                <img
                                    src={selectedItem.url}
                                    alt={selectedItem.caption}
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
                            ) : (
                                <div className="w-full max-h-[80vh] bg-black rounded-lg overflow-hidden">
                                    {getYouTubeVideoId(selectedItem.url) ? (
                                        <iframe
                                            src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedItem.url)}?autoplay=0`}
                                            title={selectedItem.caption}
                                            className="w-full h-[45vh] md:h-[60vh] max-h-[80vh]"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                        ></iframe>
                                    ) : (
                                        <video
                                            controls
                                            className="w-full h-[45vh] md:h-[60vh] max-h-[80vh] object-contain"
                                            onError={() => {
                                                console.error('Video failed to load:', selectedItem.url);
                                            }}
                                        >
                                            <source src={selectedItem.url} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    )}
                                </div>
                            )}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6">
                                <h3 className="text-white font-medium text-lg mb-2">{selectedItem.caption}</h3>
                                <div className="flex justify-between items-center text-sm text-gray-300">
                                    <span>{new Date(selectedItem.date).toLocaleDateString('bn-BD')}</span>
                                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full">
                                        {getCategoryName(selectedItem.category)}
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