import React, { useState, useEffect } from 'react';

const GalleryAdmin = () => {
    const [activeTab, setActiveTab] = useState('photo');
    const [galleryData, setGalleryData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        category: 'ইভেন্ট',
        url: '',
        caption: '',
        date: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [mediaUploading, setMediaUploading] = useState(false);

    // Fetch gallery data
    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://pressclub-netrakona-server.vercel.app/gallery');
            if (!response.ok) {
                throw new Error('Failed to fetch gallery data');
            }
            const data = await response.json();
            setGalleryData(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching gallery:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Handle image upload to ImgBB (for photos only)
    const handleImageUpload = async (file) => {
        if (!file) return;
        setMediaUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch('https://api.imgbb.com/1/upload?key=bf35be486f2b0f4b0c48958fcc4de90c', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, url: data.data.url }));
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        } finally {
            setMediaUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `https://pressclub-netrakona-server.vercel.app/gallery/${editingId}`
                : 'https://pressclub-netrakona-server.vercel.app/gallery';
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, type: activeTab })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save gallery item');
            }

            await fetchGallery();
            closeModal();
            setError(null);
        } catch (error) {
            console.error('Error saving gallery item:', error);
            setError(error.message);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/gallery/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete gallery item');
            }
            await fetchGallery();
            setError(null);
        } catch (error) {
            console.error('Error deleting gallery item:', error);
            setError(error.message);
        }
    };

    // Open modal for editing
    const openEditModal = (item) => {
        setFormData({
            category: item.category,
            url: item.url,
            caption: item.caption,
            date: item.date ? item.date.split('T')[0] : '' // Format for input[type=date]
        });
        setEditingId(item._id);
        setIsModalOpen(true);
        setError(null);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ category: 'ইভেন্ট', url: '', caption: '', date: '' });
        setEditingId(null);
        setError(null);
    };

    const tabs = [
        { key: 'photo', label: 'ফটো গ্যালারী' },
        { key: 'video', label: 'ভিডিও গ্যালারী' }
    ];

    const categories = ['ইভেন্ট', 'অনুষ্ঠান', 'জাতীয় দিবস', 'সেমিনার', 'সভা'];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    const filteredGallery = galleryData.filter(item => item.type === activeTab);

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 min-h-screen bg-gray-100">
            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Page Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                    গ্যালারী
                </h1>
                <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm sm:text-base flex-1 transition-all duration-300 text-center ${
                                activeTab === tab.key
                                    ? 'text-white bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg'
                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Add Button */}
            <div className="flex justify-end mb-6">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    {activeTab === 'photo' ? 'ফটো যোগ করুন' : 'ভিডিও যোগ করুন'}
                </button>
            </div>

            {/* Gallery Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <th className="px-6 py-4 text-left text-sm font-semibold">
                                {activeTab === 'photo' ? 'ছবি' : 'ভিডিও'}
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ক্যাটেগরি</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">ক্যাপশন</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">তারিখ</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredGallery.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            filteredGallery.map((item, index) => (
                                <tr key={item._id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                    <td className="px-6 py-4">
                                        {activeTab === 'photo' ? (
                                            item.url ? (
                                                <img src={item.url} alt={item.caption} className="w-16 h-16 object-cover rounded" />
                                            ) : (
                                                <span className="text-gray-500">No Image</span>
                                            )
                                        ) : (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                                ভিডিও লিঙ্ক
                                            </a>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{item.category}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">{item.caption}</td>
                                    <td className="px-6 py-4 text-gray-800 font-medium">
                                        {new Date(item.date).toLocaleDateString('bn-BD')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                                            onClick={() => openEditModal(item)}
                                        >
                                            এডিট
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            ডিলিট
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-4">
                            {editingId ? (activeTab === 'photo' ? 'ফটো এডিট করুন' : 'ভিডিও এডিট করুন') : (activeTab === 'photo' ? 'নতুন ফটো যোগ করুন' : 'নতুন ভিডিও যোগ করুন')}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">ক্যাটেগরি</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    required
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">{activeTab === 'photo' ? 'ছবি' : 'ভিডিও URL'}</label>
                                {activeTab === 'photo' ? (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="w-full p-2 border rounded"
                                            onChange={(e) => handleImageUpload(e.target.files[0])}
                                            disabled={mediaUploading}
                                        />
                                        {mediaUploading && (
                                            <div className="text-sm text-gray-500 mt-1">Uploading...</div>
                                        )}
                                        {formData.url && (
                                            <img src={formData.url} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                                        )}
                                    </>
                                ) : (
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com/video"
                                        required
                                    />
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">ক্যাপশন</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.caption}
                                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">তারিখ</label>
                                <input
                                    type="date"
                                    className="w-full p-2 border rounded"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                                    onClick={closeModal}
                                >
                                    বাতিল
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                                    disabled={mediaUploading}
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

export default GalleryAdmin;