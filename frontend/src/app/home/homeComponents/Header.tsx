"use client";
import ToggleThemeButton from "@/app/commonComponents/toggleThemeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import Search from "./headerComponents/Search";

interface User {
  id: string;
  email: string;
  fullName: string;
}

interface HeaderProps {
  user: User | null;
  cartItemCount: number;
  onCartClick: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  cartItemCount,
  onCartClick,
  onLogout,
}) => {
  const router = useRouter();

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm) {
      router.push(`/home/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const gotoAccount = () => {
    router.push("/account");
  };

  return (
    <Card className="fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="text-xl font-bold text-primary">
              Our Store
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
            <Search onSubmit={handleSearchSubmit} />
            <ToggleThemeButton />
            <Button
              variant="ghost"
              className="rounded-full p-3  relative hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={onCartClick}
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-xs text-white">
                  {cartItemCount}
                </span>
              )}
            </Button>
            {user ? (
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  className="p-3 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                  onClick={gotoAccount}
                >
                  <UserIcon size={20} />
                </Button>
                <span className="text-sm">Welcome, {user.fullName}</span>
                <Button
                  variant="destructive"
                  onClick={onLogout}
                  className=" rounded-full"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button variant="ghost" className="rounded-full">
                <UserIcon size={20} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Header;
