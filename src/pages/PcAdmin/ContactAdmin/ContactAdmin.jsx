import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router'; // Correct import

const ContactAdmin = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState('মতামত');
    const [contactData, setContactData] = useState([]);
    const [quickContactData, setQuickContactData] = useState({ email: [], location: [], phone: [] });
    const [officeHoursData, setOfficeHoursData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        message: '',
        emailValue: '',
        locationValue: '',
        phoneValue: '',
        day: '',
        hours: ''
    });

    // Tab mapping
    const tabMapping = {
        feedback: 'মতামত',
        suggestion: 'পরামর্শ',
        inquiry: 'জিজ্ঞাসা',
        'quick-contact': 'দ্রুত যোগাযোগ',
        'office-hours': 'অফিস সময়'
    };

    const reverseTabMapping = {
        'মতামত': 'feedback',
        'পরামর্শ': 'suggestion',
        'জিজ্ঞাসা': 'inquiry',
        'দ্রুত যোগাযোগ': 'quick-contact',
        'অফিস সময়': 'office-hours'
    };

    // Handle tab change
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setFormData({ message: '', emailValue: '', locationValue: '', phoneValue: '', day: '', hours: '' });
        setSearchParams({ tab: reverseTabMapping[tab] });
        setError(null); // Clear error on tab change
    };

    // Fetch data
    useEffect(() => {
        const fetchContactData = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/contact');
                if (!response.ok) throw new Error('Failed to fetch contact data');
                const data = await response.json();
                setContactData(data);
            } catch (error) {
                console.error('Error fetching contact data:', error);
                setError(error.message);
            }
        };

        const fetchQuickContactData = async () => {
            try {
                const response = await fetch('https://pressclub-netrakona-server.vercel.app/quick-contact');
                if (!response.ok) throw new Error('Failed to fetch quick contact data');
                const data = await response.json();
                setQuickContactData({
                    email: data.filter(item => item.type === 'email'),
                    location: data.filter(item => item.type === 'location'),
                    phone: data.filter(item => item.type === 'phone')
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

        Promise.all([fetchContactData(), fetchQuickContactData(), fetchOfficeHoursData()])
            .then(() => setLoading(false))
            .catch(() => setLoading(false));
    }, []);

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submissions
    const handleSubmit = async (e, endpoint, type) => {
        e.preventDefault();
        try {
            const valueKey = endpoint === 'quick-contact' ? `${type}Value` : 'hours';
            const body = endpoint === 'quick-contact'
                ? { type, value: formData[valueKey] }
                : { day: formData.day, hours: formData.hours };

            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add item');
            }
            const newItem = await response.json();

            if (endpoint === 'quick-contact') {
                setQuickContactData({
                    ...quickContactData,
                    [type]: [...quickContactData[type], newItem]
                });
                setFormData({
                    ...formData,
                    emailValue: '',
                    locationValue: '',
                    phoneValue: ''
                });
            } else if (endpoint === 'office-hours') {
                setOfficeHoursData([...officeHoursData, newItem]);
                setFormData({ ...formData, day: '', hours: '' });
            }
            setError(null); // Clear error on success
        } catch (error) {
            console.error('Error adding item:', error);
            setError(error.message);
        }
    };

    // Handle edit
    const handleEdit = async (id, updatedData, endpoint) => {
        try {
            const valueKey = endpoint === 'quick-contact' ? `${updatedData.type}Value` : 'hours';
            const updatedValue = formData[valueKey] || updatedData.value || updatedData.hours;
            const body = endpoint === 'quick-contact'
                ? { type: updatedData.type, value: updatedValue }
                : endpoint === 'contact'
                ? { message: formData.message }
                : { day: formData.day, hours: updatedValue };

            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/${endpoint}/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update item');
            }
            const updatedItem = await response.json();

            if (endpoint === 'quick-contact') {
                setQuickContactData({
                    ...quickContactData,
                    [updatedData.type]: quickContactData[updatedData.type].map(item =>
                        item._id === id ? updatedItem : item
                    )
                });
            } else if (endpoint === 'office-hours') {
                setOfficeHoursData(officeHoursData.map(item =>
                    item._id === id ? updatedItem : item
                ));
            } else {
                setContactData(contactData.map(item =>
                    item._id === id ? updatedItem : item
                ));
            }
            setFormData({
                message: '',
                emailValue: '',
                locationValue: '',
                phoneValue: '',
                day: '',
                hours: ''
            });
            setError(null); // Clear error on success
        } catch (error) {
            console.error('Error updating item:', error);
            setError(error.message);
        }
    };

    // Handle delete
    const handleDelete = async (id, endpoint, type) => {
        try {
            const response = await fetch(`https://pressclub-netrakona-server.vercel.app/${endpoint}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete item');
            }

            if (endpoint === 'quick-contact') {
                setQuickContactData({
                    ...quickContactData,
                    [type]: quickContactData[type].filter(item => item._id !== id)
                });
            } else if (endpoint === 'office-hours') {
                setOfficeHoursData(officeHoursData.filter(item => item._id !== id));
            } else {
                setContactData(contactData.filter(item => item._id !== id));
            }
            setError(null); // Clear error on success
        } catch (error) {
            console.error('Error deleting item:', error);
            setError(error.message);
        }
    };

    const tabs = ['মতামত', 'পরামর্শ', 'জিজ্ঞাসা', 'দ্রুত যোগাযোগ', 'অফিস সময়'];
    const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
                {/* Page Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
                        যোগাযোগ অ্যাডমিন
                    </h1>
                    <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4 text-lg">মতামত, পরামর্শ, এবং যোগাযোগের তথ্য পরিচালনা</p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-md mb-6">
                    <div className="flex flex-wrap border-b">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => handleTabChange(tab)}
                                className={`px-6 py-3 font-medium text-sm md:text-base ${
                                    activeTab === tab
                                        ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                {['মতামত', 'পরামর্শ', 'জিজ্ঞাসা'].includes(activeTab) && (
                    <div>
                        {/* List (No Add Form) */}
                        <div className="grid gap-6">
                            {contactData
                                .filter(item => item.type === reverseTabMapping[activeTab])
                                .map((item) => (
                                    <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                                        <p className="text-gray-800 mb-2">{item.message}</p>
                                        <p className="text-sm text-gray-600 mb-4">
                                            {new Date(item.createdAt).toLocaleDateString('bn-BD')}
                                        </p>
                                        <div className="flex gap-2">
                                            
                                            <button
                                                onClick={() => {
                                                    setFormData({ ...formData, message: item.message });
                                                    handleEdit(item._id, { message: formData.message }, 'contact');
                                                }}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                এডিট
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id, 'contact')}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                ডিলিট
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            {contactData.filter(item => item.type === reverseTabMapping[activeTab]).length === 0 && (
                                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                    <p className="text-gray-600">কোনো {activeTab} পাওয়া যায়নি</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'দ্রুত যোগাযোগ' && (
                    <div>
                        {['email', 'location', 'phone'].map((type) => (
                            <div key={type} className="mb-8">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                                    {type === 'email' ? 'ইমেইল' : type === 'location' ? 'অফিস লোকেশন' : 'ফোন নাম্বার'}
                                </h2>
                                {/* Add Form */}
                                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                                    <form onSubmit={(e) => handleSubmit(e, 'quick-contact', type)}>
                                        <div className="mb-4">
                                            <input
                                                type="text"
                                                name={`${type}Value`}
                                                value={formData[`${type}Value`]}
                                                onChange={handleInputChange}
                                                placeholder={`নতুন ${type === 'email' ? 'ইমেইল' : type === 'location' ? 'লোকেশন' : 'ফোন নাম্বার'} লিখুন`}
                                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            যোগ করুন
                                        </button>
                                    </form>
                                </div>
                                {/* List */}
                                <div className="grid gap-6">
                                    {quickContactData[type].map((item) => (
                                        <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                                            <p className="text-gray-800 mb-2">{item.value}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setFormData({ ...formData, [`${type}Value`]: item.value });
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    এডিট
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, 'quick-contact', type)}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    ডিলিট
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {quickContactData[type].length === 0 && (
                                        <div className="bg-white rounded-lg shadow-md p-6 text-center">
                                            <p className="text-gray-600">কোনো {type === 'email' ? 'ইমেইল' : type === 'location' ? 'লোকেশন' : 'ফোন নাম্বার'} পাওয়া যায়নি</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'অফিস সময়' && (
                    <div>
                        {/* Add Form */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">নতুন সময় যোগ করুন</h2>
                            <form onSubmit={(e) => handleSubmit(e, 'office-hours')}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                    <select
                                        name="day"
                                        value={formData.day}
                                        onChange={handleInputChange}
                                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    >
                                        <option value="" disabled>দিন নির্বাচন করুন</option>
                                        {days.map(day => (
                                            <option key={day} value={day}>{day}</option>
                                        ))}
                                    </select>
                                    <input
                                        type="text"
                                        name="hours"
                                        value={formData.hours}
                                        onChange={handleInputChange}
                                        placeholder="সময় লিখুন (যেমন: ৯:০০ পূর্বাহ্ণ - ৫:০০ অপরাহ্ণ)"
                                        className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    যোগ করুন
                                </button>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-blue-50">
                                        <th className="p-3 text-left text-gray-800">দিন</th>
                                        <th className="p-3 text-left text-gray-800">সময়</th>
                                        <th className="p-3 text-left text-gray-800">ক্রিয়া</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {officeHoursData.map((item) => (
                                        <tr key={item._id} className="border-b">
                                            <td className="p-3">{item.day}</td>
                                            <td className="p-3">{item.hours}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => {
                                                        setFormData({ ...formData, day: item.day, hours: item.hours });
                                                        handleEdit(item._id, { day: formData.day, hours: formData.hours }, 'office-hours');
                                                    }}
                                                    className="text-blue-600 hover:text-blue-800 mr-2"
                                                >
                                                    এডিট
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item._id, 'office-hours')}
                                                    className="text-red-600 hover:text-red-800"
                                                >
                                                    ডিলিট
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {officeHoursData.length === 0 && (
                                        <tr>
                                            <td colSpan="3" className="p-3 text-center text-gray-600">
                                                কোনো অফিস সময় পাওয়া যায়নি
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContactAdmin;