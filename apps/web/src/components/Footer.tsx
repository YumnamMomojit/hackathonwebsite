const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t">
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">TaikaiClone</h4>
            <p className="text-gray-600 dark:text-gray-400">
              The platform for hackathons and coding challenges.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Quick Links</h4>
            <ul>
              <li><a href="/hackathons" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Hackathons</a></li>
              <li><a href="/projects" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Projects</a></li>
              <li><a href="/about" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">About Us</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-2 text-gray-800 dark:text-white">Follow Us</h4>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">Twitter</a>
              <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-500">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} TaikaiClone. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
