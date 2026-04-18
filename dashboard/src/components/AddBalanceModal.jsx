import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { createBalanceIntent, confirmBalance } from "../api";
import { useSnackbar } from "../SnackbarContext";
import "../css/AddBalanceModal.css";

const AddBalanceModal = ({ balance, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { showSnackbar } = useSnackbar();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter amount, Step 2: Card details

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d+(\.\d{0,2})?$/.test(value)) {
      setAmount(value);
      setError("");
    }
  };

  const handleContinue = () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
    setError("");
    setAmount(""); // Reset amount on back
  };

  // Reset payment state if error occurs
  const handlePaymentError = (errorMsg) => {
    setError(errorMsg);
    setProcessing(false);
    setStep(1); // Reset to step 1 on any payment error
    setAmount("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setError("");

    if (!stripe || !elements) {
      setError("Stripe is not loaded");
      return;
    }

    setProcessing(true);

    try {
      // Step 1: Create payment intent
      const intentData = await createBalanceIntent({
        amount: parseFloat(amount),
      });

      const clientSecret = intentData.data.clientSecret;

      // Step 2: Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        handlePaymentError(`Payment failed: ${stripeError.message}`);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Step 3: Confirm balance addition on backend
        const userId = localStorage.getItem("userId");
        const balanceData = await confirmBalance({
          paymentIntentId: paymentIntent.id,
          amount: parseFloat(amount),
          userId: userId,
        });

        console.log("Balance added successfully:", balanceData);
        showSnackbar(`Successfully added ₹${amount} to your account!`, "success", 3000);
        setAmount("");
        setStep(1);
        onSuccess(balanceData.data.newBalance);
      } else {
        handlePaymentError("Payment failed. Please try again.");
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
    <div className="add-balance-overlay">
      <div className="add-balance-modal">
        <div className="modal-header">
          <h3>Add Funds to Your Account</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {/* Current Balance */}
          <div className="current-balance">
            <p className="label">Current Balance</p>
            <p className="balance">₹{balance.toFixed(2)}</p>
          </div>

          {error && (
            <div className="error-message">
              <span>!</span>
              <p>{error}</p>
            </div>
          )}

          {step === 1 ? (
            // Step 1: Amount Entry
            <div className="amount-input-section">
              <label htmlFor="amount">Amount to Add</label>
              <div className="amount-input-wrapper">
                <span className="currency">₹</span>
                <input
                  type="text"
                  id="amount"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={handleAmountChange}
                  disabled={processing}
                  className="amount-input"
                />
              </div>
              <div className="quick-amounts">
                <p className="label">Quick Add:</p>
                <div className="buttons">
                  {[5000, 10000, 25000, 50000].map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className="quick-btn"
                      disabled={processing}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Step 2: Card Details
            <form onSubmit={handlePayment} className="payment-form">
              <div className="summary">
                <p className="label">Amount to Add:</p>
                <p className="amount">₹{parseFloat(amount).toFixed(2)}</p>
              </div>
              <div className="card-element-wrapper">
                <label htmlFor="card">Card Details</label>
                <CardElement id="card" options={CARD_ELEMENT_OPTIONS} />
              </div>
              <p className="payment-note">
                This is a test payment. Use card number 4242 4242 4242 4242 with any future date and any CVC.
              </p>
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-back"
                  onClick={handleBack}
                  disabled={processing}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-add"
                  disabled={processing || !stripe}
                >
                  {processing ? "Processing..." : `Add ₹${parseFloat(amount).toFixed(2)}`}
                </button>
              </div>
            </form>
          )}
        </div>

        {step === 1 && (
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-cancel"
              disabled={processing}
            >
              Cancel
            </button>
            <button
              onClick={handleContinue}
              className="btn-continue"
              disabled={!amount || parseFloat(amount) <= 0 || processing}
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBalanceModal;
