import React from "react";
import { Link } from "react-router-dom";

function LeftSection({ productName, productDesription, badge, icon, features }) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container">
        <div className="row align-items-center" style={{ gap: "3rem 0" }}>
          {/* Visual panel */}
          <div className="col-lg-5">
            <div style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "var(--r-2xl)", padding: "2rem",
              position: "relative", overflow: "hidden",
              boxShadow: "var(--shadow-xl), var(--shadow-glow)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--primary) 0%, var(--bull) 100%)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--bear)" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--gold)" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--bull)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>equityx — {productName?.toLowerCase()}</span>
              </div>
              <div style={{ textAlign: "center", padding: "2rem 0", fontSize: "4rem" }}>{icon || "📊"}</div>
              <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-lg)", padding: "1rem", marginTop: "0.5rem" }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.5rem" }}>Quick Stats</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.75rem" }}>
                  {["99.9ms", "4.2M+", "₹0 fee"].map((v, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontWeight: "700", color: "var(--primary)", fontSize: "0.9rem" }}>{v}</div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{["Latency","Orders/day","Delivery"][i]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="col-lg-6 offset-lg-1">
            {badge && <span className="badge badge-bull" style={{ marginBottom: "1rem" }}>{badge}</span>}
            <h2 style={{ marginBottom: "1rem" }}>{productName}</h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: "1.8", marginBottom: "1.75rem" }}>{productDesription}</p>
            {features && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
                {features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--bull)", fontWeight: "700" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/signup" className="btn btn-primary">Try for Free →</Link>
              <button className="btn btn-ghost">Learn More</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeftSection;
