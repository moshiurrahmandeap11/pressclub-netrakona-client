import React, { useState } from "react";
import LastUpdate from "./LastUpdate/LastUpdate";
import HomeElement from "./HomeElement/HomeElement";
import EmerygencyPerson from "./EmergencyPerson/EmerygencyPerson";
import Calendar from "./Calendar/Calendar";
import ImportantLinks from "./ImportantLinks/ImportantLinks";
import EmergencyHotline from "./EmerygencyHotline/EmergencyHotline";
import Slider from "./Slider/Slider";
import PressClubMilonayoton from "../../components/PressClubMilonayoton/PressClubMilonayoton";
import { motion } from "framer-motion";

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto">
        {/* Left Section - 8/12 */}
        <div className="lg:col-span-8 space-y-4">
          <LastUpdate />
          <HomeElement />
          <Slider />
        </div>

        {/* Divider */}
        <div className="hidden lg:flex justify-center lg:col-span-1">
          <div className="w-px bg-gray-400 min-h-full"></div>
        </div>
        <div className="lg:hidden">
          <div className="h-px bg-gray-400 my-4"></div>
        </div>

        {/* Right Section - 3/12 */}
        <div className="lg:col-span-3 space-y-4">
          <EmerygencyPerson />
<motion.div
  className="px-6 py-3 bg-green-200 rounded-md cursor-pointer"
  onClick={openPopup}
  whileHover={{ scale: 1.05, backgroundColor: "#bbf7d0" }}
  whileTap={{ scale: 0.95 }}
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, ease: "easeInOut" }}
>
  <motion.h1
    className="text-center font-semibold"
    animate={{ opacity: [1, 0, 1] }} // blink
    transition={{ duration: 1, repeat: Infinity }} // loop
  >
    প্রেস ক্লাব মিলনায়তন
  </motion.h1>
</motion.div>

          <Calendar />
          <ImportantLinks />
          <EmergencyHotline />
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
              onClick={closePopup}
            >
              &times;
            </button>
            <PressClubMilonayoton />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
