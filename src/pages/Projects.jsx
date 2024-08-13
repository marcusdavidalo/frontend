import React, { useEffect, useState } from "react";
import axios from "axios";
import useTitle from "../hooks/useTitle";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/24/solid";

// Helper function to get data from localStorage
const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  if (data) {
    const parsedData = JSON.parse(data);
    if (new Date().getTime() < parsedData.expiry) {
      return parsedData.data;
    }
  }
  return null;
};

// Helper function to set data to localStorage
const setToLocalStorage = (key, data, ttl) => {
  const expiry = new Date().getTime() + ttl;
  localStorage.setItem(key, JSON.stringify({ data, expiry }));
};

// Fetch repository details
const fetchRepositoryDetails = async (repoFullName) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoFullName}`,
      {
        headers: {
          Authorization: `token ${process.env.REACT_APP_GITHUB_KEY}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error(`Error fetching repo details for ${repoFullName}`, error);
    return null;
  }
};

// Fetch commits for a repository
const fetchCommits = async (repoFullName) => {
  try {
    const { data } = await axios.get(
      `https://api.github.com/repos/${repoFullName}/commits`,
      {
        headers: {
          Authorization: `token ${process.env.REACT_APP_GITHUB_KEY}`,
        },
      }
    );
    return data.map((commit) => ({
      ...commit,
      stats: commit.stats || { additions: 0, deletions: 0, changes: 0 },
    }));
  } catch (error) {
    console.error(`Error fetching commits for ${repoFullName}`, error);
    return [];
  }
};

