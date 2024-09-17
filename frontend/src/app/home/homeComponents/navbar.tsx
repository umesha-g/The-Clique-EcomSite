"use client";
import ToggleThemeButton from "@/app/commonComponents/toggleThemeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search as SearchIcon, ShoppingCart, User } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Search from "./navBarComponents/Search";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSearchSubmit = (searchTerm: string) => {
    router.push(`/home/search?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <Card className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-primary">
              VANTAGE
            </a>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="link" asChild>
              <a href="#">Home</a>
            </Button>
            <Button variant="link" asChild>
              <a href="#">Products</a>
            </Button>
            <Button variant="link" asChild>
              <a href="#">About</a>
            </Button>
            <Button variant="link" asChild>
              <a href="#">Contact</a>
            </Button>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              {isSearchOpen ? (
                <Search
                  onSubmit={handleSearchSubmit}
                  onClose={() => setIsSearchOpen(false)}
                />
              ) : (
                <Button
                  variant="ghost"
                  onClick={() => setIsSearchOpen(true)}
                  className="rounded-full"
                >
                  <SearchIcon size={20} />
                </Button>
              )}
            </div>
            <ToggleThemeButton />
            <Button variant="ghost" className="rounded-full">
              <ShoppingCart size={20} />
            </Button>
            <Button variant="ghost" className="rounded-full">
              <User size={20} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Navbar;
