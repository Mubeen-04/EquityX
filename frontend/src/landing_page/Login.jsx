import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL || ""}/login`, form);
      if (res.data.token) {
        // Store auth data
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", res.data.email);
        localStorage.setItem("name", res.data.name);
        // Redirect to dashboard folder application
        const isDev = window.location.hostname === "localhost";
        const dashboardUrl = new URL(isDev ? "http://localhost:3001" : `${window.location.origin}/dashboard`);
        dashboardUrl.searchParams.set("token", res.data.token);
        dashboardUrl.searchParams.set("email", res.data.email);
        dashboardUrl.searchParams.set("name", res.data.name);
        dashboardUrl.searchParams.set("userId", res.data.userId);
        window.location.href = dashboardUrl.toString();
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-0)", padding: "3rem 1.5rem", position: "relative" }}>
      {/* Grid bg */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: "420px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-2xl)", padding: "2.5rem", boxShadow: "var(--shadow-xl)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--primary) 0%, var(--bull) 100%)" }} />

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "900", color: "var(--text-primary)", letterSpacing: "-0.04em", marginBottom: "0.25rem" }}>
              EQUITYX
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Sign in to your account
            </div>
          </div>

          {msg && (
            <div style={{ background: "var(--bear-glow)", border: "1px solid rgba(255,71,87,0.3)", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--bear)" }}>
              ⚠ {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="trader@example.com" value={form.email} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <label className="form-label" style={{ margin: 0 }}>Password</label>
                <a href="#forgot" style={{ fontSize: "0.8rem", color: "var(--primary)" }}>Forgot?</a>
              </div>
              <input type="password" name="password" className="form-control" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary btn-full">
              Sign In →
            </button>
          </form>

          <div style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: "var(--text-tertiary)" }}>
            No account?{" "}
            <Link to="/signup" style={{ color: "var(--primary)", fontWeight: "600" }}>Open free account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
