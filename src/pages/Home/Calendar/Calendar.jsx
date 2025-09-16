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

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {currentDate.toLocaleString('bn-BD', { month: 'long', year: 'numeric' })}
        </h2>
 <div className="grid grid-cols-7 gap-3 text-center">
  {daysOfWeek.map((day) => (
    <div key={day} className="text-[10px] text-gray-700 font-medium">
      {day}
    </div>
  ))}

  {days.map((day, index) => (
    <div
      key={index}
      className={`flex items-center justify-center w-8 h-8 rounded-md text-[10px]
        ${
          day === currentDate.getDate() &&
          currentDate.getMonth() === new Date().getMonth() &&
          currentDate.getFullYear() === new Date().getFullYear()
            ? 'bg-blue-500 text-white font-bold'
            : day
            ? 'hover:bg-gray-200 cursor-pointer text-gray-800'
            : 'text-gray-300'
        }`}
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