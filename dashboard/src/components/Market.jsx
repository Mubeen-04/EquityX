import React, { useState, useContext, useMemo, useEffect } from "react";
import { allAvailableStocks } from "../data/data";
import { Tooltip, Grow } from "@mui/material";
import { Favorite, FavoriteBorder, Search, FilterList, Sort } from "@mui/icons-material";
import GeneralContext from "./GeneralContext";
import { useRealTime } from "../RealTimeContext";
import { useFavorites } from "../FavoritesContext";
import { useSnackbar } from "../SnackbarContext";
import "../css/Market.css";

const Market = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedStock, setSelectedStock] = useState(null);
  const { favorites } = useFavorites();
  const generalContext = useContext(GeneralContext);
  const { marketPrices } = useRealTime();
  const { showSnackbar } = useSnackbar();

  // Get unique sectors
  const sectors = ["all", ...new Set(allAvailableStocks.map((s) => s.sector))];

  // Merge real-time market prices with static data for all 50 stocks
  const stocksWithLivePrices = useMemo(() => {
    return allAvailableStocks.map((stock) => {
      // Get real-time price from market prices broadcast
      const livePrice = marketPrices[stock.name];
      
      // If we have real-time price, use it; otherwise use static price
      return {
        ...stock,
        price: livePrice?.price ?? stock.price,
        percent: livePrice?.percent ?? stock.percent,
        isDown: livePrice?.isDown ?? false,
        isLive: !!livePrice, // Mark if this has real-time price
      };
    });
  }, [marketPrices]);

  // Filter and search stocks
  const filteredStocks = stocksWithLivePrices
    .filter((stock) => {
      const matchesSearch = stock.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSector = sectorFilter === "all" || stock.sector === sectorFilter;
      return matchesSearch && matchesSector;
    })
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "price") return b.price - a.price;
      if (sortBy === "gain") {
        const gainA = parseFloat(a.percent);
        const gainB = parseFloat(b.percent);
        // Handle NaN values in gain comparison
        if (isNaN(gainA) || isNaN(gainB)) {
          if (isNaN(gainA) && isNaN(gainB)) return 0;
          return isNaN(gainA) ? 1 : -1;
        }
        return gainB - gainA;
      }
      return 0;
    });

  return (
    <div className="market-container">
      <div className="market-header">
        <h2 className="market-title">
          Market Stocks
        </h2>
        <p className="market-subtitle">
          Browse and buy from <strong>{allAvailableStocks.length}+</strong> available stocks
        </p>
      </div>

      {/* Filters */}
      <div className="market-filters">
        <div className="filter-group">
          <label>
            <Search fontSize="small" style={{ color: "#1976D2" }} />
            Search Stock
          </label>
          <input
            type="text"
            placeholder="Search by name (e.g., INFY, TCS, RELIANCE)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>
            <FilterList fontSize="small" style={{ color: "#1976D2" }} />
            Sector
          </label>
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            {sectors.map((sector) => (
              <option key={sector} value={sector}>
                {sector === "all" ? "All Sectors" : sector}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>
            <Sort fontSize="small" style={{ color: "#1976D2" }} />
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Stock Name (A-Z)</option>
            <option value="price">Price (High to Low)</option>
            <option value="gain">Gain % (High to Low)</option>
          </select>
        </div>
      </div>

      {/* Results Info */}
      <div
        style={{
          marginBottom: "20px",
          padding: "12px 16px",
          backgroundColor: "#e7f3ff",
          border: "1px solid #b3d9ff",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: "500",
          color: "#0c5aa0",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        Showing <strong>{filteredStocks.length}</strong> of <strong>{allAvailableStocks.length}</strong> stocks
      </div>

      {/* Stocks Grid */}
      {filteredStocks.length > 0 ? (
        <div className="market-grid">
          {filteredStocks.map((stock, idx) => (
            <StockCard 
              key={idx} 
              stock={stock} 
              generalContext={generalContext}
              onViewDetails={() => setSelectedStock(stock)}
              favorites={favorites}
              showSnackbar={showSnackbar}
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No stocks found</p>
          <p>Try adjusting your search or sector filter</p>
        </div>
      )}

      {/* Stock Details Modal */}
      {selectedStock && (
        <StockDetailsModal 
          stock={selectedStock} 
          onClose={() => setSelectedStock(null)}
          onBuy={() => {
            generalContext.openBuyWindow(selectedStock.name, selectedStock.price);
            setSelectedStock(null);
          }}
          onAnalyze={() => {
            generalContext.openShareAnalysis(selectedStock.name);
            setSelectedStock(null);
          }}
        />
      )}
    </div>
  );
};

const StockCard = ({ stock, generalContext, onViewDetails, favorites, showSnackbar }) => {
  const { toggleFavorite } = useFavorites();
  
  const getGainColor = (percent) => {
    const p = parseFloat(percent);
    // Handle NaN by treating as neutral (no change)
    if (isNaN(p)) return "#666";
    return p >= 0 ? "#28a745" : "#dc3545";
  };

  const isFavorite = favorites.includes(stock.name);

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(stock.name);
    } catch (err) {
      showSnackbar("Failed to update favorites", "error", 3000);
    }
  };

  return (
    <div className="stock-card">
      {/* Header */}
      <div className="stock-card-header">
        <div className="stock-info">
          <h4 className="stock-name">
            {stock.name}
          </h4>
          <p className="stock-sector">
            {stock.sector}
          </p>
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "start" }}>
          <div className={`stock-change-badge ${getGainColor(stock.percent) === "#28a745" ? 'positive' : 'negative'}`}>
            {parseFloat(stock.percent) >= 0 ? "+" : ""}{stock.percent}
          </div>
          <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} placement="top" arrow>
            <button
              onClick={handleToggleFavorite}
              className="stock-favorite-btn"
            >
              {isFavorite ? (
                <Favorite style={{ color: "#e91e63" }} />
              ) : (
                <FavoriteBorder style={{ color: "#999" }} />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Price */}
      <div className="stock-price-section">
        <div className="stock-price-label">
          <p>
            Current Price
          </p>
          {stock.isLive && (
            <span className="stock-live-badge">
              LIVE
            </span>
          )}
        </div>
        <h3 className="stock-price">
          ₹{stock.price.toFixed(2)}
        </h3>
      </div>

      {/* Actions */}
      <div className="stock-actions">
        <button
          type="button"
          onClick={() => generalContext.openBuyWindow(stock.name, stock.price)}
          className="stock-action-btn"
          title="Buy (B)"
        >
          Buy
        </button>
        <button
          type="button"
          onClick={onViewDetails}
          className="stock-action-btn stock-details-btn"
          title="View Details"
        >
          Details
        </button>
      </div>
    </div>
  );
};

// Stock Details Modal Component
const StockDetailsModal = ({ stock, onClose, onBuy, onAnalyze }) => {
  return (
    <div className="stock-modal-overlay" onClick={onClose}>
      <div
        className="stock-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="stock-modal-header">
          <h2>
            {stock.name}
          </h2>
          <button
            onClick={onClose}
            className="stock-modal-close"
          >
            ✕
          </button>
        </div>

        {/* Stock Information */}
        <div className="stock-modal-info">
          {/* Current Price */}
          <div className="stock-modal-info-grid">
            <div className="info-box">
              <p className="info-box-label">
                Current Price
              </p>
              <p className="info-box-value">
                ₹{stock.price.toFixed(2)}
              </p>
            </div>

            <div className="info-box">
              <p className="info-box-label">
                Change
              </p>
              <p className={`info-box-value ${parseFloat(stock.percent) >= 0 ? 'positive' : 'negative'}`}>
                {parseFloat(stock.percent) >= 0 ? "+" : ""}{stock.percent}%
              </p>
            </div>
          </div>

          {/* Sector and Details */}
          <div className="info-box" style={{ marginBottom: "16px" }}>
            <p className="info-box-label">
              Sector
            </p>
            <p style={{ margin: "0", fontSize: "16px", fontWeight: "600" }}>
              {stock.sector}
            </p>
          </div>

          {/* Additional Info */}
          <div className="info-notice">
            <p>
              You can buy {stock.name} shares directly from this modal or continue browsing the market.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="stock-modal-actions">
          <button
            onClick={onClose}
            className="modal-btn modal-btn-close"
          >
            Close
          </button>
          <button
            onClick={onAnalyze}
            className="modal-btn modal-btn-secondary"
          >
            Analyze
          </button>
          <button
            onClick={onBuy}
            className="modal-btn modal-btn-primary"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Market;
