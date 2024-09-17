"use client";
import { Separator } from "@/components/ui/separator"; // Assuming Separator is available in ShadCN
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-muted py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          {/* About Us Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p>
              e
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <a href="#" className="hover:text-primary">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Products
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>Email: </p>
            <p>Phone: </p>
          </div>

          {/* Follow Us Section */}
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>

        {/* Separator and Footer Text */}
        <Separator className="my-8" />
        <div className="mt-8 text-center">
          <p>&copy; 2024 Umesha G. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
