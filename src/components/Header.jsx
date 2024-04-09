import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "react-tooltip";

const Header = () => {
  const pages = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Projects", link: "/projects" },
    { name: "Contact", link: "/contact" },
  ];

  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-3 h-16 items-center">
              <div className="flex">
                <div className="flex flex-shrink-0 items-center">
                  <Link to="/" className="text-3xl font-bold">
                    Marcus David Alo
                  </Link>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:justify-center sm:space-x-8 h-full">
                {pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.link}
                    className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-lg font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
              <div className="flex items-center justify-end">
                <Tooltip id="theme-button"></Tooltip>
                <button
                  data-tooltip-id="theme-button"
                  data-tooltip-content="This is currently non-functional, I will add functionality to this in future updates"
                  onClick={toggleDarkMode}
                  className="rounded-md bg-white px-3 py-2 text-md font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  {isDarkMode ? "Light Mode" : "Dark Mode"}
                </button>
              </div>
              <div className="-mr-2 flex sm:hidden justify-end">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {pages.map((page) => (
                <Disclosure.Button
                  key={page.name}
                  as={Link}
                  to={page.link}
                  className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pl-3 pr-4 text-base font-medium text-indigo-700"
                >
                  {page.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
