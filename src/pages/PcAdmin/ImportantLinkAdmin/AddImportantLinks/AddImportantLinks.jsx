import React, { useState } from 'react';
import axios from 'axios';

const AddImportantLinks = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !url) {
      setMessage('সব ফিল্ড পূরণ করুন।');
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post('https://pressclub-netrakona-server.vercel.app/important-links', {
        title,
        url,
      });
      setMessage('লিংক সফলভাবে যোগ করা হয়েছে ✅');
      setTitle('');
      setUrl('');
    } catch (error) {
      console.error('Failed to add link:', error);
      setMessage('লিংক যোগ করতে ব্যর্থ 😢');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">নতুন লিংক যোগ করুন</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">শিরোনাম</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="লিংকের শিরোনাম লিখুন"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium text-gray-700">লিংক URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="https://example.com"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors"
          disabled={loading}
        >
          {loading ? 'যোগ করা হচ্ছে...' : 'লিংক যোগ করুন'}
        </button>
      </form>
      {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
    </div>
  );
};

export default AddImportantLinks;
