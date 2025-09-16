import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';

const UpdateDetails = () => {
  const { id } = useParams();
  const [update, setUpdate] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const response = await fetch(`https://pressclub-netrakona-server.vercel.app/last-update/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch update");
        }
        const data = await response.json();
        setUpdate(data);
      } catch (error) {
        console.error("Error fetching update:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdate();
  }, [id]);

  console.log(update);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        লোড হচ্ছে...
      </div>
    );
  }

  if (!update) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        কোনো আপডেট পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">
        {update.title}
      </h1>
      <img src={update?.imageUrl} alt="" />
      <p className="text-sm text-gray-500 mb-6">তারিখ: {update.date}</p>
<div
  className="prose prose-lg text-gray-700 leading-relaxed"
  dangerouslySetInnerHTML={{ __html: update.description || "কোনো বিস্তারিত বর্ণনা নেই" }}
></div>


      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          ফিরে যান
        </button>
      </div>
    </div>
  );
};

export default UpdateDetails;
