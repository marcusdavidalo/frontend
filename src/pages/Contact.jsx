import React from "react";
import { Formik, Field, Form } from "formik";
import useTitle from "../hooks/useTitle";

const Contact = () => {
  useTitle("Contacts");

  return (
    <div className="bg-gray-100 dark:bg-gray-900  min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200 mb-8">
          Contact Me
        </h1>
        <div className="bg-white dark:bg-gray-950 border-b-4 border-r-4 border-gray-300 dark:border-gray-800 p-8 rounded-lg shadow-md ">
          <Formik
            initialValues={{ name: "", email: "", message: "" }}
            onSubmit={(values, { setSubmitting }) => {
              fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: JSON.stringify({
                  access_key: process.env.REACT_APP_WEB3FORMS,
                  ...values,
                }),
              }).finally(() => setSubmitting(false));
            }}
          >
            <Form>
              <div className="flex w-full justify-evenly gap-2">
                <div className="mb-4 w-full">
                  <label
                    htmlFor="name"
                    className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  >
                    Name
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    className="bg-white dark:bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your name"
                    required
                  />
                </div>
                <div className="mb-4 w-full">
                  <label
                    htmlFor="email"
                    className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="bg-white dark:bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-gray-700 dark:text-gray-300 font-bold mb-2"
                >
                  Message
                </label>
                <Field
                  as="textarea"
                  id="message"
                  name="message"
                  rows="5"
                  className="bg-white dark:bg-gray-800 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter your message"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Contact;
