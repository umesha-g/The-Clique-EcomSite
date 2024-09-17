"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axios from "axios"; // Import axios
import { X as CloseIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

interface SearchProps {
  onSubmit: (searchTerm: string) => void;
  onClose: () => void;
}

// Async function to get search suggestions using axios
const getSearchSuggestions = async (query: string): Promise<string[]> => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/suggestions?q=${encodeURIComponent(query)}`
    ); // Replace with your actual API endpoint
    return response.data; // Assuming the API returns an array of suggestions
  } catch (error) {
    console.error("Failed to fetch suggestions:", error);
    return [];
  }
};

const Search: React.FC<SearchProps> = ({ onSubmit, onClose }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const fetchSuggestions = async () => {
        try {
          const data = await getSearchSuggestions(searchTerm); // Fetch suggestions using Axios
          setSuggestions(data);
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        }
      };
      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [searchTerm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(searchTerm);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchTerm(suggestion);
    onSubmit(suggestion);
  };

  return (
    <Card className="absolute right-0 top-0 mt-2 w-64">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search..."
        />
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          className="absolute right-2 top-1/2 -translate-y-1/2"
        >
          <CloseIcon size={16} />
        </Button>
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
    </Card>
  );
};

export default Search;
