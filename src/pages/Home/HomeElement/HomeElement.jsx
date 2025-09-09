import React from 'react';
import { useNavigate } from 'react-router';

const HomeElement = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About Us */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">আমাদের সম্পর্কিত</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li onClick={() => navigate("/about-us")} className='cursor-pointer hover:underline'>ইতিহাস</li>
            <li onClick={() => navigate("/about-us")} className='cursor-pointer hover:underline'>আমাদের ইউনিয়ন</li>
            <li onClick={() => navigate("/about-us")} className='cursor-pointer hover:underline'>সংগঠন</li>
          </ul>
        </div>
        {/* Gallery */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">গ্যালারি</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li onClick={() => navigate("/gallery")} className='cursor-pointer hover:underline'>গ্যালারি পছন্দ</li>
            <li onClick={() => navigate("/gallery")} className='cursor-pointer hover:underline'>আমাদের গ্যালারি</li>
          </ul>
        </div>
        {/* Media */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">মিডিয়া</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li onClick={() => navigate("/media")} className='cursor-pointer hover:underline'>ইলেকট্রনিক মিডিয়া</li>
            <li onClick={() => navigate("/media")} className='cursor-pointer hover:underline'>ছবি গ্যালারি</li>
          </ul>
        </div>
        {/* Committee */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">কমিটি</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li onClick={() => navigate("/committee")} className='cursor-pointer hover:underline'>মাননীয় কমিটি</li>
            <li onClick={() => navigate("/committee")} className='cursor-pointer hover:underline'>আমাদের কমিটি</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeElement;