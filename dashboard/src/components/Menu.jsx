import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useRealTime } from "../RealTimeContext";
import "../css/Menu.css";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { mode, toggleMode } = useRealTime();

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };

  const handleProfileClick = (index) => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    window.location.href = "/";
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  const displayName = localStorage.getItem("name") || "User";

  return (
    <div className="menu-container">
      
      <div className="menu-right-section">
        <div className="menus">
          <ul>
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/"
                onClick={() => handleMenuClick(0)}
              >
                <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                  Dashboard
                </p>
              </Link>
            </li>
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/orders"
                onClick={() => handleMenuClick(1)}
              >
                <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                  Orders
                </p>
              </Link>
            </li>
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/holdings"
                onClick={() => handleMenuClick(2)}
              >
                <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                  Holdings
                </p>
              </Link>
            </li>
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/market"
                onClick={() => handleMenuClick(8)}
              >
                <p className={selectedMenu === 8 ? activeMenuClass : menuClass}>
                  Market
                </p>
              </Link>
            </li>
            <li>
              <Link
                style={{ textDecoration: "none" }}
                to="/analytics"
                onClick={() => handleMenuClick(7)}
              >
                <p className={selectedMenu === 7 ? activeMenuClass : menuClass}>
                  Analytics
                </p>
              </Link>
            </li>
          </ul>

          {/* Mode Toggle */}
          <button
            onClick={toggleMode}
            style={{
              padding: "6px 12px",
              backgroundColor: mode === "websocket" ? "#28a745" : "#17a2b8",
              color: "white",
              border: "none",
              borderRadius: "4px",
            cursor: "pointer",
            fontSize: "11px",
            fontWeight: "500",
            whiteSpace: "nowrap",
          }}
          title="Toggle between WebSocket and Polling modes"
        >
          {mode === "websocket" ? "🔴 WebSocket" : "🟡 Polling"}
        </button>
        </div>

        {/* Profile Section */}
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <div className="profile" onClick={handleProfileClick}>
            <div className="avatar">{displayName.substring(0, 1).toUpperCase()}</div>
            <p className="username">{displayName}</p>
          </div>
          {isProfileDropdownOpen && (
            <div style={{ 
              position: "absolute",
              top: "100%",
              right: "0",
              backgroundColor: "white",
              border: "1px solid #ddd",
              borderRadius: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: "10px",
            minWidth: "150px",
            marginTop: "5px",
            zIndex: "1000"
          }}>
            <button
              onClick={handleLogout}
              style={{
                width: "100%",
                padding: "10px 12px",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Logout
            </button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
