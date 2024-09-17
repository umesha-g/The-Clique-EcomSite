"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { X as CloseIcon, Search as SearchIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchProps {
  onSubmit: (searchTerm: string) => void;
}

const Search: React.FC<SearchProps> = ({ onSubmit }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the container
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);

  // Async function to get search suggestions using axios
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
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    // Click outside detection
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setSuggestions([]); // Close suggestions when clicking outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(searchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSubmit(suggestion);
  };

  return (
    <div className="border-transparent w-64" ref={containerRef}>
      {" "}
      {/* Attach ref here */}
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          placeholder="Search..."
          className="pl-10 pr-4 py-2 rounded-full w-full"
        />
        <SearchIcon
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        {suggestions.length > 0 && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setSuggestions([])} // Close suggestions when button is clicked
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
  );
};

export default Search;
