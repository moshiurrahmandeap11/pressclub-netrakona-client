import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavItems from './NavItems/NavItems';
import logo from "../../../assets/Press club logo.PNG"

const Navbar = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState([]);

    // Fetch slides from API
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const response = await axios.get('https://pressclub-netrakona-server.vercel.app/header-slide');
                setSlides(response.data);
            } catch (error) {
                console.error('Error fetching slides:', error);
            }
        };
        fetchSlides();
    }, []);

    // Auto-advance slideshow
    useEffect(() => {
        if (slides.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 5000);
            return () => clearInterval(timer);
        }
    }, [slides.length]);

    return (
        <div className="relative">
            {/* Navbar with Slideshow Background */}
            <nav className="relative h-24 md:h-28 lg:h-60 text-white rounded-md overflow-hidden">
                {/* Slideshow Background */}
                <div className="absolute inset-0">
{slides.length > 0 ? (
  slides.map((slide, index) => (
    <div
      key={slide._id}
      className={`absolute inset-0 transition-opacity duration-1000 ${
        index === currentSlide ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${
            slide.imageUrl ||
            "https://via.placeholder.com/1200x400?text=Slide+Not+Found"
          })`,
        }}
      >
        {/* Overlay (optional) */}
        <div className="absolute inset-0  bg-opacity-50"></div>
      </div>
    </div>
  ))
) : (
  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
    No slides available
  </div>
)}

                </div>

                {/* Main Content */}
                <div className="relative z-20 h-full">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                        <div className="flex items-center h-full">
                            {/* Logo and Text Section */}
                            <div className="flex items-center space-x-4">
                                {/* Logo */}
                                <div className="flex-shrink-0">
                                    <img
                                        src={logo}
                                        alt="Press Club Logo"
                                        className="h-12 w-12 md:h-16 md:w-16 lg:h-20 lg:w-20 object-contain"
                                        onError={(e) => {
                                            e.target.src =
                                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M2 3h20v18H2z'/%3E%3Cpath d='M8 21V7a4 4 0 0 1 8 0v14'/%3E%3Cpath d='M6 21h12'/%3E%3C/svg%3E";
                                        }}
                                    />
                                </div>

                                {/* Text Content */}
                                <div className="flex flex-col">
                                    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight">
                                        নেত্রকোনা জেলা প্রেসক্লাব
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <NavItems />
        </div>
    );
};

export default Navbar;