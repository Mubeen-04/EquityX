import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{
      minHeight: "calc(100vh - 68px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--surface-0)", padding: "3rem 1.5rem",
      position: "relative", overflow: "hidden",
    }}>
      {/* Grid bg */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        {/* Large 404 */}
        <div style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(6rem, 20vw, 14rem)",
          fontWeight: "900",
          lineHeight: "1",
          letterSpacing: "-0.05em",
          background: "linear-gradient(135deg, var(--surface-3) 0%, var(--surface-4) 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          marginBottom: "0.5rem",
          userSelect: "none",
        }}>
          404
        </div>

        <div style={{
          fontFamily: "var(--font-mono)", fontSize: "0.8rem",
          color: "var(--bear)", background: "var(--bear-glow)",
          border: "1px solid rgba(255,71,87,0.3)",
          padding: "0.35rem 1rem", borderRadius: "var(--r-full)",
          letterSpacing: "0.08em", textTransform: "uppercase",
          display: "inline-flex", alignItems: "center", gap: "0.5rem",
          marginBottom: "1.5rem",
        }}>
          <span>▼</span> Page Not Found
        </div>

        <h2 style={{ marginBottom: "1rem", color: "var(--text-primary)" }}>
          This Route Doesn't Exist
        </h2>
        <p style={{ marginBottom: "2.5rem", maxWidth: "400px", margin: "0 auto 2.5rem", color: "var(--text-secondary)" }}>
          Looks like this page has been delisted. Let's get you back to familiar territory.
        </p>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/" className="btn btn-primary btn-lg">← Back to Home</Link>
          <Link to="/support" className="btn btn-ghost btn-lg">Get Support</Link>
        </div>

        {/* Terminal flavour text */}
        <div style={{
          marginTop: "3rem",
          background: "var(--surface-2)", border: "1px solid var(--border)",
          borderRadius: "var(--r-xl)", padding: "1.25rem 1.5rem",
          maxWidth: "420px", margin: "3rem auto 0",
          fontFamily: "var(--font-mono)", fontSize: "0.78rem",
          textAlign: "left",
        }}>
          <div style={{ color: "var(--text-muted)", marginBottom: "0.5rem" }}>$ equityx navigate --route="current"</div>
          <div style={{ color: "var(--bear)" }}>ERROR: Route not found (HTTP 404)</div>
          <div style={{ color: "var(--text-muted)", marginTop: "0.25rem" }}>Suggestion: Check URL or navigate home</div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
