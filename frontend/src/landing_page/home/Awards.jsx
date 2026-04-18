import React from "react";

const features = [
  { icon: "📊", title: "Real-Time Charts", desc: "TradingView-powered charts with 100+ indicators, multi-timeframe analysis, and drawing tools." },
  { icon: "🛡️", title: "SEBI Compliant", desc: "Fully regulated by SEBI. Your funds are segregated, your data is encrypted, and your trades are transparent." },
  { icon: "🤖", title: "Smart Alerts", desc: "AI-powered price alerts, technical pattern recognition, and portfolio risk notifications." },
  { icon: "📱", title: "Trade Anywhere", desc: "Fully featured mobile app for iOS and Android. Trade, monitor, and manage from anywhere." },
];

function Awards() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Platform Features</span>
          <h2>Everything You Need<br />To Win the Market</h2>
          <p>EquityX combines professional-grade tools with an intuitive interface so you spend less time navigating and more time trading.</p>
        </div>

        <div className="grid grid-3">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust row */}
        <div style={{ marginTop: "4rem", paddingTop: "3rem", borderTop: "1px solid var(--border)" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <span className="eyebrow">Trusted & Regulated</span>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            {["SEBI Registered", "NSE Member", "BSE Member", "CDSL Partner", "MCX Member", "ISO 27001"].map((t) => (
              <div key={t} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: "600", color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--bull)", display: "inline-block" }}></span>
                {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Awards;
