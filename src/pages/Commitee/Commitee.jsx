import React, { useState, useEffect } from 'react';

const Committee = () => {
    const [committeeData, setCommitteeData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch committee data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/committee');
                if (!response.ok) {
                    throw new Error('Failed to fetch committee data');
                }
                const data = await response.json();
                setCommitteeData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching committee data:', error);
                setError(error.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Filter committee members based on search term
    const filteredCommittee = committeeData.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contact.includes(searchTerm)
    );

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

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        ম্যানেজিং কমিটি
                    </h1>
                    <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">বর্তমান কার্যনির্বাহী কমিটির সদস্যবৃন্দ</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="নাম, পদবী, বা যোগাযোগ নম্বর দিয়ে সার্চ করুন"
                        className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{filteredCommittee.length}</div>
                        <div className="text-gray-600 font-medium">মোট কমিটির সদস্য</div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ছবি</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">নাম</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">পদবী</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">পেশা</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">যোগাযোগ</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ইমেইল</th>
                                        <th className="px-6 py-4 text-left text-sm font-semibold">ঠিকানা</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {filteredCommittee.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                                                কোনো তথ্য পাওয়া যায়নি
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredCommittee.map((member, index) => (
                                            <tr key={member._id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                                <td className="px-6 py-4">
                                                    {member.image ? (
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-16 h-16 rounded-full object-cover border-2 border-blue-200 shadow-sm"
                                                            onError={(e) => {
                                                                e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="64" height="64" fill="#E5E7EB"/>
<circle cx="32" cy="24" r="10" fill="#9CA3AF"/>
<path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#9CA3AF"/>
</svg>`)}`;
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500">No Image</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold text-gray-900 text-lg">{member.name}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                        {member.designation}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-800 font-medium">{member.occupation}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href={`tel:${member.contact}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                                        {member.contact}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <a href={`mailto:${member.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                                        {member.email}
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-gray-700">{member.address}</div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-6">
                    {filteredCommittee.length === 0 ? (
                        <div className="text-center text-gray-500 p-6 bg-white rounded-lg shadow-md">
                            কোনো তথ্য পাওয়া যায়নি
                        </div>
                    ) : (
                        filteredCommittee.map((member, index) => (
                            <div key={member._id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                                <div className="flex flex-col space-y-4">
                                    {/* Header with Image and Basic Info */}
                                    <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                        <div className="flex-shrink-0 mx-auto sm:mx-0">
                                            {member.image ? (
                                                <img
                                                    src={member.image}
                                                    alt={member.name}
                                                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-100 shadow-md"
                                                    onError={(e) => {
                                                        e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="96" height="96" fill="#E5E7EB"/>
<circle cx="48" cy="36" r="15" fill="#9CA3AF"/>
<path d="M15 81c0-18.225 14.775-33 33-33s33 14.775 33 33" fill="#9CA3AF"/>
</svg>`)}`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                                    No Image
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 text-center sm:text-left">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                {member.designation}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Detailed Information */}
                                    <div className="border-t border-gray-200 pt-4">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24">
                                                    পেশা:
                                                </span>
                                                <span className="text-gray-900 font-medium">{member.occupation}</span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24">
                                                    যোগাযোগ:
                                                </span>
                                                <a href={`tel:${member.contact}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                                    {member.contact}
                                                </a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-start">
                                                <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24">
                                                    ইমেইল:
                                                </span>
                                                <a href={`mailto:${member.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                                    {member.email}
                                                </a>
                                            </div>
                                            <div className="flex flex-col sm:flex-row sm:items-start">
                                                <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24">
                                                    ঠিকানা:
                                                </span>
                                                <span className="text-gray-700">{member.address}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Member Number */}
                                    <div className="text-right">
                                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            সদস্য #{index + 1}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Committee;