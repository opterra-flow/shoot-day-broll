import { ShotIdeasPanel } from "../plan/ShotIdeasPanel";

export function ShotNoteCard({ shot, pillarId, shotIndex, notes, setNotes, shotIdeas }) {
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

    </div>
  );
}
