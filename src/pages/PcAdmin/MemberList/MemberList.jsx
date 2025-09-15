import React, { useState, useEffect } from 'react';

const MemberList = () => {
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    occupation: '',
    address: '',
    contact: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch members on component mount
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('https://pressclub-netrakona-server.vercel.app/member-list');
      const data = await response.json();
      // Map _id to id for frontend consistency
      const formattedData = data.map(item => ({
        id: item._id,
        ...item.member,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      }));
      setMembers(formattedData);
    } catch (err) {
      setError('সদস্য তালিকা লোড করতে ব্যর্থ।');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddMember = () => {
    setCurrentMember(null);
    setFormData({
      name: '',
      designation: '',
      occupation: '',
      address: '',
      contact: ''
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditMember = (member) => {
    setCurrentMember(member);
    setFormData({
      name: member.name,
      designation: member.designation,
      occupation: member.occupation,
      address: member.address,
      contact: member.contact
    });
    setIsModalOpen(true);
    setError(null);
    setSuccess(null);
  };

  const handleDeleteMember = async (id) => {
    try {
      const response = await fetch(`https://pressclub-netrakona-server.vercel.app/member-list/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setMembers(members.filter((member) => member.id !== id));
        setSuccess('সদস্য সফলভাবে মুছে ফেলা হয়েছে।');
      } else {
        setError('সদস্য মুছতে ব্যর্থ।');
      }
    } catch (err) {
      setError('সদস্য মুছতে সমস্যা হয়েছে।');
    }
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const url = currentMember
      ? `https://pressclub-netrakona-server.vercel.app/member-list/${currentMember.id}`
      : "https://pressclub-netrakona-server.vercel.app/member-list";
    const method = currentMember ? "PATCH" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const updatedMember = await response.json();
      const formattedMember = {
        id: updatedMember._id,
        ...updatedMember.member, // member এর ভেতরের data টা বের করলাম
        createdAt: updatedMember.createdAt,
        updatedAt: updatedMember.updatedAt,
      };

      if (currentMember) {
        setMembers(
          members.map((member) =>
            member.id === currentMember.id ? formattedMember : member
          )
        );
        setSuccess("সদস্য সফলভাবে আপডেট করা হয়েছে।");
      } else {
        setMembers([formattedMember, ...members]); // নতুন member সামনে আসবে
        setSuccess("সদস্য সফলভাবে যোগ করা হয়েছে।");
      }
      setIsModalOpen(false);
    } else {
      setError("সদস্য যোগ/আপডেট করতে ব্যর্থ।");
    }
  } catch (err) {
    setError("সার্ভারের সাথে সংযোগে সমস্যা হয়েছে।");
  }
};


  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">সদস্য তালিকা</h2>
        <button
          onClick={handleAddMember}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          সদস্য যোগ করুন
        </button>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Table */}
<div className="overflow-x-auto rounded-lg shadow">
  <table className="min-w-full bg-white border border-gray-200 rounded-lg">
    <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
      <tr>
        <th className="px-4 py-3 text-left">নাম</th>
        <th className="px-4 py-3 text-left">পদবী</th>
        <th className="px-4 py-3 text-left">পেশা</th>
        <th className="px-4 py-3 text-left">ঠিকানা</th>
        <th className="px-4 py-3 text-left">যোগাযোগ</th>
        <th className="px-4 py-3 text-center">ক্রিয়াকলাপ</th>
      </tr>
    </thead>
    <tbody>
      {members.length === 0 ? (
        <tr>
          <td colSpan="6" className="text-center py-6 text-gray-500">
            কোনো সদস্য নেই
          </td>
        </tr>
      ) : (
        members.map((member, index) => (
          <tr
            key={member.id}
            className={`transition duration-200 ${
              index % 2 === 0 ? "bg-gray-50" : "bg-white"
            } hover:bg-blue-50`}
          >
            <td className="px-4 py-3 border-b">{member.name}</td>
            <td className="px-4 py-3 border-b">{member.designation}</td>
            <td className="px-4 py-3 border-b">{member.occupation}</td>
            <td className="px-4 py-3 border-b">{member.address}</td>
            <td className="px-4 py-3 border-b">{member.contact}</td>
            <td className="px-4 py-3 border-b flex justify-center space-x-3">
              <button
                onClick={() => handleEditMember(member)}
                className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
              >
                ✏️ এডিট
              </button>
              <button
                onClick={() => handleDeleteMember(member.id)}
                className="px-3 py-1 text-sm rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
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


      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {currentMember ? 'সদস্য সম্পাদনা' : 'নতুন সদস্য যোগ'}
            </h3>
            <form onSubmit={handleSubmit}>
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
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
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

export default MemberList;