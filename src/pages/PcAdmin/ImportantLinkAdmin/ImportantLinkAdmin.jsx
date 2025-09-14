import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const ImportantLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [formData, setFormData] = useState({ title: '', url: '' });
  const navigate = useNavigate();

  // Fetch links from API
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setLoading(true);
        const res = await axios.get('https://pressclub-netrakona-server.vercel.app/important-links');
        setLinks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error('Failed to fetch links:', error);
        setLinks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchLinks();
  }, []);

  // Handle edit button click
  const handleEdit = (link) => {
    setSelectedLink(link);
    setFormData({ title: link.title, url: link.url });
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit submit
  const handleSubmit = async () => {
    if (!formData.title || !formData.url) {
      Swal.fire('Error!', 'Please fill in both title and URL.', 'error');
      return;
    }

    try {
      await axios.put(`https://pressclub-netrakona-server.vercel.app/important-links/${selectedLink._id}`, formData);
      const res = await axios.get('https://pressclub-netrakona-server.vercel.app/important-links');
      setLinks(Array.isArray(res.data) ? res.data : []);
      setIsModalOpen(false);
      setSelectedLink(null);
      setFormData({ title: '', url: '' });
      Swal.fire('Success!', 'Link updated successfully.', 'success');
    } catch (error) {
      console.error('Error updating link:', error);
      Swal.fire('Error!', 'Failed to update the link.', 'error');
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This link will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://pressclub-netrakona-server.vercel.app/important-links/${id}`);
        const res = await axios.get('https://pressclub-netrakona-server.vercel.app/important-links');
        setLinks(Array.isArray(res.data) ? res.data : []);
        Swal.fire('Deleted!', 'The link has been deleted.', 'success');
      } catch (error) {
        console.error('Error deleting link:', error);
        Swal.fire('Error!', 'Failed to delete the link.', 'error');
      }
    }
  };

  if (loading) {
    return <div className="text-center text-gray-500 py-10 text-xl">লোড হচ্ছে...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">গুরুত্বপূর্ন লিংক্স</h2>
        <button
          onClick={() => navigate('/add-important-links')}
          className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full md:w-auto"
        >
          নতুন লিংক যোগ করুন
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">শিরোনাম</th>
              <th className="p-4 font-semibold text-gray-600">লিংক</th>
              <th className="p-4 font-semibold text-gray-600">একশন</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link) => (
              <tr key={link._id} className="hover:bg-gray-50 border-b border-gray-200">
                <td className="p-4 text-gray-700">{link.title}</td>
                <td className="p-4">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(link)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(link._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">লিংক এডিট করুন</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="title">
                শিরোনাম
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="লিংকের শিরোনাম লিখুন"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="url">
                লিংক
              </label>
              <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="লিংকের URL লিখুন"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedLink(null);
                  setFormData({ title: '', url: '' });
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              >
                বাতিল
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                জমা দিন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportantLinks;