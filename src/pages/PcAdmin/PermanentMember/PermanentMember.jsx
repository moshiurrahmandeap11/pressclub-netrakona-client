import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PermanentMember = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    occupation: '',
    address: '',
    contact: '',
    image: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch permanent members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/permanent-member', {
        timeout: 5000 // Set a 5-second timeout to avoid hanging
      });
      const formattedData = response.data.map(item => ({
        id: item._id,
        ...item.member,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setMembers(formattedData);
    } catch (err) {
      setError('স্থায়ী সদস্য তালিকা লোড করতে ব্যর্থ। দয়া করে আবার চেষ্টা করুন।');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('ইমেজের আকার ৫ এমবি-এর বেশি হতে পারবে না।');
        return;
      }

      // Preview the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Upload to ImgBB
      try {
        const formDataImg = new FormData();
        formDataImg.append('image', file);
        const response = await axios.post(
          'https://api.imgbb.com/1/upload?key=bf35be486f2b0f4b0c48958fcc4de90c',
          formDataImg,
          { timeout: 10000 }
        );
        if (response.data.success) {
          setFormData({ ...formData, image: response.data.data.url });
        } else {
          setError('ইমেজ আপলোড করতে ব্যর্থ।');
        }
      } catch (err) {
        setError('ইমেজ আপলোডে সমস্যা হয়েছে।');
        console.error('Image upload error:', err);
      }
    }
  };

  const handleAddMember = () => {
    setCurrentMember(null);
    setFormData({
      name: '',
      designation: '',
      occupation: '',
      address: '',
      contact: '',
      image: ''
    });
    setImagePreview(null);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name || '',
      designation: member.designation || '',
      occupation: member.occupation || '',
      address: member.address || '',
      contact: member.contact || '',
      image: member.image || ''
    });
    setImagePreview(member.image || null);
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleDeleteMember = async (id) => {
    const result = await Swal.fire({
      title: 'আপনি কি নিশ্চিত?',
      text: 'এই স্থায়ী সদস্য মুছে ফেলা হবে!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'হ্যাঁ, মুছে ফেলুন!',
      cancelButtonText: 'বাতিল'
    });

    if (result.isConfirmed) {
      try {
        const response = await axios.delete(`https://pressclub-netrakona-server.vercel.app/permanent-member/${id}`);
        if (response.status === 200) {
          setMembers(members.filter((member) => member.id !== id));
          setSuccess('স্থায়ী সদস্য সফলভাবে মুছে ফেলা হয়েছে।');
          Swal.fire(
            'মুছে ফেলা হয়েছে!',
            'স্থায়ী সদস্য সফলভাবে মুছে ফেলা হয়েছে।',
            'success'
          );
        } else {
          setError(response.data.message || 'স্থায়ী সদস্য মুছতে ব্যর্থ।');
          Swal.fire('ব্যর্থ!', response.data.message || 'স্থায়ী সদস্য মুছতে ব্যর্থ।', 'error');
        }
      } catch (err) {
        setError('সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।');
        Swal.fire('ব্যর্থ!', 'সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।', 'error');
        console.error('Delete error:', err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = currentMember
        ? `https://pressclub-netrakona-server.vercel.app/permanent-member/${currentMember.id}`
        : 'https://pressclub-netrakona-server.vercel.app/permanent-member';
      const method = currentMember ? 'PATCH' : 'POST';

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { 'Content-Type': 'application/json' }
      });

      const formattedMember = {
        id: response.data.insertedId || response.data._id,
        ...formData,
        createdAt: response.data.createdAt || new Date(),
        updatedAt: response.data.updatedAt || new Date(),
      };

      if (currentMember) {
        setMembers(
          members.map((member) =>
            member.id === currentMember.id ? formattedMember : member
          )
        );
        setSuccess('স্থায়ী সদস্য সফলভাবে আপডেট করা হয়েছে।');
      } else {
        setMembers([formattedMember, ...members]);
        setSuccess('স্থায়ী সদস্য সফলভাবে যোগ করা হয়েছে।');
      }
      setIsModalOpen(false);
      setImagePreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'স্থায়ী সদস্য যোগ/আপডেট করতে ব্যর্থ।');
      console.error('Submit error:', err);
    }
  };

  // Memoize the table rows to prevent unnecessary re-renders
  const memoizedMembers = useMemo(() => members, [members]);

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">স্থায়ী সদস্য তালিকা</h2>
        <button
          onClick={handleAddMember}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition mt-4 sm:mt-0"
          disabled={loading}
        >
          {loading ? 'লোড হচ্ছে...' : 'স্থায়ী সদস্য যোগ করুন'}
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">ছবি</th>
                <th className="px-4 py-3 text-left text-sm font-medium">নাম</th>
                <th className="px-4 py-3 text-left text-sm font-medium">পদবী</th>
                <th className="px-4 py-3 text-left text-sm font-medium">পেশা</th>
                <th className="px-4 py-3 text-left text-sm font-medium">ঠিকানা</th>
                <th className="px-4 py-3 text-left text-sm font-medium">যোগাযোগ</th>
                <th className="px-4 py-3 text-center text-sm font-medium">ক্রিয়াকলাপ</th>
              </tr>
            </thead>
            <tbody>
              {memoizedMembers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-6 text-gray-500">
                    কোনো স্থায়ী সদস্য নেই
                  </td>
                </tr>
              ) : (
                memoizedMembers.map((member, index) => (
                  <tr
                    key={member.id}
                    className={`transition duration-200 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    } hover:bg-blue-50`}
                  >
                    <td className="px-4 py-3 border-b">
                      <img
                        src={member.image || `data:image/svg+xml;base64,${btoa(
                          `<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect width="48" height="48" fill="#E5E7EB"/>
                            <circle cx="24" cy="18" r="8" fill="#9CA3AF"/>
                            <path d="M8 40c0-8.837 7.163-16 16-16s16 7.163 16 16" fill="#9CA3AF"/>
                          </svg>`
                        )}`}
                        alt={member.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-4 py-3 border-b text-sm text-gray-900">{member.name}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-900">{member.designation}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-900">{member.occupation}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-900">{member.address}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-900">{member.contact}</td>
                    <td className="px-4 py-3 border-b flex justify-center space-x-3">
                      <button
                        onClick={() => handleEditMember(member)}
                        className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                        disabled={loading}
                      >
                        ✏️ এডিট
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                        disabled={loading}
                      >
                        🗑️ ডিলিট
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {currentMember ? 'স্থায়ী সদস্য সম্পাদনা' : 'নতুন স্থায়ী সদস্য যোগ'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ছবি</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full border px-3 py-2 rounded"
                />
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mt-2 w-24 h-24 rounded-full object-cover mx-auto"
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">নাম</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">পদবী</label>
                <input
                  type="text"
                  name="designation"
                  value={formData.designation}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">পেশা</label>
                <input
                  type="text"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">ঠিকানা</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">যোগাযোগ</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setImagePreview(null);
                  }}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  disabled={loading}
                >
                  {currentMember ? 'আপডেট' : 'যোগ করুন'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PermanentMember;