import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import "../css/ShareAnalysis.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ShareAnalysis = ({ stockName, onClose }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [highPrice, setHighPrice] = useState(0);
  const [lowPrice, setLowPrice] = useState(0);
  const [changePercent, setChangePercent] = useState(0);
  const chartRef = useRef(null);
  const updateIntervalRef = useRef(null);

  // Initialize with historical data from 9 AM
  useEffect(() => {
    const historicalPrices = [];
    const historicalLabels = [];
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(9, 0, 0, 0); // 9 AM
    
    // If current time is before 9 AM, start from yesterday's 9 AM
    if (now < startOfDay) {
      startOfDay.setDate(startOfDay.getDate() - 1);
    }
    
    const startPrice = 1000 + Math.random() * 2000;
    let currentPrice = startPrice;
    const timeInterval = (now.getTime() - startOfDay.getTime()) / 60000; // minutes passed
    
    // Generate 1 data point per minute from 9 AM to now
    for (let i = 0; i <= timeInterval && i < 400; i++) {
      historicalPrices.push(currentPrice);
      const time = new Date(startOfDay.getTime() + i * 60000);
      historicalLabels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      
      // Realistic price movement: up or down (-2 to +5 per minute)
      currentPrice += (Math.random() - 0.4) * 10;
      currentPrice = Math.max(currentPrice, startPrice * 0.8); // Don't go too low
    }
    
    setPriceHistory(historicalPrices);
    setCurrentPrice(historicalPrices[historicalPrices.length - 1]);
    setHighPrice(Math.max(...historicalPrices));
    setLowPrice(Math.min(...historicalPrices));
    setTimeLabels(historicalLabels);
    
    const percentChange = ((historicalPrices[historicalPrices.length - 1] - historicalPrices[0]) / historicalPrices[0] * 100).toFixed(2);
    setChangePercent(percentChange);
  }, []);

  // Simulate real-time price updates
  useEffect(() => {
    updateIntervalRef.current = setInterval(() => {
      setPriceHistory((prev) => {
        const lastPrice = prev[prev.length - 1];
        // Realistic price movement: up or down (-3 to +3)
        const priceChange = (Math.random() - 0.5) * 6;
        const newPrice = Math.max(lastPrice + priceChange, 1);

        // Keep only last 400 data points (6+ hours)
        const updated = [...prev, newPrice].slice(-400);

        // Update current price and stats
        setCurrentPrice(newPrice);
        setHighPrice(Math.max(...updated));
        setLowPrice(Math.min(...updated));

        const percentChange = ((newPrice - updated[0]) / updated[0] * 100).toFixed(2);
        setChangePercent(percentChange);

        return updated;
      });

      setTimeLabels((prev) => {
        const updated = [...prev, new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })].slice(-400);
        return updated;
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(updateIntervalRef.current);
  }, []);

  const chartData = {
    labels: timeLabels,
    datasets: [
      {
        label: `${stockName}`,
        data: priceHistory,
        borderColor: changePercent >= 0 ? "#4CAF50" : "#f44336",
        backgroundColor: changePercent >= 0 
          ? "rgba(76, 175, 80, 0.04)" 
          : "rgba(244, 67, 54, 0.04)",
        borderWidth: 2.5,
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 7,
        pointBorderWidth: 0,
        pointBackgroundColor: changePercent >= 0 ? "#4CAF50" : "#f44336",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        padding: 10,
        titleFont: { size: 12, weight: "500" },
        bodyFont: { size: 12, weight: "600" },
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `₹${context.parsed.y.toFixed(2)}`;
          },
          title: function (context) {
            return context[0].label;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function (value) {
            return "₹" + value.toFixed(0);
          },
          color: "#999",
          font: { size: 12 },
          maxTicksLimit: 5,
        },
        grid: { color: "#f5f5f5", drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
        ticks: { 
          color: "#999", 
          font: { size: 11 },
          maxRotation: 45,
          maxTicksLimit: 12,
          callback: function (index, ticks) {
            // Show every 5th label to reduce crowding
            return index % 5 === 0 ? this.getLabelForValue(index) : '';
          },
        },
      },
    },
  };

  return (
    <div className="share-analysis-modal">
      <div className="share-analysis-content">
        {/* Header */}
        <div className="analysis-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "20px", borderBottom: "1px solid #f0f0f0" }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "28px", fontWeight: "bold", color: "#333" }}>{stockName}</h2>
            <div style={{ fontSize: "13px", color: changePercent >= 0 ? "#4CAF50" : "#f44336" }}>
              {changePercent >= 0 ? "↑" : "↓"} {Math.abs(changePercent)}%
            </div>
          </div>
          <button 
            className="close-btn" 
            onClick={onClose}
            style={{
              border: "none",
              background: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#999",
              padding: "0",
            }}
          >
            ✕
          </button>
        </div>

        {/* Price Display */}
        <div style={{ padding: "20px", borderBottom: "1px solid #f0f0f0", backgroundColor: "#f9f9f9" }}>
          <div style={{ fontSize: "36px", fontWeight: "bold", color: "#333", marginBottom: "8px" }}>
            ₹{currentPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: "12px", color: "#999" }}>
            Updated at: {timeLabels.length > 0 ? timeLabels[timeLabels.length - 1] : "-"}
          </div>
        </div>

        {/* Chart */}
        <div className="chart-container">
          <Line ref={chartRef} data={chartData} options={chartOptions} />
        </div>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", padding: "20px", borderTop: "1px solid #f0f0f0", backgroundColor: "#f9f9f9" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>HIGH</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#4CAF50" }}>₹{highPrice.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>LOW</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: "#f44336" }}>₹{lowPrice.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "11px", color: "#999", marginBottom: "4px" }}>CHANGE</div>
            <div style={{ fontSize: "14px", fontWeight: "600", color: changePercent >= 0 ? "#4CAF50" : "#f44336" }}>
              {changePercent >= 0 ? "+" : ""}{changePercent}%
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareAnalysis;
