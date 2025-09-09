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
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)} // Close menu on link click
      >
        হোম
      </NavLink>
      <NavLink
        to="/about-us"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        আমাদের সম্পর্কিত
      </NavLink>
      <NavLink
        to="/administration"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        প্রশাসন
      </NavLink>
      <NavLink
        to="/media"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        মিডিয়া
      </NavLink>
      <NavLink
        to="/committee"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        কমিটি
      </NavLink>
      <NavLink
        to="/gallery"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        গ্যালারি
      </NavLink>
      <NavLink
        to="/contact"
        className={({ isActive }) =>
          `flex-1 text-center px-4 py-2 text-gray-800 hover:text-blue-600 transition-colors ${
            isActive ? 'text-blue-600 font-bold' : ''
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        যোগাযোগ
      </NavLink>
    </>
  );

  return (
    <div className="w-full">
      <nav className="bg-white shadow-md">
        {/* Hamburger Button for Mobile */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={toggleMenu}
            className="text-gray-800 focus:outline-none"
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
          } md:flex flex-col md:flex-row justify-between items-center w-full px-4 pb-4 md:pb-0 md:px-4`}
        >
          {navItems}
        </div>
      </nav>
    </div>
  );
};

export default NavItems;