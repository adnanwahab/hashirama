import React from "react";
import ReactDOM from "react-dom/client";
import App from "../views/odyssey/robotics-odyssey.tsx";
import { StrictMode } from "react";
import "../public/css/output.css";

console.log("main.js");

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
