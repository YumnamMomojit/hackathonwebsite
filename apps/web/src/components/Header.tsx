'use client';

import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid'; // Assuming you have heroicons installed
import { useEffect, useState } from 'react';

const Header = () => {
  const { theme, toggleTheme } = useTheme();
  // We need to ensure the component is mounted before rendering the theme-dependent UI
  // to avoid hydration mismatch between server and client.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);


  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-2xl font-bold text-gray-800 dark:text-white">
            TaikaiClone
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/hackathons" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            Hackathons
          </Link>
          <Link href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
            Projects
          </Link>
          {/* Add more links as needed */}
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
            Login
          </Link>
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded-md hover:bg-blue-50 dark:text-white dark:border-white">
            Register
          </Link>
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-10 h-10 p-2 bg-gray-200 rounded-lg dark:bg-gray-600 flex items-center justify-center"
            onClick={toggleTheme}
          >
            {mounted && (
                theme === 'dark' ? (
                    <SunIcon className="w-6 h-6 text-yellow-400" />
                ) : (
                    <MoonIcon className="w-6 h-6 text-gray-800" />
                )
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
