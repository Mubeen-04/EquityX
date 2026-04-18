import React, { useState } from "react";
import { submitTicket } from "../../api";

function CreateTicket() {
  const [form, setForm] = useState({ name: "", email: "", category: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await submitTicket(form);
      console.log("Ticket submitted:", response.data);
      setSent(true);
    } catch (err) {
      console.error("Error submitting ticket:", err);
      setError(err.response?.data?.msg || "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section section-alt">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            {sent ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
                <h2 style={{ marginBottom: "1rem" }}>Ticket Submitted</h2>
                <p>We've received your request. Our support team will respond within 2–4 hours on trading days.</p>
                <button 
                  className="btn btn-outline mt-6" 
                  onClick={() => {
                    setSent(false);
                    setForm({ name: "", email: "", category: "", message: "" });
                  }}
                >
                  Submit Another
                </button>
              </div>
            ) : (
              <>
                <div className="section-header" style={{ marginBottom: "2rem" }}>
                  <span className="eyebrow">Get Support</span>
                  <h2>Submit a Ticket</h2>
                  <p>Can't find your answer? Our team will get back to you within 2–4 hours.</p>
                </div>
                <div style={{ background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: "var(--r-xl)", padding: "2rem" }}>
                  {error && (
                    <div style={{ 
                      background: "#fee", 
                      border: "1px solid #fcc", 
                      color: "#c33", 
                      padding: "1rem", 
                      borderRadius: "0.5rem", 
                      marginBottom: "1rem" 
                    }}>
                      {error}
                    </div>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                      <div>
                        <label className="form-label">Full Name</label>
                        <input type="text" name="name" className="form-control" placeholder="Your name" value={form.name} onChange={handleChange} required disabled={loading} />
                      </div>
                      <div>
                        <label className="form-label">Email</label>
                        <input type="email" name="email" className="form-control" placeholder="Registered email" value={form.email} onChange={handleChange} required disabled={loading} />
                      </div>
                    </div>
                    <div style={{ marginBottom: "1rem" }}>
                      <label className="form-label">Category</label>
                      <select name="category" className="form-control" value={form.category} onChange={handleChange} required disabled={loading}>
                        <option value="">Select a category</option>
                        <option>Account & KYC</option>
                        <option>Deposits & Withdrawals</option>
                        <option>Order Execution</option>
                        <option>Brokerage & Charges</option>
                        <option>Technical Issue</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div style={{ marginBottom: "1.5rem" }}>
                      <label className="form-label">Describe Your Issue</label>
                      <textarea name="message" className="form-control" placeholder="Please describe the issue in detail including relevant order IDs or timestamps." value={form.message} onChange={handleChange} rows={5} required disabled={loading} style={{ resize: "vertical" }} />
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                      {loading ? "Submitting..." : "Submit Ticket →"}
                    </button>
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateTicket;
