import axios from 'axios';
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useLocation } from 'react-router';
import DOMPurify from 'dompurify';

const AboutUs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('ইতিহাস ও কার্যাবলী');
  const [history, setHistory] = useState('');
  const [objectives, setObjectives] = useState([]);
  const [committeeMembers, setCommitteeMembers] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [achievement, setAchievements] = useState([]);
  const [memberListLoading, setMemberListLoading] = useState(false);
  const [committeeLoading, setCommitteeLoading] = useState(false);
  const [committeeError, setCommitteeError] = useState(null);

  // Fetch achievements
  useEffect(() => {
    const tryFetching = async () => {
      try {
        const res = await axios.get('https://pressclub-netrakona-server.vercel.app/achievement', {
          timeout: 5000
        });
        setAchievements(res.data);
      } catch (error) {
        console.error('Failed to get achievement:', error);
      }
    };
    tryFetching();
  }, []);

  // Tab mapping object
  const tabMapping = {
    history: 'ইতিহাস ও কার্যাবলী',
    mission: 'আদর্শ ও উদ্দেশ্য',
    members: 'প্রতিষ্ঠাকালীন সদস্যবৃন্দ',
    'member-list': 'সাধারণ পরিষদ'
  };

  // Reverse mapping for URL generation
  const reverseTabMapping = {
    'ইতিহাস ও কার্যাবলী': 'history',
    'আদর্শ ও উদ্দেশ্য': 'mission',
    'প্রতিষ্ঠাকালীন সদস্যবৃন্দ': 'members',
    'সাধারণ পরিষদ': 'member-list'
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
    setSearchParams({ tab: reverseTabMapping[tab] });
  };

  // Fetch member list from API
  const fetchMemberList = async () => {
    try {
      setMemberListLoading(true);
      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/member-list', {
        timeout: 5000
      });
      const formattedMembers = response.data.map(item => ({
        id: item._id,
        ...item.member,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setMembers(formattedMembers);
    } catch (error) {
      console.error('Failed to fetch member list:', error);
      setMembers([
        {
          id: 1,
          name: 'মোঃ সালাম খান',
          designation: 'কর্মকর্তা',
          occupation: 'শিক্ষক',
          address: 'সিলেট, বাংলাদেশ',
          contact: '০১৯১৩-৪৫৬৭৮৯'
        },
        {
          id: 2,
          name: 'মোছাঃ রাহেলা বেগম',
          designation: 'সদস্য',
          occupation: 'ব্যবসায়ী',
          address: 'রাজশাহী, বাংলাদেশ',
          contact: '০১৫১৪-৮৯০১২৩'
        }
      ]);
    } finally {
      setMemberListLoading(false);
    }
  };

  // Fetch committee (permanent) members from API
  const fetchCommitteeMembers = async () => {
    try {
      setCommitteeLoading(true);
      setCommitteeError(null);
      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/permanent-member', {
        timeout: 5000 // 5-second timeout to prevent hanging
      });
      const formattedMembers = response.data.map(item => ({
        id: item._id,
        image: item.member.image || `data:image/svg+xml;base64,${btoa(
          `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="48" height="48" fill="#E5E7EB"/>
            <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
            <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
          </svg>`
        )}`,
        name: item.member.name,
        designation: item.member.designation,
        professional: item.member.occupation,
        address: item.member.address,
        contact: item.member.contact,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setCommitteeMembers(formattedMembers);
    } catch (error) {
      console.error('Failed to fetch permanent members:', error);
      setCommitteeError('প্রতিষ্ঠাকালীন সদস্য তালিকা লোড করতে ব্যর্থ।');
      setCommitteeMembers([
        {
          id: 1,
          image: `data:image/svg+xml;base64,${btoa(
            `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" fill="#E5E7EB"/>
              <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
              <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
            </svg>`
          )}`,
          name: 'মোঃ আব্দুর রহমান',
          designation: 'সভাপতি',
          professional: 'সাংবাদিক',
          address: 'ঢাকা, বাংলাদেশ',
          contact: '০১৭১১-১২৩৪৫৬'
        },
        {
          id: 2,
          image: `data:image/svg+xml;base64,${btoa(
            `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" fill="#E5E7EB"/>
              <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
              <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
            </svg>`
          )}`,
          name: 'মোঃ করিম উদ্দিন',
          designation: 'সাধারণ সম্পাদক',
          professional: 'সাংবাদিক',
          address: 'চট্টগ্রাম, বাংলাদেশ',
          contact: '০১৮১২-৭৮৯০১২'
        }
      ]);
    } finally {
      setCommitteeLoading(false);
    }
  };

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [historyResponse, objectivesResponse, committeeResponse] = await Promise.all([
          axios.get('https://pressclub-netrakona-server.vercel.app/pc-history', { timeout: 5000 }),
          axios.get('https://pressclub-netrakona-server.vercel.app/mishon-vishon', { timeout: 5000 }),
          axios.get('https://pressclub-netrakona-server.vercel.app/permanent-member', { timeout: 5000 })
        ]);

        setHistory(historyResponse.data);
        setObjectives(objectivesResponse.data);

        const formattedMembers = committeeResponse.data.map(item => ({
          id: item._id,
          image: item.member.image || `data:image/svg+xml;base64,${btoa(
            `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" fill="#E5E7EB"/>
              <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
              <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
            </svg>`
          )}`,
          name: item.member.name,
          designation: item.member.designation,
          professional: item.member.occupation,
          address: item.member.address,
          contact: item.member.contact,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        }));
        setCommitteeMembers(formattedMembers);

        if (activeTab === 'সাধারণ পরিষদ') {
          await fetchMemberList();
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [activeTab]);

  // Memoize committee members to prevent unnecessary re-renders
  const memoizedCommitteeMembers = useMemo(() => committeeMembers, [committeeMembers]);

  const image = objectives?.[0]?.mishonVishon?.mishonVishon?.image;

  const tabs = [
    'ইতিহাস ও কার্যাবলী',
    'আদর্শ ও উদ্দেশ্য',
    'প্রতিষ্ঠাকালীন সদস্যবৃন্দ',
    'সাধারণ পরিষদ'
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleTabChange(tab)}
                className={`px-4 py-3 font-medium text-sm sm:text-base flex-1 text-center md:flex-none ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                } transition-colors duration-200`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-md p-6 sm:p-8">
          {activeTab === 'ইতিহাস ও কার্যাবলী' && (
            <div id="history">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">ইতিহাস ও কার্যাবলী</h2>
              <div
                className="text-gray-700 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(history[0]?.description || 'এখনও ইতিহাস যোগ করা হয়নি।') }}
              ></div>
            </div>
          )}
          {activeTab === 'আদর্শ ও উদ্দেশ্য' && (
            <div id="mission">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">আদর্শ ও উদ্দেশ্য</h2>
              {image && (
                <img
                  src={image}
                  alt="Mission and Vision"
                  className="w-full max-w-md mx-auto mb-4 rounded-lg object-cover"
                />
              )}
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
          {activeTab === 'প্রতিষ্ঠাকালীন সদস্যবৃন্দ' && (
            <div id="members">
              <h2 className="text-2xl sm:text-3xl text-center font-bold text-gray-800 mb-6">প্রতিষ্ঠাকালীন সদস্যবৃন্দ</h2>
                              {/* Statistics Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{memoizedCommitteeMembers.length}</div>
                        <div className="text-gray-600 font-medium">মোট প্রতিষ্ঠাকালীন সদস্য</div>
                    </div>
                </div>
              {committeeLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
              ) : committeeError ? (
                <div className="text-center text-red-600 py-4">{committeeError}</div>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">ছবি</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">নাম</th>
                        <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-b">পেশা</th>
                        <th className="px-4 py-3 text-center  text-sm font-medium text-gray-700 border-b">পদবী</th>
                      </tr>
                    </thead>
                    <tbody>
                      {memoizedCommitteeMembers.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="text-center py-6 text-gray-500">
                            কোনো প্রতিষ্ঠাকালীন সদস্য নেই
                          </td>
                        </tr>
                      ) : (
                        memoizedCommitteeMembers.map((member) => (
                          <tr key={member.id} className="hover:bg-gray-50 transition duration-200">
                            <td className="px-4 py-3 border-b">
                              <img
                                src={member.image}
                                alt={member.name}
                                className="w-12 h-12 rounded-full object-cover"
                                onError={(e) => {
                                  e.target.src = `data:image/svg+xml;base64,${btoa(
                                    `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <rect width="48" height="48" fill="#E5E7EB"/>
                                      <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
                                      <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
                                    </svg>`
                                  )}`;
                                }}
                              />
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 border-b">{member.name}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 border-b">{member.professional}</td>
                            <td className="px-4 py-3 text-center text-sm text-gray-900 border-b">{member.designation}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
          {activeTab === 'সাধারণ পরিষদ' && (
            <div id="member-list">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl flex-1 sm:text-3xl font-bold text-gray-800">সাধারণ পরিষদ</h2>
                <button
                  onClick={fetchMemberList}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
                  disabled={memberListLoading}
                >
                  {memberListLoading ? 'লোড হচ্ছে...' : 'রিফ্রেশ'}
                </button>
              </div>

                         {/* Statistics Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{members.length}</div>
                        <div className="text-gray-600 font-medium">মোট কমিটির সদস্য</div>
                    </div>
                </div>

              {memberListLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg shadow">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600  text-white">
                      <tr>
                        <th className="px-4 py-3 text-center text-sm font-medium">নাম</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">পদবী</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">পেশা</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">ঠিকানা</th>
                        <th className="px-4 py-3 text-center text-sm font-medium">মোবাইল</th>
                      </tr>
                    </thead>
                    <tbody>
                      {members.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-6 text-gray-500">
                            কোনো সদস্য নেই
                          </td>
                        </tr>
                      ) : (
                        members.map((member, index) => (
                          <tr
                            key={member.id}
                            className={`transition duration-200 ${
                              index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                            } hover:bg-blue-50`}
                          >
                            <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{member.name}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{member.designation}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{member.occupation}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{member.address}</td>
                            <td className="px-4 py-3 text-sm text-center text-gray-900 border-b">{member.contact}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;