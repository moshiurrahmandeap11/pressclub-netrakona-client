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
        const response = await fetch('https://pressclub-netrakona-server.vercel.app/last-update');
        const data = await response.json();
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };
    fetchNews();
  }, []);

  // Auto-scroll logic (always-on)
  useEffect(() => {
    if (news.length === 0) return;

    intervalRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === news.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [news]);

  // Smooth scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: currentIndex * 40,
        behavior: 'smooth',
      });
    }
  }, [currentIndex]);

  const handleButtonClick = () => {
    navigate('/all-updates');
  };

  const handleNavigateDetails = (id) => {
    navigate(`/update-details/${id}`);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">নোটিশ</h1>
      <div
        ref={scrollRef}
        className="h-40 overflow-hidden bg-white shadow-md rounded-lg border border-gray-200 w-full"
      >
        <ul className="flex flex-col">
          {news.length > 0 ? (
            news.map((item) => (
              <li
                key={item._id}
                onClick={() => handleNavigateDetails(item._id)}
                className="p-2 text-gray-700 hover:bg-gray-100 text-sm md:text-base transition-colors text-left cursor-pointer truncate list-disc ml-5"
                style={{
                  height: '40px',
                  lineHeight: '40px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                title={item.title} // mouse hover e full title show
              >
                {item.title}
              </li>
            ))
          ) : (
            <li
              className="p-2 text-gray-500 text-left list-disc ml-5"
              style={{ height: '40px', lineHeight: '40px' }}
            >
              কোনো খবর পাওয়া যায়নি
            </li>
          )}
        </ul>
      </div>
      <div className="mt-4 flex justify-end">
        <button
          onClick={handleButtonClick}
          className="px-4 py-2 bg-blue-400 cursor-pointer text-white rounded-md hover:bg-green-400 transition-colors"
        >
          সকল নোটিশ
        </button>
      </div>
    </div>
  );
};

export default LastUpdate;
