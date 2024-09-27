"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import FeaturedCarousel from "./featuredSection";

const HomePage = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="p-4 border-b">
        <div className="container mx-auto flex flex-wrap justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold mb-2 sm:mb-0"
          >
            ShopExpress
          </motion.h1>
          <div className="flex items-center space-x-4 w-full sm:w-auto">
            <Input
              className="flex-grow sm:w-64"
              placeholder="Search products..."
            />
            <Button variant="outline" size="sm">
              Sign In
            </Button>
            <Button size="sm">Register</Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <section className="mb-12">
          <div className=" my-20 ">
            <FeaturedCarousel />
          </div>
        </section>

        <section className="my-10">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-xl font-semibold mb-4"
          >
            More to Love
          </motion.h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-2">
                    <Image
                      src={`/api/placeholder/150/150?text=Product${index + 1}`}
                      alt={`Product ${index + 1}`}
                      width={150}
                      height={150}
                      className="w-full h-auto mb-2"
                    />
                    <p className="text-xs truncate">Product Name</p>
                    <p className="text-sm font-semibold">$99.99</p>
                    <p className="text-xs text-muted-foreground">1000+ sold</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-muted mt-12 py-8">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
          © 2024 ShopExpress. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
