import React, { useState, useEffect } from "react";

const Administration = () => {
  const [activeTab, setActiveTab] = useState("সভাপতি সারণী");
  const [presidentData, setPresidentData] = useState([]);
  const [secretaryData, setSecretaryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock API calls - replace with your actual API endpoints
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Replace these with your actual API calls
        // const presidentResponse = await fetch('/api/president-list');
        // const presidentData = await presidentResponse.json();
        setPresidentData([
          {
            id: 1,
            name: "মোঃ আব্দুর রহমান খান",
            period: "২০২০-২০২২",
            image: "/api/placeholder/100/100",
            phone: "০১৭১১-১২৩৪৫৬",
            email: "president1@example.com",
            address: "ঢাকা, বাংলাদেশ",
          },
          {
            id: 2,
            name: "ডাঃ মোহাম্মদ আলী",
            period: "২০১৮-২০২০",
            image: "/api/placeholder/100/100",
            phone: "০১৮১২-৭৮৯০১২",
            email: "president2@example.com",
            address: "চট্টগ্রাম, বাংলাদেশ",
          },
          {
            id: 3,
            name: "প্রফেসর মোঃ করিম উদ্দিন",
            period: "২০১৬-২০১৮",
            image: "/api/placeholder/100/100",
            phone: "০১৯১৩-৪৫৬৭৮৯",
            email: "president3@example.com",
            address: "সিলেট, বাংলাদেশ",
          },
        ]);

        // const secretaryResponse = await fetch('/api/secretary-list');
        // const secretaryData = await secretaryResponse.json();
        setSecretaryData([
          {
            id: 1,
            name: "মোঃ রফিকুল ইসলাম",
            period: "২০২০-২০২২",
            image: "/api/placeholder/100/100",
            phone: "০১৫১৪-৮৯০১২৩",
            email: "secretary1@example.com",
            address: "রাজশাহী, বাংলাদেশ",
          },
          {
            id: 2,
            name: "জনাব আহমেদ হোসেন",
            period: "২০১৮-২০২০",
            image: "/api/placeholder/100/100",
            phone: "০১৬১৫-৩৪৫৬৭৮",
            email: "secretary2@example.com",
            address: "খুলনা, বাংলাদেশ",
          },
          {
            id: 3,
            name: "মোছাঃ সালমা খাতুন",
            period: "২০১৬-২০১৮",
            image: "/api/placeholder/100/100",
            phone: "০১৭১৬-৯০১২৩৪",
            email: "secretary3@example.com",
            address: "বরিশাল, বাংলাদেশ",
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const tabs = ["সভাপতি সারণী", "সাধারণ সম্পাদক সারণী"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const renderDataCards = (data, title) => (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h2>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
          <table className="min-w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="px-6 py-4 text-left text-sm font-medium">ছবি</th>
                <th className="px-6 py-4 text-left text-sm font-medium">নাম</th>
                <th className="px-6 py-4 text-left text-sm font-medium">
                  মেয়াদকাল
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium">
                  যোগাযোগ
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium">
                  ইমেইল
                </th>
                <th className="px-6 py-4 text-left text-sm font-medium">
                  ঠিকানা
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((person) => (
                <tr
                  key={person.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <img
                      src={person.image}
                      alt={person.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
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
                    <div className="font-medium text-gray-900">
                      {person.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                      {person.period}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {person.phone}
                  </td>
                  <td className="px-6 py-4 text-sm text-blue-600">
                    {person.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {person.address}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {data.map((person) => (
          <div
            key={person.id}
            className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-600"
          >
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src={person.image}
                  alt={person.name}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="80" height="80" fill="#E5E7EB"/>
<circle cx="40" cy="30" r="12" fill="#9CA3AF"/>
<path d="M12 66c0-15.464 12.536-28 28-28s28 12.536 28 28" fill="#9CA3AF"/>
</svg>`)}`;
                  }}
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {person.name}
                </h3>
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-600 w-full sm:w-20">
                      মেয়াদকাল:
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mx-auto sm:mx-0">
                      {person.period}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-600 w-full sm:w-20">
                      যোগাযোগ:
                    </span>
                    <span className="text-sm text-gray-900">
                      {person.phone}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-600 w-full sm:w-20">
                      ইমেইল:
                    </span>
                    <span className="text-sm text-blue-600 break-all">
                      {person.email}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0">
                    <span className="text-sm font-medium text-gray-600 w-full sm:w-20">
                      ঠিকানা:
                    </span>
                    <span className="text-sm text-gray-900">
                      {person.address}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            প্রশাসন
          </h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex flex-col sm:flex-row">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base flex-1 transition-all duration-300 ${
                  activeTab === tab
                    ? "text-white bg-blue-600 shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                } ${
                  tab === "সভাপতি সারণী"
                    ? "rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none"
                    : "rounded-b-lg sm:rounded-r-lg sm:rounded-bl-none"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          {activeTab === "সভাপতি সারণী" &&
            renderDataCards(presidentData, "সভাপতি সারণী")}
          {activeTab === "সাধারণ সম্পাদক সারণী" &&
            renderDataCards(secretaryData, "সাধারণ সম্পাদক সারণী")}
        </div>
      </div>
    </div>
  );
};

export default Administration;
