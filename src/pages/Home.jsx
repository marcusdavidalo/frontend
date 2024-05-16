import React from "react";
import { Link } from "react-router-dom";
import Me from "../assets/home/Me.png";
import useTitle from "../hooks/useTitle";
import reldocs from "../assets/home/documents.rar";

function Container({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col justify-center mb-12">
      <img
        src={Me}
        alt="Marcus David Alo"
        className="w-40 h-40 mx-auto rounded-full object-cover bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 m-4 shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105"
      />
      <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-200 sm:text-5xl md:text-6xl mb-2 text-center">
        Marcus David Alo
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-8">
        I am an enthusiastic beginner web developer with a solid grasp of
        JavaScript, React, and modern web technologies. I'm passionate about
        continuously expanding my skills in web development.
      </p>
    </div>
  );
}

function Section({ title, description, link, linkText, isExternal, onClick }) {
  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-300 dark:border-gray-800 p-6 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-200 mb-2">
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
}

function Home() {
  useTitle("Home");

  return (
    <Container>
      <Hero />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-8 mb-12">
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
    </Container>
  );
}

export default Home;
