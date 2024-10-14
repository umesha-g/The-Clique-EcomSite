import { ShoppingCart } from "lucide-react";
import React, { useEffect, useState } from "react";
import Logo from "../Logo";
import { CategoriesMenu } from "./CategoriesMenu";
import { SearchBar, SearchButton } from "./SearchBar";
import { UserMenu } from "./UserMenu";

const HomeHeader: React.FC = () => {
  const [isBgTransparent, setIsBgTransparent] = useState("bg-opacity-0");

  useEffect(() => {
    const toggleBgTransparent = () => {
      if (window.scrollY > 100) {
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
      className={`left-0 right-0 fixed z-50 transition-all ease-in-out bg-white ${isBgTransparent} `}
    >
      <nav className="container relative mx-auto pr-5 py-4 flex items-center justify-between">
        <div className="flex flex-row-reverse lg:flex-row space-x-6 items-center">
          <div className="ml-3">
            <div className="block lg:hidden">
              <SearchButton />
            </div>
            <div className="hidden w-48 lg:block">
              <SearchBar />
            </div>
          </div>
          <div>
            <CategoriesMenu />
          </div>
        </div>
        <Logo />
        <div className="flex items-center space-x-4 justify-end">
          {/* <Heart className="w-5 h-5 text-neutral-700 hover:text-red-600 hover:fill-red-600 transition-all ease-in-out" /> */}
          <ShoppingCart className="w-5 h-5 text-neutral-700 hover:text-neutral-950 hover:fill-neutral-950 transition-all ease-in-out" />

          <UserMenu />
        </div>
      </nav>
    </header>
  );
};

export default HomeHeader;
