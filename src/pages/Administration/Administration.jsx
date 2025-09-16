import React, { useState, useEffect } from "react";

const Administration = () => {
  const [activeTab, setActiveTab] = useState("সভাপতি সারণী");
  const [administrationData, setAdministrationData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://pressclub-netrakona-server.vercel.app/adminstration"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setAdministrationData(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching administration data:", error);
        setError("ডাটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on type
  const presidentData = administrationData.filter(
    (item) => item.type === "president"
  );
  const secretaryData = administrationData.filter(
    (item) => item.type === "secretary"
  );

  const tabs = ["সভাপতি সারণী", "সাধারণ সম্পাদক সারণী"];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">ডাটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.382 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </div>
    );
  }

  const renderDataCards = (data, title) => (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        {title}
      </h2>

      {data.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">কোন তথ্য পাওয়া যায়নি</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="overflow-x-auto bg-white rounded-lg shadow-lg">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      ছবি
                    </th>
                    <th className="px-4 py-4 text-left text-sm font-semibold">
                      নাম
                    </th>
                    <th className="px-4 py-4 text-center text-sm font-semibold">
                      কার্যকাল
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {data.map((person) => (
                    <tr
                      key={person._id}
                      className="hover:bg-gray-50 transition-all duration-200"
                    >
                      <td className="px-4 py-4">
                        <div className="flex-shrink-0">
                          <img
                            src={
                              person.image ||
                              `data:image/svg+xml;base64,${btoa(`<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="64" height="64" fill="#E5E7EB"/>
<circle cx="32" cy="24" r="10" fill="#9CA3AF"/>
<path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#9CA3AF"/>
</svg>`)}`
                            }
                            alt={person.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-sm"
                            onError={(e) => {
                              e.target.src = `data:image/svg+xml;base64,${btoa(`<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="64" height="64" fill="#E5E7EB"/>
<circle cx="32" cy="24" r="10" fill="#9CA3AF"/>
<path d="M10 54c0-12.15 9.85-22 22-22s22 9.85 22 22" fill="#9CA3AF"/>
</svg>`)}`;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-semibold text-gray-900 text-base">
                          {person.name}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {person.tenure}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-6">
            {data.map((person) => (
              <div
                key={person._id}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <img
                      src={
                        person.image ||
                        `data:image/svg+xml;base64,${btoa(`<svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect width="96" height="96" fill="#E5E7EB"/>
<circle cx="48" cy="36" r="15" fill="#9CA3AF"/>
<path d="M15 81c0-18.225 14.775-33 33-33s33 14.775 33 33" fill="#9CA3AF"/>
</svg>`)}`
                      }
                      alt={person.name}
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

                  {/* Name */}
                  <div className="text-center">
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                      {person.name}
                    </h3>

                    {/* Tenure Badge */}
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 border border-blue-300">
                      {person.tenure}
                    </span>
                  </div>

                  {/* Contact Details */}
                  <div className="w-full space-y-3 mt-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                            ></path>
                          </svg>
                        </div>
 
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          <svg
                            className="w-5 h-5 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            ></path>
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            ></path>
                          </svg>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            প্রশাসন
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-700 mx-auto rounded-full"></div>
          <p className="text-gray-600 mt-4 text-lg">
            আমাদের সংস্থার নেতৃত্ব ও পরিচালনা
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold text-base flex-1 transition-all duration-300 relative ${
                  activeTab === tab
                    ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                } ${
                  index === 0
                    ? "sm:rounded-tl-xl sm:rounded-bl-xl"
                    : "sm:rounded-tr-xl sm:rounded-br-xl"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white opacity-30 sm:hidden"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="min-h-[500px]">
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
