import { ShotIdeasPanel } from "../plan/ShotIdeasPanel";

export function ShotNoteCard({ shot, pillarId, shotIndex, notes, setNotes, selectedHook, onSelectHook, onRemoveHook, shotIdeas }) {
  const conceptKey = `${pillarId}-${shotIndex}-concept`;
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 16px",
      marginBottom: 10,
      border: "1px solid #e0e0e0",
      boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{
          fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.12em", background: "#1A3A2F", color: "#D4E157",
          padding: "3px 8px", borderRadius: 4,
        }}>{shot.angle}</span>
        <span style={{ fontSize: "0.8rem", color: "#666" }}>{shot.prompt}</span>
      </div>

      {shotIdeas && (
        <ShotIdeasPanel
          ideas={shotIdeas}
          onSelect={(idea) => {
            const current = notes[conceptKey] || "";
            const newVal = current ? `${current}\n${idea}` : idea;
            setNotes({ ...notes, [conceptKey]: newVal });
          }}
        />
      )}

      <div style={{ marginTop: 8 }}>
        <label style={{
          fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "#999", display: "block", marginBottom: 4,
        }}>Your concept</label>
        <textarea
          placeholder="What's your idea for this shot?"
          value={notes[conceptKey] || ""}
          onChange={(e) => setNotes({ ...notes, [conceptKey]: e.target.value })}
          style={{
            width: "100%", minHeight: 50, padding: "8px 10px",
            border: "1.5px solid #e0e0e0", borderRadius: 8, fontSize: "0.85rem",
            fontFamily: "inherit", resize: "vertical", background: "#FAFAFA",
            boxSizing: "border-box",
          }}
          onFocus={(e) => e.target.style.borderColor = "#D4E157"}
          onBlur={(e) => e.target.style.borderColor = "#e0e0e0"}
        />
      </div>

      {/* Hook section */}
      {selectedHook ? (
        <div style={{
          marginTop: 8, padding: "10px 12px",
          background: "#F9FBE7", borderRadius: 8,
          border: "1px solid #F0F4C3",
          display: "flex", alignItems: "flex-start", gap: 8,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#9E9D24", marginBottom: 4,
            }}>Hook</div>
            <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>{selectedHook}</div>
          </div>
          <button
            onClick={onRemoveHook}
            style={{
              background: "none", border: "none", color: "#ccc",
              fontSize: "0.9rem", cursor: "pointer", padding: "0 4px",
              flexShrink: 0,
            }}
          >{"\u2715"}</button>
        </div>
      ) : (
        onSelectHook && (
          <button
            onClick={onSelectHook}
            style={{
              marginTop: 8, padding: "8px 14px",
              background: "transparent",
              border: "1.5px dashed #D4E157",
              borderRadius: 8, cursor: "pointer",
              fontSize: "0.78rem", fontWeight: 600,
              color: "#9E9D24",
              width: "100%",
              transition: "background 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "#F9FBE7"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >+ Add Hook</button>
        )
      )}
    </div>
  );
}
