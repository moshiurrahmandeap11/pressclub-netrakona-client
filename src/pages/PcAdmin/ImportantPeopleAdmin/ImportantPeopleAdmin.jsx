import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';

const ImportantPeople = () => {
    const [people, setPeople] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPeople = async () => {
            try {
                setLoading(true);
                const res = await axios.get("https://pressclub-netrakona-server.vercel.app/important-person");
                setPeople(res.data);
            } catch (error) {
                console.error("ডেটা আনতে সমস্যা:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPeople();
    }, []);

    if (loading) {
        return <div className="text-center text-gray-500 py-10 text-xl">লোড হচ্ছে...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">গুরুত্বপূর্ণ ব্যক্তিবর্গ</h2>
                <button 
                    onClick={() => navigate("/add-important-person")} 
                    className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full md:w-auto"
                >
                    নতুন ব্যক্তি যোগ করুন
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">শিরোনাম</th>
                            <th className="p-4 font-semibold text-gray-600">নাম</th>
                            <th className="p-4 font-semibold text-gray-600">পদবি</th>
                            <th className="p-4 font-semibold text-gray-600">একশন</th>
                        </tr>
                    </thead>
                    <tbody>
                        {people.map(person => (
                            <tr key={person._id} className="hover:bg-gray-50 border-b border-gray-200">
                                <td className="p-4 text-gray-700">{person.title}</td>
                                <td className="p-4 text-gray-700">{person.name}</td>
                                <td className="p-4 text-gray-700">{person.designation}</td>
                                <td className="p-4 space-x-2">
                                    <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm">এডিট</button>
                                    <button className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm">ডিলিট</button>
                                </td>
                            </tr>
                        ))}
                        {people.length === 0 && (
                            <tr>
                                <td colSpan="4" className="text-center text-gray-500 p-4">কোনো তথ্য পাওয়া যায়নি</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ImportantPeople;
