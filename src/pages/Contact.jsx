import React, { useState } from "react";
import useTitle from "../hooks/useTitle";

const Contact = () => {
  useTitle("Contacts");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    setIsSubmitting(true);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 h-[75vh] flex items-center justify-center py-12">
      <div className="w-full max-w-3xl mx-auto p-6 lg:p-10 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl shadow-lg dark:shadow-black/70 transition-transform transform ease-in-out duration-300">
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-200 mb-10 text-center">
          Get in Touch
        </h1>
        <form
          action="https://api.web3forms.com/submit"
          method="POST"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <input
            type="hidden"
            name="access_key"
            value={process.env.REACT_APP_WEB3FORMS}
          />
          <div className="flex flex-col lg:flex-row lg:gap-6">
            <div className="flex-1">
              <label
                htmlFor="name"
                className="block text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md w-full py-3 px-4 text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter Name"
                required
              />
            </div>
            <div className="flex-1 mt-6 lg:mt-0">
              <label
                htmlFor="email"
                className="block text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md w-full py-3 px-4 text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="message"
              className="block text-zinc-700 dark:text-zinc-300 text-sm font-medium mb-2"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="6"
              className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-md w-full py-3 px-4 text-zinc-800 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Write your message here..."
              required
            ></textarea>
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
