import React, { useState } from 'react';
import { NavLink } from 'react-router';

const NavItems = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = (
    <>
      <NavLink
        to="/"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        হোম
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        আমাদের সম্পর্কিত
      </NavLink>
      <NavLink
        to="/administration"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        প্রশাসন
      </NavLink>
      <NavLink
        to="/media"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        মিডিয়া
      </NavLink>
      <NavLink
        to="/committee"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        কমিটি
      </NavLink>
      <NavLink
        to="/gallery"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        গ্যালারি
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-3 text-white font-medium rounded-lg 
           transition-all duration-300 ease-in-out 
           hover:bg-green-400 hover:scale-105 hover:shadow-lg 
           ${isActive ? 'bg-green-500 font-bold shadow-md' : 'bg-green-600'}`
        }
        onClick={() => setIsOpen(false)}
      >
        যোগাযোগ
      </NavLink>
    </>
  );

  return (
    <div className="w-full">
      <nav className="bg-white/30 shadow-xl">
        {/* Hamburger Button for Mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none hover:bg-green-400 p-2 rounded-full transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>
        {/* Navigation Items */}
        <div
          className={`${
            isOpen ? 'flex' : 'hidden'
          } md:flex flex-col md:flex-row justify-center items-center w-full px-6 py-4 md:py-2 gap-3 md:gap-4`}
        >
          {navItems}
        </div>
      </nav>
    </div>
  );
};

export default NavItems;