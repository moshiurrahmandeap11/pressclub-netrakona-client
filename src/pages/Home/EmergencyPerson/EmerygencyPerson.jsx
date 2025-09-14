import React, { useState, useEffect } from 'react';

const EmergencyPerson = () => {
  const [persons, setPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://pressclub-netrakona-server.vercel.app/important-person');
        const data = await response.json();
        setPersons(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching persons:', error);
        setPersons([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPersons();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg text-gray-600">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="p-4 w-full">
<div className="grid grid-cols-1 gap-6">
  {persons.map((person, index) => (
    <div
      key={person._id || index}
      className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto"
    >
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          {person.title || `ব্যক্তি ${index + 1}`}
        </h1>
      </div>

      {/* Image */}
      <div className="flex justify-center items-center mb-4">
        {person.image || person.imageUrl ? (
          <img
            src={person.image || person.imageUrl}
            alt={person.name || 'Person'}
            className="w-32 h-32 object-cover rounded-full border-4 border-gray-200 shadow-lg"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        {/* fallback */}
        <div
          className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-gray-200"
          style={{ display: (person.image || person.imageUrl) ? 'none' : 'flex' }}
        >
          <span className="text-gray-500 text-sm">ছবি নেই</span>
        </div>
      </div>

      {/* Name & Designation */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {person.name || 'নাম নেই'}
        </h3>
        <p className="text-gray-600">
          {person.designation || 'পদবি নেই'}
        </p>
      </div>
    </div>
  ))}

  {persons.length === 0 && (
    <div className="col-span-full text-center py-8">
      <p className="text-gray-500 text-lg">
        কোনো গুরুত্বপূর্ণ ব্যক্তি পাওয়া যায়নি
      </p>
    </div>
  )}
</div>

    </div>
  );
};

export default EmergencyPerson;