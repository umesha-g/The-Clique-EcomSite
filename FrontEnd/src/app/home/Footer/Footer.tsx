import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const HomeFooter: React.FC = () => (
  <div className=" text-white py-8 font-light">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Bestsellers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Sale
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">About</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Our Story
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Careers
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Press
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:underline">
                Contact Us
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Shipping
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Returns
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-500">
              <FaFacebook className="w-6 h-6" />
            </a>
            <a href="#" className="hover:text-rose-600">
              <FaInstagram className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default HomeFooter;
