'use client';

import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current path

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
        {/* Navigation Links */}
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
        {/* Logout Button */}
        <button
          className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
