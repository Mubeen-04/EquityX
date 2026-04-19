import axios from "axios";

// Use relative URLs by default (works on any domain)
// For development: set VITE_API_URL in .env.local
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "",
});

// Add token to headers if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const signup = (data) => API.post("/signup", data);
export const login = (data) => API.post("/login", data);

// Holdings APIs
export const getHoldings = () => API.get("/allHoldings");

// Positions APIs
export const getPositions = () => API.get("/allPositions");

// Orders APIs
export const getOrders = () => API.get("/allOrders");

export const placeOrder = (data) => API.post("/newOrder", data);

// Support Tickets API
export const submitTicket = (data) => API.post("/submitTicket", data);

// Market Data APIs (public, no auth required)
export const getMarketPrices = () => API.get("/marketPrices");
export const getIndices = () => API.get("/indices");

export default API;
