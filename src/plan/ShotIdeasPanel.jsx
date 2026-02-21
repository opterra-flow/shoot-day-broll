import { useState } from "react";

export function ShotIdeasPanel({ ideas, onSelect }) {
  const [expanded, setExpanded] = useState(false);

  if (!ideas || ideas.length === 0) return null;

  return (
    <div style={{ marginBottom: 10 }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: "0.75rem", fontWeight: 700, color: "#C9A961",
          textTransform: "uppercase", letterSpacing: "0.1em",
          display: "flex", alignItems: "center", gap: 6,
          padding: "10px 0",
          transition: "color 0.2s, text-shadow 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#D4E157";
          e.currentTarget.style.textShadow = "0 0 6px #D4E157, 0 0 16px rgba(212,225,87,0.5)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#C9A961";
          e.currentTarget.style.textShadow = "none";
        }}
      >
        {"\u{1F4A1}"} B-Roll Ideas
        <span style={{
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s", fontSize: "0.8rem",
        }}>{"\u25BE"}</span>
      </button>
      {expanded && (
        <div style={{
          display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8,
        }}>
          {ideas.map((idea, i) => (
            <button
              key={i}
              onClick={() => { onSelect(idea); setExpanded(false); }}
              style={{
                background: "#FFF8E1",
                border: "1px solid #FFE082",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: "0.78rem",
                color: "#5D4037",
                cursor: "pointer",
                textAlign: "left",
                lineHeight: 1.4,
                transition: "background 0.15s",
                width: "100%",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#FFE082"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#FFF8E1"}
            >
              {idea}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
