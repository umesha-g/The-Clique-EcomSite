"use client";
import React, { useEffect, useState } from "react";
import Logo from "./Logo";
import CategoriesMenu  from "./HeaderComponents/CategoriesMenu";
import { SearchBar, SearchButton } from "./HeaderComponents/SearchBar";
import UserMenu  from "./HeaderComponents/UserMenu";
import CartDrawer from "@/app/components/HeaderComponents/CartDrawer";
import {useAuth} from "@/contexts/authContext";
import {NotificationsButton} from "@/app/components/HeaderComponents/notification";

interface CommonHeaderProps{
  categoryVisibility:string;
  searchBarWidth:string;
  isSearchAvailable:boolean;
}
const CommonHeader: React.FC<CommonHeaderProps> = ({
                                                     categoryVisibility,
                                                      searchBarWidth,
                                                     isSearchAvailable,
                                                    }) => {
  const [isBgTransparent, setIsBgTransparent] = useState("bg-opacity-0");
  const {  user,isAdmin} = useAuth();

  useEffect(() => {
    const toggleBgTransparent = () => {
      if (window.scrollY > 50) {
        setIsBgTransparent(
          "bg-opacity-100 border-b-[1px] border-black shadow-sm"
        );
      } else {
        setIsBgTransparent("bg-opacity-0");
      }
    };

    window.addEventListener("scroll", toggleBgTransparent);

    return () => window.removeEventListener("scroll", toggleBgTransparent);
  }, []);

  return (
    <header
      className={`left-0 right-0 fixed z-50 transition-all h-14 lg:h-[70px] items-center flex ease-in-out bg-white ${isBgTransparent} `}
    >
      <nav className="container relative mx-auto pr-5 py-4 flex items-center justify-between">
        <div className="flex flex-row-reverse lg:flex-row space-x-6 items-center">
          {isSearchAvailable && <div className="ml-3">
            <div className="block lg:hidden">
              <SearchButton />
            </div>

            <div className={`hidden w-${searchBarWidth} lg:block`}>
              <SearchBar />
            </div>
          </div>}
          <div className={`${categoryVisibility}`}>
            <CategoriesMenu />
          </div>
        </div>
        <Logo />
        <div className="flex items-center space-x-4 sm:space-x-6 content-center justify-end">
          {user && <NotificationsButton/>}
          {user && !isAdmin && <CartDrawer/>}
          <UserMenu/>
        </div>
      </nav>
    </header>
  );
};

export default CommonHeader;
