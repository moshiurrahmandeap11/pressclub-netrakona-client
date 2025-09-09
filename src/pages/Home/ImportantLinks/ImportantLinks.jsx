import React, { useEffect, useState } from "react";
import axios from "axios";

const ImportantLinks = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLinks = async () => {
      try {
        const res = await axios.get("http://localhost:3000/important-links");
        setLinks(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Failed to fetch links:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading links...</p>;
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">📌 Important Links</h2>
<ul className="list-disc pl-5 space-y-2">
  {links.map((link) => (
    <li key={link._id}>
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline"
      >
        {link.title}
      </a>
    </li>
  ))}
</ul>

    </div>
  );
};

export default ImportantLinks;
