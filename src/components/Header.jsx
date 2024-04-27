import React, { useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Disclosure, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline";

const Header = ({ isDarkMode, toggleDarkMode }) => {
  const pages = [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "AI", link: "/arda" },
    { name: "Projects", link: "/projects" },
    { name: "Contact", link: "/contact" },
  ];

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Disclosure
      as="nav"
      className={`bg-white dark:bg-gray-800 shadow text-gray-700 dark:text-white ${
        isDarkMode ? "dark" : ""
      }`}
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-4 h-16 items-center">
              <div className="flex justify-center col-start-2 col-end-4 row-start-1 sm:col-start-1 sm:col-end-2 sm:justify-start">
                <div className="flex flex-shrink-0 items-center">
                  <Link
                    to="/"
                    className="text-3xl font-bold text-black dark:text-gray-200"
                  >
                    Marcus David Alo
                  </Link>
                </div>
              </div>
              <div className="hidden col-start-2 col-end-4 row-start-1 sm:ml-6 sm:col-start-2 sm:flex sm:justify-center sm:space-x-8 h-full">
                {pages.map((page) => (
                  <NavLink
                    key={page.name}
                    to={page.link}
                    className={({ isActive }) => {
                      if (page.name === "AI") {
                        return `inline-flex items-center border-b-4 transition-all duration-200 ease-in-out ${
                          isActive
                            ? "border-pink-500 text-pink-600" // custom styling for AI Link
                            : "border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                        } px-1 pt-1 text-2xl font-semibold leading-tight`;
                      } else {
                        return `inline-flex items-center border-b-4 transition-all duration-200 ease-in-out ${
                          isActive
                            ? "border-indigo-500 text-indigo-600"
                            : "border-transparent text-gray-500 dark:text-gray-200 hover:border-gray-300 dark:hover:border-gray-600 hover:text-gray-700 dark:hover:text-gray-200"
                        } px-1 pt-1 text-lg font-medium leading-tight`;
                      }
                    }}
                  >
                    {({ isActive }) =>
                      isActive && page.name === "AI" ? "Arda" : page.name
                    }
                  </NavLink>
                ))}
              </div>

              <div className="flex items-center justify-start col-start-1 sm:col-start-4 sm:justify-end">
                <button
                  onClick={toggleDarkMode}
                  className="rounded-md text-md font-medium"
                >
                  <div
                    className={`transition-transform duration-700 ease-in-out transform hover:scale-125 ${
                      isDarkMode ? "" : "rotate-180"
                    }`}
                  >
                    {isDarkMode ? (
                      <MoonIcon
                        className="block h-7 w-7 text-gray-200"
                        aria-hidden="true"
                      />
                    ) : (
                      <SunIcon
                        className="block h-8 w-8 text-gray-800"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                </button>
              </div>
              <div className="-mr-2 flex sm:hidden justify-end col-start-4">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-200 dark:bg-gray-700 p-2 text-gray-400 hover:text-gray-500">
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

          <Transition
            show={open}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-y-0"
            enterTo="opacity-100 scale-y-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-y-100"
            leaveTo="opacity-0 scale-y-0"
          >
            <Disclosure.Panel
              className={`sm:hidden ${open ? "scale-y-100" : "scale-y-0"}`}
            >
              <div className="space-y-1 pb-1">
                {pages.map((page) => (
                  <Disclosure.Button
                    key={page.name}
                    as={Link}
                    to={page.link}
                    className="block border-l-4 border-gray-900 dark:border-white bg-gray-200 dark:bg-gray-700 py-2 pl-3 pr-4 text-base font-medium text-gray-600 dark:text-gray-400"
                  >
                    {page.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
