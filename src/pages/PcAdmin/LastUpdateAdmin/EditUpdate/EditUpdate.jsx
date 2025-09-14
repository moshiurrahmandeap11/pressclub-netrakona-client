import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import axios from 'axios';
import { Editor } from '@tinymce/tinymce-react';

const EditUpdate = () => {
    // React Router hooks
    const { id } = useParams(); // URL থেকে id পাওয়ার জন্য
    const navigate = useNavigate(); // পেজ পরিবর্তনের জন্য

    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [imageFile, setImageFile] = useState(null); // নতুন আপলোড করা ছবি
    const [previewUrl, setPreviewUrl] = useState(''); // ছবির প্রিভিউ দেখানোর জন্য
    const [initialData, setInitialData] = useState(null); // পুরোনো ডেটা রাখার জন্য

    // State for loading and error handling
    const [isLoading, setIsLoading] = useState(true); // ডেটা লোড হওয়ার জন্য
    const [isSubmitting, setIsSubmitting] = useState(false); // ফর্ম সাবমিট হওয়ার জন্য
    const [error, setError] = useState('');

    const editorRef = useRef(null);

    // Get your API keys
    const TINYMCE_API_KEY = 'YOUR_TINYMCE_API_KEY'; // <-- আপনার TinyMCE API Key
    const IMGBB_API_KEY = 'YOUR_IMGBB_API_KEY'; // <-- আপনার ImgBB API Key

    // Step 1: Fetch existing update data when the component loads
    useEffect(() => {
        const fetchUpdateData = async () => {
            try {
                setIsLoading(true);
                const res = await axios.get(`http://localhost:3000/last-update/${id}`);
                const data = res.data;
                
                // Populate states with fetched data
                setTitle(data.title);
                setDescription(data.description);
                setPreviewUrl(data.imageUrl); // পুরোনো ছবির URL দিয়ে প্রিভিউ সেট করা
                setInitialData(data); // পুরোনো ডেটা সেভ রাখা
                setError('');

            } catch (err) {
                setError('ডেটা লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।');
                console.error("Fetch error:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUpdateData();
    }, [id]); // id পরিবর্তন হলে আবার ডেটা আনা হবে

    // Handle new image selection and create a new preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); // নতুন ফাইল সেট করা
            setPreviewUrl(URL.createObjectURL(file)); // নতুন প্রিভিউ তৈরি করা
        }
    };

    // Handle form submission
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!title || !description) {
            setError('শিরোনাম এবং বিবরণ অবশ্যই পূরণ করতে হবে।');
            return;
        }

        setIsSubmitting(true);
        setError('');
        let finalImageUrl = initialData.imageUrl; // ডিফল্টভাবে পুরোনো ছবির URL

        // Step 2: If a new image is selected, upload it to ImgBB
        if (imageFile) {
            try {
                const formData = new FormData();
                formData.append('image', imageFile);

                const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                    method: 'POST',
                    body: formData,
                });

                const imgbbResult = await imgbbResponse.json();

                if (!imgbbResult.success) {
                    throw new Error(imgbbResult.error.message || 'Image upload failed');
                }
                
                finalImageUrl = imgbbResult.data.url; // নতুন ছবির URL

            } catch (err) {
                setError(`নতুন ছবি আপলোড করা যায়নি: ${err.message}`);
                setIsSubmitting(false);
                return;
            }
        }

        // Step 3: Create payload and send PUT request to your server
        const payload = {
            title,
            description,
            imageUrl: finalImageUrl,
            updatedAt: new Date().toISOString(),
        };

        try {
            await axios.put(`http://localhost:3000/last-update/${id}`, payload);
            alert('আপডেট সফলভাবে সম্পন্ন হয়েছে!');
            navigate(-1); // সফলভাবে আপডেট হলে আগের পেজে ফেরত যাওয়া

        } catch (err) {
            setError(`একটি সমস্যা হয়েছে: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="text-center text-gray-500 py-10 text-xl">ডেটা লোড হচ্ছে...</div>;
    }

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                আপডেট এডিট করুন
            </h2>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleUpdate} className="space-y-6">
                {/* Title Field */}
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">শিরোনাম</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 transition"
                        disabled={isSubmitting}
                    />
                </div>

                {/* Description Field (TinyMCE) */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">বিবরণ</label>
                    <Editor
                        apiKey={TINYMCE_API_KEY}
                        onInit={(evt, editor) => editorRef.current = editor}
                        value={description} // ডেটাবেস থেকে আসা কন্টেন্ট এখানে দেখানো হচ্ছে
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'anchor autolink charmap codesample emoticons link lists searchreplace table visualblocks wordcount',
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                        }}
                        onEditorChange={(content) => setDescription(content)}
                        disabled={isSubmitting}
                    />
                </div>

                {/* Image Upload Field */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">ছবি</label>
                    <div className="mt-1 flex flex-col items-center p-6 border-2 border-gray-300 border-dashed rounded-md">
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="mb-4 h-48 w-auto rounded-md object-cover" />
                        )}
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500">
                            <span>{imageFile ? 'অন্য ছবি বাছাই করুন' : 'নতুন ছবি বাছাই করুন'}</span>
                            <input id="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isSubmitting} />
                        </label>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center py-3 px-4 border rounded-lg shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 transition-colors"
                    >
                        {isSubmitting ? 'আপডেট করা হচ্ছে...' : 'আপডেট করুন'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditUpdate;