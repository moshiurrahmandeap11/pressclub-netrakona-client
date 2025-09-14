import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const ITEMS_PER_PAGE = 10; // প্রতি পেইজে কতগুলো আপডেট দেখাবে

const AllUpdates = () => {
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch("http://localhost:3000/last-update");
        const data = await response.json();
        setUpdates(data);
      } catch (error) {
        console.error("Error fetching updates:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  const totalPages = Math.ceil(updates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentUpdates = updates.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        সকল আপডেট
      </h1>

      {/* Title List */}
      <ul className="divide-y divide-gray-200">
        {currentUpdates.length > 0 ? (
          currentUpdates.map((update) => (
            <li
              key={update._id}
              onClick={() => navigate(`/update-details/${update._id}`)}
              className="p-4 cursor-pointer text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {update.title}
            </li>
          ))
        ) : (
          <li className="p-4 text-gray-500">কোনো আপডেট পাওয়া যায়নি</li>
        )}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center items-center space-x-3">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            পূর্ববর্তী
          </button>
          <span className="font-semibold">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            পরবর্তী
          </button>
        </div>
      )}
    </div>
  );
};

export default AllUpdates;
