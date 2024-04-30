import React from "react";
import { Routes, Route } from "react-router-dom";
import { Home, About, Contact, Projects, NotFound, Arda } from "../pages";

export const AllRoutes = () => {
  return (
    <>
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
    </>
  );
};
