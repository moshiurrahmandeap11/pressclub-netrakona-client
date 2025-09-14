import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // useNavigate এর import ঠিক করা হয়েছে
import axios from 'axios';

const ITEMS_PER_PAGE = 5;

const LastUpdate = () => {
    const [updates, setUpdates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // API থেকে ডেটা আনা
    useEffect(() => {
        const fetchUpdates = async () => {
            try {
                setLoading(true);
                // ডেটা আনার সময় সর্বশেষ ডেটাগুলো আগে দেখানোর জন্য সর্ট করা হয়েছে
                const res = await axios.get("http://localhost:3000/last-update");
                const sortedUpdates = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setUpdates(sortedUpdates);
            } catch (error) {
                console.error("ডেটা আনার সময় সমস্যা:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUpdates();
    }, []);

    // --- ডিলিট হ্যান্ডলার ---
    const handleDelete = async (id) => {
        // ডিলিট করার আগে ব্যবহারকারীর কাছে নিশ্চিতকরণ চাওয়া হচ্ছে
        const isConfirmed = window.confirm("আপনি কি নিশ্চিতভাবে এই আপডেটটি ডিলিট করতে চান?");
        
        if (isConfirmed) {
            try {
                // সার্ভারে DELETE রিকোয়েস্ট পাঠানো হচ্ছে
                await axios.delete(`http://localhost:3000/last-update/${id}`);
                
                // সফলভাবে ডিলিট হলে UI থেকে আপডেটটি মুছে ফেলা হচ্ছে
                setUpdates(currentUpdates => currentUpdates.filter(update => update._id !== id));
                
                alert("আপডেট সফলভাবে ডিলিট করা হয়েছে।");

            } catch (error) {
                console.error("ডিলিট করার সময় সমস্যা:", error);
                alert("আপডেট ডিলিট করা যায়নি।");
            }
        }
    };

    // --- এডিট হ্যান্ডলার ---
    const handleEdit = (id) => {
        // ব্যবহারকারীকে এডিট পেজে রিডাইরেক্ট করা হচ্ছে
        navigate(`/edit-update/${id}`);
    };

    // Pagination Logic
    const totalPages = Math.ceil(updates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentUpdates = updates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-500 py-10 text-xl">লোড হচ্ছে...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">সর্বশেষ আপডেট</h2>
                <button
                    onClick={() => navigate("/add-update")}
                    className="bg-teal-500 cursor-pointer text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full md:w-auto">
                    নতুন আপডেট যোগ করুন
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">শিরোনাম</th>
                            <th className="p-4 font-semibold text-gray-600">তারিখ</th>
                            <th className="p-4 font-semibold text-gray-600">একশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUpdates.map(update => (
                            <tr key={update._id} className="hover:bg-gray-50 border-b border-gray-200">
                                <td className="p-4 text-gray-700">{update.title}</td>
                                <td className="p-4 text-gray-500">
                                    {/* `createdAt` ব্যবহার করা হয়েছে কারণ এটি POST করার সময় তৈরি হয় */}
                                    {new Date(update.createdAt).toLocaleDateString("bn-BD")}
                                </td>
                                <td className="p-4 space-x-2">
                                    <button 
                                        onClick={() => handleEdit(update._id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm">
                                        এডিট
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(update._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm">
                                        ডিলিট
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex justify-end items-center space-x-3">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    পূর্ববর্তী
                </button>
                <span className="font-semibold">{currentPage} / {totalPages}</span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed">
                    পরবর্তী
                </button>
            </div>
        </div>
    );
};

export default LastUpdate;