const ProjectCard = ({ title, description, link, repoFullName }) => {
  const [commits, setCommits] = useState([]);
  const [latestCommitStats, setLatestCommitStats] = useState({
    additions: "N/A",
    deletions: "N/A",
    changes: "N/A",
  });

  useEffect(() => {
    const fetchAndSetData = async () => {
      const cacheKey = `commits_${repoFullName}`;
      const cachedData = getFromLocalStorage(cacheKey);

      if (cachedData) {
        setCommits(cachedData);
        if (cachedData.length > 0) {
          const latestCommit = cachedData[0];
          setLatestCommitStats(latestCommit.stats);
        }
      } else {
        const commitsData = await fetchCommits(repoFullName);
        setCommits(commitsData);
        setToLocalStorage(cacheKey, commitsData, 5 * 24 * 60 * 60 * 1000); // Cache for 5 days
        if (commitsData.length > 0) {
          const latestCommit = commitsData[0];
          setLatestCommitStats(latestCommit.stats);
        }
      }
    };

    fetchAndSetData();
  }, [repoFullName]);

  const hasCommits = commits.length > 0;

  return (
    <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 p-6 rounded-lg shadow-md dark:shadow-black/70 transform transition duration-300 hover:scale-[1.02] flex flex-col justify-between">
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-200">
          {title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          {description
            ? description.substring(0, 100) + "..."
            : "No description available."}
        </p>
        <div>
          {hasCommits && (
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              <div className="flex items-center space-x-2">
                <PlusIcon className="w-5 h-5 text-green-600 inline" />
                <div className="font-semibold">Latest Activity:</div>
              </div>
              <div className="mt-1">
                <span className="font-semibold">Additions:</span>{" "}
                {latestCommitStats.additions}
              </div>
              <div>
                <span className="font-semibold">Deletions:</span>{" "}
                {latestCommitStats.deletions}
              </div>
              <div>
                <span className="font-semibold">Changes:</span>{" "}
                {latestCommitStats.changes}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          View Project
        </a>
      </div>
    </div>
  );
};

const SortButton = ({ field, sort, handleSort, label }) => (
  <button
    onClick={() => handleSort(field)}
    className="flex items-center space-x-1 px-3 py-2 bg-white dark:bg-zinc-950 rounded-md shadow-sm"
  >
    <span className={`text-zinc-700 dark:text-zinc-200`}>
      {sort.field === field
        ? sort.direction === "desc"
          ? `${label} ▲`
          : `${label} ▼`
        : label}
    </span>
    <ChevronDownIcon
      className={`w-5 h-5 text-zinc-400 ${
        sort.field === field ? "rotate-180" : ""
      }`}
    />
  </button>
);

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState({ field: "updated_at", direction: "asc" });
  const [searchTerm, setSearchTerm] = useState("");
  const [projectsPerPage, setProjectsPerPage] = useState(6);

  useEffect(() => {
    const fetchAndSetData = async () => {
      const cacheKey = "projects";
      const cachedData = getFromLocalStorage(cacheKey);

      if (cachedData) {
        setProjects(cachedData);
      } else {
        try {
          const { data } = await axios.get(
            "https://api.github.com/users/marcusdavidalo/repos"
          );
          const detailedRepos = await Promise.all(
            data.map(async (repo) => {
              const details = await fetchRepositoryDetails(
                `${repo.owner.login}/${repo.name}`
              );
              return { ...repo, ...details };
            })
          );
          setProjects(detailedRepos);
          setToLocalStorage(cacheKey, detailedRepos, 5 * 24 * 60 * 60 * 1000); // Cache for 5 days
        } catch (error) {
          console.error("Error fetching repos", error);
        }
      }
    };

    fetchAndSetData();
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (!project.name && !project.description) return false;
    return (
      (project.name &&
        project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (project.description &&
        project.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
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
  for (
    let i = 1;
    i <= Math.ceil(sortedProjects.length / projectsPerPage);
    i++
  ) {
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

  const handleProjectsPerPageChange = (e) =>
    setProjectsPerPage(Number(e.target.value));

  useTitle("Projects");

  return (
    <div className="bg-zinc-100 dark:bg-zinc-900 min-h-screen">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-200 mb-8">
          My Projects
        </h1>
        <div className="flex flex-col md:flex-row md:justify-between items-center mb-6">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <SortButton
              field="name"
              sort={sort}
              handleSort={handleSort}
              label="Name"
            />
            <SortButton
              field="created_at"
              sort={sort}
              handleSort={handleSort}
              label="Created"
            />
            <SortButton
              field="updated_at"
              sort={sort}
              handleSort={handleSort}
              label="Updated"
            />
          </div>
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-zinc-700 dark:text-zinc-200">
                Total projects:
              </span>
              <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {projects.length}
              </span>
            </div>
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search projects"
              className="px-3 py-2 bg-white dark:bg-zinc-950 dark:text-zinc-200 rounded-md shadow-sm"
            />
            <select
              value={projectsPerPage}
              onChange={handleProjectsPerPageChange}
              className="px-3 py-2 bg-white dark:bg-zinc-950 dark:text-zinc-200 rounded-md shadow-sm"
            >
              <option value={3}>3 per page</option>
              <option value={6}>6 per page</option>
              <option value={9}>9 per page</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentProjects.map((project) => (
            <ProjectCard
              key={project.id}
              title={project.name}
              description={project.description}
              link={project.html_url}
              repoFullName={`${project.owner.login}/${project.name}`}
            />
          ))}
        </div>
        <div className="flex justify-center mt-8">
          <nav className="flex space-x-2">
            <button
              onClick={() =>
                handlePageChange(
                  currentPage > 1 ? currentPage - 1 : currentPage
                )
              }
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => handlePageChange(number)}
                className={`px-4 py-2 text-sm font-medium rounded-md shadow-sm transition ${
                  currentPage === number
                    ? "bg-indigo-600 text-white"
                    : "bg-zinc-300 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200"
                } hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() =>
                handlePageChange(
                  currentPage <
                    Math.ceil(sortedProjects.length / projectsPerPage)
                    ? currentPage + 1
                    : currentPage
                )
              }
              disabled={
                currentPage ===
                Math.ceil(sortedProjects.length / projectsPerPage)
              }
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Projects;
