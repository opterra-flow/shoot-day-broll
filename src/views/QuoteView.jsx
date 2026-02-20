import { useState, useEffect } from "react";
import { OPENING_QUOTE } from "../data/quote";

export function QuoteView({ onContinue }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      onClick={onContinue}
      style={{
        minHeight: "100vh",
        background: "#1A3A2F",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 32px",
        cursor: "pointer",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}
    >
      <div style={{
        maxWidth: 380,
        textAlign: "center",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 1.2s ease, transform 1.2s ease",
      }}>
        <div style={{
          fontSize: "2.5rem",
          marginBottom: 24,
        }}>{"\u2728"}</div>
        <p style={{
          color: "#fff",
          fontSize: "1.15rem",
          lineHeight: 1.8,
          fontWeight: 400,
          letterSpacing: "0.01em",
          fontStyle: "italic",
        }}>
          {OPENING_QUOTE}
        </p>
        <div style={{
          marginTop: 48,
          color: "#C9A961",
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          opacity: visible ? 0.8 : 0,
          transition: "opacity 1.8s ease 0.6s",
        }}>
          Tap to begin
        </div>
      </div>
    </div>
  );
}
