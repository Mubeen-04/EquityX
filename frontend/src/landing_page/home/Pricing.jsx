import React from "react";
import { Link } from "react-router-dom";

function Pricing() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Pricing</span>
          <h2>Transparent. Flat. Fair.</h2>
          <p>We pioneered discount broking in India. No hidden charges, no percentage-based commissions. Just a simple flat fee.</p>
        </div>

        <div className="row justify-content-center" style={{ gap: "1.5rem 0" }}>
          <div className="col-md-4">
            <div className="pricing-badge featured with-badge">
              <div className="pricing-amount bull">₹0</div>
              <div style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "1rem", marginTop: "0.5rem" }}>
                Equity Delivery
              </div>
              <div className="pricing-desc">
                Zero brokerage on all equity delivery trades. Invest in stocks and mutual funds for free — forever.
              </div>
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Long-term investing", "Direct mutual funds", "ETFs & Index funds", "IPO applications"].map(f => (
                  <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--bull)" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="pricing-badge featured">
              <div className="pricing-amount">₹20</div>
              <div style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "1rem", marginTop: "0.5rem" }}>
                Intraday & F&O
              </div>
              <div className="pricing-desc">
                Flat ₹20 per executed order for all intraday, futures, and options trades. No percentage cut.
              </div>
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Equity intraday", "Futures & Options", "Currency derivatives", "Commodity futures"].map(f => (
                  <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--primary)" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="pricing-badge featured">
              <div className="pricing-amount">₹0</div>
              <div style={{ color: "var(--text-primary)", fontWeight: "700", fontSize: "1rem", marginTop: "0.5rem" }}>
                Account Opening
              </div>
              <div className="pricing-desc">
                Open your demat and trading account in under 10 minutes. No paperwork, no courier, no charges.
              </div>
              <div style={{ marginTop: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {["Instant KYC via Aadhaar", "Digital account setup", "Bank linking in 2 mins", "Same-day activation"].map(f => (
                  <div key={f} style={{ display: "flex", gap: "0.5rem", alignItems: "center", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--gold)" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "3rem" }}>
          <Link to="/pricing" className="btn btn-outline btn-lg">
            View Full Pricing Breakdown →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Pricing;
