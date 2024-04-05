import React, { useEffect, useState } from "react";
import axios from "axios";
import useTitle from "../hooks/useTitle";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const ProjectCard = ({ title, description, link }) => (
  <div className="bg-white p-6 rounded-lg shadow-md transform transition duration-500 ease-in-out min-h-max hover:scale-105">
    <div className="mt-4">
      <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
      >
        View Project
      </a>
    </div>
  </div>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ field: "name", direction: "asc" });
  const projectsPerPage = 6;

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

  const sortedProjects = [...projects].sort((a, b) => {
    const isAsc = sort.direction === "asc";
    return (
      a[sort.field].localeCompare(b[sort.field], "en", { numeric: true }) *
      (isAsc ? 1 : -1)
    );
  });

  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(projects.length / projectsPerPage); i++) {
    pageNumbers.push(i);
  }

  const handleSort = (field) => {
    setSort((prevSort) => ({
      field,
      direction:
        prevSort.field === field
          ? prevSort.direction === "asc"
            ? "desc"
            : "asc"
          : "asc",
    }));
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  useTitle("Projects");

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          My Projects
        </h1>
        <div>
          <div className="flex flex-col md:flex-row md:justify-between justify-start items-center mb-4">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <span className="text-sm font-medium text-gray-700">
                Sort by:
              </span>
              <button
                className="flex items-center space-x-1 px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => handleSort("name")}
              >
                <span className="text-gray-700">
                  {sort.field === "name"
                    ? sort.direction === "asc"
                      ? "Name ▲"
                      : "Name ▼"
                    : "Name"}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400 ${
                    sort.field === "name" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                className="flex items-center space-x-1 px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => handleSort("created_at")}
              >
                <span className="text-gray-700">
                  {sort.field === "created_at"
                    ? sort.direction === "asc"
                      ? "Created ▲"
                      : "Created ▼"
                    : "Created"}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400 ${
                    sort.field === "created_at" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <button
                className="flex items-center space-x-1 px-3 py-2 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onClick={() => handleSort("updated_at")}
              >
                <span className="text-gray-700">
                  {sort.field === "updated_at"
                    ? sort.direction === "asc"
                      ? "Updated ▲"
                      : "Updated ▼"
                    : "Updated"}
                </span>
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400 ${
                    sort.field === "updated_at" ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  handlePageChange(
                    currentPage > 1 ? currentPage - 1 : currentPage
                  )
                }
                disabled={currentPage === 1}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Previous
              </button>
              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                    currentPage === number ? "bg-indigo-600" : "bg-indigo-400"
                  } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {number}
                </button>
              ))}
              <button
                onClick={() =>
                  handlePageChange(
                    currentPage < Math.ceil(projects.length / projectsPerPage)
                      ? currentPage + 1
                      : currentPage
                  )
                }
                disabled={
                  currentPage === Math.ceil(projects.length / projectsPerPage)
                }
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Next
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentProjects.map((project) => (
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
    </div>
  );
};

export default Projects;
