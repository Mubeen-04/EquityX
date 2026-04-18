import React from "react";
import { useRealTime } from "../RealTimeContext";
import "../css/ConnectionStatus.css";

const ConnectionStatus = () => {
  const { isOnline, isConnected, mode } = useRealTime();

  if (!isOnline) {
    return (
      <div className="connection-status offline-mode">
        <span>📡</span>
        <span>Offline Mode - Using cached data</span>
      </div>
    );
  }

  return (
    <div className="connection-status online-mode">
      <span className={`status-indicator ${isConnected ? 'connected' : 'polling'}`} />
      <span>{isConnected ? "Live" : "Polling"}</span>
    </div>
  );
};

export default ConnectionStatus;
