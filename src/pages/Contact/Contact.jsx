import React, { useState, useEffect } from 'react';

const Contact = () => {
    const [contactInfo, setContactInfo] = useState(null);
    const [loading, setLoading] = useState(true);

    // Mock API call - replace with your actual API endpoint
    useEffect(() => {
        const fetchContactInfo = async () => {
            try {
                // Replace this with your actual API call
                // const response = await fetch('/api/contact-info');
                // const data = await response.json();
                setContactInfo({
                    email: 'info@pressclub.com.bd',
                    address: 'ঢাকা প্রেস ক্লাব, সেগুনবাগিচা, ঢাকা-১০০০, বাংলাদেশ',
                    mobile: '০১৭১১-১২৩৪৫৬'
                });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching contact info:', error);
                setLoading(false);
            }
        };

        fetchContactInfo();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
            <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-4">
                        <span className="text-5xl">📞</span>
                        যোগাযোগ
                    </h1>
                    <div className="w-32 h-1 bg-blue-600 mx-auto mb-6"></div>
                    <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        আমাদের সাথে যোগাযোগ করুন। আমরা সর্বদা আপনার সেবায় নিয়োজিত।
                    </p>
                </div>

                {/* Contact Information Cards */}
                <div className="space-y-6 mb-12">
                    {/* Email Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border-l-6 border-blue-500">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-3xl text-white">📧</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">ইমেইল</h3>
                                <p className="text-gray-600 mb-3">আমাদের সাথে ইমেইলের মাধ্যমে যোগাযোগ করুন</p>
                                <a 
                                    href={`mailto:${contactInfo.email}`}
                                    className="inline-flex items-center text-lg font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                >
                                    {contactInfo.email}
                                    <span className="ml-2">→</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Address Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border-l-6 border-green-500">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-3xl text-white">📍</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">ঠিকানা</h3>
                                <p className="text-gray-600 mb-3">আমাদের অফিসে সরাসরি যোগাযোগ করুন</p>
                                <p className="text-lg text-gray-800 font-medium leading-relaxed">
                                    {contactInfo.address}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300 border-l-6 border-purple-500">
                        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                            <div className="flex-shrink-0">
                                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                    <span className="text-3xl text-white">📱</span>
                                </div>
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">মোবাইল</h3>
                                <p className="text-gray-600 mb-3">জরুরি প্রয়োজনে সরাসরি কল করুন</p>
                                <a 
                                    href={`tel:${contactInfo.mobile}`}
                                    className="inline-flex items-center text-lg font-semibold text-purple-600 hover:text-purple-800 transition-colors duration-200"
                                >
                                    {contactInfo.mobile}
                                    <span className="ml-2">📞</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Contact Summary */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-t-6 border-blue-500">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">দ্রুত যোগাযোগ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="group cursor-pointer">
                                <a href={`mailto:${contactInfo.email}`} className="block">
                                    <div className="bg-blue-50 rounded-xl p-6 group-hover:bg-blue-100 transition-colors duration-300">
                                        <span className="text-3xl block mb-3">📧</span>
                                        <h3 className="font-semibold text-gray-800 mb-2">ইমেইল করুন</h3>
                                        <p className="text-sm text-gray-600 break-all">{contactInfo.email}</p>
                                    </div>
                                </a>
                            </div>
                            <div className="group cursor-pointer">
                                <div className="bg-green-50 rounded-xl p-6 group-hover:bg-green-100 transition-colors duration-300">
                                    <span className="text-3xl block mb-3">📍</span>
                                    <h3 className="font-semibold text-gray-800 mb-2">অফিসে আসুন</h3>
                                    <p className="text-sm text-gray-600">সেগুনবাগিচা, ঢাকা</p>
                                </div>
                            </div>
                            <div className="group cursor-pointer">
                                <a href={`tel:${contactInfo.mobile}`} className="block">
                                    <div className="bg-purple-50 rounded-xl p-6 group-hover:bg-purple-100 transition-colors duration-300">
                                        <span className="text-3xl block mb-3">📱</span>
                                        <h3 className="font-semibold text-gray-800 mb-2">ফোন করুন</h3>
                                        <p className="text-sm text-gray-600">{contactInfo.mobile}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Office Hours */}
                <div className="mt-8 bg-white rounded-2xl shadow-xl p-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center justify-center gap-3">
                        <span className="text-3xl">🕒</span>
                        অফিস সময়
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-lg">
                        <div className="bg-blue-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-2">কর্মদিবস</h3>
                            <p className="text-gray-700">রবিবার - বৃহস্পতিবার</p>
                            <p className="text-blue-600 font-medium">সকাল ৯:০০ - সন্ধ্যা ৬:০০</p>
                        </div>
                        <div className="bg-green-50 rounded-xl p-6">
                            <h3 className="font-semibold text-gray-800 mb-2">সাপ্তাহিক ছুটি</h3>
                            <p className="text-gray-700">শুক্রবার ও শনিবার</p>
                            <p className="text-green-600 font-medium">সরকারি ছুটির দিন বন্ধ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;