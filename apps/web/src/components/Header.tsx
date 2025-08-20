import Link from 'next/link';

const Header = () => {
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
          <Link href="/register" className="px-4 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded-md hover:bg-blue-50">
            Register
          </Link>
          <button
            aria-label="Toggle Dark Mode"
            type="button"
            className="w-10 h-10 p-2 bg-gray-200 rounded-lg dark:bg-gray-600"
            // onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {/* Sun/Moon Icon can be added here */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-gray-800 dark:text-white">
              <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.106a.75.75 0 010 1.06l-1.591 1.59a.75.75 0 11-1.06-1.06l1.59-1.59a.75.75 0 011.06 0zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5h2.25a.75.75 0 01.75.75zM17.894 17.894a.75.75 0 011.06 0l1.59 1.591a.75.75 0 11-1.06 1.06l-1.59-1.59a.75.75 0 010-1.061zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM6.106 18.894a.75.75 0 011.06 0l1.59 1.59a.75.75 0 01-1.06 1.06l-1.59-1.591a.75.75 0 010-1.06zM5.25 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 015.25 12zM6.106 6.106a.75.75 0 010-1.06l1.59-1.591a.75.75 0 111.06 1.06l-1.59 1.59a.75.75 0 01-1.06 0z" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
