import ToggleThemeButton from "@/app/commonComponents/toggleThemeButton";
import { Input } from "@/components/ui/input";
import { Bell, Menu, Search } from "lucide-react";
import React from "react";

interface HeaderProps {
  toggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  return (
    <header className="bg-white dark:bg-gray-800 p-4 flex justify-between items-center">
      <button onClick={toggleSidebar} className="md:hidden">
        <Menu size={24} />
      </button>
      <div className="relative flex-grow max-w-md mx-4">
        <Input
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-full w-full"
        />
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="flex items-center space-x-4">
        <ToggleThemeButton />
        <Bell size={20} />
        <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
      </div>
    </header>
  );
};
