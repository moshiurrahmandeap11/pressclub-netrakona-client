import React from "react";
import { Outlet } from "react-router";
import Footer from "../../components/sharedItems/Footer/Footer";
import Navbar from "../../components/sharedItems/Navbar/Navbar";

const RootLayout = () => {
  return (
    <div>
      <nav className="max-w-7xl mx-auto mt-4">
        <Navbar></Navbar>
      </nav>
      <main className="max-w-7xl mx-auto ">
        <Outlet></Outlet>
      </main>
      <footer className="max-w-7xl mx-auto">
        <Footer></Footer>
      </footer>
    </div>
  );
};

export default RootLayout;
