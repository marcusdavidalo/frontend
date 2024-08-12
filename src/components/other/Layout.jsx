import React from "react";
import Header from "./Header";
import Footer from "./Footer";

const Layout = ({ children, isDarkMode, toggleDarkMode }) => {
  return (
    <div>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
