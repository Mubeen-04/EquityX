import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import io from "socket.io-client";
import { getHoldings, getPositions, getOrders, getIndices, getMarketPrices, getUserBalance } from "./api";

const RealTimeContext = createContext();

export const useRealTime = () => {
  const context = useContext(RealTimeContext);
  if (!context) {
    throw new Error("useRealTime must be used within RealTimeProvider");
  }
  return context;
};

export const RealTimeProvider = ({ children }) => {
  const [holdings, setHoldings] = useState([]);
  const [positions, setPositions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [indices, setIndices] = useState({ NIFTY50: {}, SENSEX: {} });
  const [balance, setBalance] = useState(100000); // User's available cash
  const [isConnected, setIsConnected] = useState(false);
  const [mode, setMode] = useState("websocket"); // "websocket" or "polling"
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [marketPrices, setMarketPrices] = useState({}); // All 50 stock prices
  const socket = React.useRef(null);
  const pollingInterval = React.useRef(null);

  // Define fetchData early and wrap in useCallback to avoid recreating on every render
  const fetchData = useCallback(async () => {
    try {
      const [holdingsRes, positionsRes, ordersRes, marketPricesRes, indicesRes] = await Promise.all([
        getHoldings(),
        getPositions(),
        getOrders(),
        getMarketPrices().catch(e => {
          console.error("Error fetching market prices:", e);
          return { data: {} };
        }),
        getIndices(),
      ]);

      const holdingsData = holdingsRes.data || [];
      const positionsData = positionsRes.data || [];
      const ordersData = ordersRes.data || [];
      const marketPricesData = marketPricesRes.data || {};
      const indicesData = indicesRes.data || {};

      setHoldings(holdingsData);
      setPositions(positionsData);
      setOrders(ordersData);
      setMarketPrices(marketPricesData);
      setIndices(indicesData);
      setLastUpdate(new Date());

      // Cache the fresh data with user-specific key to prevent data leaking between users
      const userId = localStorage.getItem("userId");
      const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
      const cacheData = {
        holdings: holdingsData,
        positions: positionsData,
        orders: ordersData,
        marketPrices: marketPricesData,
        indices: indicesData,
        timestamp: new Date().toISOString(),
      };
      localStorage.setItem(cacheKey, JSON.stringify(cacheData));

      console.log(`Polling successful - ${holdingsData.length || 0} holdings, ${positionsData.length || 0} positions, ${Object.keys(marketPricesData).length || 0} market stocks, indices updated`);
    } catch (err) {
      console.error("❌ Polling failed:", err.message);
      if (isOnline) {
        setIsConnected(false);
      }
    }
  }, [isOnline]);

  // Initialize data on mount
  useEffect(() => {
    console.log("RealTimeProvider initializing...");
    
    // Load cached data first
    const loadCachedData = () => {
      try {
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = localStorage.getItem(cacheKey);
        if (cached) {
          const { holdings: cachedHoldings, positions: cachedPositions, orders: cachedOrders, indices: cachedIndices, marketPrices: cachedMarketPrices } = JSON.parse(cached);
          setHoldings(cachedHoldings || []);
          setPositions(cachedPositions || []);
          setOrders(cachedOrders || []);
          setIndices(cachedIndices || {});
          setMarketPrices(cachedMarketPrices || {});
          console.log(`Cached data loaded for userId ${userId} (including market prices)`);
        }
      } catch (err) {
        console.warn("Failed to load cached data:", err);
      }
    };

    loadCachedData();

    // Fetch fresh data on mount
    const initData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const [holdingsRes, positionsRes, ordersRes, indicesRes, balanceRes] = await Promise.all([
          getHoldings(),
          getPositions(),
          getOrders(),
          getIndices(),
          userId ? getUserBalance(userId) : Promise.resolve({ data: { balance: 100000 } }),
        ]);
        const newData = {
          holdings: holdingsRes.data || [],
          positions: positionsRes.data || [],
          orders: ordersRes.data || [],
          indices: indicesRes.data || {},
        };
        setHoldings(newData.holdings);
        setPositions(newData.positions);
        setOrders(newData.orders);
        setIndices(newData.indices);
        setBalance(balanceRes.data.balance || 100000);
        
        // Cache the data with user-specific key to prevent data leaking between users
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        localStorage.setItem(cacheKey, JSON.stringify(newData));
        
        setIsInitialized(true);
        console.log("Initial data loaded and cached, Balance: ₹" + (balanceRes.data.balance || 100000));
      } catch (err) {
        console.error("Failed to load initial data:", err);
        setIsInitialized(true); // Show page even if initial data fails
      }
    };
    initData();
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (mode === "websocket") {
      console.log("Connecting to WebSocket...");
      const socketIO = io(import.meta.env.VITE_API_URL || "http://localhost:5000", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
        transports: ["websocket", "polling"],
      });

      socket.current = socketIO;

      socketIO.on("connect", () => {
        console.log("WebSocket connected!");
        setIsConnected(true);
        
        // Send userId for user-specific data
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        if (userId || token) {
          socketIO.emit("join", { userId, token });
        }
        
        socketIO.emit("requestHoldings");
        socketIO.emit("requestPositions");
        socketIO.emit("requestMarketPrices");
      });

      socketIO.on("connected", (data) => {
        console.log("WebSocket connected (legacy):", data);
        setIsConnected(true);
      });

      socketIO.on("holdingsData", (data) => {
        console.log("Holdings data received:", data?.length || 0, "items");
        setHoldings(data);
        setLastUpdate(new Date());
        
        // Cache the data with user-specific key
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
        cached.holdings = data;
        cached.timestamp = new Date().toISOString();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      });

      socketIO.on("positionsData", (data) => {
        console.log("Positions data received:", data?.length || 0, "items");
        setPositions(data);
        setLastUpdate(new Date());
        
        // Cache the data with user-specific key
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
        cached.positions = data;
        cached.timestamp = new Date().toISOString();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      });

      socketIO.on("priceUpdate", (data) => {
        console.log("Price update received");
        setHoldings(data);
        setLastUpdate(new Date());
        
        // Cache the data with user-specific key
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
        cached.holdings = data;
        cached.timestamp = new Date().toISOString();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      });

      socketIO.on("marketPricesUpdate", (data) => {
        console.log("Market prices update received:", Object.keys(data).length, "stocks");
        setMarketPrices(data);
        setLastUpdate(new Date());
        
        // Cache the data with user-specific key
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
        cached.marketPrices = data;
        cached.timestamp = new Date().toISOString();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      });

      socketIO.on("indexUpdate", (data) => {
        console.log("Index update received:", data);
        setIndices(data);
        setLastUpdate(new Date());
        
        // Cache the data with user-specific key
        const userId = localStorage.getItem("userId");
        const cacheKey = userId ? `tradingAppCache_${userId}` : "tradingAppCache";
        const cached = JSON.parse(localStorage.getItem(cacheKey) || "{}");
        cached.indices = data;
        cached.timestamp = new Date().toISOString();
        localStorage.setItem(cacheKey, JSON.stringify(cached));
      });

      socketIO.on("balanceUpdate", (data) => {
        console.log("💰 Balance updated: ₹" + data.balance);
        setBalance(data.balance);
        setLastUpdate(new Date());
      });

      socketIO.on("newOrder", (orderData) => {
        console.log("📦 New order received:", orderData.mode, orderData.name, "qty:", orderData.qty);
        setOrders((prev) => [orderData, ...prev]);
        setLastUpdate(new Date());
      });

      socketIO.on("orderStatusUpdate", (updatedOrder) => {
        console.log("Order status updated:", updatedOrder.name, "->", updatedOrder.status);
        setOrders((prev) =>
          prev.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
        );
        setLastUpdate(new Date());
      });

      socketIO.on("disconnect", () => {
        console.log("❌ WebSocket disconnected - switching to polling mode");
        setIsConnected(false);
        setMode("polling"); // Auto-fallback to polling when disconnected
      });

      socketIO.on("connect_error", (error) => {
        console.warn("⚠️ Connection Error:", error.message);
        setIsConnected(false);
        setMode("polling"); // Auto-fallback to polling on connection error
      });

      socketIO.on("error", (error) => {
        console.error("❌ WebSocket error:", error);
        setIsConnected(false);
        setMode("polling"); // Auto-fallback to polling on error
      });

      // Fallback to polling if socket doesn't connect within 5 seconds
      const connectionTimeout = setTimeout(() => {
        if (!socketIO.connected) {
          console.log("⏱️ Socket connection timeout - falling back to polling");
          setMode("polling");
          socketIO.disconnect();
        }
      }, 5000);

      return () => {
        clearTimeout(connectionTimeout);
        socketIO.disconnect();
      };
    }
  }, [mode]);

  // Setup polling when mode is polling
  useEffect(() => {
    if (mode === "polling") {
      console.log("Polling mode activated - fetching data every 5 seconds");
      setIsConnected(true);

      // Initial fetch
      fetchData();

      // Polling interval
      pollingInterval.current = setInterval(() => {
        console.log("Polling: Fetching latest data...");
        fetchData();
      }, 5000); // Every 5 seconds

      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [mode, fetchData]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => {
      console.log("Back online!");
      setIsOnline(true);
      setIsConnected(false); // Force reconnection
      setMode("websocket"); // Try WebSocket again
      
      // Sync all data when coming back online
      setTimeout(() => {
        console.log("Syncing data with server...");
        fetchData();
      }, 1000);
    };

    const handleOffline = () => {
      console.log("❌ Internet lost - using cached data");
      setIsOnline(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [fetchData]);

  const toggleMode = () => {
    setMode(mode === "websocket" ? "polling" : "websocket");
  };

  const refreshNow = () => {
    if (mode === "polling") {
      fetchData();
    } else {
      socket.current?.emit("requestHoldings");
      socket.current?.emit("requestPositions");
    }
  };

  return (
    <RealTimeContext.Provider
      value={{
        holdings,
        positions,
        orders,
        indices,
        balance,
        isConnected,
        isOnline,
        mode,
        toggleMode,
        lastUpdate,
        refreshNow,
        isInitialized,
        marketPrices,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};

export default RealTimeProvider;
