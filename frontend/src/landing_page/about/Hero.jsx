import React from "react";

function Hero() {
  return (
    <div style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container">
        <div style={{ maxWidth: "700px" }}>
          <span className="eyebrow">About EquityX</span>
          <h1 style={{ marginBottom: "1.5rem" }}>Democratising Wealth Creation for Every Indian.</h1>
          <p style={{ fontSize: "1.125rem", color: "var(--text-secondary)", maxWidth: "600px", lineHeight: "1.8" }}>
            Founded in 2018, EquityX set out with one mission: make professional-grade trading tools
            accessible to every Indian — not just the ultra-wealthy. Today we're India's fastest-growing
            discount broker with 500,000+ active accounts.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Hero;
