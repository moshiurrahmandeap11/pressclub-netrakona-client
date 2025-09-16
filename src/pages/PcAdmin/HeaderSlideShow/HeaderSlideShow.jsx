import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const HeaderSlideShow = () => {
  const [slides, setSlides] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch slides from API or localStorage
  useEffect(() => {
    const fetchSlides = async () => {
      setLoading(true);
      setError(null);

      // Check localStorage first
      const cachedSlides = localStorage.getItem('headerSlides');
      if (cachedSlides) {
        setSlides(JSON.parse(cachedSlides));
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://pressclub-netrakona-server.vercel.app/header-slide', {
          timeout: 5000 // 5-second timeout
        });
        setSlides(response.data);
        localStorage.setItem('headerSlides', JSON.stringify(response.data));
      } catch (err) {
        setError('Failed to fetch slides. Please try again.');
        Swal.fire('Error!', 'Failed to fetch slides.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchSlides();
  }, []);

  // Handle file selection with validation
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Please select a valid image (JPEG or PNG).');
        Swal.fire('Error!', 'Please select a valid image (JPEG or PNG).', 'error');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB.');
        Swal.fire('Error!', 'Image size must be less than 5MB.', 'error');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  // Handle image upload to ImgBB and API
  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select an image to upload.');
      Swal.fire('Error!', 'Please select an image to upload.', 'error');
      return;
    }

    setUploading(true);
    setError(null);
    try {
      // Resize image to 1280x240
      const resizedImage = await resizeImage(selectedFile, 1280, 240);

      // Upload to ImgBB
      const formData = new FormData();
      formData.append('image', resizedImage);

      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: {
          key: 'bf35be486f2b0f4b0c48958fcc4de90c',
        },
        timeout: 10000 // 10-second timeout for upload
      });

      const imageUrl = response.data.data.url;

      // Post to backend API
await axios.post('https://pressclub-netrakona-server.vercel.app/header-slide', {
  imageUrl
});


      // Refresh slides
      const updatedSlides = await axios.get('https://pressclub-netrakona-server.vercel.app/header-slide', {
        timeout: 5000
      });
      setSlides(updatedSlides.data);
      localStorage.setItem('headerSlides', JSON.stringify(updatedSlides.data));

      // Show success message
      Swal.fire('Success!', 'Image uploaded successfully.', 'success');

      // Close modal and reset
      setIsModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
      Swal.fire('Error!', 'Failed to upload image.', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Handle image deletion
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This image will be deleted permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`https://pressclub-netrakona-server.vercel.app/header-slide/${id}`, {
          timeout: 5000
        });
        // Refresh slides
        const updatedSlides = await axios.get('https://pressclub-netrakona-server.vercel.app/header-slide', {
          timeout: 5000
        });
        setSlides(updatedSlides.data);
        localStorage.setItem('headerSlides', JSON.stringify(updatedSlides.data));
        Swal.fire('Deleted!', 'The image has been deleted.', 'success');
      } catch (err) {
        setError('Failed to delete image. Please try again.');
        Swal.fire('Error!', 'Failed to delete image.', 'error');
      }
    }
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

        // Maintain aspect ratio
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

        // Use high-quality scaling
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height, 0, 0, maxWidth, maxHeight);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 0.85); // Reduced quality to 0.85 for faster upload
      };

      reader.readAsDataURL(file);
    });
  };

  // Memoize slides to prevent unnecessary re-renders
  const memoizedSlides = useMemo(() => slides, [slides]);

  return (
    <div className="relative container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 py-4">{error}</div>
      ) : (
        <>
          {/* Grid of Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {memoizedSlides.length > 0 ? (
              memoizedSlides.map((slide, index) => (
                <div key={slide._id} className="relative group">
 <img
  src={slide?.imageUrl }
  alt={`Slide ${index + 1}`}
  className="w-[300px] h-[120px] object-cover rounded"
/>

                  {/* Delete button on hover (desktop) */}
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded hidden sm:block"
                  >
                    Delete
                  </button>
                  {/* Delete icon for mobile */}
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full sm:hidden"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="w-full h-[120px] bg-gray-200 flex items-center justify-center rounded">
                No slides available
              </div>
            )}
          </div>

          {/* Add Slide Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
            disabled={uploading}
          >
            Add Slide
          </button>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Upload New Slide</h2>
                {error && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
                )}
                {/* Stylish File Input */}
                <div className="mb-4">
                  <label
                    htmlFor="file-upload"
                    className="flex items-center justify-center w-full px-4 py-2 bg-blue-100 text-blue-700 border-2 border-blue-300 rounded-md cursor-pointer hover:bg-blue-200 transition-colors duration-200"
                  >
                    <svg
                      className="w-6 h-6 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16V8m0 0l-4 4m4-4l4 4m6 4v-6m0 0l-3-3m3 3l3-3"
                      />
                    </svg>
                    <span>{selectedFile ? selectedFile.name : 'Choose an Image'}</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile && (
                    <p className="mt-2 text-sm text-gray-600 truncate">
                      Selected: {selectedFile.name}
                    </p>
                  )}
                </div>
                {previewUrl && (
                  <div className="mb-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-[120px] object-cover rounded"
                    />
                  </div>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setError(null);
                    }}
                    className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedFile || uploading}
                    className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                      uploading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {uploading ? 'Uploading...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default HeaderSlideShow;