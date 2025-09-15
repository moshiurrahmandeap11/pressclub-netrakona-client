import React from "react";
import { useNavigate } from "react-router";

const HomeElement = () => {
  const navigate = useNavigate();

  // Map menu items to Media tabs
  const navigateToMedia = (tab) => {
    navigate("/media", { state: { tab } });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* About Us */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            আমাদের সম্পর্কিত
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li
              onClick={() => navigate("/about-us?tab=history")}
              className="cursor-pointer hover:underline"
            >
              ইতিহাস ও কার্যাবলী
            </li>
            <li
              onClick={() => navigate("/about-us?tab=mission")}
              className="cursor-pointer hover:underline"
            >
              মিশন ও ভিশন
            </li>
            <li
              onClick={() => navigate("/about-us?tab=members")}
              className="cursor-pointer hover:underline"
            >
              সাংগঠনিক কাঠামো
            </li>
            <li
              onClick={() => navigate("/about-us?tab=success")}
              className="cursor-pointer hover:underline"
            >
              সাফল্য ও অর্জন
            </li>
            <li
              onClick={() => navigate("/about-us?tab=member-list")}
              className="cursor-pointer hover:underline"
            >
              সদস্য তালিকা
            </li>
          </ul>
        </div>
        {/* Gallery */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">গ্যালারি</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li
              onClick={() => navigate("/gallery?tab=photo")}
              className="cursor-pointer hover:underline"
            >
              ফটো গ্যালারী
            </li>
            <li
              onClick={() => navigate("/gallery?tab=video")}
              className="cursor-pointer hover:underline"
            >
              ভিডিও গ্যালারি
            </li>
          </ul>
        </div>
        {/* Media */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">মিডিয়া</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li
              onClick={() => navigateToMedia("Electronic")}
              className="cursor-pointer hover:underline"
            >
              ইলেকট্রনিক মিডিয়া
            </li>
            <li
              onClick={() => navigateToMedia("Print")}
              className="cursor-pointer hover:underline"
            >
              প্রিন্ট মিডিয়া
            </li>
          </ul>
        </div>
        {/* Committee */}
        <div className="bg-blue-200 p-4 rounded-lg shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-2">কমিটি</h2>
          <ul className="list-disc list-inside text-gray-700">
            <li
              onClick={() => navigate("/committee")}
              className="cursor-pointer hover:underline"
            >
              ম্যানেজিং কমিটি
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomeElement;
