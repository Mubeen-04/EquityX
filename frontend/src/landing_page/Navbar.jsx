import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Check login status on mount and when storage changes
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (when logging in from another tab or context)
    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  // Also check auth status when route changes (e.g., coming back from dashboard)
  useEffect(() => {
    checkAuthStatus();
  }, [location]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem("token");
    const name = localStorage.getItem("name");
    if (token && name) {
      setIsLoggedIn(true);
      setUserName(name);
    } else {
      setIsLoggedIn(false);
      setUserName("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    setIsLoggedIn(false);
    setUserName("");
    navigate("/");
  };

  return (
    <nav className={`navbar navbar-expand-lg${scrolled ? " scrolled" : ""}`}>
      <div className="container" style={{ maxWidth: "1280px" }}>
        <Link className="navbar-brand" to="/">
          EQUITYX
          <span className="brand-live">LIVE</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0" style={{ alignItems: "center" }}>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/product">Features</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/pricing">Pricing</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/support">Support</Link>
            </li>

            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <a
                    href="/dashboard"
                    className="nav-link"
                    style={{ 
                      color: "#1976d2",
                      fontWeight: "600",
                      marginRight: "10px"
                    }}
                  >
                    📊 Dashboard
                  </a>
                </li>
                <li className="nav-item">
                  <span className="nav-link" style={{ cursor: "default", marginRight: "10px" }}>
                    👤 {userName}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-outline"
                    onClick={handleLogout}
                    style={{
                      padding: "8px 16px",
                      fontSize: "14px",
                      border: "1px solid var(--text-secondary)",
                      color: "var(--text-secondary)",
                      backgroundColor: "transparent",
                      cursor: "pointer",
                      borderRadius: "4px",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
                      e.target.style.borderColor = "#dc3545";
                      e.target.style.color = "#dc3545";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "transparent";
                      e.target.style.borderColor = "var(--text-secondary)";
                      e.target.style.color = "var(--text-secondary)";
                    }}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login" style={{ color: "var(--text-secondary)" }}>
                    Log In
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-cta" to="/signup">
                    Open Account →
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
