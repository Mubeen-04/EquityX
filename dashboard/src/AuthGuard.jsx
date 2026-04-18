import { useEffect, useState } from "react";

function AuthGuard({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to frontend login
      console.log("No token found, redirecting to login...");
      window.location.href = "/login";
    } else {
      console.log("Token found, user authenticated");
      setIsAuthenticated(true);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "18px",
        color: "#666"
      }}>
        <div>
          <p>🔐 Authenticating...</p>
          <p style={{ fontSize: "12px", color: "#999" }}>Please wait while we verify your credentials</p>
        </div>
      </div>
    );
  }

  return isAuthenticated ? children : null;
}

export default AuthGuard;
