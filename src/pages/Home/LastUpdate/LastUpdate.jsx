import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';

const LastUpdate = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef(null);
  const intervalRef = useRef(null);
  const navigate = useNavigate();

  // Fetch news from API
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:3000/last-update');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (news.length === 0) return;

    const startScrolling = () => {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) =>
          prevIndex === news.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000);
    };

    startScrolling();

    return () => clearInterval(intervalRef.current);
  }, [news]);

  // Smooth scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: currentIndex * 40, // প্রতিটা item এর height
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  // Pause scrolling on hover
  const handleMouseEnter = () => {
    clearInterval(intervalRef.current);
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === news.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
  };

  // Navigate to /all-updates
  const handleButtonClick = () => {
    navigate('/all-updates');
  };

  // Navigate to details
  const handleNavigateDetails = (id) => {
    navigate(`/update-details/${id}`);
  };

  return (
    <div className="w-full max-w-2xl p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        সর্বশেষ খবর
      </h1>
      <div
        ref={scrollRef}
        className="h-40 overflow-hidden bg-white shadow-md rounded-lg border border-gray-200"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex flex-col">
          {news.length > 0 ? (
            news.map((item) => (
              <div
                key={item._id}
                onClick={() => handleNavigateDetails(item._id)}
                className="p-2 text-gray-700 hover:bg-gray-100 transition-colors text-left cursor-pointer"
                style={{ height: '40px', lineHeight: '40px' }}
              >
                {item.title}
              </div>
            ))
          ) : (
            <div
              className="p-2 text-gray-500 text-left"
              style={{ height: '40px', lineHeight: '40px' }}
            >
              কোনো খবর পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-green-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          সকল খবর
        </button>
      </div>
    </div>
  );
};

export default LastUpdate;
