import React from "react";
import { Link } from "react-router-dom";

const resources = [
  { tag: "BEGINNER", title: "Stock Market 101", desc: "Learn how Indian markets work, from Sensex to settlement.", time: "12 min read", icon: "📖" },
  { tag: "INTERMEDIATE", title: "Options Strategies", desc: "Covered calls, straddles, iron condors — master the Greeks.", time: "24 min read", icon: "🎯" },
  { tag: "ADVANCED", title: "Algo Trading with APIs", desc: "Build and deploy your own automated trading strategy.", time: "40 min read", icon: "💻" },
];

function Education() {
  return (
    <section className="section">
      <div className="container">
        <div className="row align-items-center" style={{ gap: "3rem 0" }}>
          <div className="col-lg-5">
            <span className="eyebrow">Learn & Grow</span>
            <h2 style={{ marginBottom: "1.25rem" }}>Trade with<br />Confidence.</h2>
            <p style={{ marginBottom: "2rem" }}>
              Access our library of 500+ free courses, live webinars by SEBI-registered analysts,
              and daily market commentary — no subscription required.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem", marginBottom: "2rem" }}>
              {["500+ free courses & tutorials", "Daily market analysis & commentary", "Paper trading to practice risk-free", "Community of 500K+ traders"].map(item => (
                <div key={item} style={{ display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.9rem", color: "var(--text-secondary)" }}>
                  <span style={{ color: "var(--bull)", fontWeight: "700", fontSize: "0.8rem" }}>✓</span>
                  {item}
                </div>
              ))}
            </div>
            <Link to="/product" className="btn btn-primary">
              Explore Learning Hub →
            </Link>
          </div>

          <div className="col-lg-6 offset-lg-1">
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {resources.map((r) => (
                <div key={r.title} className="feature-card" style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.25rem" }}>
                  <div className="feature-icon" style={{ margin: 0, flexShrink: 0 }}>{r.icon}</div>
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span className="badge badge-blue">{r.tag}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)" }}>{r.time}</span>
                    </div>
                    <h3 style={{ fontSize: "0.975rem", marginBottom: "0.3rem" }}>{r.title}</h3>
                    <p style={{ fontSize: "0.85rem", margin: 0 }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Education;
