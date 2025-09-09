import React, { useState, useEffect } from 'react';

const Committee = () => {
    const [committeeData, setCommitteeData] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock API call - replace with your actual API endpoint
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace this with your actual API call
                // const response = await fetch('/api/managing-committee');
                // const data = await response.json();
                setCommitteeData([
                    {
                        id: 1,
                        name: 'মোঃ আব্দুর রহমান খান',
                        designation: 'সভাপতি',
                        image: '/api/placeholder/100/100',
                        phone: '০১৭১১-১২৩৪৫৬',
                        email: 'president@example.com',
                        address: 'ঢাকা, বাংলাদেশ',
                        profession: 'সাংবাদিক'
                    },
                    {
                        id: 2,
                        name: 'মোঃ করিম উদ্দিন',
                        designation: 'সাধারণ সম্পাদক',
                        image: '/api/placeholder/100/100',
                        phone: '০১৮১২-৭৮৯০১২',
                        email: 'secretary@example.com',
                        address: 'চট্টগ্রাম, বাংলাদেশ',
                        profession: 'সাংবাদিক'
                    },
                    {
                        id: 3,
                        name: 'ডাঃ ফাতেমা বেগম',
                        designation: 'সহ-সভাপতি',
                        image: '/api/placeholder/100/100',
                        phone: '০১৯১৩-৪৫৬৭৮৯',
                        email: 'vicepresident@example.com',
                        address: 'সিলেট, বাংলাদেশ',
                        profession: 'চিকিৎসক'
                    },
                    {
                        id: 4,
                        name: 'প্রফেসর আহমেদ হাসান',
                        designation: 'যুগ্ম সম্পাদক',
                        image: '/api/placeholder/100/100',
                        phone: '০১৫১৪-৮৯০১২৩',
                        email: 'jointsecretary@example.com',
                        address: 'রাজশাহী, বাংলাদেশ',
                        profession: 'শিক্ষক'
                    },
                    {
                        id: 5,
                        name: 'জনাব সালাম খান',
                        designation: 'কোষাধ্যক্ষ',
                        image: '/api/placeholder/100/100',
                        phone: '০১৬১৫-৩৪৫৬৭৮',
                        email: 'treasurer@example.com',
                        address: 'খুলনা, বাংলাদেশ',
                        profession: 'ব্যাংকার'
                    },
                    {
                        id: 6,
                        name: 'মোছাঃ রাহেলা আক্তার',
                        designation: 'সাংগঠনিক সম্পাদক',
                        image: '/api/placeholder/100/100',
                        phone: '০১৭১৬-৯০১২৩৪',
                        email: 'organizer@example.com',
                        address: 'বরিশাল, বাংলাদেশ',
                        profession: 'সাংবাদিক'
                    },
                    {
                        id: 7,
                        name: 'মোঃ জামাল উদ্দিন',
                        designation: 'প্রচার সম্পাদক',
                        image: '/api/placeholder/100/100',
                        phone: '০১৮১৭-৫৬৭৮৯০',
                        email: 'publicity@example.com',
                        address: 'রংপুর, বাংলাদেশ',
                        profession: 'সাংবাদিক'
                    },
                    {
                        id: 8,
                        name: 'ডাঃ নাসির উদ্দিন',
                        designation: 'সদস্য',
                        image: '/api/placeholder/100/100',
                        phone: '০১৯১৮-১২৩৪৫৬',
                        email: 'member1@example.com',
                        address: 'ময়মনসিংহ, বাংলাদেশ',
                        profession: 'চিকিৎসক'
                    },
                    {
                        id: 9,
                        name: 'ইঞ্জিনিয়ার শাহনাজ পারভীন',
                        designation: 'সদস্য',
                        image: '/api/placeholder/100/100',
                        phone: '০১৫১৯-৭৮৯০১২',
                        email: 'member2@example.com',
                        address: 'কুমিল্লা, বাংলাদেশ',
                        profession: 'প্রকৌশলী'
                    },
                    {
                        id: 10,
                        name: 'মোঃ রফিকুল ইসলাম',
                        designation: 'সদস্য',
                        image: '/api/placeholder/100/100',
                        phone: '০১৬২০-৩৪৫৬১৮',
                        email: 'member3@example.com',
                        address: 'যশোর, বাংলাদেশ',
                        profession: 'ব্যবসায়ী'
                    }
                ]);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching committee data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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
                        <span className="text-4xl">👥</span>
                        ম্যানেজিং কমিটি
                    </h1>
                    <div className="w-32 h-1 bg-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">বর্তমান কার্যনির্বাহী কমিটির সদস্যবৃন্দ</p>
                </div>

                {/* Statistics Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{committeeData.length}</div>
                        <div className="text-gray-600 font-medium">মোট কমিটির সদস্য</div>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
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
                                    {committeeData.map((member, index) => (
                                        <tr key={member.id} className={`hover:bg-blue-50 transition-colors duration-200 ${
                                            index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                        }`}>
                                            <td className="px-6 py-4">
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
                                                <div className="text-gray-800 font-medium">{member.profession}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-blue-600 font-medium">{member.phone}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-green-600 font-medium break-all">{member.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-700">{member.address}</div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-6">
                    {committeeData.map((member, index) => (
                        <div key={member.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex flex-col space-y-4">
                                {/* Header with Image and Basic Info */}
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                                    <div className="flex-shrink-0 mx-auto sm:mx-0">
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
                                            <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24 flex items-center">
                                                <span className="mr-2">💼</span>
                                                পেশা:
                                            </span>
                                            <span className="text-gray-900 font-medium">{member.profession}</span>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-center">
                                            <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24 flex items-center">
                                                <span className="mr-2">📱</span>
                                                মোবাইল:
                                            </span>
                                            <a href={`tel:${member.phone}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                                {member.phone}
                                            </a>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-start">
                                            <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24 flex items-center">
                                                <span className="mr-2">📧</span>
                                                ইমেইল:
                                            </span>
                                            <a href={`mailto:${member.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                                {member.email}
                                            </a>
                                        </div>
                                        
                                        <div className="flex flex-col sm:flex-row sm:items-start">
                                            <span className="text-sm font-semibold text-gray-600 mb-1 sm:mb-0 sm:w-24 flex items-center">
                                                <span className="mr-2">📍</span>
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
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Committee;