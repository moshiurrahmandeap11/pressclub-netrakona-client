import React, { useState, useEffect } from 'react';

const EmergencyPerson = () => {
  const [persons, setPersons] = useState([]);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await fetch('http://localhost:3000/important-person');
        const data = await response.json();
        setPersons(data);
      } catch (error) {
        console.error('Error fetching persons:', error);
      }
    };
    fetchPersons();
  }, []);

  console.log(persons);

  return (
    <div className="p-4 w-full"> {/* Removed container, use w-full for full width */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* President */}
        {persons.length > 0 && (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">সভাপতি</h1>
            <img
              src={persons[0]?.imageUrl}
              alt={persons[0]?.name || 'President'}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
            />
            <h3 className="text-xl font-semibold text-gray-700">{persons[0]?.name || 'N/A'}</h3>
            <p className="text-gray-600">{persons[0]?.designation || 'N/A'}</p>
          </div>
        )}

        {/* Vice President (or another role) */}
        {persons.length > 1 && (
          <div className="bg-white p-4 rounded-lg shadow-md text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">সহ-সভাপতি</h1>
            <img
              src={persons[1]?.imageUrl}
              alt={persons[1]?.name || 'Vice President'}
              className="w-32 h-32 object-cover rounded-full mx-auto mb-2"
            />
            <h3 className="text-xl font-semibold text-gray-700">{persons[1]?.name || 'N/A'}</h3>
            <p className="text-gray-600">{persons[1]?.designation || 'N/A'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyPerson;