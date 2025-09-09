import React, { useState, useEffect } from 'react';

const Gallery = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [filter, setFilter] = useState('All');

    // Mock API call - replace with your actual API endpoint
    useEffect(() => {
        const fetchImages = async () => {
            try {
                // Replace this with your actual API call
                // const response = await fetch('/api/gallery');
                // const data = await response.json();
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
                    },
                    {
                        id: 7,
                        url: '/api/placeholder/400/300',
                        caption: 'প্রেস ক্লাব ভবনের উদ্বোধনী অনুষ্ঠান',
                        category: 'Ceremonies',
                        date: '২০২৪-০৬-২০'
                    },
                    {
                        id: 8,
                        url: '/api/placeholder/400/300',
                        caption: 'তরুণ সাংবাদিকদের প্রশিক্ষণ কর্মশালা',
                        category: 'Training',
                        date: '২০২৪-০৭-১৫'
                    },
                    {
                        id: 9,
                        url: '/api/placeholder/400/300',
                        caption: 'বিশ্ব প্রেস স্বাধীনতা দিবস উদযাপন',
                        category: 'National Days',
                        date: '২০২৪-০৫-০৩'
                    },
                    {
                        id: 10,
                        url: '/api/placeholder/400/300',
                        caption: 'স্থানীয় প্রশাসনের সাথে মতবিনিময়',
                        category: 'Meetings',
                        date: '২০২৪-০৮-১০'
                    },
                    {
                        id: 11,
                        url: '/api/placeholder/400/300',
                        caption: 'সাংস্কৃতিক অনুষ্ঠান ও পুরস্কার বিতরণী',
                        category: 'Events',
                        date: '২০২৪-০৯-০৫'
                    },
                    {
                        id: 12,
                        url: '/api/placeholder/400/300',
                        caption: 'ক্রীড়া প্রতিযোগিতা ও পুরস্কার বিতরণ',
                        category: 'Sports',
                        date: '২০২৪-১০-১৫'
                    }
                ]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching gallery images:', error);
                setLoading(false);
            }
        };

        fetchImages();
    }, []);

    // Get unique categories for filter
    const categories = ['All', ...new Set(images.map(img => img.category))];
    
    // Filter images based on selected category
    const filteredImages = filter === 'All' ? images : images.filter(img => img.category === filter);

    const openModal = (image) => {
        setSelectedImage(image);
    };

    const closeModal = () => {
        setSelectedImage(null);
    };

    const nextImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const nextIndex = (currentIndex + 1) % filteredImages.length;
        setSelectedImage(filteredImages[nextIndex]);
    };

    const prevImage = () => {
        const currentIndex = filteredImages.findIndex(img => img.id === selectedImage.id);
        const prevIndex = currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
        setSelectedImage(filteredImages[prevIndex]);
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                        <span className="text-4xl">📸</span>
                        গ্যালারি
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">প্রেস ক্লাবের স্মরণীয় মুহূর্তসমূহ</p>
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
                                {category === 'All' ? 'সবগুলো' : 
                                 category === 'Events' ? 'ইভেন্ট' :
                                 category === 'Ceremonies' ? 'অনুষ্ঠান' :
                                 category === 'National Days' ? 'জাতীয় দিবস' :
                                 category === 'Seminars' ? 'সেমিনার' :
                                 category === 'Meetings' ? 'সভা' :
                                 category === 'Training' ? 'প্রশিক্ষণ' :
                                 category === 'Sports' ? 'ক্রীড়া' : category}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-blue-600">{images.length}</div>
                        <div className="text-sm text-gray-600">মোট ছবি</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-green-600">{categories.length - 1}</div>
                        <div className="text-sm text-gray-600">ক্যাটাগরি</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-purple-600">{filteredImages.length}</div>
                        <div className="text-sm text-gray-600">ফিল্টার করা</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4 text-center">
                        <div className="text-2xl font-bold text-orange-600">২০২৪</div>
                        <div className="text-sm text-gray-600">বর্তমান বছর</div>
                    </div>
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredImages.map((image) => (
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
                                        {image.category === 'Events' ? 'ইভেন্ট' :
                                         image.category === 'Ceremonies' ? 'অনুষ্ঠান' :
                                         image.category === 'National Days' ? 'জাতীয় দিবস' :
                                         image.category === 'Seminars' ? 'সেমিনার' :
                                         image.category === 'Meetings' ? 'সভা' :
                                         image.category === 'Training' ? 'প্রশিক্ষণ' :
                                         image.category === 'Sports' ? 'ক্রীড়া' : image.category}
                                    </span>
                                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                                        <span className="text-lg">🔍</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* No images message */}
                {filteredImages.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">📷</div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">কোনো ছবি পাওয়া যায়নি</h3>
                        <p className="text-gray-500">এই ক্যাটাগরিতে কোনো ছবি নেই।</p>
                    </div>
                )}

                {/* Modal for full-size image */}
                {selectedImage && (
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
                                &#8249;
                            </button>
                            
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-gray-300 transition-colors z-10"
                            >
                                &#8250;
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
                                        {selectedImage.category === 'Events' ? 'ইভেন্ট' :
                                         selectedImage.category === 'Ceremonies' ? 'অনুষ্ঠান' :
                                         selectedImage.category === 'National Days' ? 'জাতীয় দিবস' :
                                         selectedImage.category === 'Seminars' ? 'সেমিনার' :
                                         selectedImage.category === 'Meetings' ? 'সভা' :
                                         selectedImage.category === 'Training' ? 'প্রশিক্ষণ' :
                                         selectedImage.category === 'Sports' ? 'ক্রীড়া' : selectedImage.category}
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