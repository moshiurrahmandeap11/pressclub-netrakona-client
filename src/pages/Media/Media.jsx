import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';

const Media = () => {
    const [activeTab, setActiveTab] = useState('electronic');
    const [mediaList, setMediaList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    // Set active tab from navigation state
    useEffect(() => {
        const tabFromState = location.state?.tab;
        if (tabFromState && ['electronic', 'print'].includes(tabFromState)) {
            setActiveTab(tabFromState);
        }
    }, [location.state]);

    // Fetch media data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/media');
                if (!response.ok) {
                    throw new Error('Failed to fetch media data');
                }
                const data = await response.json();
                setMediaList(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabs = [
        { key: 'electronic', label: 'ইলেকট্রনিক মিডিয়া' },
        { key: 'print', label: 'প্রিন্ট ও অনলাইন মিডিয়া' }
    ];

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

    // Filter media based on active tab and search term
    const filteredMedia = mediaList.filter(media => 
        media.type === activeTab && (
            media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.mobile.includes(searchTerm)
        )
    );

    const renderMediaTable = (data, title) => (
        <div>
            <div className="text-center mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                    {title}
                </h2>
                <div className="w-full h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="মিডিয়ার নাম, প্রতিনিধি, বা মোবাইল দিয়ে সার্চ করুন"
                    className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            {/* Desktop Table View */}
            <div className="hidden lg:block">
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full table-auto">
                        <thead>
                            <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                <th className="px-6 py-4 text-left text-sm font-semibold">মিডিয়ার নাম</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">জেলা প্রতিনিধি</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">মোবাইল</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold">ইমেইল</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        কোনো তথ্য পাওয়া যায়নি
                                    </td>
                                </tr>
                            ) : (
                                data.map((media, index) => (
                                    <tr key={media._id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                        <td className="px-6 py-4 text-gray-900 font-semibold">{media.name}</td>
                                        <td className="px-6 py-4 text-gray-800 font-medium">{media.representative}</td>
                                        <td className="px-6 py-4">
                                            <a href={`tel:${media.mobile}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                                {media.mobile}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`mailto:${media.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                                {media.email}
                                            </a>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {data.length === 0 ? (
                    <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">
                        কোনো তথ্য পাওয়া যায়নি
                    </div>
                ) : (
                    data.map((media, index) => (
                        <div key={media._id} className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
                            <div className="space-y-3">
                                <div className="border-b border-gray-200 pb-3">
                                    <h3 className="text-xl font-bold text-gray-900 mb-1">{media.name}</h3>
                                    <span className="text-sm text-blue-600 font-medium">#{index + 1}</span>
                                </div>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32">
                                            জেলা প্রতিনিধি:
                                        </span>
                                        <span className="text-gray-900 font-medium">{media.representative}</span>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center">
                                        <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32">
                                            মোবাইল:
                                        </span>
                                        <a href={`tel:${media.mobile}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                            {media.mobile}
                                        </a>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-start">
                                        <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-32">
                                            ইমেইল:
                                        </span>
                                        <a href={`mailto:${media.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                            {media.email}
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
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
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
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
                                onClick={() => {
                                    setActiveTab(tab.key);
                                    setSearchTerm(''); // Reset search term on tab change
                                }}
                                className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base flex-1 transition-all duration-300 text-center ${
                                    activeTab === tab.key
                                        ? 'text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[500px]">
                    {activeTab === 'electronic' && renderMediaTable(filteredMedia, 'ইলেকট্রনিক মিডিয়া')}
                    {activeTab === 'print' && renderMediaTable(filteredMedia, 'প্রিন্ট মিডিয়া')}
                </div>
            </div>
        </div>
    );
};

export default Media;