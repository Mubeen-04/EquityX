import React from "react";
import { Link } from "react-router-dom";

function RightSection({ productName, productDesription, badge, icon, features }) {
  return (
    <div style={{ borderBottom: "1px solid var(--border)", padding: "5rem 0" }}>
      <div className="container">
        <div className="row align-items-center" style={{ gap: "3rem 0" }}>
          {/* Content */}
          <div className="col-lg-6">
            {badge && <span className="badge badge-blue" style={{ marginBottom: "1rem" }}>{badge}</span>}
            <h2 style={{ marginBottom: "1rem" }}>{productName}</h2>
            <p style={{ fontSize: "1.0625rem", lineHeight: "1.8", marginBottom: "1.75rem" }}>{productDesription}</p>
            {features && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem", marginBottom: "2rem" }}>
                {features.map((f) => (
                  <div key={f} style={{ display: "flex", gap: "0.6rem", alignItems: "center", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--primary)", fontWeight: "700" }}>✓</span> {f}
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/signup" className="btn btn-primary">Get Started →</Link>
              <button className="btn btn-ghost">Documentation</button>
            </div>
          </div>

          {/* Visual panel */}
          <div className="col-lg-5 offset-lg-1">
            <div style={{
              background: "var(--surface-2)", border: "1px solid var(--border)",
              borderRadius: "var(--r-2xl)", padding: "2rem",
              position: "relative", overflow: "hidden",
              boxShadow: "var(--shadow-xl), 0 0 24px rgba(0,212,255,0.08)",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--bull) 0%, var(--primary) 100%)" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.5rem" }}>
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--bear)" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--gold)" }} />
                <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--bull)" }} />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", marginLeft: "0.5rem" }}>equityx — {productName?.toLowerCase()}</span>
              </div>
              <div style={{ textAlign: "center", padding: "2rem 0", fontSize: "4rem" }}>{icon || "🎯"}</div>
              <div style={{ background: "var(--surface-3)", borderRadius: "var(--r-lg)", padding: "1rem" }}>
                <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  {["Active", "Connected", "Secure"].map((s, i) => (
                    <span key={s} className="badge" style={{ color: ["var(--bull)","var(--primary)","var(--gold)"][i], background: ["var(--bull-glow)","var(--primary-glow)","rgba(255,215,0,0.1)"][i], border: `1px solid ${["var(--bull-border)","var(--primary-border)","rgba(255,215,0,0.2)"][i]}` }}>{s}</span>
                  ))}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  <div style={{ color: "var(--bull)", marginBottom: "0.25rem" }}>▶ System operational</div>
                  <div>Latency: 0.8ms · Uptime: 99.99%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RightSection;
