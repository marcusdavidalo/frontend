import React from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
  return (
    <div className="transition-all ease-linear h-screen">
      <Layout>
        <Loader />
        <AllRoutes />
      </Layout>
    </div>
  );
}

export default App;
