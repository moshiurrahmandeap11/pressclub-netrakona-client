import React, { useState } from "react";
import LastUpdate from "./LastUpdateAdmin/LastUpdateAdmin";
import ImportantPeople from "./ImportantPeopleAdmin/ImportantPeopleAdmin";
import ImportantLinks from "./ImportantLinkAdmin/ImportantLinkAdmin";
import Sidebar from "./Sidebar/Sidebar";
import PcHistory from "./PcHistory/PcHistory";

const PcAdmin = () => {
  const [currentView, setCurrentView] = useState("updates");

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const renderContent = () => {
    switch (currentView) {
      case "updates":
        return <LastUpdate />;
      case "people":
        return <ImportantPeople />;
      case "links":
        return <ImportantLinks />;
      case "history":
        return <PcHistory></PcHistory>;
      default:
        return <LastUpdate />;
    }
  };

  return (
    // Main layout container
    <div className="flex flex-col md:flex-row bg-gray-100 min-h-screen font-sans">
      <Sidebar onViewChange={handleViewChange} currentView={currentView} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{renderContent()}</main>
    </div>
  );
};

export default PcAdmin;
