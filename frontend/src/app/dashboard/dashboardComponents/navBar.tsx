import React from 'react';
import Link from 'next/link';

interface NavbarProps {
  title: string;
}

const Navbar: React.FC<NavbarProps> = ({ title }) => {
  return (
    <nav className="bg-gray-800 p-4 fixed w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div>
          <Link href="/dashboard" className="text-white hover:text-gray-300 mr-4">
            Dashboard
          </Link>
          <Link href="/" className="text-white hover:text-gray-300">
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;