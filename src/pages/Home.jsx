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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </div>
  );
}

function Hero() {
  return (
    <div className="flex flex-col justify-center items-center mb-12">
      <img
        src={Me}
        alt="Marcus David Alo"
        className="w-40 h-40 rounded-full object-cover bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 m-4 shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105"
      />
      <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-200 sm:text-5xl md:text-6xl mb-2 text-center">
        Marcus David Alo
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 text-center mb-8 max-w-2xl">
        I am an enthusiastic beginner web developer with a solid grasp of
        JavaScript, React, and modern web technologies. I'm passionate about
        continuously expanding my skills in web development.
      </p>
    </div>
  );
}

function Section({ title, description, link, linkText, isExternal, download }) {
  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-6 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-500 ease-in-out hover:scale-105">
      <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-200 mb-2">
        {title}
      </h2>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4">
        {description}
      </p>
      {isExternal ? (
        <a
          href={link}
          download={download}
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
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
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
