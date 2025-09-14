import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const Achievement = () => {
    const [achievements, setAchievements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        imageFile: null,
        features: '',
        existingImage: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState('');

    // ImgBB API key
    const IMGBB_API_KEY = 'bf35be486f2b0f4b0c48958fcc4de90c';

    // Fetch achievements from API
    useEffect(() => {
        const fetchAchievements = async () => {
            try {
                const response = await fetch('http://localhost:3000/achievement');
                const data = await response.json();
                // Ensure achievements is an array and filter out invalid entries
                setAchievements(Array.isArray(data) ? data.filter(item => item && typeof item === 'object') : []);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching achievements:', error);
                setError('অর্জন লোড করতে সমস্যা হয়েছে।');
                setLoading(false);
            }
        };

        fetchAchievements();
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image' && files && files[0]) {
            setFormData((prev) => ({ ...prev, imageFile: files[0] }));
            // Generate image preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(files[0]);
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    // Handle edit button click
    const handleEdit = (achievement) => {
    setEditMode(true);
    setSelectedAchievement(achievement); // ✅ এখানে যোগ করতে হবে
    setFormData({
        title: achievement.title,
        imageFile: null,
        features: achievement.features || '',
        existingImage: achievement.image || ''
    });
    setImagePreview(achievement.image || null);
    setIsModalOpen(true);
};


    // Handle delete button click
    const handleDelete = async (id) => {
        console.log(id);
        const result = await Swal.fire({
            title: 'আপনি কি নিশ্চিত?',
            text: 'এই অর্জন মুছে ফেলা হবে এবং এটি পুনরুদ্ধার করা যাবে না!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
            cancelButtonText: 'বাতিল'
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`http://localhost:3000/achievement/${id}`, {
                    method: 'DELETE'
                });

                if (!response.ok) {
                    throw new Error('Failed to delete achievement');
                }

                setAchievements((prev) => prev.filter((ach) => ach.id !== id));

                Swal.fire({
                    title: 'মুছে ফেলা হয়েছে!',
                    text: 'অর্জন সফলভাবে মুছে ফেলা হয়েছে।',
                    icon: 'success',
                    confirmButtonText: 'ওকে'
                });
            } catch (error) {
                console.error('Error deleting achievement:', error);
                Swal.fire({
                    title: 'ত্রুটি!',
                    text: 'অর্জন মুছে ফেলতে সমস্যা হয়েছে।',
                    icon: 'error',
                    confirmButtonText: 'ওকে'
                });
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            let imageUrl = formData.existingImage;
            // Upload image to ImgBB if a new image is selected
            if (formData.imageFile) {
                const imgbbFormData = new FormData();
                imgbbFormData.append('image', formData.imageFile);

                const imgbbResponse = await fetch(
                    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
                    {
                        method: 'POST',
                        body: imgbbFormData,
                    }
                );

                if (!imgbbResponse.ok) {
                    throw new Error('Failed to upload image to ImgBB');
                }

                const imgbbData = await imgbbResponse.json();
                imageUrl = imgbbData.data.url;
            }

            // Prepare data for backend submission
            const submissionData = {
                title: formData.title,
                image: imageUrl,
                features: formData.features || '', // Ensure features is a string
            };

            let response;
if (editMode) {
    response = await fetch(`http://localhost:3000/achievement/${selectedAchievement._id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
    });
}
 else {
                // Add new achievement
                response = await fetch('http://localhost:3000/achievement', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(submissionData),
                });
            }

            if (!response.ok) {
                throw new Error(editMode ? 'Failed to update achievement' : 'Failed to submit achievement');
            }

            const updatedAchievement = await response.json();
            if (editMode) {
setAchievements((prev) =>
    prev.map((ach) => (ach._id === updatedAchievement._id ? updatedAchievement : ach))
);

            } else {
                setAchievements((prev) => [...prev, updatedAchievement]);
            }

            setFormData({ title: '', imageFile: null, features: '', existingImage: '' });
            setImagePreview(null);
            setIsModalOpen(false);
            setEditMode(false);
            setSelectedAchievement(null);

            // Success SweetAlert
            Swal.fire({
                title: 'সফল!',
                text: editMode ? 'অর্জন সফলভাবে আপডেট করা হয়েছে।' : 'অর্জন সফলভাবে যোগ করা হয়েছে।',
                icon: 'success',
                confirmButtonText: 'ওকে',
            });
        } catch (error) {
            console.error('Error:', error);
            setError('অপারেশন সম্পাদন করতে সমস্যা হয়েছে।');

            // Error SweetAlert
            Swal.fire({
                title: 'ত্রুটি!',
                text: 'অপারেশন সম্পাদন করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।',
                icon: 'error',
                confirmButtonText: 'ওকে',
            });
        }
    };

    // Open and close modal
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
        setError('');
        setFormData({ title: '', imageFile: null, features: '', existingImage: '' });
        setImagePreview(null);
        setEditMode(false);
        setSelectedAchievement(null);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">সাফল্য ও অর্জন</h2>
                    <button
                        onClick={() => {
                            setEditMode(false);
                            toggleModal();
                        }}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        সাফল্য ও অর্জন যোগ করুন
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Achievements List */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    {achievements.length === 0 ? (
                        <p className="text-gray-700">কোনো অর্জন পাওয়া যায়নি।</p>
                    ) : (
                        <ul className="space-y-6">
                            {achievements.map((achievement) => (
                                <li key={achievement._id} className="border-b pb-4">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-semibold text-gray-800">{achievement.title}</h3>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEdit(achievement)}
                                                className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition"
                                            >
                                                সম্পাদনা
                                            </button>
                                            <button
                                                onClick={() => handleDelete(achievement?._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
                                            >
                                                মুছে ফেলুন
                                            </button>
                                        </div>
                                    </div>
                                    {achievement.image && (
                                        <img
                                            src={achievement.image}
                                            alt={achievement.title}
                                            className="w-48 h-48 object-cover rounded-lg my-4"
                                            onError={(e) => {
                                                e.target.src = `data:image/svg+xml;base64,${btoa(`
                                                    <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect width="192" height="192" fill="#E5E7EB"/>
                                                        <rect x="48" y="32" width="96" height="64" fill="#9CA3AF"/>
                                                        <path d="M48 128C48 108.117 64.117 92 84 92H108C127.883 92 144 108.117 144 128V160H48V128Z" fill="#9CA3AF"/>
                                                    </svg>
                                                `)}`;
                                            }}
                                        />
                                    )}
                                    <div className="text-gray-700">
                                        <h4 className="font-medium">বৈশিষ্ট্য:</h4>
                                        <ul className="list-disc list-inside">
                                            {achievement.features && typeof achievement.features === 'string' && achievement.features.trim() ? (
                                                achievement.features.split(',').map((feature, index) => (
                                                    <li key={index}>{feature.trim()}</li>
                                                ))
                                            ) : (
                                                <li>কোনো বৈশিষ্ট্য উপলব্ধ নয়</li>
                                            )}
                                        </ul>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-gray-800 mb-4">
                                {editMode ? 'অর্জন সম্পাদনা করুন' : 'নতুন অর্জন যোগ করুন'}
                            </h3>
                            {error && (
                                <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="title">টাইটেল</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="image">ইমেজ</label>
                                    <input
                                        type="file"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg"
                                    />
                                    {imagePreview && (
                                        <div className="mt-4">
                                            <p className="text-gray-700 mb-2">ইমেজ প্রিভিউ:</p>
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-32 h-32 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 mb-2" htmlFor="features">বৈশিষ্ট্য (কমা দিয়ে আলাদা করুন)</label>
                                    <textarea
                                        name="features"
                                        value={formData.features}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows="4"
                                        placeholder="বৈশিষ্ট্য১, বৈশিষ্ট্য২, বৈশিষ্ট্য৩"
                                        required
                                    ></textarea>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={toggleModal}
                                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        {editMode ? 'আপডেট' : 'সাবমিট'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Achievement;