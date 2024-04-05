import React, { useEffect, useState } from "react";
import axios from "axios";

const ProjectCard = ({ title, description, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 ease-in-out min-h-max hover:scale-105">
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <a
        href={link}
        className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        View Project
      </a>
    </div>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    axios
      .get("https://api.github.com/users/marcusdavidalo/repos")
      .then((response) => {
        setProjects(response.data);
      })
      .catch((error) => {
        console.error("Error fetching repos", error);
      });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          My Projects
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              link={project.html_url}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;
