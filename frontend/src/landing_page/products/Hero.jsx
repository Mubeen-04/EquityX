import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container">
        <div style={{ maxWidth: "720px" }}>
          <span className="eyebrow">Platform Features</span>
          <h1 style={{ marginBottom: "1.25rem" }}>
            Built for Modern Traders.<br />
            <span style={{ color: "var(--primary)" }}>Not Modern Fads.</span>
          </h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem", maxWidth: "560px" }}>
            Every feature on EquityX was requested by real traders. Professional-grade tools,
            lightning execution, and an interface that gets out of your way.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/signup" className="btn btn-bull btn-lg">Try Free Demo →</Link>
            <Link to="/pricing" className="btn btn-outline btn-lg">View Pricing</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
