"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Moon, Sun } from "lucide-react";

const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} className="rounded-full" variant="default">
      {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  );
};

export default ToggleThemeButton;
