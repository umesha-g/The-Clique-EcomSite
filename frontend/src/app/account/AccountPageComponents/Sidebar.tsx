import { X } from "lucide-react";
import React from "react";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
}) => {
  const tabs = [
    "Overview",
    "Products",
    "Campaigns",
    "Schedules",
    "Payouts",
    "Statement",
    "Settings",
  ];

  return (
    <nav
      className={`
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0
      fixed md:static
      w-64 h-screen
      bg-white dark:bg-gray-800
      p-4
      transition-transform duration-200 ease-in-out
      z-20 md:z-auto
    `}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-xl font-bold">VANTAGE</span>
        </div>
        <button onClick={toggleSidebar} className="md:hidden">
          <X size={24} />
        </button>
      </div>
      <ul>
        {tabs.map((tab) => (
          <li
            key={tab}
            className={`mb-2 ${activeTab === tab ? "text-blue-500" : ""}`}
          >
            <button
              onClick={() => {
                setActiveTab(tab);
                if (window.innerWidth < 768) toggleSidebar();
              }}
              className="flex items-center p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 w-full text-left"
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
