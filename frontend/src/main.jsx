import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// ✅ IMPORT THEME (TEAM BACKGROUND)
import "./styles/theme.css";

// Tailwind + global styles
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);