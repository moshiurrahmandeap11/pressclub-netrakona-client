import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import Swal from 'sweetalert2';
import axios from 'axios';

const MissionVision = () => {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [missionVisions, setMissionVisions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', image: '', details: '' });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMissionVisions();
  }, []);

  const fetchMissionVisions = async () => {
    try {
      const res = await axios.get('https://pressclub-netrakona-server.vercel.app/mishon-vishon');
      setMissionVisions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setFormData({ title: item.mishonVishon.title, image: item.mishonVishon.image, details: item.mishonVishon.details });
      setEditingId(item._id);
    } else {
      setFormData({ title: '', image: '', details: '' });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ title: '', image: '', details: '' });
    setEditingId(null);
    if (editorRef.current) editorRef.current.setContent('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDetailsChange = () => {
    if (editorRef.current) {
      setFormData((prev) => ({ ...prev, details: editorRef.current.getContent() }));
    }
  };

  const handleImageUpload = async (file) => {
    const API_KEY = 'bf35be486f2b0f4b0c48958fcc4de90c';
    if (!API_KEY) return Swal.fire('Error', 'ImgBB API key missing', 'error');

    setIsUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      const response = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      if (data.success) {
        setFormData((prev) => ({ ...prev, image: data.data.url }));
        Swal.fire('Success', 'Image uploaded successfully', 'success');
      } else throw new Error('Upload failed');
    } catch  {
      Swal.fire('Error', 'Image upload failed', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 10 * 1024 * 1024 && file.type.startsWith('image/')) {
      handleImageUpload(file);
    } else if(file.size > 10 * 1024 * 1024) {
      Swal.fire('Error', 'File size must be <10MB', 'error');
    } else {
      Swal.fire('Error', 'Please select an image file', 'error');
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return Swal.fire('Error', 'Title required', 'error');
    if (!formData.details.trim()) return Swal.fire('Error', 'Details required', 'error');

    const payload = { mishonVishon: formData };

    try {
      if (editingId) {
        await axios.patch(`https://pressclub-netrakona-server.vercel.app/mishon-vishon/${editingId}`, payload);
        Swal.fire('Updated', 'Mission Vision updated successfully', 'success');
      } else {
        await axios.post('https://pressclub-netrakona-server.vercel.app/mishon-vishon', payload);
        Swal.fire('Added', 'Mission Vision added successfully', 'success');
      }
      handleCloseModal();
      fetchMissionVisions();
    } catch  {
      Swal.fire('Error', 'Something went wrong', 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the Mission Vision',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`https://pressclub-netrakona-server.vercel.app/mishon-vishon/${id}`);
        Swal.fire('Deleted', 'Mission Vision deleted', 'success');
        fetchMissionVisions();
      } catch  {
        Swal.fire('Error', 'Failed to delete', 'error');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button
        onClick={() => handleOpenModal()}
        className="mb-6 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors font-medium"
      >
        Add Mission Vision
      </button>

      {/* Mission Vision List */}
      {missionVisions.map((item) => (
        <div key={item._id} className="bg-white shadow-lg rounded-lg p-6 border mb-4">
          <h2 className="text-2xl font-bold mb-3">{item.mishonVishon.title}</h2>
          {item.mishonVishon.image && (
            <img src={item.mishonVishon.image} alt="" className="w-full max-w-2xl h-64 object-cover rounded mb-3"/>
          )}
          <div dangerouslySetInnerHTML={{ __html: item.mishonVishon.details }} />
          <div className="flex gap-3 mt-4">
            <button
              onClick={() => handleOpenModal(item)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(item._id)}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">{editingId ? 'Edit Mission Vision' : 'Add Mission Vision'}</h2>
            <div className="space-y-6">
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Title"
                className="w-full p-3 border rounded"
              />
              <div className="flex gap-3 items-center">
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-blue-600 text-white rounded">
                  {isUploading ? 'Uploading...' : 'Upload Image'}
                </button>
                <input type="url" name="image" value={formData.image} onChange={handleInputChange} placeholder="Image URL" className="flex-1 p-2 border rounded" />
              </div>
              {formData.image && <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover mt-2 rounded border"/>}
<Editor
  apiKey="omvpp0a8wm3rf2q7bpkhn6cbvz260ncye2yi8axr5a5daj9e"
  onInit={(evt, editor) => {
    editorRef.current = editor;
    if (formData.details) editor.setContent(formData.details); // Preload content
  }}
  onEditorChange={(content) => setFormData(prev => ({ ...prev, details: content }))} // Live update
  init={{
    height: 300,
    menubar: true,
    plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste help wordcount'.split(' '),
    toolbar: 'undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code',
    branding: false,
  }}
/>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={handleCloseModal} className="px-6 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white rounded">{editingId ? 'Update' : 'Submit'}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionVision;
