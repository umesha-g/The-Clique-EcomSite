"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Header } from "./accountComponents/Header";
import { Sidebar } from "./accountComponents/Sidebar";
import { Campaigns } from "./accountComponents/tabs/Campaigns";
import { Overview } from "./accountComponents/tabs/Overview";
import { Payouts } from "./accountComponents/tabs/Payouts";
import { Products } from "./accountComponents/tabs/Products";
import { Schedules } from "./accountComponents/tabs/Schedules";
import { Settings } from "./accountComponents/tabs/Settings";
import { Statement } from "./accountComponents/tabs/Statement";

const AccountPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
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
  }, [router]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const renderActiveTab = () => {
    switch (activeTab) {
      case "Overview":
        return <Overview earnings={data.earnings} />;
      case "Products":
        return <Products />;
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
      className={`min-h-screen dark:bg-gray-900 dark:text-white bg-gray-100 text-gray-900
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
          <Header toggleSidebar={toggleSidebar} />
          <main className="p-4 md:p-8 h-fit">{renderActiveTab()}</main>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
