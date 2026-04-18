import React from "react";

const values = [
  { icon: "🎯", title: "Transparency First", desc: "Every fee, every charge — disclosed upfront. No surprises, no fine print designed to confuse." },
  { icon: "⚡", title: "Speed as a Right", desc: "Fast execution shouldn't be a premium feature. Every trader deserves sub-millisecond order routing." },
  { icon: "🔒", title: "Security Above All", desc: "SEBI-compliant fund segregation, two-factor auth, and 256-bit encryption protect every account." },
  { icon: "🧠", title: "Education Over Hype", desc: "We educate traders to make better decisions, not push them towards high-risk strategies for our gain." },
];

const milestones = [
  { year: "2018", event: "EquityX founded. First 100 accounts opened." },
  { year: "2019", event: "NSE & BSE membership acquired. Full equity trading launched." },
  { year: "2020", event: "Crossed 50,000 accounts during COVID bull run." },
  { year: "2021", event: "F&O and commodity trading launched. Raised Series A." },
  { year: "2022", event: "Mobile app launched. 200K active traders." },
  { year: "2023", event: "Algo trading API opened. 400K accounts." },
  { year: "2024", event: "500K+ active traders. ₹5L Cr+ daily volume." },
];

function Team() {
  return (
    <section className="section">
      <div className="container">
        {/* Values */}
        <div className="section-header">
          <span className="eyebrow">Our Values</span>
          <h2>Built on Principles,<br />Not Just Profit.</h2>
        </div>
        <div className="grid grid-2" style={{ marginBottom: "5rem" }}>
          {values.map((v) => (
            <div className="feature-card" key={v.title}>
              <div className="feature-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="section-header">
          <span className="eyebrow">Our Journey</span>
          <h2>6 Years of Building Trust.</h2>
        </div>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          {milestones.map((m, i) => (
            <div key={m.year} style={{ display: "flex", gap: "1.5rem", marginBottom: "1.5rem", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, fontFamily: "var(--font-mono)", fontSize: "0.78rem", fontWeight: "700", color: "var(--primary)", background: "var(--primary-glow)", border: "1px solid var(--primary-border)", padding: "0.25rem 0.6rem", borderRadius: "var(--r-sm)", marginTop: "0.15rem" }}>{m.year}</div>
              <div style={{ flex: 1, paddingBottom: i < milestones.length - 1 ? "1.5rem" : 0, borderBottom: i < milestones.length - 1 ? "1px solid var(--border)" : "none" }}>
                <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "0.9rem" }}>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
