import React from "react";
import { Link } from "react-router-dom";
import useTitle from "../hooks/useTitle";

const NotFound = () => {
  useTitle("404 - Page Not Found");
  return (
    <div className="bg-zinc-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-9xl font-extrabold text-zinc-900">404</h1>
      <h2 className="text-4xl font-bold text-zinc-900 mt-4">
        Oops! Page not found.
      </h2>
      <p className="text-xl text-zinc-600 mt-4">
        The page you're looking for doesn't seem to exist.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        Go back to the Home page
      </Link>
      <div className="mt-16">
        <img
          src="https://via.placeholder.com/400x300"
          alt="404 Error"
          className="w-full max-w-md rounded-lg shadow-md"
        />
      </div>
    </div>
  );
};

export default NotFound;
