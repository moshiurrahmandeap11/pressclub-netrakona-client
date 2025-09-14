import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

const ImportantPeople = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    name: "",
    designation: "",
    image: "",
  });
  const navigate = useNavigate();

  // Fetch people from API
  useEffect(() => {
    const fetchPeople = async () => {
      try {
        setLoading(true);
        const res = await axios.get("https://pressclub-netrakona-server.vercel.app/important-person");
        setPeople(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("ডেটা আনতে সমস্যা:", error);
        setPeople([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPeople();
  }, []);

  // handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle edit button click
  const handleEdit = (person) => {
    setSelectedPerson(person);
    setFormData({
      title: person.title,
      name: person.name,
      designation: person.designation,
      image: person.image || person.imageUrl || "", // Handle both image fields
    });
    setIsModalOpen(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle edit submit - FIXED to include image
  const handleSubmit = async () => {
    if (!formData.title || !formData.name || !formData.designation) {
      Swal.fire("Error!", "Please fill in all fields.", "error");
      return;
    }

    try {
      // Include image in the update data
      const updateData = {
        title: formData.title,
        name: formData.name,
        designation: formData.designation,
        image: formData.image, // Make sure image is included
      };

      await axios.put(
        `https://pressclub-netrakona-server.vercel.app/important-person/${selectedPerson._id}`,
        updateData
      );
      
      const res = await axios.get("https://pressclub-netrakona-server.vercel.app/important-person");
      setPeople(Array.isArray(res.data) ? res.data : []);
      setIsModalOpen(false);
      setSelectedPerson(null);
      setFormData({ title: "", name: "", designation: "", image: "" });
      Swal.fire("Success!", "Person updated successfully.", "success");
    } catch (error) {
      console.error("Error updating person:", error);
      Swal.fire("Error!", "Failed to update the person.", "error");
    }
  };

  // Handle delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This person will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://pressclub-netrakona-server.vercel.app/important-person/${id}`);
        const res = await axios.get("https://pressclub-netrakona-server.vercel.app/important-person");
        setPeople(Array.isArray(res.data) ? res.data : []);
        Swal.fire("Deleted!", "The person has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting person:", error);
        Swal.fire("Error!", "Failed to delete the person.", "error");
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10 text-xl">
        লোড হচ্ছে...
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-4 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">
          গুরুত্বপূর্ণ ব্যক্তিবর্গ
        </h2>
        <button
          onClick={() => navigate("/add-important-person")}
          className="bg-teal-500 text-white px-5 py-2 rounded-lg hover:bg-teal-600 transition-colors w-full md:w-auto"
        >
          নতুন ব্যক্তি যোগ করুন
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4 font-semibold text-gray-600">ছবি</th>
              <th className="p-4 font-semibold text-gray-600">শিরোনাম</th>
              <th className="p-4 font-semibold text-gray-600">নাম</th>
              <th className="p-4 font-semibold text-gray-600">পদবি</th>
              <th className="p-4 font-semibold text-gray-600">একশন</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person) => (
              <tr
                key={person._id}
                className="hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="p-4">
                  {person.image || person.imageUrl ? (
                    <img
                      src={person.image || person.imageUrl}
                      alt={person.name}
                      className="w-12 h-12 object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-500">ছবি নেই</span>
                    </div>
                  )}
                </td>
                <td className="p-4 text-gray-700">{person.title}</td>
                <td className="p-4 text-gray-700">{person.name}</td>
                <td className="p-4 text-gray-700">{person.designation}</td>
                <td className="p-4 space-x-2">
                  <button
                    onClick={() => handleEdit(person)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                  >
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(person._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 text-sm"
                  >
                    ডিলিট
                  </button>
                </td>
              </tr>
            ))}
            {people.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 p-4">
                  কোনো তথ্য পাওয়া যায়নি
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">ব্যক্তি এডিট করুন</h2>
            
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
                placeholder="শিরোনাম লিখুন"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="name">
                নাম
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="নাম লিখুন"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="designation">
                পদবি
              </label>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="পদবি লিখুন"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="image">
                ছবি
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              {/* Current/Preview Image - Centered */}
              {formData.image && (
                <div className="mt-3 flex justify-center">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedPerson(null);
                  setFormData({ title: "", name: "", designation: "", image: "" });
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

export default ImportantPeople;