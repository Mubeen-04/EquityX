import React, { useState, useEffect, useContext, useMemo } from "react";
import { useRealTime } from "../RealTimeContext";
import GeneralContext from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import { Tooltip, Grow } from "@mui/material";
import "../css/Holdings.css";

const Holdings = () => {
  const { holdings, isConnected, mode, lastUpdate, refreshNow, marketPrices } = useRealTime();
  const generalContext = useContext(GeneralContext);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [totalPL, setTotalPL] = useState(0);
  const updateCountRef = React.useRef(0);

  // Log when holdings data changes (for debugging real-time updates)
  useEffect(() => {
    if (holdings.length > 0) {
      updateCountRef.current += 1;
      const newCount = updateCountRef.current;
      console.log(
        `Holdings update #${newCount} at ${new Date().toLocaleTimeString()} - ${holdings.length} stocks`
      );
      if (newCount % 3 === 0) {
        console.log("Sample prices:", holdings.slice(0, 3).map((s) => `${s.name}: ₹${(s.price || 0).toFixed(2)}`));
      }
    }
  }, [holdings]);

  // Merge holdings with real-time market prices
  const holdingsWithLivePrices = useMemo(() => {
    return holdings.map((stock) => {
      const livePrice = marketPrices[stock.name];
      return {
        ...stock,
        price: livePrice?.price ?? stock.price,
        percent: livePrice?.percent ?? stock.percent,
        isDown: livePrice?.isDown ?? false,
        openPrice: livePrice?.openPrice ?? stock.price, // Opening price for day change calculation
        isLive: !!livePrice, // Mark if has real-time price
      };
    });
  }, [holdings, marketPrices]);

  // Calculate totals
  useEffect(() => {
    if (holdingsWithLivePrices.length > 0) {
      let totalInv = 0;
      let totalCurVal = 0;

      holdingsWithLivePrices.forEach((stock) => {
        const price = stock.price || 0;
        const avg = stock.avg || 0;
        const qty = stock.qty || 0;
        
        const investmentValue = avg * qty;
        const currentVal = price * qty;
        totalInv += investmentValue;
        totalCurVal += currentVal;
      });

      setTotalInvestment(totalInv);
      setCurrentValue(totalCurVal);
      setTotalPL(totalCurVal - totalInv);
    }
  }, [holdingsWithLivePrices]);

  const labels = holdingsWithLivePrices.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: holdingsWithLivePrices.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  const isPLPositive = totalPL >= 0;

  return (
    <>
      <h3 className="title">Holdings ({holdings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {holdingsWithLivePrices.map((stock, index) => {
              const price = stock.price || 0;
              const avg = stock.avg || 0;
              const qty = stock.qty || 0;
              const openPrice = stock.openPrice || stock.price || 0;
              
              const curValue = price * qty;
              const isProfit = curValue - avg * qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              
              // Calculate real-time net change: (current price - avg price) / avg price * 100
              const netPercent = avg > 0 ? ((price - avg) / avg * 100) : 0;
              const netStr = (netPercent >= 0 ? "+" : "") + netPercent.toFixed(2) + "%";
              const netClass = netPercent >= 0 ? "profit" : "loss";
              
              // Calculate real-time day change: (current price - opening price) / opening price * 100
              const dayPercent = openPrice > 0 ? ((price - openPrice) / openPrice * 100) : 0;
              const dayStr = (dayPercent >= 0 ? "+" : "") + dayPercent.toFixed(2) + "%";
              const dayClass = dayPercent >= 0 ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - avg * qty).toFixed(2)}
                  </td>
                  <td className={netClass}>{netStr}</td>
                  <td className={dayClass}>{dayStr}</td>
                  <td>
                    <Tooltip title="Sell" placement="top" arrow TransitionComponent={Grow}>
                      <button
                        onClick={() => generalContext.openSellWindow(stock.name)}
                        className="sell-button"
                      >
                        Sell
                      </button>
                    </Tooltip>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {(totalInvestment || 0).toFixed(2)}
            <span></span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {(currentValue || 0).toFixed(2)}
            <span></span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={isPLPositive ? "profit" : "loss"}>
            {(totalPL || 0).toFixed(2)} ({(totalInvestment > 0 ? ((totalPL / totalInvestment) * 100) : 0).toFixed(2)}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>
      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
