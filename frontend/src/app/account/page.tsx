"use client";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Header } from "./AccountPageComponents/Header";
import { Sidebar } from "./AccountPageComponents/Sidebar";
import { Campaigns } from "./AccountPageComponents/tabs/Campaigns";
import { Overview } from "./AccountPageComponents/tabs/Overview";
import { Payouts } from "./AccountPageComponents/tabs/Payouts";
import { Products } from "./AccountPageComponents/tabs/Products";
import { Schedules } from "./AccountPageComponents/tabs/Schedules";
import { Settings } from "./AccountPageComponents/tabs/Settings";
import { Statement } from "./AccountPageComponents/tabs/Statement";

const AccountPage: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState({
    earnings: {},
    products: [],
    campaigns: [],
    schedules: [],
    payouts: [],
    statements: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/profile");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview earnings={data.earnings} />;
      case "Products":
        return <Products products={data.products} />;
      case "Campaigns":
        return <Campaigns campaigns={data.campaigns} />;
      case "Schedules":
        return <Schedules schedules={data.schedules} />;
      case "Payouts":
        return <Payouts payouts={data.payouts} />;
      case "Statement":
        return <Statement statements={data.statements} />;
      case "Settings":
        return <Settings />;
      default:
        return <div>Select a tab</div>;
    }
  };

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-100"
      }`}
    >
      <div className="flex flex-col md:flex-row">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
        />
        <div className="flex-1">
          <Header
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            toggleSidebar={toggleSidebar}
          />
          <main className="p-4 md:p-8">{renderActiveTab()}</main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
