import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Loader from "../components/reusable/Loader";

// Lazy loading pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const Projects = lazy(() => import("../pages/Projects"));
const NotFound = lazy(() => import("../pages/NotFound"));
const Arda = lazy(() => import("../pages/Arda"));

export const AllRoutes = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/arda" element={<Arda />} />
        <Route path="/projects" element={<Projects />}>
          <Route path=":projectName" element={<Projects />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};
