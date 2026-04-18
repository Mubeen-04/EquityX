import React from "react";

const rows = [
  { segment: "Equity Delivery", brokerage: "₹0", stt: "0.1% (buy & sell)", exchange: "0.00345%", gst: "18% on brokerage", stamp: "0.015%", sebi: "₹10 / Cr" },
  { segment: "Equity Intraday", brokerage: "₹20 or 0.03%", stt: "0.025% (sell)", exchange: "0.00345%", gst: "18%", stamp: "0.003%", sebi: "₹10 / Cr" },
  { segment: "Equity Futures", brokerage: "₹20 or 0.03%", stt: "0.0125% (sell)", exchange: "0.00235%", gst: "18%", stamp: "0.002%", sebi: "₹10 / Cr" },
  { segment: "Equity Options", brokerage: "Flat ₹20", stt: "0.0625% (sell, premium)", exchange: "0.053%", gst: "18%", stamp: "0.003%", sebi: "₹10 / Cr" },
  { segment: "Currency Futures", brokerage: "₹20 or 0.03%", stt: "—", exchange: "0.00115%", gst: "18%", stamp: "0.0001%", sebi: "₹10 / Cr" },
];

function Brokerage() {
  return (
    <section className="section">
      <div className="container">
        <div className="section-header">
          <span className="eyebrow">Full Fee Schedule</span>
          <h2>Complete Charge Breakdown</h2>
          <p>All charges are disclosed upfront. No percentage-based hidden fees, no account maintenance charges.</p>
        </div>

        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Segment</th>
                <th>Brokerage</th>
                <th>STT / CTT</th>
                <th>Exchange Charges</th>
                <th>GST</th>
                <th>Stamp Duty</th>
                <th>SEBI Charges</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.segment}>
                  <td style={{ fontWeight: "600", color: "var(--text-primary)" }}>{r.segment}</td>
                  <td style={{ fontFamily: "var(--font-mono)", color: "var(--bull)", fontWeight: "700" }}>{r.brokerage}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{r.stt}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{r.exchange}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{r.gst}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{r.stamp}</td>
                  <td style={{ fontFamily: "var(--font-mono)" }}>{r.sebi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "2rem", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "1.5rem", display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>DP Charges</div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>₹13.5 + GST per scrip per day (when selling)</div>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>Account Opening</div>
            <div style={{ fontWeight: "700", color: "var(--bull)" }}>₹0 — Completely Free</div>
          </div>
          <div style={{ flex: 1, minWidth: "220px" }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.35rem" }}>Annual Maintenance</div>
            <div style={{ fontWeight: "600", color: "var(--text-primary)" }}>₹300 + GST (waived first year)</div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Brokerage;
