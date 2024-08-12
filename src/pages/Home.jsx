import React from "react";
import { Link } from "react-router-dom";
import Me from "../assets/home/Me.png";
import useTitle from "../hooks/useTitle";
import cv from "../assets/home/documents/CV.pdf";
import resume from "../assets/home/documents/Resume.pdf";
import certificate from "../assets/home/documents/Certificate.pdf";

function Container({ children }) {
  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-zinc-900 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col justify-center items-center mb-16">
      <img
        src={Me}
        alt="Marcus David Alo"
        className="w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-full object-cover bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 shadow-lg dark:shadow-black/70 transform transition duration-500 hover:scale-105"
      />
      <h1 className="mt-8 text-3xl sm:text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-200 text-center">
        Marcus David Alo
      </h1>
      <p className="mt-4 text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 text-center max-w-lg md:max-w-2xl">
        Enthusiastic web developer with a solid grasp of JavaScript, React, and
        modern web technologies. I’m driven by a passion for continuous learning
        and growth in the tech industry.
      </p>
    </div>
  );
}

function Section({ title, description, link, linkText, isExternal, download }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-6 rounded-xl shadow-lg dark:shadow-black/70 transform transition duration-500 hover:scale-105 flex flex-col items-center text-center h-full">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200 mb-3">
        {title}
      </h2>
      <p className="text-sm sm:text-base md:text-lg text-zinc-600 dark:text-zinc-400 mb-5 flex-grow">
        {description}
      </p>
      {isExternal ? (
        <a
          href={link}
          download={download}
          className="inline-flex items-center justify-center px-4 py-2 text-sm sm:text-base md:text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none mt-auto"
        >
          {linkText}
        </a>
      ) : (
        <Link
          to={link}
          className="inline-flex items-center justify-center px-4 py-2 text-sm sm:text-base md:text-lg font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none mt-auto"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <Section
          title="View Certificate"
          description="Click the button below to view my certificate."
          link={certificate}
          linkText="View Certificate"
          isExternal={true}
        />
        <Section
          title="View Resume"
          description="Click the button below to view my resume."
          link={resume}
          linkText="View Resume"
          isExternal={true}
        />
        <Section
          title="View CV"
          description="Click the button below to view my CV."
          link={cv}
          linkText="View CV"
          isExternal={true}
        />
      </div>
    </Container>
  );
}

export default Home;
