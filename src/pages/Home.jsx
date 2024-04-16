import React from "react";
import { Link } from "react-router-dom";
import Me from "../assets/home/Me.png";
import useTitle from "../hooks/useTitle";
import reldocs from "../assets/home/documents.rar";

const Section = ({
  title,
  description,
  link,
  linkText,
  onClick,
  isExternal,
}) => (
  <div className="bg-white dark:bg-gray-950 border-b-4 border-r-4 border-gray-300 dark:border-gray-800 p-6 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105">
    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-2">
      {title}
    </h2>
    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
      {description}
    </p>
    {isExternal ? (
      <a
        href={link}
        onClick={onClick}
        download
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {linkText}
      </a>
    ) : (
      <Link
        to={link}
        className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        {linkText}
      </Link>
    )}
  </div>
);

const Home = () => {
  useTitle("Home");

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img
            src={Me}
            alt="Marcus David Alo"
            className="mx-auto h-32 w-32 rounded-full"
          />{" "}
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200 sm:text-5xl md:text-6xl">
            Marcus David Alo
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-xl text-gray-600 dark:text-gray-400">
            I am an enthusiastic beginner web developer with a solid grasp of
            JavaScript, React, and modern web technologies. I'm passionate about
            continuously expanding my skills in web development.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section
            title="About Me"
            description="Learn more about my background, skills, and experience as a web developer."
            link="/about"
            linkText="Read More"
          />

          <Section
            title="My Projects"
            description="Explore the projects I've worked on, showcasing my skills and problem-solving abilities."
            link="/projects"
            linkText="View Projects"
          />

          <Section
            title="Contact Me"
            description="Get in touch with me for potential collaborations, job opportunities, or general inquiries."
            link="/contact"
            linkText="Contact"
          />

          <Section
            title="Relevant Documents"
            description="Click the button below to download a zip file of relevant documents."
            link={reldocs}
            linkText="Download Documents"
            isExternal={true}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
