import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const PcHistory = () => {
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(true);
const navigate = useNavigate();
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:3000/pc-history");
        // Assuming API returns array, take the first item if exists
        setHistory(res.data.length ? res.data[0] : null);
      } catch (err) {
        console.error("Error fetching history:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <p>Loading history...</p>;
  }

  const handleAddOrEdit = () => {
    // Here you can open a modal or navigate to AddHistory component
    if (history) {
      navigate(`/edit-history/${history?._id}`)
    } else {
      navigate("/add-history")
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">PC History</h2>
        <button
          onClick={handleAddOrEdit}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {history ? "Edit History" : "Add History"}
        </button>
      </div>

      {history ? (
        <div
          className="bg-gray-100 p-4 rounded shadow prose max-w-none"
          dangerouslySetInnerHTML={{ __html: history.description }}
        />
      ) : (
        <p className="text-gray-500">No history found. Click above to add one.</p>
      )}
    </div>
  );
};

export default PcHistory;
