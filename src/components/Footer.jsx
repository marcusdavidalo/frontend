import React from "react";
import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-6 sm:space-y-0">
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-2 sm:space-y-0 sm:space-x-6">
          <p className="text-lg font-medium">
            &copy; 2023 Marcus David Alo. All rights reserved.
          </p>
        </div>
        <div className="flex space-x-6">
          <a
            href="https://github.com/marcusdavidalo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <FaGithub />
          </a>
          <a
            href="https://www.linkedin.com/in/mdalo/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-2xl hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:marcusdavidalo.work@gmail.com"
            className="text-2xl hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
