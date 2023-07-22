import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

function BasePage() {
  return (
    <React.Fragment>
      <Navbar />
      <Sidebar />
      <main className="container main-container mx-auto">
        <Outlet />
      </main>
    </React.Fragment>
  );
}

export default BasePage;
