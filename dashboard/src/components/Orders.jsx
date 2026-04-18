import React, { useState, useMemo } from "react";
import { useRealTime } from "../RealTimeContext";
import { useSnackbar } from "../SnackbarContext";
import { cancelOrder } from "../api";
import "../css/Orders.css";

const Orders = () => {
  const { orders, isConnected, mode } = useRealTime();
  const { showSnackbar } = useSnackbar();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState("all"); // all, buy, sell
  const [cancellingOrder, setCancellingOrder] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const getStatusBadge = (status = "pending") => {
    const statusLower = (status || "pending").toLowerCase();
    const statusClass = {
      pending: "order-status-pending",
      executed: "order-status-executed",
      cancelled: "order-status-cancelled",
      rejected: "order-status-rejected",
    }[statusLower] || "order-status-pending";

    return (
      <span className={`order-status-badge ${statusClass}`}>
        {statusLower.charAt(0).toUpperCase() + statusLower.slice(1)}
      </span>
    );
  };

  // Filter and search orders
  const filteredOrders = useMemo(() => {
    if (!orders) return [];

    return orders.filter((order) => {
      const matchesSearch = (order.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMode = filterMode === "all" || (order.mode || "").toLowerCase() === filterMode.toLowerCase();
      return matchesSearch && matchesMode;
    });
  }, [orders, searchTerm, filterMode]);

  const handleCancelOrder = async (orderId) => {
    setCancellingOrder(orderId);
    try {
      await cancelOrder(orderId);
      // Reset the button state after successful cancellation
      // The order status will be updated via WebSocket event (orderStatusUpdate)
      setTimeout(() => {
        setCancellingOrder(null);
      }, 500); // Brief delay to show "Cancelling..." state
    } catch (err) {
      console.error("Error cancelling order:", err);
      showSnackbar("Failed to cancel order. Please try again.", "error", 3000);
      setCancellingOrder(null);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      {/* Header */}
      <div className="orders-header">
        <span>Total Orders: {orders.length} (Filtered: {filteredOrders.length})</span>
      </div>

      {/* Search and Filter */}
      <div className="orders-filters">
        <input
          type="text"
          placeholder="Search by stock name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="order-search"
        />
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="order-filter-select"
        >
          <option value="all">All Orders</option>
          <option value="buy">Buy Only</option>
          <option value="sell">Sell Only</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Stock</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Mode</th>
              <th>Status</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr key={order._id || index}>
                  <td>{order.name || "N/A"}</td>
                  <td>{order.qty || 0}</td>
                  <td>₹{(order.price || 0).toFixed(2)}</td>
                  <td>
                    <span className={`order-mode-badge order-mode-${(order.mode || "").toLowerCase()}`}>
                      {(order.mode || "N/A").toUpperCase()}
                    </span>
                  </td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{formatDate(order.createdAt || new Date().toISOString())}</td>
                  <td>
                    {(order.status || "").toLowerCase() === "pending" && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        disabled={cancellingOrder === order._id}
                        className="order-cancel-btn"
                      >
                        {cancellingOrder === order._id ? "Cancelling..." : "Cancel"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-orders-message">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
