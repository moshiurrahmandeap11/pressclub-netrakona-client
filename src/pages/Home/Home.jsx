import React from "react";
import LastUpdate from "./LastUpdate/LastUpdate";
import HomeElement from "./HomeElement/HomeElement";
import EmerygencyPerson from "./EmergencyPerson/EmerygencyPerson";
import Calendar from "./Calendar/Calendar";
import ImportantLinks from "./ImportantLinks/ImportantLinks";
import EmergencyHotline from "./EmerygencyHotline/EmergencyHotline";
import Slider from "./Slider/Slider";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 max-w-7xl mx-auto">
        {/* Left Section - 8/12 */}
        <div className="lg:col-span-8 space-y-4">
          <LastUpdate />
          <HomeElement />
          <Slider></Slider>
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
          <Calendar />
          <ImportantLinks />
          <EmergencyHotline />
        </div>
      </div>
    </div>
  );
};

export default Home;