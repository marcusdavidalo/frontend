import React, { useState } from "react";
import useTitle from "../hooks/useTitle";

const Contact = () => {
  useTitle("Contacts");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    setIsSubmitting(true);
  };

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900  min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-200 mb-8">
          Contact Me
        </h1>
        <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-6 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out ">
          <form
            action="https://api.web3forms.com/submit"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input
              type="hidden"
              name="access_key"
              value={process.env.REACT_APP_WEB3FORMS}
            />
            <div className="flex w-full justify-evenly gap-2">
              <div className="mb-4 w-full">
                <label
                  htmlFor="name"
                  className="block text-zinc-700 dark:text-zinc-300 font-bold mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="bg-white dark:bg-zinc-800 shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-300 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="email"
                  className="block text-zinc-700 dark:text-zinc-300 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="bg-white dark:bg-zinc-800 shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-300 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-zinc-700 dark:text-zinc-300 font-bold mb-2"
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                className="bg-white dark:bg-zinc-800 shadow appearance-none border rounded w-full py-2 px-3 text-zinc-700 dark:text-zinc-300 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter your message"
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
