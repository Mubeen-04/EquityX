import React, { useState, useContext, useEffect } from "react";

import { placeOrder } from "../api";
import { useRealTime } from "../RealTimeContext";
import { useSnackbar } from "../SnackbarContext";

import GeneralContext from "./GeneralContext";

import "../css/BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const generalContext = useContext(GeneralContext);
  const { refreshNow, holdings, marketPrices } = useRealTime();
  const { showSnackbar } = useSnackbar();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get live market price from real-time market prices or holdings
  useEffect(() => {
    // Priority 1: Use real-time market price from marketPrices
    if (marketPrices && marketPrices[uid]) {
      setStockPrice(marketPrices[uid].price);
      return;
    }
    
    // Priority 2: Check holdings
    if (holdings && holdings.length > 0) {
      const holding = holdings.find((h) => h.name === uid);
      if (holding && holding.price) {
        setStockPrice(holding.price);
        return;
      }
    }
  }, [marketPrices, holdings, uid]);

  const handleSellClick = async () => {
    setError("");
    
    // Validation
    if (!stockQuantity || stockQuantity <= 0) {
      setError("Quantity must be greater than 0");
      return;
    }
    if (!stockPrice || stockPrice <= 0) {
      setError("Live market price not available. Please try again.");
      return;
    }

    // Validate holdings
    const holding = holdings.find((h) => h.name === uid);
    if (!holding || holding.qty < parseInt(stockQuantity)) {
      const availableQty = holding ? holding.qty : 0;
      setError(`Insufficient holdings. Required: ${stockQuantity}, Available: ${availableQty}`);
      return;
    }

    setLoading(true);
    try {
      const userId = localStorage.getItem("userId");
      await placeOrder({
        name: uid,
        qty: parseInt(stockQuantity),
        price: parseFloat(stockPrice),
        mode: "SELL",
        userId: userId,
      });
      showSnackbar("Order placed successfully!", "success", 3000);
      setStockQuantity(1);
      
      // Refresh holdings to reflect the sell
      refreshNow();
      
      generalContext.closeSellWindow();
    } catch (err) {
      setError("Failed to place order. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setError("");
    setStockQuantity(1);
    generalContext.closeSellWindow();
  };

  const marginRequired = (stockQuantity * stockPrice).toFixed(2);

  return (
    <div className="container sell-container" id="sell-window" draggable="true">
      {/* Header */}
      <div className="window-header sell-header">
        <div className="header-content">
          <span className="header-icon">$</span>
          <div className="header-text">
            <h3>Sell {uid}</h3>
            <p>Place your sell order</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="window-body">
        {/* Error Message */}
        {error && (
          <div className="error-message">
            <span>!</span>
            <p>{error}</p>
          </div>
        )}

        {/* Input Section */}
        <div className="order-inputs">
          <div className="input-group">
            <label htmlFor="qty">Quantity</label>
            <input
              type="number"
              name="qty"
              id="qty"
              min="1"
              disabled={loading}
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
              placeholder="Enter quantity"
              className="modern-input"
            />
            <span className="input-hint">Number of shares</span>
          </div>

          <div className="input-group">
            <label htmlFor="price">
              Live Market Price
              <span className="live-badge">● LIVE</span>
            </label>
            <div className="price-input-wrapper">
              <span className="currency">₹</span>
              <input
                type="text"
                name="price"
                id="price"
                disabled={true}
                value={parseFloat(stockPrice).toFixed(2)}
                placeholder="0.00"
                className="modern-input price-input disabled"
              />
            </div>
            <span className="input-hint">Automatically updated from market</span>
          </div>
        </div>

        {/* Summary Section */}
        <div className="order-summary">
          <div className="summary-row">
            <span className="summary-label">You Hold</span>
            <span className="summary-value">{holdings.find((h) => h.name === uid)?.qty || 0} shares</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row">
            <span className="summary-label">Quantity</span>
            <span className="summary-value">{stockQuantity} shares</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Price per Share</span>
            <span className="summary-value">₹{parseFloat(stockPrice).toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span className="summary-label">Total Revenue</span>
            <span className="summary-value total-value">₹{marginRequired}</span>
          </div>
        </div>
      </div>

      {/* Footer with Buttons */}
      <div className="window-footer">
        <button
          className={`btn btn-sell sell-btn ${loading || !stockQuantity || !stockPrice ? 'disabled' : ''}`}
          onClick={handleSellClick}
          disabled={loading || !stockQuantity || !stockPrice}
        >
          {loading ? "Placing Order..." : "Sell Now"}
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleCancelClick}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SellActionWindow;
