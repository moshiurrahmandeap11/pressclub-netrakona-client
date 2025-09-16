import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const PressClubMilonayotonAdmin = () => {
  const [hallRooms, setHallRooms] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    image: null,
    seatNumber: '',
    capacity: '',
    bannerSize: '',
    soundSystem: '',
    table: '',
    sofa: '',
    fullDayRent: '',
    halfDayRent: ''
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Fetch hall room data and images
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Check localStorage for hall room data
        const cachedHallRoomData = localStorage.getItem('hallRoomData');
        if (cachedHallRoomData) {
          setHallRooms(JSON.parse(cachedHallRoomData));
        } else {
          const hallRoomResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom', { timeout: 5000 });
          setHallRooms(hallRoomResponse.data);
          localStorage.setItem('hallRoomData', JSON.stringify(hallRoomResponse.data));
        }

        // Fetch images
        const imagesResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom-images', { timeout: 5000 });
        setImages(imagesResponse.data);
      } catch (err) {
        console.error('Fetch error:', err.message, err.response?.data);
        setError('Failed to fetch data. Please try again.');
        Swal.fire('Error!', 'Failed to fetch data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle file selection for hall room modal
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Please select a valid image (JPEG or PNG).');
        Swal.fire('Error!', 'Please select a valid image (JPEG or PNG).', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        Swal.fire('Error!', 'Image size must be less than 5MB.', 'error');
        return;
      }
      setFormData({ ...formData, image: file });
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle file selection for image only modal
  const handleImageFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        Swal.fire('Error!', 'Please select a valid image (JPEG or PNG).', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire('Error!', 'Image size must be less than 5MB.', 'error');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission for hall room
  const handleSubmit = async () => {
    if (!formData.image && !editId) {
      setError('Please select an image.');
      Swal.fire('Error!', 'Please select an image.', 'error');
      return;
    }
    if (!formData.seatNumber || !formData.capacity || !formData.bannerSize || !formData.soundSystem || 
        !formData.table || !formData.sofa || !formData.fullDayRent || !formData.halfDayRent) {
      setError('Please fill in all fields.');
      Swal.fire('Error!', 'Please fill in all fields.', 'error');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      let imageUrl = editId ? hallRooms.find(room => room._id === editId)?.imageUrl : null;

      if (formData.image) {
        const resizedImage = await resizeImage(formData.image, 800, 600);
        const formDataUpload = new FormData();
        formDataUpload.append('image', resizedImage);

        const imgResponse = await axios.post('https://api.imgbb.com/1/upload', formDataUpload, {
          params: { key: 'bf35be486f2b0f4b0c48958fcc4de90c' },
          timeout: 10000
        });
        imageUrl = imgResponse.data.data.url;
      }

      const hallRoomData = {
        imageUrl,
        seatNumber: Number(formData.seatNumber),
        capacity: Number(formData.capacity),
        bannerSize: formData.bannerSize,
        soundSystem: formData.soundSystem,
        table: Number(formData.table),
        sofa: Number(formData.sofa),
        fullDayRent: Number(formData.fullDayRent),
        halfDayRent: Number(formData.halfDayRent)
      };

      if (editId) {
        await axios.patch(`https://pressclub-netrakona-server.vercel.app/hallroom/${editId}`, hallRoomData, { timeout: 5000 });
      } else {
        await axios.post('https://pressclub-netrakona-server.vercel.app/hallroom', hallRoomData, { timeout: 5000 });
      }

      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom', { timeout: 5000 });
      setHallRooms(response.data);
      localStorage.setItem('hallRoomData', JSON.stringify(response.data));

      Swal.fire('Success!', editId ? 'Hall room updated successfully.' : 'Hall room added successfully.', 'success');
      setIsModalOpen(false);
      setEditId(null);
      setFormData({
        image: null,
        seatNumber: '',
        capacity: '',
        bannerSize: '',
        soundSystem: '',
        table: '',
        sofa: '',
        fullDayRent: '',
        halfDayRent: ''
      });
      setPreviewUrl(null);
    } catch (err) {
      console.error('Submit error:', err.message, err.response?.data);
      setError('Failed to save hall room data. Please try again.');
      Swal.fire('Error!', 'Failed to save hall room data.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle Add Image Only
  const handleAddImage = async () => {
    if (!selectedImage) {
      Swal.fire('Error!', 'Please select an image first.', 'error');
      return;
    }

    setUploading(true);
    try {
      const resizedImage = await resizeImage(selectedImage, 800, 600);
      const formDataUpload = new FormData();
      formDataUpload.append("image", resizedImage);

      const imgResponse = await axios.post("https://api.imgbb.com/1/upload", formDataUpload, {
        params: { key: "bf35be486f2b0f4b0c48958fcc4de90c" },
        timeout: 10000,
      });

      const imageUrl = imgResponse.data.data.url;

      await axios.post("https://pressclub-netrakona-server.vercel.app/hallroom-images", { image: imageUrl });

      // Refresh images
      const imagesResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom-images', { timeout: 5000 });
      setImages(imagesResponse.data);

      Swal.fire("Success!", "Image added successfully.", "success");
      setSelectedImage(null);
      setImagePreview(null);
      setIsImageModalOpen(false);
    } catch (err) {
      console.error("Add image error:", err.message, err.response?.data);
      Swal.fire("Error!", "Failed to add image.", "error");
    } finally {
      setUploading(false);
    }
  };

  // Handle image delete
  const handleImageDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://pressclub-netrakona-server.vercel.app/hallroom-images/${id}`, { timeout: 5000 });
        const imagesResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom-images', { timeout: 5000 });
        setImages(imagesResponse.data);
        Swal.fire('Deleted!', 'Image deleted successfully.', 'success');
      } catch (err) {
        console.error('Delete image error:', err.message, err.response?.data);
        Swal.fire('Error!', 'Failed to delete image.', 'error');
      }
    }
  };

  // Handle edit
  const handleEdit = (room) => {
    setEditId(room._id);
    setFormData({
      image: null,
      seatNumber: room.seatNumber || '',
      capacity: room.capacity || '',
      bannerSize: room.bannerSize || '',
      soundSystem: room.soundSystem || '',
      table: room.table || '',
      sofa: room.sofa || '',
      fullDayRent: room.fullDayRent || '',
      halfDayRent: room.halfDayRent || ''
    });
    setPreviewUrl(room.imageUrl || null);
    setIsModalOpen(true);
  };

  // Open image modal
  const openImageModal = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setIsImageModalOpen(true);
  };

  // Resize image function
  const resizeImage = (file, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        const offsetX = (maxWidth - width) / 2;
        const offsetY = (maxHeight - height) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, maxWidth, maxHeight);
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, offsetX, offsetY, width, height);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.85);
      };

      reader.readAsDataURL(file);
    });
  };

  // Delete hall room
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: 'This hall room will be deleted permanently!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`https://pressclub-netrakona-server.vercel.app/hallroom/${id}`, { timeout: 5000 });

      // Refresh hall room list
      const response = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom', { timeout: 5000 });
      setHallRooms(response.data);
      localStorage.setItem('hallRoomData', JSON.stringify(response.data));

      Swal.fire('Deleted!', 'Hall room deleted successfully.', 'success');
    } catch (err) {
      console.error('Delete hall room error:', err.message, err.response?.data);
      Swal.fire('Error!', 'Failed to delete hall room.', 'error');
    }
  }
};


  // Memoize hall rooms and images
  const memoizedHallRooms = useMemo(() => hallRooms, [hallRooms]);
  const memoizedImages = useMemo(() => images, [images]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">মিলনায়তন বিবরণ</h1>
          <p className="text-gray-600">প্রেস ক্লাবের হল রুমগুলোর বিবরণ পরিচালনা করুন</p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-600 font-medium mb-2">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            {/* Images Section */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">আপলোড করা ছবি</h2>
                <button
                  onClick={openImageModal}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  নতুন ছবি যোগ করুন
                </button>
              </div>
              {memoizedImages.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {memoizedImages.map((image) => (
                    <div key={image._id} className="relative group">
                      <img
                        src={image.image || 'https://via.placeholder.com/400x300?text=ইমেজ+নেই'}
                        alt="Uploaded Image"
                        className="w-full h-40 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=ইমেজ+নেই';
                        }}
                      />
                      <button
                        onClick={() => handleImageDelete(image._id)}
                        className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-white rounded-xl shadow-md">
                  <p className="text-gray-500">কোনো ছবি পাওয়া যায়নি</p>
                </div>
              )}
            </div>

            {/* Hall Rooms Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">হল রুম তালিকা</h2>
                <p className="text-sm text-gray-500">{memoizedHallRooms.length}টি রুম পাওয়া গেছে</p>
              </div>
              <button
                onClick={() => {
                  setEditId(null);
                  setFormData({
                    image: null,
                    seatNumber: '',
                    capacity: '',
                    bannerSize: '',
                    soundSystem: '',
                    table: '',
                    sofa: '',
                    fullDayRent: '',
                    halfDayRent: ''
                  });
                  setPreviewUrl(null);
                  setIsModalOpen(true);
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                নতুন হল রুম যোগ করুন
              </button>
            </div>

            {memoizedHallRooms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {memoizedHallRooms.map((room) => (
                  <div
                    key={room._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="relative h-48 bg-gray-100">
                      <img
                        src={room.imageUrl || 'https://via.placeholder.com/400x300?text=ইমেজ+নেই'}
                        alt="Hall Room"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=ইমেজ+নেই';
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">আসন সংখ্যা:</span>
                          <span>{room.seatNumber || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">ধারণ ক্ষমতা:</span>
                          <span>{room.capacity || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">ব্যানার সাইজ:</span>
                          <span>{room.bannerSize || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">সাউন্ড সিস্টেম:</span>
                          <span>{room.soundSystem || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">টেবিল:</span>
                          <span>{room.table || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">সোফা:</span>
                          <span>{room.sofa || 'N/A'}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">ভাড়া (সারাদিন):</span>
                          <span className="text-green-600 font-medium">{room.fullDayRent || 'N/A'} টাকা</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-semibold text-gray-900 mr-2">ভাড়া (অর্ধদিন):</span>
                          <span className="text-green-600 font-medium">{room.halfDayRent || 'N/A'} টাকা</span>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          সম্পাদনা
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          className="inline-flex items-center px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          মুছে ফেলুন
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-md">
                <div className="text-gray-500 mb-4">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">কোনো হল রুম তথ্য নেই</h3>
                  <p className="text-gray-500">প্রথম হল রুমটি যোগ করুন</p>
                </div>
                <button
                  onClick={() => {
                    setEditId(null);
                    setFormData({
                      image: null,
                      seatNumber: '',
                      capacity: '',
                      bannerSize: '',
                      soundSystem: '',
                      table: '',
                      sofa: '',
                      fullDayRent: '',
                      halfDayRent: ''
                    });
                    setPreviewUrl(null);
                    setIsModalOpen(true);
                  }}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  নতুন হল রুম যোগ করুন
                </button>
              </div>
            )}
          </>
        )}

        {/* Hall Room Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">{editId ? 'হল রুম সম্পাদনা' : 'নতুন হল রুম যোগ করুন'}</h2>
              </div>
              <div className="p-6">
                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
                )}
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">হল রুমের ছবি</label>
                    <label
                      htmlFor="file-upload"
                      className={`flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ${
                        formData.image
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50 text-gray-600 hover:text-blue-700'
                      }`}
                    >
                      {previewUrl ? (
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className="text-sm">
                            {formData.image ? formData.image.name : 'ছবি নির্বাচন করুন (JPEG/PNG, সর্বোচ্চ ৫MB)'}
                          </div>
                        </>
                      )}
                    </label>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">আসন সংখ্যা</label>
                    <input
                      type="number"
                      name="seatNumber"
                      value={formData.seatNumber}
                      onChange={handleInputChange}
                      placeholder="যেমন: ৫০"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ধারণ ক্ষমতা</label>
                    <input
                      type="number"
                      name="capacity"
                      value={formData.capacity}
                      onChange={handleInputChange}
                      placeholder="যেমন: ১০০"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ব্যানার সাইজ</label>
                    <input
                      type="text"
                      name="bannerSize"
                      value={formData.bannerSize}
                      onChange={handleInputChange}
                      placeholder="যেমন: ৬ফুট x ৩ফুট"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সাউন্ড সিস্টেম</label>
                    <input
                      type="text"
                      name="soundSystem"
                      value={formData.soundSystem}
                      onChange={handleInputChange}
                      placeholder="যেমন: উপলব্ধ"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">টেবিল</label>
                    <input
                      type="number"
                      name="table"
                      value={formData.table}
                      onChange={handleInputChange}
                      placeholder="যেমন: ১০"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">সোফা</label>
                    <input
                      type="number"
                      name="sofa"
                      value={formData.sofa}
                      onChange={handleInputChange}
                      placeholder="যেমন: ৫"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ভাড়া (সারাদিন)</label>
                    <input
                      type="number"
                      name="fullDayRent"
                      value={formData.fullDayRent}
                      onChange={handleInputChange}
                      placeholder="যেমন: ৫০০০"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ভাড়া (অর্ধদিন)</label>
                    <input
                      type="number"
                      name="halfDayRent"
                      value={formData.halfDayRent}
                      onChange={handleInputChange}
                      placeholder="যেমন: ৩০০০"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </form>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditId(null);
                    setFormData({
                      image: null,
                      seatNumber: '',
                      capacity: '',
                      bannerSize: '',
                      soundSystem: '',
                      table: '',
                      sofa: '',
                      fullDayRent: '',
                      halfDayRent: ''
                    });
                    setPreviewUrl(null);
                    setError(null);
                  }}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={uploading}
                  className={`inline-flex items-center px-4 py-2 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    uploading
                      ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 hover:shadow-lg'
                  }`}
                >
                  <svg className={`w-4 h-4 mr-2 ${uploading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {uploading ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                  {uploading ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image Only Modal */}
        {isImageModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">ইমেজ যোগ করুন</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ছবি নির্বাচন করুন</label>
                    <label
                      htmlFor="image-file-upload"
                      className={`flex items-center justify-center w-full h-40 border-2 border-dashed rounded-lg text-center cursor-pointer transition-all duration-200 ${
                        selectedImage
                          ? 'border-green-300 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-400 hover:bg-green-50 text-gray-600 hover:text-green-700'
                      }`}
                    >
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <>
                          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <div className="text-sm">
                            {selectedImage ? selectedImage.name : 'ছবি নির্বাচন করুন (JPEG/PNG, সর্বোচ্চ ৫MB)'}
                          </div>
                        </>
                      )}
                    </label>
                    <input
                      id="image-file-upload"
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <button
                  type="button"
                  onClick={() => {
                    setIsImageModalOpen(false);
                    setSelectedImage(null);
                    setImagePreview(null);
                  }}
                  disabled={uploading}
                  className="px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors disabled:opacity-50"
                >
                  বাতিল
                </button>
                <button
                  type="button"
                  onClick={handleAddImage}
                  disabled={uploading || !selectedImage}
                  className={`inline-flex items-center px-4 py-2 font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ${
                    uploading || !selectedImage
                      ? 'bg-gray-400 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 hover:shadow-lg'
                  }`}
                >
                  <svg className={`w-4 h-4 mr-2 ${uploading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {uploading ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    )}
                  </svg>
                  {uploading ? 'আপলোড হচ্ছে...' : 'আপলোড করুন'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PressClubMilonayotonAdmin;