import React, { useState } from "react";
import LastUpdate from "./LastUpdateAdmin/LastUpdateAdmin";
import ImportantPeople from "./ImportantPeopleAdmin/ImportantPeopleAdmin";
import ImportantLinks from "./ImportantLinkAdmin/ImportantLinkAdmin";
import Sidebar from "./Sidebar/Sidebar";
import PcHistory from "./PcHistory/PcHistory";
import HeaderSlideShow from "./HeaderSlideShow/HeaderSlideShow";
import SliderAdmin from "./SliderAdmin/SliderAdmin";
import MIshonVishon from "./MIshonVishon/MIshonVishon";
import Achievement from "./Achievement/Achievement";
import MemberList from "./MemberList/MemberList";
import AdminsTrationAdmin from "./AdminstrationAdmin/AdminsTrationAdmin";
import MediaAdmin from "./MediaAdmin/MediaAdmin";
import CommitteeAdmin from "./CommitteeAdmin/CommitieeAdmin";
import GalleryAdmin from "./GalleryAdmin/GalleryAdmin";
import ContactAdmin from "./ContactAdmin/ContactAdmin";

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
      case "headerslideshow":
        return <HeaderSlideShow></HeaderSlideShow>;
      case "slider":
        return <SliderAdmin></SliderAdmin>;
      case "mishon-vishon":
        return <MIshonVishon></MIshonVishon>;
      case "achievement":
        return <Achievement></Achievement>;
      case "member-list":
        return <MemberList></MemberList>;
      case "adminstration":
        return <AdminsTrationAdmin></AdminsTrationAdmin>;
      case "media":
        return <MediaAdmin></MediaAdmin>;
      case "committee":
        return <CommitteeAdmin></CommitteeAdmin>;
      case "gallery":
        return <GalleryAdmin></GalleryAdmin>;
      case "contact":
        return <ContactAdmin></ContactAdmin>;
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
