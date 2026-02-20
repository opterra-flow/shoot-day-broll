import { useState, useRef, useEffect } from "react";
import { HOOKS } from "../data/hooks";

export function HookBankModal({ isOpen, onClose, onSelect }) {
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = searchQuery
    ? HOOKS.filter((h) => h.toLowerCase().includes(searchQuery.toLowerCase()))
    : HOOKS;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      display: "flex", flexDirection: "column", justifyContent: "flex-end",
    }}>
      {/* Scrim */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.5)",
        }}
      />

      {/* Bottom sheet */}
      <div style={{
        position: "relative",
        background: "#fff",
        borderRadius: "20px 20px 0 0",
        maxHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        animation: "slideUp 0.3s ease",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px 12px",
          borderBottom: "1px solid #eee",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1A3A2F" }}>Hook Bank</div>
            <div style={{ fontSize: "0.72rem", color: "#999", marginTop: 2 }}>
              {filtered.length === HOOKS.length
                ? `${HOOKS.length} hooks`
                : `Showing ${filtered.length} of ${HOOKS.length}`}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "#f0f0f0", border: "none", borderRadius: "50%",
            width: 32, height: 32, fontSize: "1rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#666",
          }}>{"\u2715"}</button>
        </div>

        {/* Search */}
        <div style={{ padding: "12px 20px", flexShrink: 0 }}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search hooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%", padding: "10px 14px",
              border: "1.5px solid #e0e0e0", borderRadius: 10,
              fontSize: "0.9rem", fontFamily: "inherit",
              background: "#FAFAFA", boxSizing: "border-box",
              outline: "none",
            }}
            onFocus={(e) => e.target.style.borderColor = "#D4E157"}
            onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
          />
        </div>

        {/* Results */}
        <div style={{
          overflowY: "auto", padding: "0 20px 20px",
          WebkitOverflowScrolling: "touch",
          flex: 1,
        }}>
          {filtered.length === 0 && (
            <div style={{
              textAlign: "center", color: "#999", padding: "24px 0",
              fontSize: "0.85rem",
            }}>No hooks match your search</div>
          )}
          {filtered.map((hook, i) => (
            <div
              key={i}
              onClick={() => { onSelect(hook); onClose(); }}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                marginBottom: 6,
                background: "#F9FBE7",
                border: "1px solid #F0F4C3",
                cursor: "pointer",
                fontSize: "0.84rem",
                color: "#333",
                lineHeight: 1.5,
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "#F0F4C3"}
              onMouseLeave={(e) => e.currentTarget.style.background = "#F9FBE7"}
            >
              {hook}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
