import React, { useState, useEffect } from 'react';

const MediaAdmin = () => {
    const [activeTab, setActiveTab] = useState('electronic');
    const [mediaList, setMediaList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        representative: '',
        mobile: '',
        email: '',
        type: activeTab
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);

    // Update formData.type when activeTab changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, type: activeTab }));
    }, [activeTab]);

    // Fetch media data
    useEffect(() => {
        fetchMedia();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch('https://pressclub-netrakona-server.vercel.app/media');
            if (!response.ok) {
                throw new Error('Failed to fetch media data');
            }
            const data = await response.json();
            setMediaList(data);
        } catch (error) {
            console.error('Error fetching media:', error);
            setError(error.message);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `https://pressclub-netrakona-server.vercel.app/media/${editingId}`
                : 'https://pressclub-netrakona-server.vercel.app/media';
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: activeTab })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save media');
            }

            await fetchMedia();
            closeModal();
            setError(null);
        } catch (error) {
            console.error('Error saving media:', error);
            setError(error.message);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/media/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete media');
            }
            await fetchMedia();
            setError(null);
        } catch (error) {
            console.error('Error deleting media:', error);
            setError(error.message);
        }
    };

    // Open modal for editing
    const openEditModal = (media) => {
        setFormData({
            name: media.name,
            representative: media.representative,
            mobile: media.mobile,
            email: media.email,
            type: media.type
        });
        setEditingId(media._id); // Changed from media.id to media._id
        setIsModalOpen(true);
        setError(null);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ name: '', representative: '', mobile: '', email: '', type: activeTab });
        setEditingId(null);
        setError(null);
    };

    // Filter media based on search term and active tab
    const filteredMedia = mediaList.filter(media => 
        media.type === activeTab && (
            media.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.representative.toLowerCase().includes(searchTerm.toLowerCase()) ||
            media.mobile.includes(searchTerm)
        )
    );

    return (
        <div className="container mx-auto p-4">
            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b mb-4">
                <button
                    className={`px-4 py-2 ${activeTab === 'electronic' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('electronic')}
                >
                    ইলেক্ট্রনিক মিডিয়া
                </button>
                <button
                    className={`px-4 py-2 ${activeTab === 'print' ? 'border-b-2 border-blue-500' : ''}`}
                    onClick={() => setActiveTab('print')}
                >
                    প্রিন্ট মিডিয়া
                </button>
            </div>

            {/* Search and Add Button */}
            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="নাম, ফোন, বা মিডিয়ার নাম দিয়ে সার্চ করুন"
                    className="p-2 border rounded w-1/2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                    onClick={() => setIsModalOpen(true)}
                >
                    {activeTab === 'electronic' ? 'ইলেক্ট্রনিক মিডিয়া যোগ করুন' : 'প্রিন্ট মিডিয়া যোগ করুন'}
                </button>
            </div>

            {/* Media Table */}
            <table className="w-full border-collapse border">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">মিডিয়ার নাম</th>
                        <th className="border p-2">জেলা প্রতিনিধি</th>
                        <th className="border p-2">মোবাইল</th>
                        <th className="border p-2">ইমেইল</th>
                        <th className="border p-2">অ্যাকশন</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredMedia.map(media => (
                        <tr key={media._id}>
                            <td className="border p-2">{media.name}</td>
                            <td className="border p-2">{media.representative}</td>
                            <td className="border p-2">{media.mobile}</td>
                            <td className="border p-2">{media.email}</td>
                            <td className="border p-2">
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                                    onClick={() => openEditModal(media)}
                                >
                                    এডিট
                                </button>
                                <button
                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                    onClick={() => handleDelete(media._id)}
                                >
                                    ডিলিট
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded max-w-md w-full">
                        <h2 className="text-xl mb-4">
                            {editingId ? 'মিডিয়া এডিট করুন' : 'নতুন মিডিয়া যোগ করুন'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1">মিডিয়ার নাম</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">জেলা প্রতিনিধি</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.representative}
                                    onChange={(e) => setFormData({ ...formData, representative: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">মোবাইল</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1">ইমেইল</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                                    onClick={closeModal}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded"
                                >
                                    সংরক্ষণ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaAdmin;