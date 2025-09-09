import React, { useState, useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

const AddUpdate = () => {
    // State for form fields
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    // State for loading and error handling
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const editorRef = useRef(null);
    const fileInputRef = useRef(null);

    // Get your API keys from their respective websites
    const TINYMCE_API_KEY = 'k2b4mo2evgamnxk6pi4zr060mdooxnzed1zp909c2h9kb7wf'; 
    const IMGBB_API_KEY = 'bf35be486f2b0f4b0c48958fcc4de90c'; 

    // Handle image selection and create a preview
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
            setError(''); // Clear previous errors
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic validation
        if (!title || !description || !image) {
            setError('অনুগ্রহ করে সবগুলো ঘর পূরণ করুন।');
            return;
        }

        setError('');
        let imageUrl = '';

        // Step 1: Upload image to ImgBB
        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('image', image);

            const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData,
            });

            const imgbbResult = await imgbbResponse.json();

            if (!imgbbResult.success) {
                throw new Error(imgbbResult.error.message || 'Image upload failed');
            }
            
            imageUrl = imgbbResult.data.url;
            setIsUploading(false);

        } catch (err) {
            setError(`ছবি আপলোড করা যায়নি: ${err.message}`);
            setIsUploading(false);
            return;
        }

        // Step 2: Create payload and POST to your server
        const payload = {
            title,
            description,
            imageUrl,
            createdAt: new Date().toISOString(), // Current timestamp
        };

        try {
            setIsSubmitting(true);
            const apiResponse = await fetch('http://localhost:3000/last-update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!apiResponse.ok) {
                throw new Error('সার্ভারে ডেটা পাঠানো যায়নি।');
            }
            
            // On success
            alert('সফলভাবে নতুন আপডেট যোগ করা হয়েছে!');
            // Reset form
            setTitle('');
            setDescription('');
            setImage(null);
            setPreviewUrl('');
            if (editorRef.current) editorRef.current.setContent('');
            if (fileInputRef.current) fileInputRef.current.value = '';
            
        } catch (err) {
            setError(`একটি সমস্যা হয়েছে: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isLoading = isUploading || isSubmitting;

    return (
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 pb-4 border-b border-gray-200">
                নতুন আপডেট যোগ করুন
            </h2>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div>
                    <label htmlFor="title" className="block text-lg font-medium text-gray-700 mb-2">শিরোনাম</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
                        placeholder="আপডেটের শিরোনাম লিখুন"
                        disabled={isLoading}
                    />
                </div>

                {/* Description Field (TinyMCE) */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">বিবরণ</label>
                    <Editor
                        apiKey={TINYMCE_API_KEY}
                        onInit={(evt, editor) => editorRef.current = editor}
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: 'anchor autolink charmap codesample emoticons link lists searchreplace table visualblocks wordcount',
                            toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat',
                            content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                        onEditorChange={(content) => setDescription(content)}
                        disabled={isLoading}
                    />
                </div>

                {/* Image Upload Field */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">ছবি</label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                            {previewUrl ? (
                                <img src={previewUrl} alt="Preview" className="mx-auto h-40 w-auto rounded-md object-cover" />
                            ) : (
                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            <div className="flex text-sm text-gray-600">
                                <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-teal-600 hover:text-teal-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-teal-500">
                                    <span>একটি ফাইল আপলোড করুন</span>
                                    <input ref={fileInputRef} id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isLoading} />
                                </label>
                                <p className="pl-1">অথবা টেনে এনে এখানে ছাড়ুন</p>
                            </div>
                            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        {isUploading ? 'ছবি আপলোড হচ্ছে...' : isSubmitting ? 'আপডেট যোগ করা হচ্ছে...' : 'আপডেট যোগ করুন'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddUpdate;