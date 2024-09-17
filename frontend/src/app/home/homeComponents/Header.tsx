"use client";
import ToggleThemeButton from "@/app/commonComponents/toggleThemeButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import {
  X as CloseIcon,
  Search as SearchIcon,
  ShoppingCart,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface User {
  id: number;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  const getSearchSuggestions = async (query: string): Promise<string[]> => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/suggestions?q=${query}`
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const data = await getSearchSuggestions(debouncedSearchTerm);
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm) {
      router.push(`/home/search?q=${encodeURIComponent(searchTerm)}`);
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    router.push(`/home/search?q=${encodeURIComponent(suggestion)}`);
    setSuggestions([]);
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
            <div className="relative" ref={containerRef}>
              <form onSubmit={handleSearchSubmit} className="relative">
                <Input
                  ref={inputRef}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 rounded-full w-64"
                />
                <SearchIcon
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                {suggestions.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSuggestions([])}
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                  >
                    <CloseIcon size={16} />
                  </Button>
                )}
              </form>
              {suggestions.length > 0 && (
                <Card className="absolute z-10 w-full mt-1">
                  <ul>
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
            <ToggleThemeButton />
            <Button
              variant="ghost"
              className="rounded-full relative"
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
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {user.fullName}</span>
                <Button
                  variant="ghost"
                  onClick={onLogout}
                  className="text-red-500 hover:text-red-400"
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
