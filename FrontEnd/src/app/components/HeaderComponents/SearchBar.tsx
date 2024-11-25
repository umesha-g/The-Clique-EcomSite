"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { X as CloseIcon, Search as SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const router = useRouter();

  const handleSearchSubmit = (searchTerm: string) => {
    if (searchTerm) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
    else {
      router.push(`/search`);
    }
  };

  const getSearchSuggestions = async (query: string): Promise<string[]> => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/searchSuggestions?q=${query}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
      return [];
    }
  };

  useEffect(() => {
    if (debouncedSearchTerm.length > 0) {
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
    inputRef.current?.focus();
  }, []);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchSubmit(searchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    handleSearchSubmit(suggestion);
  };

  return (
    <div
      className="border-none outline-none w-full border-neutral-700"
      ref={containerRef}
    >
      {" "}
      {/* Attach ref here */}
      <form
        onSubmit={handleSubmit}
        className="relative outline-none border-neutral-700 rounded-full hover:ring-1 hover:ring-neutral-700"
      >
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-full border-neutral-700 placeholder:text-neutral-700 placeholder:font-literata text-md font-literata text-neutral-700 w-full "
          style={{ boxShadow: "none" }}
        />
        <SearchIcon
          className="absolute hidden lg:block left-3 top-1/2 transform -translate-y-1/2 text-neutral-700"
          size={20}
        />
        {suggestions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSuggestions([])}
            className="absolute rounded-xl right-2 top-1/2 -translate-y-1/2"
          >
            <CloseIcon size={16} className="hover:text-neutral-800" />
          </Button>
        )}
        {suggestions.length > 0 && (
          <Card className="absolute z-10 rounded-lg w-full mt-1">
            <ul>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </form>
    </div>
  );
};

const SearchButton: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      setIsSearchOpen(false);
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col">
      <button onClick={toggleSearch}>
        <SearchIcon
          className=" text-neutral-700 hover:fill-neutral-800"
          size={20}
        />
      </button>
      {isSearchOpen && (
        <div className="absolute flex z-10 object-center top-16">
          <SearchBar />
        </div>
      )}
    </div>
  );
};

export { SearchBar, SearchButton };
