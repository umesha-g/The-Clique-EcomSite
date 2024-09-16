import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 dark:bg-gray-800 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">About Us</h3>
            <p>
              Vantage is your go-to platform for innovative technology
              solutions.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
            <ul>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Products
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
            <p>Email: info@vantage.com</p>
            <p>Phone: (123) 456-7890</p>
          </div>
          <div className="w-full md:w-1/4">
            <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>&copy; 2024 Vantage. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
