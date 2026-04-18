import React, { useState, useContext, useEffect } from "react";

import GeneralContext from "./GeneralContext";
import { useRealTime } from "../RealTimeContext";
import { useFavorites } from "../FavoritesContext";

import { Tooltip, Grow } from "@mui/material";

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";
import "../css/WatchList.css";

const WatchList = () => {
  const { holdings, isConnected, mode, marketPrices } = useRealTime();
  const { favorites } = useFavorites();
  const [displayList, setDisplayList] = useState([]);

  // Update display list with ALL favorites (not just holdings) using real-time market prices
  useEffect(() => {
    if (favorites.length > 0) {
      const updatedList = favorites.map((favName) => {
        const marketPrice = marketPrices[favName];
        const holding = holdings.find(h => h.name === favName);
        
        return {
          name: favName,
          price: marketPrice?.price || holding?.price || 0,
          percent: marketPrice?.percent || holding?.day || "0%",
          isDown: (marketPrice?.isDown ?? (holding?.day && holding.day.includes("-"))) || false,
          isOwned: !!holding,
        };
      });
      setDisplayList(updatedList);
      console.log(`WatchList updated with ${updatedList.length} favorite stocks`);
    } else {
      setDisplayList([]);
    }
  }, [holdings, favorites, marketPrices]);

  const labels = displayList.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: displayList.map((stock) => stock.price || 0),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // export const data = {
  //   labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
  // datasets: [
  //   {
  //     label: "# of Votes",
  //     data: [12, 19, 3, 5, 2, 3],
  //     backgroundColor: [
  //       "rgba(255, 99, 132, 0.2)",
  //       "rgba(54, 162, 235, 0.2)",
  //       "rgba(255, 206, 86, 0.2)",
  //       "rgba(75, 192, 192, 0.2)",
  //       "rgba(153, 102, 255, 0.2)",
  //       "rgba(255, 159, 64, 0.2)",
  //     ],
  //     borderColor: [
  //       "rgba(255, 99, 132, 1)",
  //       "rgba(54, 162, 235, 1)",
  //       "rgba(255, 206, 86, 1)",
  //       "rgba(75, 192, 192, 1)",
  //       "rgba(153, 102, 255, 1)",
  //       "rgba(255, 159, 64, 1)",
  //     ],
  //     borderWidth: 1,
  //   },
  // ],
  // };

  return (
    <div className="watchlist-container">
      <div className="watchlist-header">
        <h3>Watchlist</h3>
        <span className="watchlist-count">{displayList.length}</span>
      </div>
      
      <ul className="list">
        {displayList.length > 0 ? (
          displayList.map((stock, index) => {
            return <WatchListItem stock={stock} key={index} favorites={favorites} />;
          })
        ) : (
          <div style={{
            padding: "20px",
            textAlign: "center",
            color: "#999",
            fontSize: "13px",
            fontStyle: "italic"
          }}>
            No favorites yet. Add stocks from the Market page!
          </div>
        )}
      </ul>

      {displayList.length > 0 && <DoughnutChart data={data} />}
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, favorites }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" style={{ color: "#dc3545" }} />
          ) : (
            <KeyboardArrowUp className="up" style={{ color: "#28a745" }} />
          )}
          <span className="price">{typeof stock.price === "number" ? stock.price.toFixed(2) : stock.price}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} favorites={favorites} isOwned={stock.isOwned} />}
    </li>
  );
};

const WatchListActions = ({ uid, favorites, isOwned }) => {
  const generalContext = useContext(GeneralContext);
  const { toggleFavorite } = useFavorites();
  const isFavorite = favorites.includes(uid);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  const handleSellClick = () => {
    if (isOwned) {
      generalContext.openSellWindow(uid);
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite(uid);
    } catch (err) {
      alert("Failed to update favorites");
    }
  };

  return (
    <span className="actions">
      <span>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title={isOwned ? "Sell (S)" : "You don't own this stock"}
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell" disabled={!isOwned} style={{ opacity: isOwned ? 1 : 0.5, cursor: isOwned ? "pointer" : "not-allowed" }}>Sell</button>
        </Tooltip>
        <Tooltip title={isFavorite ? "Remove from Favorites" : "Add to Favorites"} placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={handleToggleFavorite}>
            {isFavorite ? (
              <Favorite className="icon" style={{ color: "#e91e63" }} />
            ) : (
              <FavoriteBorder className="icon" />
            )}
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
