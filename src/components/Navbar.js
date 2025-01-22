'use client';

import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path
  const [isOpen, setIsOpen] = useState(false); // State for managing mobile menu

  const handleLogout = () => {
    Cookies.remove('auth_token');
    router.push('/');
  };

  const navItems = [
    { name: 'Home', path: '/home' },
    { name: 'Jokes', path: '/jokes' },
    { name: 'Create Jokes', path: '/create-jokes' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        {/* Logo or brand name */}
        <div className="text-lg font-bold">Jokes App</div>

        {/* Hamburger Menu for Mobile */}
        <div className="block lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex space-x-8">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`px-4 py-2 rounded ${
                  pathname === item.path
                    ? 'bg-blue-800' // Active link background color
                    : 'hover:bg-blue-500'
                }`}
                onClick={() => router.push(item.path)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Navigation Links */}
        <div
          className={`lg:hidden ${isOpen ? 'block' : 'hidden'} absolute top-16 left-0 w-full bg-blue-700 text-white p-6 space-y-4`}
        >
          <div className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`px-4 py-2 rounded ${
                  pathname === item.path
                    ? 'bg-blue-800' // Active link background color
                    : 'hover:bg-blue-500'
                }`}
                onClick={() => router.push(item.path)}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Logout Button */}
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600 w-full"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        {/* Desktop Logout Button */}
        <div className="lg:flex hidden">
          <button
            className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
