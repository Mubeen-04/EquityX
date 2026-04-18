import React, { useState, useEffect } from "react";
import { getMarketPrices } from "../../api";

function Stats() {
  const [marketData, setMarketData] = useState([]);

  useEffect(() => {
    fetchLiveMarketData();
    // Refresh every 5 seconds
    const interval = setInterval(fetchLiveMarketData, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchLiveMarketData = async () => {
    try {
      const res = await getMarketPrices();
      const prices = res.data || {};
      
      // Get top 7 movers by percentage
      const topMovers = Object.entries(prices)
        .map(([sym, data]) => ({
          sym,
          name: sym,
          price: data.price.toFixed(2),
          chg: data.percent,
          up: !data.isDown,
        }))
        .sort((a, b) => {
          const percentA = parseFloat(a.chg);
          const percentB = parseFloat(b.chg);
          return Math.abs(percentB) - Math.abs(percentA);
        })
        .slice(0, 7);
      
      setMarketData(topMovers);
    } catch (err) {
      console.error("Error fetching market data:", err);
    }
  };
  return (
    <section className="section section-alt">
      <div className="container">
        <div className="row align-items-start" style={{ gap: "3rem 0" }}>

          {/* Left — Info */}
          <div className="col-lg-5">
            <span className="eyebrow">Why EquityX</span>
            <h2 style={{ marginBottom: "2rem" }}>Built for Traders,<br />by Traders.</h2>

            <div className="info-block">
              <h3>Zero Hidden Fees</h3>
              <p>No surprises. Know exactly what you pay before every trade. ₹0 for equity delivery, flat ₹20 for F&O.</p>
            </div>
            <div className="info-block">
              <h3>Sub-Millisecond Execution</h3>
              <p>Our co-located servers ensure your orders reach the exchange in under 1ms. Trade at the exact price you see.</p>
            </div>
            <div className="info-block">
              <h3>Institutional Analytics</h3>
              <p>Advanced charting, options chain, portfolio heat-maps, and AI-powered risk scoring — at no extra cost.</p>
            </div>
            <div className="info-block">
              <h3>Bank-Grade Security</h3>
              <p>Two-factor authentication, 256-bit encryption, and SEBI-compliant fund segregation keep your capital safe.</p>
            </div>
          </div>

          {/* Right — Market Widget */}
          <div className="col-lg-6 offset-lg-1">
            <div className="market-widget">
              <div className="market-widget-header">
                <span className="market-widget-title">Top Movers — NSE</span>
                <span className="live-dot">Live</span>
              </div>
              {marketData.map((row) => (
                <div className="market-row" key={row.sym}>
                  <div>
                    <div className="market-row-sym">{row.sym}</div>
                    <div className="market-row-name">{row.name}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="market-row-price">₹{row.price}</div>
                    <div className={`market-row-chg ${row.up ? "chg-up" : "chg-dn"}`}>
                      {row.up ? "▲" : "▼"} {row.chg}
                    </div>
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

export default Stats;
