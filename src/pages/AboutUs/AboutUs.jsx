import React, { useState, useEffect } from 'react';

const AboutUs = () => {
    const [activeTab, setActiveTab] = useState('ইতিহাস');
    const [history, setHistory] = useState('');
    const [objectives, setObjectives] = useState('');
    const [committeeMembers, setCommitteeMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock API calls - replace with your actual API endpoints
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Replace these with your actual API calls
                const historyResponse = await fetch('https://pressclub-netrakona-server.vercel.app/pc-history');
                const historyData = await historyResponse.json();
                setHistory(historyData);

                // const objectivesResponse = await fetch('/api/objectives');
                // const objectivesData = await objectivesResponse.json();
                setObjectives('এখানে আদর্শ ও উদ্দেশ্য সম্পর্কিত তথ্য প্রদর্শিত হবে...');

                // const committeeResponse = await fetch('/api/committee-members');
                // const committeeData = await committeeResponse.json();
                setCommitteeMembers([
                    {
                        id: 1,
                        image: '/api/placeholder/150/150',
                        name: 'মোঃ আব্দুর রহমান',
                        designation: 'সভাপতি',
                        professional: 'সাংবাদিক',
                        address: 'ঢাকা, বাংলাদেশ',
                        contact: '০১৭১১-১২৩৪৫৬'
                    },
                    {
                        id: 2,
                        image: '/api/placeholder/150/150',
                        name: 'মোঃ করিম উদ্দিন',
                        designation: 'সাধারণ সম্পাদক',
                        professional: 'সাংবাদিক',
                        address: 'চট্টগ্রাম, বাংলাদেশ',
                        contact: '০১৮১২-৭৮৯০১২'
                    }
                ]);

                // const membersResponse = await fetch('/api/members');
                // const membersData = await membersResponse.json();
                setMembers([
                    {
                        id: 1,
                        name: 'মোঃ সালাম খান',
                        designation: 'কর্মকর্তা',
                        professional: 'শিক্ষক',
                        address: 'সিলেট, বাংলাদেশ',
                        contact: '০১৯১৩-৪৫৬৭৮৯'
                    },
                    {
                        id: 2,
                        name: 'মোছাঃ রাহেলা বেগম',
                        designation: 'সদস্য',
                        professional: 'ব্যবসায়ী',
                        address: 'রাজশাহী, বাংলাদেশ',
                        contact: '০১৫১৪-৮৯০১২৩'
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
        'ইতিহাস',
        'আদর্শ ও উদ্দেশ্য',
        'সদস্যব্রিন্দ',
        'অসাংবাদিক সদস্য'
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
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

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
{activeTab === 'ইতিহাস' && (
  <div>
    <h2 className="text-2xl font-bold text-gray-800 mb-4">ইতিহাস</h2>
    <div
      className="text-gray-700 leading-relaxed"
      dangerouslySetInnerHTML={{ __html: history[0]?.description || 'এখনও ইতিহাস যোগ করা হয়নি।' }}
    ></div>
  </div>
)}


                    {activeTab === 'আদর্শ ও উদ্দেশ্য' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">আদর্শ ও উদ্দেশ্য</h2>
                            <div className="text-gray-700 leading-relaxed">
                                <p>{objectives}</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'সদস্যব্রিন্দ' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">সদস্যব্রিন্দ</h2>
                            
                            {/* Committee Members Table */}
                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">কমিটি ও কর্মচারী বৃন্দ</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full bg-white border border-gray-200">
                                        <thead>
                                            <tr className="bg-blue-50">
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">ছবি</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">নাম</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">পদবী</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">পেশা</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">ঠিকানা</th>
                                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">যোগাযোগ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {committeeMembers.map((member) => (
                                                <tr key={member.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 border-b">
                                                        <img
                                                            src={member.image}
                                                            alt={member.name}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                            onError={(e) => {
                                                                e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="48" height="48" fill="#E5E7EB"/>
<circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
<path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
</svg>`)}`;
                                                            }}
                                                        />
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.name}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.designation}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.professional}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.address}</td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.contact}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">স্বাক্ষর</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {committeeMembers.map((member) => (
                                        <div key={`signature-${member.id}`} className="border border-gray-200 rounded-lg p-4 text-center">
                                            <img
                                                src={member.image}
                                                alt={member.name}
                                                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
                                                onError={(e) => {
                                                    e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="80" height="80" fill="#E5E7EB"/>
<circle cx="40" cy="30" r="12" fill="#9CA3AF"/>
<path d="M12 66c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#9CA3AF"/>
</svg>`)}`;
                                                }}
                                            />
                                            <h4 className="font-medium text-gray-900">{member.name}</h4>
                                            <p className="text-sm text-gray-600">{member.designation}</p>
                                            <p className="text-sm text-gray-500">{member.professional}</p>
                                            <p className="text-sm text-gray-500">{member.address}</p>
                                            <p className="text-sm text-blue-600">{member.contact}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'অসাংবাদিক সদস্য' && (
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">অসাংবাদিক সদস্য</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border border-gray-200">
                                    <thead>
                                        <tr className="bg-blue-50">
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">নাম</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">পদবী</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">পেশা</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">ঠিকানা</th>
                                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">যোগাযোগ</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => (
                                            <tr key={member.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.name}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.designation}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.professional}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.address}</td>
                                                <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.contact}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AboutUs;