import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getMarketPrices, getIndices } from "../../api";
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

const TickerTape = ({ marketData }) => {
  const doubled = marketData.length > 0 ? [...marketData, ...marketData] : [];

  return (
    <div className="ticker-tape">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span className="ticker-item" key={i}>
            <span className="sym">{item.sym}</span>
            <span>₹{typeof item.price === "number" ? item.price.toFixed(2) : item.price}</span>
            <span className={item.up ? "up" : "dn"}>{item.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const ChartPanel = ({ niftyData, priceHistory, timeLabels }) => {
  const price = niftyData.price || "Loading...";
  const percent = niftyData.percent || "+0.00%";
  const isPositive = !niftyData.isDown;

  return (
    <div className="hero-panel">
      <div className="panel-header">
        <div>
          <div className="panel-title">NIFTY 50 — NSE:NIFTY</div>
          <div className="panel-price">{typeof price === "number" ? price.toFixed(2) : price}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div 
            className="panel-change"
            style={{
              color: isPositive ? "#00e676" : "#ff5252",
              backgroundColor: isPositive ? "rgba(0, 230, 118, 0.15)" : "rgba(255, 82, 82, 0.15)",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "14px",
              fontWeight: "600",
              display: "inline-block",
              border: `1px solid ${isPositive ? "rgba(0, 230, 118, 0.3)" : "rgba(255, 82, 82, 0.3)"}`
            }}
          >
            {!isPositive ? "▼" : "▲"} {percent}
          </div>
          <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
            LIVE · NSE
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ position: "relative", height: "200px", padding: "0 20px 20px 20px", overflow: "hidden" }}>
        <Line
          data={{
            labels: timeLabels,
            datasets: [
              {
                label: "NIFTY 50",
                data: priceHistory,
                borderColor: isPositive ? "#00e676" : "#ff5252",
                backgroundColor: isPositive ? "rgba(0, 230, 118, 0.12)" : "rgba(255, 82, 82, 0.12)",
                borderWidth: 2.5,
                fill: true,
                tension: 0.4,
                clip: true,
                pointRadius: 0,
                pointHoverRadius: 7,
                pointBorderWidth: 0,
                pointBackgroundColor: isPositive ? "#00e676" : "#ff5252",
              },
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: {
              duration: 500,
              easing: 'easeInOutQuart',
            },
            transitions: {
              active: {
                animation: {
                  duration: 400,
                }
              }
            },
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
                min: priceHistory.length > 0
                  ? Math.min(...priceHistory) * 0.9995
                  : (niftyData.low ? niftyData.low * 0.998 : undefined),
                max: priceHistory.length > 0
                  ? Math.max(...priceHistory) * 1.0005
                  : (niftyData.high ? niftyData.high * 1.002 : undefined),
                ticks: {
                  callback: function (value) {
                    return "₹" + value.toFixed(0);
                  },
                  color: "#999",
                  font: { size: 11 },
                  maxTicksLimit: 4,
                },
                grid: { color: "#f5f5f5", drawBorder: false },
              },
              x: {
                grid: { display: false, drawBorder: false },
                ticks: {
                  color: "#999",
                  font: { size: 10 },
                  maxRotation: 0,
                },
              },
            },
          }}
        />
      </div>

      <div className="mini-stats">
        <div className="mini-stat">
          <div className="mini-stat-label">OPEN</div>
          <div className="mini-stat-val">{typeof niftyData.openPrice === "number" ? niftyData.openPrice.toFixed(2) : niftyData.openPrice || "—"}</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-label">HIGH</div>
          <div className="mini-stat-val up">{typeof niftyData.high === "number" ? niftyData.high.toFixed(2) : "—"}</div>
        </div>
        <div className="mini-stat">
          <div className="mini-stat-label">52W LOW</div>
          <div className="mini-stat-val dn">{typeof niftyData.low === "number" ? niftyData.low.toFixed(2) : "—"}</div>
        </div>
      </div>
    </div>
  );
};

