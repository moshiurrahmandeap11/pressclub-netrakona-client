import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const EditHistory = () => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [historyId, setHistoryId] = useState(null);
  const editorRef = useRef(null);

  // Fetch existing history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("https://pressclub-netrakona-server.vercel.app/pc-history");
        if (res.data.length) {
          const history = res.data[0]; // assuming single history
          setContent(history.description);
          setHistoryId(history._id);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    fetchHistory();
  }, []);

  const handleSubmit = async () => {
    if (!historyId) return;

    setIsSubmitting(true);
    try {
      if (editorRef.current) {
        const editorContent = editorRef.current.getContent();

        const response = await axios.put(
          `https://pressclub-netrakona-server.vercel.app/pc-history/${historyId}`,
          { description: editorContent }
        );

        if (response.status === 200) {
          alert("History updated successfully!");
        } else {
          throw new Error("Failed to update history");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error updating history. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // TinyMCE initialization
  useEffect(() => {
    if (!window.tinymce) {
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.7.2/tinymce.min.js";
      script.onload = initEditor;
      document.head.appendChild(script);
    } else {
      initEditor();
    }

    function initEditor() {
      window.tinymce.init({
        selector: "#tinymce-editor",
        height: 500,
        menubar: false,
        plugins: [
          "advlist autolink lists link image charmap anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table preview help wordcount",
          "paste importcss autosave save directionality",
          "visualchars template codesample",
        ],
        toolbar:
          "undo redo | blocks | bold italic forecolor | alignleft aligncenter " +
          "alignright alignjustify | bullist numlist outdent indent | " +
          "removeformat | image media link | fullscreen preview | help",
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        branding: false,
        resize: "both",
        elementpath: false,
        statusbar: true,
        valid_elements: "*[*]",
        extended_valid_elements: "img[*]",
        setup: (editor) => {
          editorRef.current = editor;

          // Preload content once editor is ready
          editor.on("init", () => {
            editor.setContent(content);
          });

          editor.on("change", () => {
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
  }, [content]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Edit History
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-lg font-semibold text-gray-700 mb-4">
                Description
              </label>

              <textarea
                id="tinymce-editor"
                className="w-full h-96 border border-gray-300 rounded-lg p-4"
              />
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !content.trim()}
                className={`px-8 py-3 rounded-lg font-semibold text-white text-lg transition-all duration-200 ${
                  isSubmitting || !content.trim()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:scale-105"
                }`}
              >
                {isSubmitting ? "Updating..." : "Update History"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditHistory;
