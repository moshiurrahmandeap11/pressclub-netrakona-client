import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const ImportantLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

useEffect(() => {
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:3000/important-links");
      // Make sure it's always an array
      setLinks(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Failed to fetch links:", error);
      setLinks([]); // fallback
    } finally {
      setLoading(false);
    }
  };

  fetchLinks();
}, []);


  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-xl">লোড হচ্ছে...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">গুরুত্বপূর্ন লিংক্স</h2>
        <button onClick={() => navigate("/add-important-links")} className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full md:w-auto">
          নতুন লিংক যোগ করুন
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">শিরোনাম</th>
              <th className="p-4 font-semibold text-gray-600">লিংক</th>
              <th className="p-4 font-semibold text-gray-600">একশন</th>
            </tr>
          </thead>
          <tbody>
            {links.map(link => (
              <tr key={link._id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-4 text-gray-700">{link.title}</td>
                <td className="p-4">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </td>
                <td className="p-4 space-x-2">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm">
                    এডিট
                  </button>
                  <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm">
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ImportantLinks;
