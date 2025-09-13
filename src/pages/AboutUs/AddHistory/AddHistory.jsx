import React, { useState, useRef, useEffect } from 'react';

const AddHistory = () => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // Get content from TinyMCE editor
      if (editorRef.current) {
        const editorContent = editorRef.current.getContent();
        console.log('Content to submit:', editorContent);

        // Submit to API
        const response = await fetch('https://pressclub-netrakona-server.vercel.app/pc-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            description: editorContent,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Success:', result);

          // Reset form after successful submit
          editorRef.current.setContent('');
          setContent('');

          alert('History added successfully!');
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('Error submitting:', error);
      alert('Error submitting history. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Initialize TinyMCE when component mounts
  useEffect(() => {
    // Load TinyMCE script if not already loaded
    if (!window.tinymce) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.2/tinymce.min.js';
      script.onload = initEditor;
      document.head.appendChild(script);
    } else {
      initEditor();
    }

    function initEditor() {
      window.tinymce.init({
        selector: '#tinymce-editor',
        height: 500,
        menubar: false,
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount',
          'paste', 'importcss', 'autosave', 'save', 'directionality',
          'visualchars', 'template', 'codesample',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media link | fullscreen preview | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        
        // Image upload configuration for ImgBB
        images_upload_url: 'https://api.imgbb.com/1/upload', // ImgBB API endpoint
        automatic_uploads: true,
        paste_data_images: true,
        
        // ImgBB image upload handler
        images_upload_handler: async (blobInfo, success, failure, progress) => {
          try {
            const formData = new FormData();
            formData.append('image', blobInfo.blob(), blobInfo.filename());
            formData.append('key', 'bf35be486f2b0f4b0c48958fcc4de90c'); // Replace with your ImgBB API key

            const response = await fetch('https://api.imgbb.com/1/upload', {
              method: 'POST',
              body: formData,
            });

            if (!response.ok) {
              throw new Error(`ImgBB upload failed: ${response.statusText}`);
            }

            const result = await response.json();
            if (result.success) {
              // Return the uploaded image URL
              success(result.data.url);
            } else {
              throw new Error('ImgBB upload failed: ' + result.status);
            }
          } catch (error) {
            console.error('ImgBB upload error:', error);
            failure('Image upload failed: ' + error.message);
          }
        },

        // File picker for images
        file_picker_types: 'image',
        file_picker_callback: (callback, value, meta) => {
          if (meta.filetype === 'image') {
            const input = document.createElement('input');
            input.setAttribute('type', 'file');
            input.setAttribute('accept', 'image/*');

            input.addEventListener('change', async (e) => {
              const file = e.target.files[0];
              if (file) {
                try {
                  const formData = new FormData();
                  formData.append('image', file, file.name);
                  formData.append('key', 'YOUR_IMGBB_API_KEY'); // Replace with your ImgBB API key

                  const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData,
                  });

                  if (!response.ok) {
                    throw new Error(`ImgBB upload failed: ${response.statusText}`);
                  }

                  const result = await response.json();
                  if (result.success) {
                    callback(result.data.url, {
                      alt: file.name,
                    });
                  } else {
                    throw new Error('ImgBB upload failed: ' + result.status);
                  }
                } catch (error) {
                  console.error('ImgBB file picker error:', error);
                  alert('Failed to upload image: ' + error.message);
                }
              }
            });

            input.click();
          }
        },

        // Additional settings for better UX
        branding: false,
        resize: 'both',
        elementpath: false,
        statusbar: true,

        // Content filtering
        valid_elements: '*[*]',
        extended_valid_elements: 'img[*]',

        // Placeholder text
        placeholder: 'Start writing your history here... You can drag and drop images directly into the editor!',

        // Setup callback
        setup: function (editor) {
          editorRef.current = editor;
          editor.on('change', function () {
            setContent(editor.getContent());
          });
        },
      });
    }

    return () => {
      if (window.tinymce && editorRef.current) {
        window.tinymce.remove(editorRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Add New History
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Description
              </label>

              <textarea
                id="tinymce-editor"
                className="w-full h-96 border border-gray-300 rounded-lg p-4"
                placeholder="Start writing your history here..."
              />
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className={`px-8 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-200 ${
                  isSubmitting || !content.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105'
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  'Submit History'
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">💡 Tips:</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• You can drag and drop images directly into the editor</li>
              <li>• Use the image button in the toolbar to upload images</li>
              <li>• Copy and paste images from clipboard works too</li>
              <li>• Use formatting tools to make your content look great</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddHistory;