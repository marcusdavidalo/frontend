import React from "react";
import { Link } from "react-router-dom";
import Me from "../assets/home/Me.png"; // Import your image

const Section = ({ title, description, link, linkText }) => (
  <div className="bg-white p-8 rounded-lg shadow-md transform transition duration-500 ease-in-out hover:scale-105">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
    <p className="text-gray-600 mb-4">{description}</p>
    <Link
      to={link}
      className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
    >
      {linkText}
    </Link>
  </div>
);

const Home = () => {
  return (
    <div className="bg-gray-100 min-h-max">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <img
            src={Me}
            alt="Marcus David Alo"
            className="mx-auto h-24 w-24 rounded-full"
          />{" "}
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            Marcus David Alo
          </h1>
          <p className="mt-4 max-w-md mx-auto text-xl text-gray-600">
            Welcome to my portfolio! I'm a passionate web developer with
            expertise in React, Tailwind CSS, and modern web technologies.
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
        </div>
      </div>
    </div>
  );
};

export default Home;
