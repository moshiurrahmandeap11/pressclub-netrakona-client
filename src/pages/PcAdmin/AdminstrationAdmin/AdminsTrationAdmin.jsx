import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminsTrationAdmin = () => {
  const [activeTab, setActiveTab] = useState('president');
  const [presidents, setPresidents] = useState([]);
  const [secretaries, setSecretaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    tenure: '',
    contact: '',
    email: '',
    address: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch data on component mount and tab change
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/adminstration');
      
      // Separate presidents and secretaries
      const presidentsData = response.data.filter(item => item.type === 'president');
      const secretariesData = response.data.filter(item => item.type === 'secretary');
      
      setPresidents(presidentsData);
      setSecretaries(secretariesData);
    } catch (err) {
      setError('ডেটা লোড করতে ব্যর্থ।');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const uploadImageToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(
        'https://api.imgbb.com/1/upload?key=bf35be486f2b0f4b0c48958fcc4de90c',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data.data.url;
    } catch (error) {
      console.error('Image upload failed:', error);
      throw new Error('ছবি আপলোড করতে ব্যর্থ।');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      tenure: '',
      contact: '',
      email: '',
      address: ''
    });
    setImageFile(null);
    setImagePreview('');
    setCurrentItem(null);
    setError(null);
    setSuccess(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name || '',
      image: item.image || '',
      tenure: item.tenure || '',
      contact: item.contact || '',
      email: item.email || '',
      address: item.address || ''
    });
    setImagePreview(item.image || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?')) {
      return;
    }

    try {
      await axios.delete(`https://pressclub-netrakona-server.vercel.app/adminstration/${id}`);
      setSuccess('সফলভাবে মুছে ফেলা হয়েছে।');
      fetchData();
    } catch (err) {
      setError('মুছে ফেলতে ব্যর্থ।');
      console.error('Error deleting:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    setError(null);

    try {
      let imageUrl = formData.image;
      
      // Upload new image if file is selected
      if (imageFile) {
        imageUrl = await uploadImageToImgBB(imageFile);
      }

      const submitData = {
        ...formData,
        image: imageUrl,
        type: activeTab === 'president' ? 'president' : 'secretary'
      };

      if (currentItem) {
        // Update existing item
        await axios.patch(`https://pressclub-netrakona-server.vercel.app/adminstration/${currentItem._id}`, submitData);
        setSuccess('সফলভাবে আপডেট করা হয়েছে।');
      } else {
        // Create new item
        await axios.post('https://pressclub-netrakona-server.vercel.app/adminstration', submitData);
        setSuccess('সফলভাবে যোগ করা হয়েছে।');
      }

      setIsModalOpen(false);
      resetForm();
      fetchData();
    } catch (err) {
      setError('সংরক্ষণ করতে ব্যর্থ।');
      console.error('Error submitting:', err);
    } finally {
      setModalLoading(false);
    }
  };

  const currentData = activeTab === 'president' ? presidents : secretaries;
  const currentTitle = activeTab === 'president' ? 'সভাপতি' : 'সাধারণ সম্পাদক';

  return (
    <div className="container mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">প্রশাসনিক ব্যবস্থাপনা</h1>
        
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveTab('president')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'president'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            সভাপতি সারণি
          </button>
          <button
            onClick={() => setActiveTab('secretary')}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === 'secretary'
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            সাধারণ সম্পাদক সারণি
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={handleAdd}
          className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition font-medium"
        >
          {currentTitle} যোগ করুন
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Table - Desktop & Mobile Responsive */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden lg:block bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">ছবি</th>
                    <th className="px-4 py-3 text-left font-medium">নাম</th>
                    <th className="px-4 py-3 text-left font-medium">মেয়াদকাল</th>
                    <th className="px-4 py-3 text-left font-medium">যোগাযোগ</th>
                    <th className="px-4 py-3 text-left font-medium">ইমেইল</th>
                    <th className="px-4 py-3 text-left font-medium">ঠিকানা</th>
                    <th className="px-4 py-3 text-center font-medium">ক্রিয়া</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-8 text-gray-500">
                        কোনো {currentTitle} নেই
                      </td>
                    </tr>
                  ) : (
                    currentData.map((item, index) => (
                      <tr
                        key={item._id}
                        className={`transition duration-200 ${
                          index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                        } hover:bg-blue-50`}
                      >
                        <td className="px-4 py-3 border-b">
                          <img
                            src={item.image || 'https://via.placeholder.com/50'}
                            alt={item.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-4 py-3 border-b font-medium">{item.name}</td>
                        <td className="px-4 py-3 border-b">{item.tenure}</td>
                        <td className="px-4 py-3 border-b">{item.contact}</td>
                        <td className="px-4 py-3 border-b">{item.email}</td>
                        <td className="px-4 py-3 border-b">{item.address}</td>
                        <td className="px-4 py-3 border-b">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => handleEdit(item)}
                              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
                            >
                              ✏️ এডিট
                            </button>
                            <button
                              onClick={() => handleDelete(item._id)}
                              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                            >
                              🗑️ ডিলিট
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View - Visible only on mobile */}
          <div className="lg:hidden space-y-4">
            {currentData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">কোনো {currentTitle} নেই</p>
              </div>
            ) : (
              currentData.map((item) => (
                <div key={item._id} className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                  {/* Header with Image and Name */}
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={item.image || 'https://via.placeholder.com/60'}
                      alt={item.name}
                      className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{item.name}</h3>
                      <p className="text-sm text-gray-500">{item.tenure}</p>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-sm font-medium text-gray-500 sm:w-20 flex-shrink-0">যোগাযোগ:</span>
                      <span className="text-sm text-gray-900 sm:flex-1">{item.contact}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center">
                      <span className="text-sm font-medium text-gray-500 sm:w-20 flex-shrink-0">ইমেইল:</span>
                      <span className="text-sm text-gray-900 sm:flex-1 break-all">{item.email}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row">
                      <span className="text-sm font-medium text-gray-500 sm:w-20 flex-shrink-0">ঠিকানা:</span>
                      <span className="text-sm text-gray-900 sm:flex-1">{item.address}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleEdit(item)}
                      className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition font-medium"
                    >
                      ✏️ এডিট
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-medium"
                    >
                      🗑️ ডিলিট
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-6">
                {currentItem ? `${currentTitle} সম্পাদনা` : `নতুন ${currentTitle} যোগ`}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">ছবি</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium mb-1">নাম *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Tenure */}
                <div>
                  <label className="block text-sm font-medium mb-1">মেয়াদকাল *</label>
                  <input
                    type="text"
                    name="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    placeholder="dd/mm/yyyy - dd/mm/yyyy"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium mb-1">যোগাযোগ *</label>
                  <input
                    type="text"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-1">ইমেইল *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium mb-1">ঠিকানা *</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full border border-gray-300 rounded px-3 py-2"
                    required
                  ></textarea>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      resetForm();
                    }}
                    className="px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition"
                    disabled={modalLoading}
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition disabled:opacity-50"
                    disabled={modalLoading}
                  >
                    {modalLoading ? 'সংরক্ষণ হচ্ছে...' : currentItem ? 'আপডেট' : 'যোগ করুন'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminsTrationAdmin;