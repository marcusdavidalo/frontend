import React from "react";
import Layout from "./components/Layout";
import Loader from "./components/Loader";
import Chatbot from "./components/Chatbot";
import { AllRoutes } from "./routes/AllRoutes";
import "./App.css";

function App() {
  return (
    <div className="transition-all ease-linear h-screen">
      <Layout>
        <Loader />
        <Chatbot />
        <AllRoutes />
      </Layout>
    </div>
  );
}

export default App;
