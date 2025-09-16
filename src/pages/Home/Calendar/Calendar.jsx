import React, { useState, useEffect } from 'react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [days, setDays] = useState([]);

  useEffect(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const calendarDays = [];
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push(null); // Empty slots before the 1st
    }
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push(i);
    }

    setDays(calendarDays);
  }, [currentDate]);

  const daysOfWeek = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];

  const navigateMonth = (direction) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <div className="container mx-auto p-4 max-w-full">
      <div className="bg-white rounded-lg shadow-lg p-6">
        {/* Header with navigation */}
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            ←
          </button>
          <h2 className="text-xl font-bold text-gray-800">
            {currentDate.toLocaleString('bn-BD', { month: 'long', year: 'numeric' })}
          </h2>
          <button 
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            →
          </button>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-3 mb-3">
          {daysOfWeek.map((day) => (
            <div key={day} className="text-sm font-semibold text-gray-600 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-3">
          {days.map((day, index) => (
            <div
              key={index}
              className={`
                h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200
                ${day ? 'border border-gray-200' : ''}
                ${isToday(day) 
                  ? 'bg-blue-500 text-white shadow-md border-blue-500' 
                  : day 
                    ? 'hover:bg-blue-50 hover:border-blue-300 cursor-pointer text-gray-700' 
                    : 'text-gray-300'
                }
              `}
            >
              {day || ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;