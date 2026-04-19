import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./css/Global.css";
import "./index.css";
import Home from "./components/Home";
import RealTimeProvider from "./RealTimeContext";
import { FavoritesProvider } from "./FavoritesContext";
import { SnackbarProvider } from "./SnackbarContext";

// Extract and store auth data from URL query parameters
const params = new URLSearchParams(window.location.search);
const token = params.get("token");
const email = params.get("email");
const name = params.get("name");
const userId = params.get("userId");

// If token is in URL, store it in localStorage (for dashboard's own localStorage)
if (token) {
  console.log("📝 Storing auth data from URL parameters into dashboard localStorage...");
  localStorage.setItem("token", token);
  localStorage.setItem("email", email);
  localStorage.setItem("name", name);
  localStorage.setItem("userId", userId);
  
  // Clean up URL - remove query parameters and replace history
  window.history.replaceState({}, document.title, window.location.pathname);
  console.log("Auth data stored and URL cleaned");
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SnackbarProvider>
      <RealTimeProvider>
        <FavoritesProvider>
          <BrowserRouter basename="/dashboard">
            <Routes>
              <Route path="/*" element={<Home />} />
            </Routes>
          </BrowserRouter>
        </FavoritesProvider>
      </RealTimeProvider>
    </SnackbarProvider>
  </React.StrictMode>
);
