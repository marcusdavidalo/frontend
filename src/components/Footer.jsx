import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center">
        <p className="text-lg">
          &copy; 2023 Marcus David Alo. All rights reserved.
        </p>
        <div className="flex space-x-4 mt-4 sm:mt-0">
          <a
            href="https://github.com/marcusdavidalo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaGithub className="text-2xl hover:text-gray-700 dark:hover:text-gray-100 transition-colors" />
          </a>
          <a
            href="https://www.linkedin.com/in/mdalo/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedin className="text-2xl hover:text-gray-700 dark:hover:text-gray-100 transition-colors" />
          </a>
          {/* emailing needs to be improved */}
          <a href="mailto:marcusdavidalo.work@gmail.com">
            <FaEnvelope className="text-2xl hover:text-gray-700 dark:hover:text-gray-100 transition-colors" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
