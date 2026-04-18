import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

// Add token to headers if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Holdings APIs
export const getHoldings = () => API.get("/allHoldings");

// Positions APIs
export const getPositions = () => API.get("/allPositions");

// Orders APIs
export const getOrders = () => API.get("/allOrders");

export const placeOrder = (data) => API.post("/newOrder", data);

export const cancelOrder = (orderId) => API.put(`/cancelOrder/${orderId}`);

// Balance APIs
export const getUserBalance = (userId) => API.get(`/balance/${userId}`);

export const createBalanceIntent = (data) => API.post("/create-balance-intent", data);

export const confirmBalance = (data) => API.post("/confirm-balance", data);

// Stripe Payment APIs
export const createPaymentIntent = (data) => API.post("/create-payment-intent", data);

export const confirmPayment = (data) => API.post("/confirm-payment", data);

export const getPaymentStatus = (paymentIntentId) => API.get(`/payment-status/${paymentIntentId}`);

// Indices APIs
export const getIndices = () => API.get("/indices");

// Favorites APIs
export const getFavorites = () => API.get("/favorites");

export const addFavorite = (stockName) => API.post("/favorites", { stockName });

export const removeFavorite = (stockName) => API.delete(`/favorites/${stockName}`);

export default API;

