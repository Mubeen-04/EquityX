import React from "react";
import { Route, Routes } from "react-router-dom";

import Holdings from "./Holdings";
import Analytics from "./Analytics";
import Market from "./Market";

import Orders from "./Orders";
import Summary from "./Summary";
import WatchList from "./WatchList";
import ErrorBoundary from "./ErrorBoundary";
import { GeneralContextProvider } from "./GeneralContext";
import "../css/Dashboard.css";

const Dashboard = () => {
  return (
    <GeneralContextProvider>
      <div className="dashboard-container">
        <ErrorBoundary>
          <WatchList />
        </ErrorBoundary>
        <div className="content">
          <ErrorBoundary>
            <Routes>
              <Route exact path="/" element={<Summary />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/holdings" element={<Holdings />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/market" element={<Market />} />
            </Routes>
          </ErrorBoundary>
        </div>
      </div>
    </GeneralContextProvider>
  );
};

export default Dashboard;
