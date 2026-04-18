import React from "react";
import { useRealTime } from "../RealTimeContext";
import Menu from "./Menu";
import "../css/TopBar.css";

const TopBar = () => {
  const { indices } = useRealTime();

  const nifty = indices.NIFTY50 || { current: 0, percent: 0 };
  const sensex = indices.SENSEX || { current: 0, percent: 0 };

  const formatValue = (value) => {
    return typeof value === "number" ? value.toFixed(2) : value;
  };

  const getColor = (percent) => {
    const p = parseFloat(percent);
    return p >= 0 ? "#28a745" : "#dc3545";
  };

  return (
    <div className="topbar-container">
      <div className="indices-container">
        <div className="nifty">
          <p className="index">NIFTY 50</p>
          <p className="index-points" style={{ color: getColor(nifty.percent) }}>
            {formatValue(nifty.current)}
          </p>
          <p className="percent" style={{ color: getColor(nifty.percent) }}>
            {parseFloat(nifty.percent) >= 0 ? "+" : ""}{formatValue(nifty.percent)}%
          </p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points" style={{ color: getColor(sensex.percent) }}>
            {formatValue(sensex.current)}
          </p>
          <p className="percent" style={{ color: getColor(sensex.percent) }}>
            {parseFloat(sensex.percent) >= 0 ? "+" : ""}{formatValue(sensex.percent)}%
          </p>
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
