import React, { useEffect, useState } from "react";
import "../css/Debug.css";

const Debug = () => {
  const [info, setInfo] = useState({});

  useEffect(() => {
    const debugInfo = {
      token: localStorage.getItem("token") ? "Present" : "Missing",
      email: localStorage.getItem("email") || "Not found",
      name: localStorage.getItem("name") || "Not found",
      userId: localStorage.getItem("userId") || "Not found",
      url: window.location.href,
      timestamp: new Date().toLocaleString(),
    };
    setInfo(debugInfo);
  }, []);

  return (
    <div className="debug-container">
      <h2>🔍 Dashboard Debug Info</h2>
      <hr />
      <p>
        <strong>Token:</strong> {info.token}
      </p>
      <p>
        <strong>Email:</strong> {info.email}
      </p>
      <p>
        <strong>Name:</strong> {info.name}
      </p>
      <p>
        <strong>User ID:</strong> {info.userId}
      </p>
      <p>
        <strong>Current URL:</strong> {info.url}
      </p>
      <p>
        <strong>Time:</strong> {info.timestamp}
      </p>
      <hr />
      {localStorage.getItem("token") ? (
        <div className="debug-status authenticated">
          <strong>Authentication Status: Authenticated</strong>
          <p>Dashboard should be loading...</p>
          <p>Check the browser console for more details (F12 → Console tab)</p>
        </div>
      ) : (
        <div className="debug-status not-authenticated">
          <strong>Authentication Status: NOT Authenticated</strong>
          <p>Token is missing. You should be redirected to login.</p>
          <p>
            If you're seeing this, there might be an issue with localStorage or
            the redirect.
          </p>
        </div>
      )}
    </div>
  );
};

export default Debug;
