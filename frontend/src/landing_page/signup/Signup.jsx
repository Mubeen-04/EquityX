import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Signup() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "", pan: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  const handleChange = (e) => {
    let value = e.target.value;
    // Convert PAN to uppercase
    if (e.target.name === "pan") {
      value = value.toUpperCase();
    }
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Signup API call
      const signupRes = await axios.post(
        `${import.meta.env.VITE_API_URL || ""}/signup`,
        { 
          name: form.name, 
          email: form.email, 
          password: form.password,
          phone: form.phone,
          pan: form.pan
        }
      );

      if (signupRes.data.userId) {
        // Auto-login after signup
        const loginRes = await axios.post(
          `${import.meta.env.VITE_API_URL || ""}/login`,
          { email: form.email, password: form.password }
        );

        if (loginRes.data.token) {
          // Store auth data
          localStorage.setItem("token", loginRes.data.token);
          localStorage.setItem("userId", loginRes.data.userId);
          localStorage.setItem("email", loginRes.data.email);
          localStorage.setItem("name", loginRes.data.name);
          // Redirect to dashboard folder application
          const dashboardUrl = new URL("http://localhost:3001");
          dashboardUrl.searchParams.set("token", loginRes.data.token);
          dashboardUrl.searchParams.set("email", loginRes.data.email);
          dashboardUrl.searchParams.set("name", loginRes.data.name);
          dashboardUrl.searchParams.set("userId", loginRes.data.userId);
          window.location.href = dashboardUrl.toString();
        }
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 68px)", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface-0)", padding: "3rem 1.5rem", position: "relative" }}>
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ width: "100%", maxWidth: "600px", position: "relative", zIndex: 1 }}>
        <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-2xl)", padding: "2.5rem", boxShadow: "var(--shadow-xl)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg, var(--primary) 0%, var(--bull) 100%)" }} />

          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: "900", color: "var(--text-primary)", letterSpacing: "-0.04em", marginBottom: "0.25rem" }}>Open Free Account</div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Start trading in 10 minutes
            </div>
          </div>

          {msg && (
            <div style={{ background: msg.toLowerCase().includes("success") ? "var(--bull-glow)" : "var(--bear-glow)", border: msg.toLowerCase().includes("success") ? "1px solid var(--bull-border)" : "1px solid rgba(255,71,87,0.3)", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: msg.toLowerCase().includes("success") ? "var(--bull)" : "var(--bear)" }}>
              {msg.toLowerCase().includes("success") ? "✓" : "⚠"} {msg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-control" placeholder="As per PAN card" value={form.name} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Email Address</label>
              <input type="email" name="email" className="form-control" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">Mobile Number</label>
              <input type="tel" name="phone" className="form-control" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={handleChange} />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label className="form-label">PAN Number</label>
              <input type="text" name="pan" className="form-control" placeholder="ABCDE1234F" value={form.pan} onChange={handleChange} maxLength={10} style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.08em" }} />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="form-label">Create Password</label>
              <input type="password" name="password" className="form-control" placeholder="Min 8 characters" value={form.password} onChange={handleChange} required />
            </div>

            <div style={{ background: "var(--bull-glow)", border: "1px solid var(--bull-border)", borderRadius: "var(--r-md)", padding: "0.75rem 1rem", marginBottom: "1.5rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--bull)", display: "flex", gap: "0.5rem", alignItems: "flex-start" }}>
              <span>✓</span>
              <span>₹0 account opening fee. ₹0 delivery brokerage. Instant activation via Aadhaar e-KYC.</span>
            </div>

            <button type="submit" className="btn btn-bull btn-full" style={{ marginBottom: "1rem" }} disabled={loading}>
              {loading ? "Creating Account..." : "Create Free Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "0.8rem", color: "var(--text-tertiary)", margin: 0 }}>
            Already a member?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: "600" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
