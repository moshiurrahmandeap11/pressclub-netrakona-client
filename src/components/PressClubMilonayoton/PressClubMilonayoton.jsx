import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PressClubMilonayoton = () => {
  const [images, setImages] = useState([]);
  const [hallRoom, setHallRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch images
        const imagesResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom-images');
        setImages(imagesResponse.data.map(img => img.image));

        // Fetch hall room data (take the first one for display)
        const hallRoomResponse = await axios.get('https://pressclub-netrakona-server.vercel.app/hallroom');
        if (hallRoomResponse.data.length > 0) {
          setHallRoom(hallRoomResponse.data[0]);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to fetch data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">প্রেস ক্লাব মিলনায়তন</h2>
      
      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className="w-full h-[200px] object-cover rounded-lg"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/400x200?text=Image+Not+Found';
            }}
          />
        ))}
      </div>

      {/* Venue Details */}
      {hallRoom ? (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-lg"><strong>আসন সংখ্যা:</strong> {hallRoom.seatNumber}</p>
              <p className="text-lg"><strong>ধারণ ক্ষমতা:</strong> {hallRoom.capacity}</p>
              <p className="text-lg"><strong>ব্যানার সাইজ:</strong> {hallRoom.bannerSize}</p>
              <p className="text-lg"><strong>সাউন্ড সিস্টেম:</strong> {hallRoom.soundSystem}</p>
            </div>
            <div>
              <p className="text-lg"><strong>টেবিল:</strong> {hallRoom.table}</p>
              <p className="text-lg"><strong>সোফা:</strong> {hallRoom.sofa}</p>
              <p className="text-lg"><strong>ভাড়া:</strong></p>
              <ul className="list-disc ml-6">
                <li>সারাদিন: {hallRoom.fullDayRent} টাকা</li>
                <li>অর্ধদিন: {hallRoom.halfDayRent} টাকা</li>
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-gray-500 mb-8">No venue details available.</div>
      )}

      {/* Contact Section */}
      <div className="bg-blue-600 text-white p-6 rounded-lg shadow-lg text-center">
        <h3 className="text-xl font-bold mb-2">যোগাযোগ</h3>
        <p className="text-lg mb-2">ভাড়া নিতে যোগাযোগ করুন</p>
        <a 
          href="tel:+8801712939697" 
          className="text-2xl font-bold underline hover:text-yellow-300 transition-colors"
        >
          +8801712939697
        </a>
      </div>
    </div>
  );
};

export default PressClubMilonayoton;