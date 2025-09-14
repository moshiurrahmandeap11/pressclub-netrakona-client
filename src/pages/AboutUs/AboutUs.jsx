import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router';
import DOMPurify from 'dompurify';


const AboutUs = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('ইতিহাস ও কার্যাবলী');
    const [history, setHistory] = useState('');
    const [objectives, setObjectives] = useState('');
    const [committeeMembers, setCommitteeMembers] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [achievement, setAchievements] = useState([])

  useEffect(() => {
    const tryFetching = async () => {
      try {
        const res = await axios.get("https://pressclub-netrakona-server.vercel.app/achievement");
        setAchievements(res.data);
      } catch (error) {
        console.log("failed to get achievement", error);
      }
    };

    tryFetching();
  }, []);

    // Tab mapping object - Fixed to match sidebar
    const tabMapping = {
        'history': 'ইতিহাস ও কার্যাবলী',
        'mission': 'মিশন ও ভিশন',
        'members': 'সাংগঠনিক কাঠামো',
        'success': 'সাফল্য ও অর্জন',
        'member-list': 'সদস্য তালিকা'
    };

    // Reverse mapping for URL generation
    const reverseTabMapping = {
        'ইতিহাস ও কার্যাবলী': 'history',
        'মিশন ও ভিশন': 'mission',
        'সাংগঠনিক কাঠামো': 'members',
        'সাফল্য ও অর্জন': 'success',
        'সদস্য তালিকা': 'member-list'
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

useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await axios.get("https://pressclub-netrakona-server.vercel.app/mishon-vishon");
      setObjectives(res.data); // res.data কে string বানানো দরকার নেই
    } catch  {
      alert("Failed to load mishon-vishon");
    }
  };

  fetchData();
}, []);


const image = (objectives?.[0]?.mishonVishon?.mishonVishon?.image);

    
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
        'ইতিহাস ও কার্যাবলী',
        'মিশন ও ভিশন',
        'সাংগঠনিক কাঠামো',
        'সাফল্য ও অর্জন',
        'সদস্য তালিকা'
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

                {/* Tab Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {activeTab === 'ইতিহাস ও কার্যাবলী' && (
                        <div id="history">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">ইতিহাস ও কার্যাবলী</h2>
                            <div
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: history[0]?.description || 'এখনও ইতিহাস যোগ করা হয়নি।' }}
                            ></div>
                        </div>
                    )}
{activeTab === 'মিশন ও ভিশন' && (
  <div id="mission">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">মিশন ও ভিশন</h2>
    <img src={image} alt="" />
    <div
      className="text-gray-700 leading-relaxed prose max-w-none"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(
          objectives[0]?.mishonVishon?.mishonVishon?.details || 'এখনও মিশন/ভিশন যোগ করা হয়নি।'
        ),
      }}
    />
  </div>
)}


                    {activeTab === 'সাংগঠনিক কাঠামো' && (
                        <div id="members">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">সাংগঠনিক কাঠামো</h2>
                            
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
{activeTab === 'সাফল্য ও অর্জন' && (
  <div id="success">
    <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">সাফল্য ও অর্জন</h2>

    {achievement?.length > 0 ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievement.map((item) => (
          <div 
            key={item._id} 
            className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition duration-300"
          >
            {/* Image */}
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-48 object-cover"
              />
            )}

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {item.title}
              </h3>

              {/* Key Features */}
              {item.features && (
                <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm">
                  {item.features.split(",").map((feature, idx) => (
                    <li key={idx}>{feature.trim()}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-center text-gray-500">কোনো অর্জন পাওয়া যায়নি...</p>
    )}
  </div>
)}


                    {activeTab === 'সদস্য তালিকা' && (
                        <div id="member-list">
                            <h2 className="text-2xl font-bold text-gray-800 mb-6">সদস্য তালিকা</h2>
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