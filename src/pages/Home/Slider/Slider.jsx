import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // API থেকে ডেটা লোড করা
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('https://pressclub-netrakona-server.vercel.app/slider');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // Transform nested slider object to flat structure - FIXED for nested structure
        const transformedSlides = data.map(slide => ({
          id: slide._id,
          image: slide.slider.slider.image,
          title: slide.slider.slider.title || '',
          description: slide.slider.slider.description || '',
          createdAt: slide.slider.slider.createdAt
        }));
        setSlides(transformedSlides);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching slides:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // অটো প্লে ফিচার
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPlaying, slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="relative h-96 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="text-gray-500 text-lg">Loading slider...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <div className="text-red-600 text-lg font-semibold mb-2">Error Loading Slider</div>
        <div className="text-red-500">{error}</div>
        <div className="text-sm text-gray-600 mt-2">
          Make sure your API is running on localhost:3000/slider
        </div>
      </div>
    );
  }

  if (slides.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="text-gray-600 text-lg">No slides available</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="relative h-96 group">
        {/* Main Slide Image */}
        <div className="relative h-full overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
                index === currentSlide
                  ? 'transform translate-x-0'
                  : index < currentSlide
                  ? 'transform -translate-x-full'
                  : 'transform translate-x-full'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || `Slide ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Slide image failed to load:', slide.image);
                  e.target.src = `https://via.placeholder.com/800x400/e5e7eb/6b7280?text=Image+${index + 1}`;
                }}
              />
              {/* Overlay Content */}
              {(slide.title || slide.description) && (
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center text-white p-6 max-w-2xl">
                    {slide.title && (
                      <h2 className="text-3xl font-bold mb-4 drop-shadow-lg">
                        {slide.title}
                      </h2>
                    )}
                    {slide.description && (
                      <p className="text-lg opacity-90 drop-shadow">
                        {slide.description}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Play/Pause Button */}
        <button
          onClick={toggleAutoPlay}
          className="absolute top-4 right-4 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white p-2 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>

        {/* Slide Counter */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
          {currentSlide + 1} / {slides.length}
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <div className="flex justify-center items-center space-x-2 overflow-x-auto pb-2">
          {slides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`flex-shrink-0 relative w-20 h-12 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                index === currentSlide
                  ? 'border-blue-500 ring-2 ring-blue-200 transform scale-105'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title || `Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/80x48/e5e7eb/6b7280?text=${index + 1}`;
                }}
              />
              {/* Active indicator overlay */}
              {index === currentSlide && (
                <div className="absolute inset-0  bg-opacity-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        
        {/* Dots Indicator (smaller, below thumbnails) */}
        <div className="flex justify-center items-center space-x-1 mt-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentSlide
                  ? 'bg-blue-500'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Slide Info (if available) */}
      {slides[currentSlide] && (slides[currentSlide].title || slides[currentSlide].description) && (
        <div className="p-4 bg-white border-t border-gray-200">
          <div className="max-w-4xl mx-auto">
            {slides[currentSlide].title && (
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {slides[currentSlide].title}
              </h3>
            )}
            {slides[currentSlide].description && (
              <p className="text-gray-600 leading-relaxed">
                {slides[currentSlide].description}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Slider;