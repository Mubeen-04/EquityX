import React, { useState, useMemo } from "react";
import { useRealTime } from "../RealTimeContext";
import AddBalanceModal from "./AddBalanceModal";
import { allAvailableStocks } from "../data/data";
import "../css/Summary.css";

const Summary = () => {
  const { holdings, isConnected, mode, balance, refreshNow, marketPrices } = useRealTime();
  const [showAddBalance, setShowAddBalance] = useState(false);

  // Calculate totals from holdings
  const calculateTotals = () => {
    let totalInvestment = 0;
    let totalCurrentValue = 0;

    if (holdings && Array.isArray(holdings)) {
      holdings.forEach((holding) => {
        const investment = holding.qty * holding.avg; // Changed from avgPrice to avg
        const currentValue = holding.qty * holding.price;
        totalInvestment += investment;
        totalCurrentValue += currentValue;
      });
    }

    return { totalInvestment, totalCurrentValue };
  };

  const { totalInvestment, totalCurrentValue } = calculateTotals();
  const pnl = totalCurrentValue - totalInvestment;
  const pnlPercent =
    totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : 0;

  // Calculate top gainers and losers from all 50 stocks
  const { topGainers, topLosers } = useMemo(() => {
    if (!marketPrices || Object.keys(marketPrices).length === 0) {
      return { topGainers: [], topLosers: [] };
    }

    const sorted = allAvailableStocks
      .map((stock) => {
        const liveData = marketPrices[stock.name];
        const percentStr = liveData?.percent ?? stock.percent;
        const percent = parseFloat(percentStr);
        
        return {
          name: stock.name,
          percent: isNaN(percent) ? 0 : percent,
          price: liveData?.price ?? stock.price,
        };
      })
      .sort((a, b) => b.percent - a.percent);

    const gainers = sorted.filter(item => item.percent > 0).slice(0, 5);
    const losers = sorted.filter(item => item.percent < 0).slice(0, 5).reverse();

    return { topGainers: gainers, topLosers: losers };
  }, [marketPrices]);

  // Equity calculations
  const totalEquity = balance + totalCurrentValue;
  const investedAmount = totalCurrentValue;

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + "k";
    }
    return num.toFixed(2);
  };

  const holdingsCount = holdings ? holdings.length : 0;
  const userName = localStorage.getItem("name") || "User";

  return (
    <>
      <div className="username">
        <h6>Hi, {userName}! 👋</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Wallet</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>₹{balance.toFixed(2)}</h3>
            <p>Available Balance</p>
            <button 
              onClick={() => setShowAddBalance(true)}
              className="add-funds-btn"
            >
              + Add Funds
            </button>
          </div>
          <hr />

        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnl >= 0 ? "profit" : "loss"}>
              {formatNumber(pnl)} <small>{pnlPercent >= 0 ? "+" : ""}{pnlPercent}%</small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value: <span>{formatNumber(totalCurrentValue)}</span>{" "}
            </p>
            <p>
              Investment: <span>{formatNumber(totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Market Top Gainers & Losers</p>
        </span>

        <div className="gainers-losers-grid">
            {/* Top Gainers */}
            <div className="gainers-table">
              <h4>Top Gainers</h4>
              {topGainers.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topGainers.map((stock, idx) => (
                      <tr key={idx}>
                        <td>{stock.name}</td>
                        <td>₹{stock.price.toFixed(2)}</td>
                        <td className="percent">+{stock.percent.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data-msg">Loading gainers...</p>
              )}
            </div>

            {/* Top Losers */}
            <div className="losers-table">
              <h4>Top Losers</h4>
              {topLosers.length > 0 ? (
                <table>
                  <thead>
                    <tr>
                      <th>Stock</th>
                      <th>Price</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topLosers.map((stock, idx) => (
                      <tr key={idx}>
                        <td>{stock.name}</td>
                        <td>₹{stock.price.toFixed(2)}</td>
                        <td className="percent">{stock.percent.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="no-data-msg">Loading losers...</p>
              )}
            </div>
          </div>
          <hr className="divider" />
        </div>

      {showAddBalance && (
        <AddBalanceModal 
          balance={balance}
          onSuccess={(newBalance) => {
            setShowAddBalance(false);
            refreshNow();
          }}
          onClose={() => setShowAddBalance(false)}
        />
      )}
    </>
  );
};

export default Summary;
