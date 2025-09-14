import React, { useState, useEffect } from 'react';
import { Plus, Upload, X, Trash2, Eye } from 'lucide-react';

const SliderAdmin = () => {
  const [slides, setSlides] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch slides from API
  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/slider');
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched slides:', data);
        const transformedSlides = data.map(slide => ({
          id: slide._id,
          image: slide.slider.slider.image,
          title: slide.slider.slider.title || '',
          description: slide.slider.slider.description || '',
          createdAt: slide.slider.slider.createdAt
        }));
        setSlides(transformedSlides);
      } else {
        throw new Error('Failed to fetch slides');
      }
    } catch (error) {
      console.error('Error fetching slides:', error);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file selection - FIXED VERSION
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    console.log('Selected file:', file); // Debug log
    
    if (file) {
      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        alert('অনুগ্রহ করে একটি ইমেজ ফাইল নির্বাচন করুন।');
        return;
      }

      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert('ফাইল সাইজ 10MB এর কম হতে হবে।');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        console.log('FileReader result:', e.target.result); // Debug log
        setPreviewUrl(e.target.result);
      };
      reader.onerror = (e) => {
        console.error('FileReader error:', e);
        alert('ফাইল পড়তে সমস্যা হয়েছে।');
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload to ImgBB and save to API
  const handleUpload = async () => {
    if (!selectedFile) {
      showAlert('Error!', 'Please select an image.', 'error');
      return;
    }

    setUploadLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // Upload to ImgBB
      const imgbbResponse = await fetch('https://api.imgbb.com/1/upload?key=bf35be486f2b0f4b0c48958fcc4de90c', {
        method: 'POST',
        body: formData
      });

      if (!imgbbResponse.ok) {
        throw new Error('Failed to upload image to ImgBB');
      }

      const imgbbData = await imgbbResponse.json();
      const imageUrl = imgbbData.data.url;

      // Save to API with nested slider structure
      const slideData = {
        slider: {
          image: imageUrl,
          title: title.trim() || undefined,
          description: description.trim() || undefined,
          createdAt: new Date().toISOString()
        }
      };

      const apiResponse = await fetch('http://localhost:3000/slider', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(slideData)
      });

      if (apiResponse.ok) {
        await fetchSlides();
        handleCloseModal();
        showAlert('Success!', 'Slider image uploaded successfully!', 'success');
      } else {
        throw new Error('Failed to save slide');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showAlert('Error!', 'Failed to upload image. Please try again.', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  // Delete slide
  const handleDelete = async (slideId, slideTitle) => {
    console.log(slideId);
    const result = await showConfirmAlert(
      'Are you sure?',
      `Do you want to delete "${slideTitle || 'this slide'}"?`,
      'warning'
    );

    if (result.isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3000/slider/${slideId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await fetchSlides();
          showAlert('Deleted!', 'Slide has been deleted successfully.', 'success');
        } else {
          throw new Error('Failed to delete slide');
        }
      } catch (error) {
        console.error('Delete error:', error);
        showAlert('Error!', 'Failed to delete slide. Please try again.', 'error');
      }
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setPreviewUrl('');
    setTitle('');
    setDescription('');
    
    // Reset file input
    const fileInput = document.getElementById('file-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  // SweetAlert2 style alert function
  const showAlert = (title, text, icon) => {
    // Create custom modal for alerts
    const alertModal = document.createElement('div');
    alertModal.className = 'fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50';
    
    const iconColors = {
      success: 'text-green-500',
      error: 'text-red-500',
      warning: 'text-yellow-500',
      info: 'text-blue-500'
    };

    const iconSymbols = {
      success: '✓',
      error: '✕',
      warning: '⚠',
      info: 'ℹ'
    };

    alertModal.innerHTML = `
      <div class="bg-white rounded-lg p-6 max-w-sm w-full text-center transform transition-all duration-300 scale-95">
        <div class="${iconColors[icon]} text-5xl mb-4">${iconSymbols[icon]}</div>
        <h3 class="text-lg font-semibold text-gray-800 mb-2">${title}</h3>
        <p class="text-gray-600 mb-4">${text}</p>
        <button class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors">
          OK
        </button>
      </div>
    `;

    document.body.appendChild(alertModal);
    
    // Add animation
    setTimeout(() => {
      alertModal.querySelector('div').classList.remove('scale-95');
      alertModal.querySelector('div').classList.add('scale-100');
    }, 10);

    // Handle close
    const closeAlert = () => {
      alertModal.querySelector('div').classList.add('scale-95');
      setTimeout(() => {
        document.body.removeChild(alertModal);
      }, 300);
    };

    alertModal.querySelector('button').addEventListener('click', closeAlert);
    alertModal.addEventListener('click', (e) => {
      if (e.target === alertModal) closeAlert();
    });
  };

  // SweetAlert2 style confirm alert
  const showConfirmAlert = async (title, text, icon = 'warning') => {
    return new Promise((resolve) => {
      const confirmModal = document.createElement('div');
      confirmModal.className = 'fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center p-4 z-50';
      
      const iconColors = {
        success: 'text-green-500',
        error: 'text-red-500',
        warning: 'text-yellow-500',
        info: 'text-blue-500'
      };

      const iconSymbols = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
      };

      confirmModal.innerHTML = `
        <div class="bg-white rounded-lg p-6 max-w-sm w-full text-center transform transition-all duration-300 scale-95">
          <div class="${iconColors[icon]} text-5xl mb-4">${iconSymbols[icon]}</div>
          <h3 class="text-lg font-semibold text-gray-800 mb-2">${title}</h3>
          <p class="text-gray-600 mb-6">${text}</p>
          <div class="flex gap-3 justify-center">
            <button class="cancel-btn bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition-colors">
              Cancel
            </button>
            <button class="confirm-btn bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              Yes, Delete!
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(confirmModal);
      
      // Add animation
      setTimeout(() => {
        confirmModal.querySelector('div').classList.remove('scale-95');
        confirmModal.querySelector('div').classList.add('scale-100');
      }, 10);

      // Handle responses
      const closeModal = (result) => {
        confirmModal.querySelector('div').classList.add('scale-95');
        setTimeout(() => {
          document.body.removeChild(confirmModal);
          resolve({ isConfirmed: result });
        }, 300);
      };

      confirmModal.querySelector('.confirm-btn').addEventListener('click', () => closeModal(true));
      confirmModal.querySelector('.cancel-btn').addEventListener('click', () => closeModal(false));
      confirmModal.addEventListener('click', (e) => {
        if (e.target === confirmModal) closeModal(false);
      });
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Slider Management</h1>
              <p className="text-gray-600 mt-1">Manage your slider images and content</p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Slider
            </button>
          </div>
        </div>

        {/* Slides Grid */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {slides.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Eye className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No slides found</h3>
              <p className="text-gray-500 mb-4">Get started by adding your first slider image</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add First Slide
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {slides.map((slide) => (
                <div key={slide.id} className="relative group bg-gray-50 rounded-lg overflow-hidden">
                  <div className="relative h-32 bg-gray-200">
                    <img
                      src={slide.image}
                      alt={slide.title || `Slide ${slide.id}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Slide image failed to load:', slide.image);
                        e.target.src = 'https://via.placeholder.com/300x120/e5e7eb/6b7280?text=Image+Error';
                      }}
                    />
                    <button
                      onClick={() => handleDelete(slide.id, slide.title)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hidden md:flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        {slide.title && (
                          <h4 className="text-sm font-medium text-gray-900 truncate">
                            {slide.title}
                          </h4>
                        )}
                        {slide.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {slide.description}
                          </p>
                        )}
                        {!slide.title && !slide.description && (
                          <p className="text-xs text-gray-400">No title or description</p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDelete(slide.id, slide.title)}
                        className="ml-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full flex md:hidden items-center justify-center flex-shrink-0"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800">Add New Slide</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
                disabled={uploadLoading}
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6">
              {/* File Upload - IMPROVED */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Image *
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={uploadLoading}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer block">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      {selectedFile ? selectedFile.name : 'Click to select image or drag and drop'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </label>
                </div>
              </div>

              {/* Preview - IMPROVED */}
              {previewUrl && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="bg-gray-50 rounded-lg p-2 border">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-40 object-cover rounded shadow-sm"
                      style={{ maxWidth: '100%', height: 'auto', minHeight: '160px' }}
                    />
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title (Optional)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter slide title"
                  disabled={uploadLoading}
                />
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter slide description"
                  disabled={uploadLoading}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  disabled={uploadLoading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadLoading}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {uploadLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Slide
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SliderAdmin;