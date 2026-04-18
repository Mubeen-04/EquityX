import React, { useState, useContext, useEffect } from "react";

import GeneralContext from "./GeneralContext";
import { useRealTime } from "../RealTimeContext";
import { useSnackbar } from "../SnackbarContext";

import "../css/BuyActionWindow.css";

const BuyActionWindow = ({ uid, initialPrice = 0, onOpenPayment }) => {
  const generalContext = useContext(GeneralContext);
  const { refreshNow, balance, holdings, marketPrices } = useRealTime();
  const { showSnackbar } = useSnackbar();
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get live market price from real-time market prices or holdings or use initialPrice
  useEffect(() => {
    // Priority 1: Use real-time market price from marketPrices
    if (marketPrices && marketPrices[uid]) {
      setStockPrice(marketPrices[uid].price);
      return;
    }
    
    // Priority 2: Check holdings
    if (holdings && holdings.length > 0) {
      const holding = holdings.find((h) => h.name === uid);
      if (holding) {
        setStockPrice(holding.price);
        return;
      }
    }
    
    // Priority 3: Use the initialPrice passed from Market page
    if (initialPrice > 0) {
      setStockPrice(initialPrice);
    }
  }, [marketPrices, holdings, uid, initialPrice]);

  const handleBuyClick = async () => {
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

    const totalAmount = parseFloat(stockQuantity) * parseFloat(stockPrice);
    
    // Validate balance
    if (balance < totalAmount) {
      setError(`Insufficient balance. Required: ₹${totalAmount.toFixed(2)}, Available: ₹${balance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      // Open payment modal with order details
      if (onOpenPayment) {
        const userId = localStorage.getItem("userId");
        onOpenPayment({
          amount: totalAmount,
          stockName: uid,
          quantity: parseInt(stockQuantity),
          price: parseFloat(stockPrice),
          mode: "BUY",
          userId: userId,
          onSuccess: () => {
            showSnackbar("Order placed successfully!", "success", 3000);
            setStockQuantity(1);
            
            // Refresh holdings to reflect the buy
            refreshNow();
            
            generalContext.closeBuyWindow();
          },
        });
      }
    } catch (err) {
      setError("Failed to initiate payment. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = () => {
    setError("");
    setStockQuantity(1);
    generalContext.closeBuyWindow();
  };

  // Calculate margin dynamically (quantity * price)
  const marginRequired = (stockQuantity * stockPrice).toFixed(2);

  return (
    <div className="container buy-container" id="buy-window" draggable="true">
      {/* Header */}
      <div className="window-header buy-header">
        <div className="header-content">
          <span className="header-icon">$</span>
          <div className="header-text">
            <h3>Buy {uid}</h3>
            <p>Place your buy order</p>
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
            <span className="summary-label">Quantity</span>
            <span className="summary-value">{stockQuantity} shares</span>
          </div>
          <div className="summary-row">
            <span className="summary-label">Price per Share</span>
            <span className="summary-value">₹{parseFloat(stockPrice).toFixed(2)}</span>
          </div>
          <div className="summary-divider"></div>
          <div className="summary-row total">
            <span className="summary-label">Total Cost</span>
            <span className="summary-value total-value">₹{marginRequired}</span>
          </div>
        </div>
      </div>

      {/* Footer with Buttons */}
      <div className="window-footer">
        <button
          className={`btn btn-primary buy-btn ${loading || !stockQuantity || !stockPrice ? 'disabled' : ''}`}
          onClick={handleBuyClick}
          disabled={loading || !stockQuantity || !stockPrice}
        >
          {loading ? "Proceeding to Payment..." : "Buy Now"}
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

export default BuyActionWindow;
