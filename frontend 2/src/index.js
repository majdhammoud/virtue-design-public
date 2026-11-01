// Import React dependencies for building and rendering components
import React from "react";
import ReactDOM from "react-dom/client";

// Import global stylesheets
import './App.css';
import './index.css';

// Import BrowserRouter for client-side routing and main App component
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Get the root DOM node where the app will mount
const root = ReactDOM.createRoot(document.getElementById("root"));

/**
 * Render the application to the DOM.
 * - Wraps the App component with BrowserRouter to enable React Router v6 navigation.
 * - This is the entry point of the React app.
 */
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
