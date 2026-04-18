import React from "react";

import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import AuthGuard from "../AuthGuard";
import { useRealTime } from "../RealTimeContext";
import "../css/Home.css";

const DashboardContent = () => {
  const { isConnected, mode, isInitialized } = useRealTime();

  if (!isInitialized) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        fontSize: "16px",
        color: "#666"
      }}>
        <div style={{ textAlign: "center" }}>
          <p>Loading Dashboard...</p>
          <p style={{ fontSize: "12px", color: "#999" }}>Connecting to server...</p>
          <div style={{ marginTop: "20px", fontSize: "12px" }}>
            Status: {isConnected ? "Connected" : "Connecting"} ({mode})
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

const Home = () => {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
};

export default Home;
