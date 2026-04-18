import React, { useMemo, useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useRealTime } from "../RealTimeContext";
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
import "../css/Analytics.css";

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

// Simple SVG Pie Chart Component
const PieChart = ({ sectors, total }) => {
  const colors = [
    "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
    "#FF9F40", "#FF6384", "#C9CBCF", "#4BC0C0", "#FF9F40"
  ];

  let currentAngle = 0;
  const slices = sectors.map((sector, idx) => {
    const percentage = total > 0 ? (sector.value / total) : 0;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);
    
    const largeArc = angle > 180 ? 1 : 0;
    
    currentAngle += angle;
    
    return {
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      color: colors[idx % colors.length],
      percentage: (percentage * 100).toFixed(1),
      sector: sector.name,
    };
  });

  return (
    <div className="pie-chart-container">
      <svg width="250" height="250" viewBox="0 0 100 100" className="pie-chart-svg">
        {slices.map((slice, idx) => (
          <path
            key={idx}
            d={slice.path}
            fill={slice.color}
            stroke="white"
            strokeWidth="0.5"
            opacity="0.8"
          />
        ))}
      </svg>
      <div className="pie-chart-legend">
        {slices.map((slice, idx) => (
          <div key={idx} className="pie-chart-legend-item">
            <div className="pie-chart-color-box" style={{ backgroundColor: slice.color }} />
            <span>{slice.sector}: {slice.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const Analytics = () => {
  const [searchParams] = useSearchParams();
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("1M");
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeLabels, setTimeLabels] = useState([]);
  const { marketPrices, holdings: contextHoldings } = useRealTime();
  const updateIntervalRef = useRef(null);

  // Use real holdings from context, fallback to empty array if not available
  const holdings = contextHoldings && contextHoldings.length > 0 ? contextHoldings : [];

  // Initialize historical price data for selected stock
  useEffect(() => {
    if (!selectedStock || !holdings) return;

    const stock = holdings.find((h) => h.name === selectedStock);
    if (!stock) return;

    const historicalPrices = [];
    const historicalLabels = [];
    
    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(9, 0, 0, 0); // 9 AM
    
    // If current time is before 9 AM, start from yesterday's 9 AM
    if (now < startOfDay) {
      startOfDay.setDate(startOfDay.getDate() - 1);
    }
    
    // Start with realistic price variation
    let currentPrice = stock.price * (0.95 + Math.random() * 0.1); // ±5% variation
    const timeInterval = (now.getTime() - startOfDay.getTime()) / 60000; // minutes passed
    
    // Generate 1 data point per minute from 9 AM to now
    for (let i = 0; i <= timeInterval && i < 400; i++) { // Max 400 points
      historicalPrices.push(currentPrice);
      const time = new Date(startOfDay.getTime() + i * 60000);
      historicalLabels.push(time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      
      // More realistic price movement: ±1% to +2% per minute
      const changePercent = (Math.random() - 0.4) * 3; // -0.4% to +2%
      currentPrice = currentPrice * (1 + changePercent / 100);
    }
    
    setPriceHistory(historicalPrices);
    setTimeLabels(historicalLabels);

    // Update price every 2 seconds with new data - realistic variation
    updateIntervalRef.current = setInterval(() => {
      setPriceHistory((prev) => {
        if (prev.length === 0) return prev;
        const lastPrice = prev[prev.length - 1];
        const changePercent = (Math.random() - 0.4) * 3; // -0.4% to +2%
        const newPrice = lastPrice * (1 + changePercent / 100);
        return [...prev, newPrice].slice(-400); // Keep last 400 points
      });

      setTimeLabels((prev) => {
        const updated = [...prev, new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })].slice(-400);
        return updated;
      });
    }, 2000);

    return () => {
      if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);
    };
  }, [selectedStock, holdings]);

  // Categorize stock to sector - expanded mapping
  const categorizeStockToSector = (stockName) => {
    const sectorMap = {
      // IT Sector
      "INFY": "IT",
      "TCS": "IT",
      "WIPRO": "IT",
      "KPITTECH": "IT",
      "QUICKHEAL": "IT",
      "TECHM": "IT",
      "HCLTECH": "IT",
      
      // Banking
      "HDFCBANK": "Banking",
      "SBIN": "Banking",
      "ICICIBANK": "Banking",
      "KOTAKBANK": "Banking",
      "AXISBANK": "Banking",
      
      // Energy
      "RELIANCE": "Energy",
      "ONGC": "Energy",
      "TATAPOWER": "Energy",
      "POWERGRID": "Energy",
      "ADANIGREEN": "Energy",
      "ADANIPORTS": "Energy",
      "GAIL": "Energy",
      "IOC": "Energy",
      "BPCL": "Energy",
      
      // FMCG
      "HINDUNILVR": "FMCG",
      "ITC": "FMCG",
      "NESTLEIND": "FMCG",
      "BRITANNIA": "FMCG",
      "SUNPHARMA": "FMCG",
      
      // Auto
      "M&M": "Auto",
      "MARUTI": "Auto",
      "TATAMOTORS": "Auto",
      "BAJAJMOTORS": "Auto",
      "HEROMOTOCO": "Auto",
      
      // Telecom
      "BHARTIARTL": "Telecom",
      "JIOTELECOM": "Telecom",
      "IDEA": "Telecom",
      
      // Finance
      "BAJAJFINSV": "Finance",
      "LICI": "Finance",
      "HDFCLIFE": "Finance",
      
      // Pharma
      "DRREDDY": "Pharma",
      "CIPLA": "Pharma",
      
      // Metals
      "TATASTEEL": "Metals",
      "JSWSTEEL": "Metals",
      
      // Construction
      "LARSENTOUBRO": "Construction",
      "EICHERMOT": "Construction",
      
      // Utilities
      "ASIANPAINT": "Paints",
      "COLPAL": "Consumer",
      "TATACONSUM": "Consumer",
      
      // Commodities
      "SGBMAY29": "Commodities",
      "GOLD": "Commodities",
      "COAL INDIA": "Commodities",
      
      // Airlines
      "INDIGO": "Airlines",
      
      // Grasim
      "GRASIM": "Conglomerate",
    };
    return sectorMap[stockName?.toUpperCase()] || "Other";
  };

  // Individual stock analytics
  const individualStockAnalytics = useMemo(() => {
    if (!selectedStock || !holdings || holdings.length === 0) {
      return null;
    }

    const stock = holdings.find((h) => h.name === selectedStock);
    if (!stock) {
      return null;
    }

    // Use live market price if available, otherwise use holding price
    const livePrice = marketPrices[selectedStock]?.price ?? stock.price;
    
    const investment = stock.qty * stock.avg;
    const currentValue = stock.qty * livePrice;
    const pl = currentValue - investment;
    const plPercent = investment > 0 ? ((pl / investment) * 100).toFixed(2) : 0;

    return {
      name: stock.name,
      quantity: stock.qty,
      avgPrice: stock.avg,
      currentPrice: livePrice,
      investment,
      currentValue,
      pl,
      plPercent,
      sector: categorizeStockToSector(stock.name),
      dayChange: stock.day || "N/A",
    };
  }, [selectedStock, holdings, marketPrices]);

  // Calculate portfolio metrics and sector breakdown
  const portfolioAnalytics = useMemo(() => {
    if (!holdings || holdings.length === 0) {
      return {
        totalInvestment: 0,
        totalValue: 0,
        totalPL: 0,
        plPercent: 0,
        sectors: [],
        topGainers: [],
        topLosers: [],
      };
    }

    let totalInv = 0;
    let totalVal = 0;
    const sectorMap = {};

    holdings.forEach((holding) => {
      // Use live market price if available, otherwise use holding price
      const livePrice = marketPrices[holding.name]?.price ?? holding.price;
      
      const investment = holding.qty * holding.avg;
      const currentValue = holding.qty * livePrice;
      const pl = currentValue - investment;

      totalInv += investment;
      totalVal += currentValue;

      // Sector categorization (simple logic)
      let sector = categorizeStockToSector(holding.name);
      if (!sectorMap[sector]) {
        sectorMap[sector] = {
          name: sector,
          value: 0,
          count: 0,
          pl: 0,
        };
      }
      sectorMap[sector].value += currentValue;
      sectorMap[sector].count += 1;
      sectorMap[sector].pl += pl;
    });

    const totalPL = totalVal - totalInv;
    const plPercent = totalInv > 0 ? ((totalPL / totalInv) * 100).toFixed(2) : 0;

    // Sort sectors by value
    const sectors = Object.values(sectorMap).sort((a, b) => b.value - a.value);

    // Get top gainers and losers - use live prices
    const sorted = holdings
      .map((h) => {
        const livePrice = marketPrices[h.name]?.price ?? h.price;
        return {
          name: h.name,
          pl: h.qty * livePrice - h.qty * h.avg,
          plPercent: ((livePrice - h.avg) / h.avg * 100).toFixed(2),
          price: livePrice,
        };
      })
      .sort((a, b) => b.pl - a.pl);

    // Separate gainers (positive) and losers (negative)
    const topGainers = sorted.filter(item => item.pl > 0).slice(0, 3);
    const topLosers = sorted.filter(item => item.pl < 0).slice(0, 3).reverse();

    return {
      totalInvestment: totalInv,
      totalValue: totalVal,
      totalPL,
      plPercent,
      sectors,
      topGainers,
      topLosers,
    };
  }, [holdings, marketPrices]);

  const formatCurrency = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + "M";
    if (num >= 1000) return (num / 1000).toFixed(2) + "K";
    return num.toFixed(2);
  };

  // Individual Stock View
  if (selectedStock && individualStockAnalytics) {
    const stock = individualStockAnalytics;
    const percentage = ((stock.currentValue / portfolioAnalytics.totalValue) * 100).toFixed(1);

    return (
      <div className="analytics-container">
        <div className="analytics-header">
          <h2>{stock.name} Analytics</h2>
          <a href="/analytics" className="analytics-back-link">
            ← Back to Portfolio
          </a>
        </div>

        {/* Price Chart - Groww Style */}
        {priceHistory.length > 0 && (
          <div className="analytics-chart-container">
            {/* Header with Price */}
            <div className="analytics-chart-header">
              <div className="analytics-price-section">
                <div>
                  <div className="analytics-price">
                    ₹{priceHistory[priceHistory.length - 1].toFixed(2)}
                  </div>
                  {priceHistory.length > 1 && (
                    <div className={`analytics-price-change ${priceHistory[priceHistory.length - 1] >= priceHistory[0] ? 'positive' : 'negative'}`}>
                      {priceHistory[priceHistory.length - 1] >= priceHistory[0] ? "↑" : "↓"} {Math.abs(priceHistory[priceHistory.length - 1] - priceHistory[0]).toFixed(2)} ({((priceHistory[priceHistory.length - 1] - priceHistory[0]) / priceHistory[0] * 100).toFixed(2)}%)
                    </div>
                  )}
                </div>
                <div>
                  <div className="analytics-time-label">
                    {timeLabels[timeLabels.length - 1]}
                  </div>
                </div>
              </div>

              {/* Period Buttons */}
              <div className="analytics-period-buttons">
                {["1M", "6M", "1Yr", "3Yr", "5Yr", "10Yr", "Max"].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`period-btn ${selectedPeriod === period ? 'active' : ''}`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart */}
            <div className="analytics-chart">
              <Line 
                data={{
                  labels: timeLabels,
                  datasets: [
                    {
                      label: `${stock.name}`,
                      data: priceHistory,
                      borderColor: stock.pl >= 0 ? "#4CAF50" : "#f44336",
                      backgroundColor: stock.pl >= 0 ? "rgba(76, 175, 80, 0.04)" : "rgba(244, 67, 54, 0.04)",
                      borderWidth: 2.5,
                      fill: true,
                      tension: 0.4,
                      pointRadius: 0,
                      pointHoverRadius: 7,
                      pointBorderWidth: 0,
                      pointBackgroundColor: stock.pl >= 0 ? "#4CAF50" : "#f44336",
                    },
                  ]
                }}
                options={{
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
                        maxRotation: 0,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Key Metrics */}
        <div className="analytics-metrics">
          <MetricCard label="Avg Price" value={`₹${stock.avgPrice.toFixed(2)}`} color="#007bff" />
          <MetricCard label="Current Price" value={`₹${stock.currentPrice.toFixed(2)}`} color="#28a745" />
          <MetricCard label="Quantity" value={stock.quantity} color="#6c757d" />
          <MetricCard
            label="Day Change"
            value={stock.dayChange}
            color={stock.dayChange.includes("-") ? "#dc3545" : "#28a745"}
          />
        </div>

        {/* Investment Summary */}
        <div className="analytics-metrics">
          <MetricCard label="Investment" value={`₹${formatCurrency(stock.investment)}`} color="#007bff" />
          <MetricCard label="Current Value" value={`₹${formatCurrency(stock.currentValue)}`} color="#28a745" />
          <MetricCard label="P&L" value={`₹${formatCurrency(stock.pl)}`} color={stock.pl >= 0 ? "#28a745" : "#dc3545"} />
          <MetricCard
            label="Return %"
            value={`${stock.plPercent}%`}
            color={stock.plPercent >= 0 ? "#28a745" : "#dc3545"}
          />
        </div>

        {/* Sector & Portfolio Position */}
        <div className="portfolio-info-grid">
          <div className="info-card">
            <h4>📂 Sector</h4>
            <div className="info-card-value">
              {stock.sector}
            </div>
            <div className="info-card-description">
              This stock belongs to the <strong>{stock.sector}</strong> sector
            </div>
          </div>

          <div className="info-card">
            <h4>Portfolio Weight</h4>
            <div className="info-card-value primary">
              {percentage}%
            </div>
            <div className="portfolio-weight-bar">
              <div
                className="portfolio-weight-bar-fill"
                style={{
                  width: `${Math.min(parseFloat(percentage), 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Universal Portfolio View
  return (
    <div className="analytics-container">
      <h2>Portfolio Analytics</h2>

      {/* Key Metrics */}
      <div className="analytics-metrics">
        <MetricCard
          label="Total Investment"
          value={`₹${formatCurrency(portfolioAnalytics.totalInvestment)}`}
          color="#007bff"
        />
        <MetricCard
          label="Current Value"
          value={`₹${formatCurrency(portfolioAnalytics.totalValue)}`}
          color="#28a745"
        />
        <MetricCard
          label="Total P&L"
          value={`₹${formatCurrency(portfolioAnalytics.totalPL)}`}
          color={portfolioAnalytics.totalPL >= 0 ? "#28a745" : "#dc3545"}
        />
        <MetricCard
          label="Return %"
          value={`${portfolioAnalytics.plPercent}%`}
          color={portfolioAnalytics.plPercent >= 0 ? "#28a745" : "#dc3545"}
        />
      </div>

      {/* Sector Breakdown with Pie Chart */}
      <div className="sector-breakdown-section">
        <h4>Sector Allocation</h4>
        {portfolioAnalytics.sectors.length > 0 && (
          <PieChart sectors={portfolioAnalytics.sectors} total={portfolioAnalytics.totalValue} />
        )}
        <div className="sector-cards-grid">
          {portfolioAnalytics.sectors.map((sector, idx) => (
            <SectorCard key={idx} sector={sector} total={portfolioAnalytics.totalValue} />
          ))}
        </div>
      </div>

      {/* Top Gainers & Losers */}
      <div className="gainers-losers-grid">
        <div className="gainers-section">
          <h4>Top Gainers</h4>
          <table className="gainers-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>P&L</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {portfolioAnalytics.topGainers.map((stock, idx) => (
                <tr key={idx}>
                  <td>{stock.name}</td>
                  <td>₹{stock.pl.toFixed(2)}</td>
                  <td className="percent">{stock.plPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="losers-section">
          <h4>Top Losers</h4>
          <table className="losers-table">
            <thead>
              <tr>
                <th>Stock</th>
                <th>P&L</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              {portfolioAnalytics.topLosers.map((stock, idx) => (
                <tr key={idx}>
                  <td>{stock.name}</td>
                  <td>₹{stock.pl.toFixed(2)}</td>
                  <td className="loss">{stock.plPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ label, value, color }) => (
  <div className="metric-card" style={{ borderColor: color }}>
    <div className="metric-card-label">{label}</div>
    <div className="metric-card-value" style={{ color }}>{value}</div>
  </div>
);

const SectorCard = ({ sector, total }) => {
  const percentage = ((sector.value / total) * 100).toFixed(1);
  return (
    <div className="sector-card">
      <div className="sector-card-header">
        <strong className="sector-card-name">{sector.name}</strong>
        <span className="sector-card-percentage">{percentage}%</span>
      </div>
      <div className="sector-card-value">
        Value: ₹{(sector.value / 1000).toFixed(2)}K ({sector.count} holdings)
      </div>
      <div className={`sector-card-pl ${sector.pl >= 0 ? 'positive' : 'negative'}`}>
        P&L: ₹{sector.pl.toFixed(2)}
      </div>
      <div className="progress-bar">
        <div
          className={`progress-bar-fill ${sector.pl >= 0 ? 'positive' : 'negative'}`}
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
};

export default Analytics;
