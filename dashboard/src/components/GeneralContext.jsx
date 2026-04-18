import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";
import StripePaymentModal from "./StripePaymentModal";
import ShareAnalysis from "./ShareAnalysis";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_default");

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid) => {},
  closeSellWindow: () => {},
  openShareAnalysis: (stockName) => {},
  closeShareAnalysis: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);
  const [paymentModalData, setPaymentModalData] = useState(null);
  const [shareAnalysisStock, setShareAnalysisStock] = useState(null);

  const handleOpenBuyWindow = (uid, price = 0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
    setSelectedStockPrice(0);
  };

  const handleOpenSellWindow = (uid) => {
    setIsSellWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  const handleOpenPayment = (paymentData) => {
    setPaymentModalData(paymentData);
  };

  const handleClosePayment = () => {
    setPaymentModalData(null);
  };

  const handlePaymentSuccess = (orderData) => {
    if (paymentModalData?.onSuccess) {
      paymentModalData.onSuccess(orderData);
    }
    handleClosePayment();
  };

  const handleOpenShareAnalysis = (stockName) => {
    setShareAnalysisStock(stockName);
  };

  const handleCloseShareAnalysis = () => {
    setShareAnalysisStock(null);
  };

  return (
    <Elements stripe={stripePromise}>
      <GeneralContext.Provider
        value={{
          openBuyWindow: handleOpenBuyWindow,
          closeBuyWindow: handleCloseBuyWindow,
          openSellWindow: handleOpenSellWindow,
          closeSellWindow: handleCloseSellWindow,
          openShareAnalysis: handleOpenShareAnalysis,
          closeShareAnalysis: handleCloseShareAnalysis,
        }}
      >
        {props.children}
        {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} initialPrice={selectedStockPrice} onOpenPayment={handleOpenPayment} />}
        {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
        {paymentModalData && (
          <StripePaymentModal
            amount={paymentModalData.amount}
            stockName={paymentModalData.stockName}
            quantity={paymentModalData.quantity}
            price={paymentModalData.price}
            mode={paymentModalData.mode}
            userId={paymentModalData.userId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentCancel={handleClosePayment}
          />
        )}
        {shareAnalysisStock && (
          <ShareAnalysis 
            stockName={shareAnalysisStock} 
            onClose={handleCloseShareAnalysis}
          />
        )}
      </GeneralContext.Provider>
    </Elements>
  );
};

export default GeneralContext;
