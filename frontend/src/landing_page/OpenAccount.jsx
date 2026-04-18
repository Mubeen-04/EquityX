import React from "react";
import { Link } from "react-router-dom";

function OpenAccount() {
  return (
    <section style={{ padding: "5rem 0", background: "var(--surface-1)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
      <div className="container">
        <div style={{
          background: "var(--surface-2)",
          border: "1px solid var(--border-accent)",
          borderRadius: "var(--r-2xl)",
          padding: "4rem 3rem",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",
          boxShadow: "var(--shadow-glow)",
        }}>
          {/* Top accent bar */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, transparent, var(--primary), var(--bull), transparent)" }} />

          {/* Grid overlay */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)", backgroundSize: "40px 40px", pointerEvents: "none" }} />

          <div style={{ position: "relative", zIndex: 1 }}>
            <span className="eyebrow" style={{ marginBottom: "1.25rem", display: "inline-block" }}>Zero Cost to Start</span>
            <h2 style={{ marginBottom: "1rem", fontSize: "clamp(1.75rem, 4vw, 3rem)" }}>
              Ready to Trade Like a Pro?
            </h2>
            <p style={{ fontSize: "1.0625rem", maxWidth: "520px", margin: "0 auto 2.5rem", color: "var(--text-secondary)" }}>
              Join 500,000+ traders. Open your demat and trading account for free
              in under 10 minutes with instant Aadhaar e-KYC.
            </p>

            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "2rem" }}>
              <Link to="/signup" className="btn btn-bull btn-xl">
                Open Free Account →
              </Link>
              <Link to="/product" className="btn btn-outline btn-xl">
                Explore Features
              </Link>
            </div>

            <div style={{ display: "flex", gap: "2rem", justifyContent: "center", flexWrap: "wrap" }}>
              {[
                { icon: "✓", text: "₹0 account opening" },
                { icon: "✓", text: "₹0 equity delivery" },
                { icon: "✓", text: "Instant activation" },
                { icon: "✓", text: "SEBI regulated" },
              ].map(({ icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-tertiary)", letterSpacing: "0.04em" }}>
                  <span style={{ color: "var(--bull)" }}>{icon}</span> {text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default OpenAccount;
