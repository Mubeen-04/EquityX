import React from "react";
import Hero from "./Hero";
import LeftSection from "./LeftSection";
import RightSection from "./RightSection";
import Universe from "./Universe";

function ProductsPage() {
  return (
    <>
      <Hero />

      <LeftSection
        icon="📈"
        badge="FLAGSHIP"
        productName="EquityX Kite"
        productDesription="Our ultra-fast flagship trading terminal. Stream live L1/L2 market data, build advanced multi-indicator charts, and execute orders in milliseconds — all from a beautifully clean interface."
        features={[
          "100+ technical indicators & drawing tools",
          "Multi-chart layouts with linked watchlists",
          "One-click bracket & cover orders",
          "Basket order execution for options strategies",
          "Available on Web, Android & iOS",
        ]}
      />

      <RightSection
        icon="📋"
        badge="ANALYTICS"
        productName="EquityX Console"
        productDesription="Your central command center. Gain deep insight into your trading performance with P&L reports, tax statements, fund flows, and advanced portfolio visualisations — all in one place."
        features={[
          "FIFO/LIFO-accurate realised P&L reports",
          "Capital gains tax statements for ITR filing",
          "Detailed fund and margin statements",
          "Portfolio heat-maps and sector allocation",
        ]}
      />

      <LeftSection
        icon="🪙"
        badge="INVEST"
        productName="EquityX Coin"
        productDesription="Invest in direct mutual funds at zero commission. Your units are held directly in your demat account — eliminating distributor commissions and maximising your returns."
        features={[
          "1,000+ direct mutual fund schemes",
          "SIP setup in under 2 minutes",
          "Units credited directly to demat",
          "Compare funds side-by-side with rolling returns",
          "Available on Android & iOS",
        ]}
      />

      <RightSection
        icon="🔌"
        badge="API"
        productName="Connect API"
        productDesription="Build automated trading strategies with our battle-tested REST + WebSocket API. Used by thousands of quants and algo traders to power their own platforms and bots."
        features={[
          "Full order management via REST API",
          "Streaming live quotes via WebSocket",
          "Historical minute data going back 10 years",
          "SDK libraries for Python, JavaScript & Go",
        ]}
      />

      <LeftSection
        icon="🎓"
        badge="LEARN"
        productName="Varsity"
        productDesription="The most comprehensive free market education resource in India. 500+ modules covering everything from equity basics to advanced options Greeks — structured, illustrated, and bite-sized."
        features={[
          "500+ structured learning modules",
          "From basics to advanced F&O strategies",
          "Interactive quizzes and assessments",
          "Mobile-first app for learning on the go",
          "Completely free, forever",
        ]}
      />

      <Universe />
    </>
  );
}

export default ProductsPage;
