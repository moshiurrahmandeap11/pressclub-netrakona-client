import React, { useState, useEffect } from 'react';

const CommitteeAdmin = () => {
    const [committeeList, setCommitteeList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        image: '',
        name: '',
        designation: '',
        occupation: '',
        contact: '',
        email: '',
        address: ''
    });
    const [editingId, setEditingId] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageUploading, setImageUploading] = useState(false);

    // Fetch committee data
    useEffect(() => {
        fetchCommittee();
    }, []);

    const fetchCommittee = async () => {
        try {
            setLoading(true);
            const response = await fetch('https://pressclub-netrakona-server.vercel.app/committee');
            if (!response.ok) {
                throw new Error('Failed to fetch committee data');
            }
            const data = await response.json();
            setCommitteeList(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching committee:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    // Handle image upload to ImgBB
    const handleImageUpload = async (file) => {
        if (!file) return;
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const response = await fetch('https://api.imgbb.com/1/upload?key=bf35be486f2b0f4b0c48958fcc4de90c', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.data.url }));
            } else {
                throw new Error('Image upload failed');
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            setError('Failed to upload image');
        } finally {
            setImageUploading(false);
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingId 
                ? `https://pressclub-netrakona-server.vercel.app/committee/${editingId}`
                : 'https://pressclub-netrakona-server.vercel.app/committee';
            const method = editingId ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save committee member');
            }

            await fetchCommittee();
            closeModal();
            setError(null);
        } catch (error) {
            console.error('Error saving committee member:', error);
            setError(error.message);
        }
    };

    // Handle delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/committee/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete committee member');
            }
            await fetchCommittee();
            setError(null);
        } catch (error) {
            console.error('Error deleting committee member:', error);
            setError(error.message);
        }
    };

    // Open modal for editing
    const openEditModal = (member) => {
        setFormData({
            image: member.image || '',
            name: member.name,
            designation: member.designation,
            occupation: member.occupation,
            contact: member.contact,
            email: member.email,
            address: member.address
        });
        setEditingId(member._id);
        setIsModalOpen(true);
        setError(null);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ image: '', name: '', designation: '', occupation: '', contact: '', email: '', address: '' });
        setEditingId(null);
        setError(null);
    };

    // Filter committee members based on search term
    const filteredCommittee = committeeList.filter(member => 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contact.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4">
            {/* Error Message */}
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* Search and Add Button */}
            <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
                <input
                    type="text"
                    placeholder="নাম, পদবী, বা যোগাযোগ নম্বর দিয়ে সার্চ করুন"
                    className="w-full sm:w-1/2 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    onClick={() => setIsModalOpen(true)}
                >
                    কমিটি মেম্বার যোগ করুন
                </button>
            </div>

            {/* Committee Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
                            <th className="px-4 py-3 text-left text-sm font-semibold">ছবি</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">নাম</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">পদবী</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">পেশা</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">যোগাযোগ</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">ইমেইল</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">ঠিকানা</th>
                            <th className="px-4 py-3 text-left text-sm font-semibold">অ্যাকশন</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredCommittee.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="px-4 py-4 text-center text-gray-500">
                                    কোনো তথ্য পাওয়া যায়নি
                                </td>
                            </tr>
                        ) : (
                            filteredCommittee.map((member, index) => (
                                <tr key={member._id} className={`transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                    <td className="px-4 py-4">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                                        ) : (
                                            <span className="text-gray-500">No Image</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-gray-900 font-semibold">{member.name}</td>
                                    <td className="px-4 py-4 text-gray-800 font-medium">{member.designation}</td>
                                    <td className="px-4 py-4 text-gray-800 font-medium">{member.occupation}</td>
                                    <td className="px-4 py-4">
                                        <a href={`tel:${member.contact}`} className="text-blue-600 font-medium hover:text-blue-800 transition-colors">
                                            {member.contact}
                                        </a>
                                    </td>
                                    <td className="px-4 py-4">
                                        <a href={`mailto:${member.email}`} className="text-green-600 font-medium hover:text-green-800 transition-colors break-all">
                                            {member.email}
                                        </a>
                                    </td>
                                    <td className="px-4 py-4 text-gray-800 font-medium">{member.address}</td>
                                    <td className="px-4 py-4">
                                        <button
                                            className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 transition-colors"
                                            onClick={() => openEditModal(member)}
                                        >
                                            এডিট
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                                            onClick={() => handleDelete(member._id)}
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
                            {editingId ? 'মেম্বার এডিট করুন' : 'নতুন মেম্বার যোগ করুন'}
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">ছবি</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full p-2 border rounded"
                                    onChange={(e) => handleImageUpload(e.target.files[0])}
                                    disabled={imageUploading}
                                />
                                {imageUploading && (
                                    <div className="text-sm text-gray-500 mt-1">Uploading...</div>
                                )}
                                {formData.image && (
                                    <img src={formData.image} alt="Preview" className="mt-2 w-20 h-20 object-cover rounded" />
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">নাম</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">পদবী</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.designation}
                                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">পেশা</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.occupation}
                                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">যোগাযোগ</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">ইমেইল</label>
                                <input
                                    type="email"
                                    className="w-full p-2 border rounded"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block mb-1 font-medium">ঠিকানা</label>
                                <input
                                    type="text"
                                    className="w-full p-2 border rounded"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                                    disabled={imageUploading}
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

export default CommitteeAdmin;