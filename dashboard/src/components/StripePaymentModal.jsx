import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createPaymentIntent, confirmPayment } from "../api";
import "../css/StripePaymentModal.css";

const StripePaymentModal = ({ amount, stockName, quantity, price, mode, userId, onPaymentSuccess, onPaymentCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      return;
    }

    setProcessing(true);

    try {
      // SAFETY FIX: Validate userId exists
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User session not found. Please login again.");
        setProcessing(false);
        return;
      }

      // Step 1: Create payment intent on the backend
      const paymentData = await createPaymentIntent({
        amount: amount,
        name: stockName,
        qty: quantity,
        price: price,
        mode: mode,
      });

      const clientSecret = paymentData.data.clientSecret;

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);
      
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: stockName,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Confirm payment on backend and create order
        const orderData = await confirmPayment({
          paymentIntentId: paymentIntent.id,
          name: stockName,
          qty: quantity,
          price: price,
          mode: mode,
          userId: userId,
        });

        console.log("Payment successful, order created:", orderData);
        onPaymentSuccess(orderData);
      } else {
        setError("Payment failed. Please try again.");
        setProcessing(false);
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError(err.response?.data?.msg || "Payment processing failed");
      setProcessing(false);
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    hidePostalCode: true,
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  };

  return (
    <div className="stripe-payment-modal">
      <div className="payment-modal-content">
        <div className="payment-modal-header">
          <h3>Complete Payment</h3>
          <button className="close-btn" onClick={onPaymentCancel}>✕</button>
        </div>

        <div className="payment-modal-body">
          <div className="order-summary">
            <div className="summary-row">
              <span className="label">Stock:</span>
              <span className="value">{stockName}</span>
            </div>
            <div className="summary-row">
              <span className="label">Quantity:</span>
              <span className="value">{quantity}</span>
            </div>
            <div className="summary-row">
              <span className="label">Price per share:</span>
              <span className="value">₹{parseFloat(price).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span className="label">Total Amount:</span>
              <span className="value">₹{amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          <form onSubmit={handlePayment} className="payment-form">
            <div className="card-element-wrapper">
              <label htmlFor="card">Card Details</label>
              <CardElement id="card" options={CARD_ELEMENT_OPTIONS} />
            </div>

            {error && (
              <div className="error-message">
                <span>!</span>
                <p>{error}</p>
              </div>
            )}

            <div className="payment-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onPaymentCancel}
                disabled={processing || !stripe}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-pay"
                disabled={processing || !stripe}
              >
                {processing ? "Processing..." : `Pay ₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
              </button>
            </div>

            <p className="payment-note">
              This is a test payment. Use card number 4242 4242 4242 4242 with any future date and any CVC.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
