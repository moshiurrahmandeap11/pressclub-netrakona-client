import React, { useState, useEffect } from 'react';

const Media = () => {
    const [activeTab, setActiveTab] = useState('Electronic');
    const [electronicMedia, setElectronicMedia] = useState([]);
    const [printMedia, setPrintMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock API calls - replace with your actual API endpoints
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace these with your actual API calls
                // const electronicResponse = await fetch('/api/electronic-media');
                // const electronicData = await electronicResponse.json();
                setElectronicMedia([
                    {
                        id: 1,
                        mediaName: 'আরটিভি',
                        districtRepresentative: 'মোঃ আব্দুর রহমান',
                        mobile: '০১৭১১-১২৩৪৫৬',
                        email: 'rahman@rtv.com.bd'
                    },
                    {
                        id: 2,
                        mediaName: 'চ্যানেল আই',
                        districtRepresentative: 'সালমা খাতুন',
                        mobile: '০১৮১২-৭৮৯০১২',
                        email: 'salma@channeli.tv'
                    },
                    {
                        id: 3,
                        mediaName: 'একুশে টেলিভিশন',
                        districtRepresentative: 'ডাঃ করিম উদ্দিন',
                        mobile: '০১৯১৩-৪৫৬৭৮৯',
                        email: 'karim@ekushey-tv.com'
                    },
                    {
                        id: 4,
                        mediaName: 'বাংলাভিশন',
                        districtRepresentative: 'ফাতেমা বেগম',
                        mobile: '০১৫১৪-৮৯০১২৩',
                        email: 'fatema@banglavision.tv'
                    },
                    {
                        id: 5,
                        mediaName: 'সময় টেলিভিশন',
                        districtRepresentative: 'মোঃ জামাল উদ্দিন',
                        mobile: '০১৬১৫-৩৪৫৬৭৮',
                        email: 'jamal@somoytv.com'
                    }
                ]);

                // const printResponse = await fetch('/api/print-media');
                // const printData = await printResponse.json();
                setPrintMedia([
                    {
                        id: 1,
                        mediaName: 'প্রথম আলো',
                        districtRepresentative: 'জনাব আহমেদ হাসান',
                        mobile: '০১৭১৬-৯০১২৩৪',
                        email: 'ahmed@prothomalo.com'
                    },
                    {
                        id: 2,
                        mediaName: 'দৈনিক ইত্তেফাক',
                        districtRepresentative: 'মোছাঃ রাহেলা আক্তার',
                        mobile: '০১৮১৭-৫৬৭৮৯০',
                        email: 'rahela@ittefaq.com.bd'
                    },
                    {
                        id: 3,
                        mediaName: 'দৈনিক কালের কন্ঠ',
                        districtRepresentative: 'প্রফেসর মনিরুল ইসলাম',
                        mobile: '০১৯১৮-১২৩৪৫৬',
                        email: 'monirul@kalerkantho.com'
                    },
                    {
                        id: 4,
                        mediaName: 'দৈনিক জনকন্ঠ',
                        districtRepresentative: 'ডাঃ নাসির উদ্দিন',
                        mobile: '০১৫১৯-৭৮৯০১২',
                        email: 'nasir@dailyjanakantha.com'
                    },
                    {
                        id: 5,
                        mediaName: 'দৈনিক আমাদের সময়',
                        districtRepresentative: 'শাহনাজ পারভীন',
                        mobile: '০১৬২০-৩৪৫৬৭৮',
                        email: 'shahnaz@amadershomoy.com'
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabs = [
        { key: 'Electronic', label: 'ইলেকট্রনিক মিডিয়া', icon: '📺' },
        { key: 'Print', label: 'প্রিন্ট মিডিয়া', icon: '📰' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const renderMediaTable = (data, title, icon) => (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                    <span className="text-3xl">{icon}</span>
                    {title}
                </h2>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                                <th className="px-6 py-4 text-left text-sm font-semibold">মিডিয়ার নাম</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">জেলা প্রতিনিধি</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">মোবাইল</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">ইমেইল</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.map((media, index) => (
                                <tr key={media.id} className={`hover:bg-blue-50 transition-colors duration-200 ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900 text-lg">{media.mediaName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-800 font-medium">{media.districtRepresentative}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-blue-600 font-medium">{media.mobile}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-green-600 font-medium break-all">{media.email}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {data.map((media, index) => (
                    <div key={media.id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
                        <div className="space-y-3">
                            <div className="border-b border-gray-200 pb-3">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{media.mediaName}</h3>
                                <span className="text-sm text-blue-600 font-medium">#{index + 1}</span>
                            </div>
                            
                            <div className="grid grid-cols-1 gap-3">
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32 flex items-center">
                                        <span className="mr-2">👤</span>
                                        প্রতিনিধি:
                                    </span>
                                    <span className="text-gray-900 font-medium">{media.districtRepresentative}</span>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-center">
                                    <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32 flex items-center">
                                        <span className="mr-2">📱</span>
                                        মোবাইল:
                                    </span>
                                    <a href={`tel:${media.mobile}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                        {media.mobile}
                                    </a>
                                </div>
                                
                                <div className="flex flex-col sm:flex-row sm:items-start">
                                    <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32 flex items-center">
                                        <span className="mr-2">📧</span>
                                        ইমেইল:
                                    </span>
                                    <a href={`mailto:${media.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                        {media.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Statistics */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{data.length}</div>
                    <div className="text-gray-600 font-medium">মোট {title}</div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
                        <span className="text-4xl">🎬</span>
                        মিডিয়া
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base flex-1 transition-all duration-300 flex items-center justify-center gap-2 ${
                                    activeTab === tab.key
                                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'Electronic' && renderMediaTable(electronicMedia, 'ইলেকট্রনিক মিডিয়া', '📺')}
                    {activeTab === 'Print' && renderMediaTable(printMedia, 'প্রিন্ট মিডিয়া', '📰')}
                </div>
            </div>
        </div>
    );
};

export default Media;