function Hero() {
  const [marketData, setMarketData] = useState([]);
  const [niftyData, setNiftyData] = useState({ price: 0, percent: "+0.00%", isDown: false, openPrice: 0, high: 0, low: 0 });
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const updateIntervalRef = useRef(null);

  useEffect(() => {
    // Initial fetch
    fetchLiveData();
    
    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    
    // Refresh data every 5 seconds
    const interval = setInterval(fetchLiveData, 5000);
    
    return () => clearInterval(interval);
  }, []);

  // Initialize historical price data for NIFTY 50 (same logic as Analytics)
  useEffect(() => {
    if (niftyData.price === 0) return;

    // Clear any existing interval
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }

    const historicalPrices = [];
    const historicalLabels = [];
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(9, 0, 0, 0); // 9 AM
    
    // If current time is before 9 AM, start from yesterday's 9 AM
    if (now < startOfDay) {
      startOfDay.setDate(startOfDay.getDate() - 1);
    }
    
    const openPrice = niftyData.openPrice || niftyData.price;
    const currentNiftyPrice = niftyData.price;
    const timeInterval = (now.getTime() - startOfDay.getTime()) / 60000; // minutes passed
    const totalPoints = Math.min(Math.ceil(timeInterval), 400);
    
    // Build smooth price path from opening to current
    let currentPrice = openPrice;
    for (let i = 0; i <= totalPoints && i < 400; i++) {
      // Smooth interpolation: gradually move from open to current
      const progress = totalPoints > 0 ? i / totalPoints : 0;
      const interpolatedPrice = openPrice + (currentNiftyPrice - openPrice) * progress;
      
      // Add realistic micro-variation (±0.05%) — tiny noise around the trend
      const changePercent = (Math.random() - 0.5) * 0.1;
      currentPrice = interpolatedPrice * (1 + changePercent / 100);
      
      historicalPrices.push(currentPrice);
      const time = new Date(startOfDay.getTime() + (i / totalPoints) * timeInterval * 60000);
      historicalLabels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }
    
    // Ensure last point is current price
    if (historicalPrices.length > 0) {
      historicalPrices[historicalPrices.length - 1] = currentNiftyPrice;
    }
    
    setPriceHistory(historicalPrices);
    setTimeLabels(historicalLabels);

    // Update price every 2 seconds with new data - realistic variation
    updateIntervalRef.current = setInterval(() => {
      setPriceHistory((prev) => {
        if (prev.length === 0) return prev;
        const lastPrice = prev[prev.length - 1];
        const changePercent = (Math.random() - 0.5) * 0.12; // ±0.06% per tick — realistic
        const newPrice = lastPrice * (1 + changePercent / 100);
        return [...prev, newPrice].slice(-400); // Keep last 400 points
      });

      setTimeLabels((prev) => {
        const updated = [...prev, new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })].slice(-400);
        return updated;
      });
    }, 2000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [niftyData.price]);

  const fetchLiveData = async () => {
    try {
      // Fetch market prices
      const marketRes = await getMarketPrices();
      const marketPrices = marketRes.data || {};
      
      // Create market items from top movers (first 10 stocks)
      const marketItems = Object.entries(marketPrices)
        .slice(0, 10)
        .map(([sym, data]) => ({
          sym,
          price: data.price,
          chg: data.percent,
          up: !data.isDown,
        }));
      setMarketData(marketItems);

      // Fetch indices
      const indicesRes = await getIndices();
      const indices = indicesRes.data || {};
      if (indices.NIFTY50) {
        const nifty = indices.NIFTY50;
        const percentValue = typeof nifty.percent === "number" 
          ? nifty.percent 
          : parseFloat(nifty.percent || 0);
        
        setNiftyData({
          price: nifty.price || nifty.current,
          openPrice: nifty.openPrice || nifty.open,
          high: nifty.high,
          low: nifty.low,
          percent: (percentValue >= 0 ? "+" : "") + percentValue + "%",
          isDown: percentValue < 0
        });
      }
    } catch (err) {
      console.error("Error fetching live data:", err);
    }
  };

  return (
    <>
      <TickerTape marketData={marketData} />

      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center" style={{ gap: "2rem 0" }}>
            {/* Left */}
            <div className="col-lg-6">
              <div className="hero-eyebrow">
                India's Most Trusted Trading Platform
              </div>

              <h1 className="hero-title">
                Trade <span className="accent-bull">Smarter</span><br />
                Grow <span className="accent-blue">Faster</span>
              </h1>

              <p className="hero-subtitle">
                Real-time data, institutional-grade analytics, and lightning-fast order execution —
                all in one professional platform built for serious traders.
              </p>

              <div className="hero-actions">
                {isLoggedIn ? (
                  <button 
                    className="btn btn-bull btn-lg"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      const email = localStorage.getItem("email");
                      const name = localStorage.getItem("name");
                      const userId = localStorage.getItem("userId");
                      const dashboardUrl = new URL("http://localhost:3001");
                      dashboardUrl.searchParams.set("token", token);
                      dashboardUrl.searchParams.set("email", email);
                      dashboardUrl.searchParams.set("name", name);
                      dashboardUrl.searchParams.set("userId", userId);
                      window.location.href = dashboardUrl.toString();
                    }}
                  >
                    Go to Dashboard →
                  </button>
                ) : (
                  <Link to="/signup" className="btn btn-bull btn-lg">
                    Start Trading Free →
                  </Link>
                )}
                <Link to="/product" className="btn btn-outline btn-lg">
                  Explore Features
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="col-lg-6">
              <ChartPanel niftyData={niftyData} priceHistory={priceHistory} timeLabels={timeLabels} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;