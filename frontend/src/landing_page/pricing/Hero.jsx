import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container">
        <div style={{ maxWidth: "640px" }}>
          <span className="eyebrow">Pricing</span>
          <h1 style={{ marginBottom: "1.25rem" }}>Simple, Transparent<br />Pricing.</h1>
          <p style={{ fontSize: "1.125rem", marginBottom: "2rem", maxWidth: "520px" }}>
            We don't take a percentage of your profits. Flat fees, no surprises.
            The less you pay us, the more you keep.
          </p>
          <Link to="/signup" className="btn btn-bull btn-lg">
            Open Free Account →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hero;
