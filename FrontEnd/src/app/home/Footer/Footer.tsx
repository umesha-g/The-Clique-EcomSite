import React from "react";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const HomeFooter: React.FC = () => (
  <div className=" bg-neutral-800 text-white py-14 font-light">
    <div className="container mx-auto px-4">
      <div className="ml-5 md:ml-0 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="text-lg font-semibold mb-4">Shop</h4>
          <ul className="space-y-2">
            <li>
              <a href="/search" className="hover:underline">
                New Arrivals
              </a>
            </li>
            <li>
              <a href="/search?sort=purchaseCount%2Cdesc" className="hover:underline">
                Bestsellers
              </a>
            </li>
            <li>
              <a href="/deals" className="hover:underline">
                Deals
              </a>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">About</h4>
          <ul className="space-y-2">
            <li>
              <a href="/about" className="hover:underline">
                The Story
              </a>
            </li>
            <li>
              <p className="hover:underline">
                Careers
              </p>
            </li>
            <li>
              <p className="hover:underline">
                Press
              </p>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold mb-4">Customer Service</h4>
          <ul className="space-y-2">
            <li>
              <p className="hover:underline">
                Contact Us
              </p>
            </li>
            <li>
              <p className="hover:underline">
                Shipping
              </p>
            </li>
            <li>
              <p className="hover:underline">
                Returns
              </p>
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
