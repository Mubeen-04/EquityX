import React from "react";
import { Link } from "react-router-dom";

const ecosystem = [
  { name: "EquityX Kite", desc: "Flagship web & mobile trading terminal", icon: "🖥️", tag: "CORE" },
  { name: "EquityX Console", desc: "Portfolio analytics & reporting dashboard", icon: "📊", tag: "CORE" },
  { name: "EquityX Coin", desc: "Commission-free direct mutual funds", icon: "🪙", tag: "INVEST" },
  { name: "Connect API", desc: "REST API for algo & automated trading", icon: "🔌", tag: "API" },
  { name: "Varsity",     desc: "Free market education & courses library", icon: "🎓", tag: "LEARN" },
  { name: "Streak",      desc: "Visual no-code algo strategy builder", icon: "⚡", tag: "PARTNER" },
];

function Universe() {
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">The EquityX Ecosystem</span>
          <h2>One Platform. Every Tool<br />You'll Ever Need.</h2>
          <p>
            From your first stock purchase to advanced algorithmic strategies,
            EquityX has a dedicated tool for every stage of your trading journey.
          </p>
        </div>

        <div className="grid grid-3">
          {ecosystem.map((item) => (
            <div className="feature-card" key={item.name}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div className="feature-icon" style={{ margin: 0 }}>{item.icon}</div>
                <span className={`badge ${item.tag === "CORE" ? "badge-bull" : item.tag === "API" ? "badge-blue" : item.tag === "PARTNER" ? "badge-gray" : "badge-blue"}`}>
                  {item.tag}
                </span>
              </div>
              <h3 style={{ marginBottom: "0.5rem" }}>{item.name}</h3>
              <p style={{ margin: 0 }}>{item.desc}</p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "3.5rem" }}>
          <p style={{ marginBottom: "1.5rem", color: "var(--text-secondary)" }}>
            Join 500,000+ traders already using the EquityX platform.
          </p>
          <Link to="/signup" className="btn btn-bull btn-xl">
            Open Free Account →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Universe;
