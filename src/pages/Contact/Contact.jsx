import React, { useState, useEffect } from 'react';

const Contact = () => {
    const [quickContactData, setQuickContactData] = useState({ email: [], location: [], phone: [] });
    const [officeHoursData, setOfficeHoursData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formData, setFormData] = useState({
        type: '',
        title: '',
        name: '',
        email: '',
        phone: '',
        details: ''
    });

    // Fetch data from API
    useEffect(() => {
        const fetchQuickContactData = async () => {
            try {
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/quick-contact');
                if (!response.ok) throw new Error('Failed to fetch quick contact data');
                const data = await response.json();
                setQuickContactData({
                    email: data.filter(item => item.type === 'email'),
                    location: data.filter(item => item.type === 'location'),
                    phone: data.filter(item => item.type === 'phone'),
                });
            } catch (error) {
                console.error('Error fetching quick contact data:', error);
                setError(error.message);
            }
        };

        const fetchOfficeHoursData = async () => {
            try {
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/office-hours');
                if (!response.ok) throw new Error('Failed to fetch office hours data');
                const data = await response.json();
                setOfficeHoursData(data);
            } catch (error) {
                console.error('Error fetching office hours data:', error);
                setError(error.message);
            }
        };

        Promise.all([fetchQuickContactData(), fetchOfficeHoursData()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('https://pressclub-netrakona-server.vercel.app/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: formData.type,
                    title: formData.title.trim(),
                    name: formData.name.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    details: formData.details.trim(),
                }),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to submit contact form');
            }
            setFormData({ type: '', title: '', name: '', email: '', phone: '', details: '' });
            setIsModalOpen(false);
            setError(null);
            setSuccessMessage(
                formData.type === 'feedback' ? 'মতামত সফলভাবে জমা হয়েছে!' :
                formData.type === 'suggestion' ? 'পরামর্শ সফলভাবে জমা হয়েছে!' :
                'জিজ্ঞাসা সফলভাবে জমা হয়েছে!'
            );
            setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setError(error.message);
        }
    };

    // Open modal with specific type
    const openModal = (type) => {
        setFormData({ type, title: '', name: '', email: '', phone: '', details: '' });
        setIsModalOpen(true);
        setError(null);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
        setFormData({ type: '', title: '', name: '', email: '', phone: '', details: '' });
        setError(null);
    };

    // Determine holidays
    const allDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const officeDays = officeHoursData.map(item => item.day);
    const holidays = allDays.filter(day => !officeDays.includes(day)).join(' এবং ');

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !isModalOpen && !successMessage) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Success Message */}
                {successMessage && (
                    <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
                        {successMessage}
                    </div>
                )}

                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
                        যোগাযোগ
                    </h1>
                    <div className="w-full h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        আমাদের সাথে যোগাযোগ করুন। আমরা সর্বদা আপনার সেবায় নিয়োজিত।
                    </p>
                </div>

                {/* Contact Buttons */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">আপনার মতামত জানান</h2>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button
                            onClick={() => openModal('feedback')}
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-semibold"
                        >
                            মতামত দিন
                        </button>
                        <button
                            onClick={() => openModal('suggestion')}
                            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors duration-200 font-semibold"
                        >
                            পরামর্শ দিন
                        </button>
                        <button
                            onClick={() => openModal('inquiry')}
                            className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors duration-200 font-semibold"
                        >
                            জিজ্ঞাসা করুন
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                {formData.type === 'feedback' ? 'মতামত' : formData.type === 'suggestion' ? 'পরামর্শ' : 'জিজ্ঞাসা'}
                            </h2>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">টাইটেল</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        placeholder="আপনার মতামতের টাইটেল লিখুন"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">নাম</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="আপনার নাম লিখুন"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">ইমেইল</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="আপনার ইমেইল লিখুন"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">মোবাইল নাম্বার</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="আপনার মোবাইল নাম্বার লিখুন"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-medium mb-2">ডিটেইলস</label>
                                    <textarea
                                        name="details"
                                        value={formData.details}
                                        onChange={handleInputChange}
                                        placeholder="আপনার মতামত, পরামর্শ, বা জিজ্ঞাসা বিস্তারিত লিখুন"
                                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        rows="5"
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                                    >
                                        বাতিল
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        সাবমিট
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Quick Contact Summary */}
                {(quickContactData.email.length > 0 || quickContactData.location.length > 0 || quickContactData.phone.length > 0) && (
                    <div className="bg-white rounded-2xl shadow-xl p-8 border-t-6 border-blue-500 mb-12">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">দ্রুত যোগাযোগ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {quickContactData.email.length > 0 && (
                                    <div className="group cursor-pointer">
                                        <a href={`mailto:${quickContactData.email[0].value}`} className="block">
                                            <div className="bg-blue-50 rounded-xl p-6 group-hover:bg-blue-100 transition-colors duration-300">
                                                <span className="text-3xl block mb-3">📧</span>
                                                <h3 className="font-semibold text-gray-800 mb-2">ইমেইল করুন</h3>
                                                <p className="text-sm text-gray-600 break-all">{quickContactData.email[0].value}</p>
                                            </div>
                                        </a>
                                    </div>
                                )}
                                {quickContactData.location.length > 0 && (
                                    <div className="group cursor-pointer">
                                        <div className="bg-green-50 rounded-xl p-6 group-hover:bg-green-100 transition-colors duration-300">
                                            <iframe
                                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d452.448176491258!2d90.7312439328707!3d24.87800564628195!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3756fd14d0ad5be7%3A0x2224473412d09e31!2sNetrokona%20Press%20Club!5e0!3m2!1sen!2sbd!4v1757936107371!5m2!1sen!2sbd"
                                                width="100%"
                                                height="200"
                                                style={{ border: 0 }}
                                                allowFullScreen=""
                                                loading="lazy"
                                                referrerPolicy="no-referrer-when-downgrade"
                                            ></iframe>
                                        </div>
                                    </div>
                                )}
                                {quickContactData.phone.length > 0 && (
                                    <div className="group cursor-pointer">
                                        <a href={`tel:${quickContactData.phone[0].value}`} className="block">
                                            <div className="bg-purple-50 rounded-xl p-6 group-hover:bg-purple-100 transition-colors duration-300">
                                                <span className="text-3xl block mb-3">📱</span>
                                                <h3 className="font-semibold text-gray-800 mb-2">ফোন করুন</h3>
                                                <h3 className="font-semibold text-gray-800 mb-2">সাধারণ সম্পাদক</h3>
                                                <p className="text-sm text-gray-600">{quickContactData.phone[0].value}</p>
                                            </div>
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Office Hours and Holidays */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
                        <span className="text-3xl">🕒</span>
                        অফিস সময় এবং ছুটির দিন
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-2">কর্মদিবস</h3>
                            {officeHoursData.length > 0 ? (
                                officeHoursData.map(item => (
                                    <div key={item._id} className="text-gray-700 mb-2">
                                        <span>{item.day}: </span>
                                        <span className="text-blue-600 font-medium">{item.hours}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-600">কোনো কর্মদিবসের তথ্য নেই</p>
                            )}
                        </div>
                        <div className="bg-green-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-2">সাপ্তাহিক ছুটি</h3>
                            {holidays ? (
                                <p className="text-gray-700">{holidays}</p>
                            ) : (
                                <p className="text-gray-600">কোনো ছুটির দিন নেই</p>
                            )}
                            <p className="text-green-600 font-medium mt-2">সরকারি ছুটির দিন বন্ধ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;