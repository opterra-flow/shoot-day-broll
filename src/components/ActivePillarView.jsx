import { ShotCheckItem } from "./ShotCheckItem";

export function ActivePillarView({ pillar, checkedShots, onCheckShot, notes, setNotes, onComplete, allChecked }) {
  return (
    <div style={{
      background: pillar.bgColor,
      borderRadius: 16,
      border: `2px solid ${pillar.color}`,
      overflow: "hidden",
      boxShadow: `0 4px 20px ${pillar.color}40`,
    }}>
      <div style={{ padding: "18px 20px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <span style={{ fontSize: "1.6rem" }}>{pillar.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1A3A2F" }}>{pillar.name}</div>
            <div style={{ fontSize: "0.78rem", color: "#777" }}>{pillar.subtitle}</div>
          </div>
        </div>
        <p style={{
          fontSize: "0.82rem", color: "#555", fontStyle: "italic",
          lineHeight: 1.5, margin: "8px 0 4px",
        }}>{pillar.description}</p>
      </div>

      <div style={{
        background: `${pillar.bgColor}`,
        padding: "0 16px",
        marginBottom: 4,
      }}>
        <div style={{
          fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.12em", color: pillar.darkColor, marginBottom: 8, paddingTop: 4,
        }}>Quick Examples</div>
        {pillar.examples.map((ex, i) => (
          <div key={i} style={{ fontSize: "0.78rem", color: "#555", padding: "3px 0", display: "flex", gap: 6 }}>
            <span style={{ color: pillar.darkColor }}>{"\u2192"}</span> {ex}
          </div>
        ))}
      </div>

      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{
          fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
          letterSpacing: "0.1em", color: "#1A3A2F", marginBottom: 10,
        }}>{"\u{1F4F8}"} Shot List {"\u2014"} tap each when captured</div>

        {pillar.shots.map((shot, i) => (
          <ShotCheckItem
            key={i}
            shot={shot}
            checked={checkedShots.includes(i)}
            onCheck={() => onCheckShot(i)}
            index={i}
          />
        ))}
      </div>

      {notes && (
        <div style={{ padding: "8px 16px 16px" }}>
          <div style={{
            background: "#FFFDE7", borderRadius: 10, padding: "10px 12px",
          }}>
            <label style={{
              fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#F9A825", display: "block", marginBottom: 4,
            }}>{"\u270F\uFE0F"} Notes</label>
            <textarea
              placeholder="Props, moods, extra ideas..."
              value={notes[`${pillar.id}-extra`] || ""}
              onChange={(e) => setNotes({ ...notes, [`${pillar.id}-extra`]: e.target.value })}
              style={{
                width: "100%", minHeight: 45, padding: "8px 10px",
                border: "1.5px solid #FFF176", borderRadius: 8, fontSize: "0.82rem",
                fontFamily: "inherit", resize: "vertical", background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>
      )}

      <button
        onClick={onComplete}
        disabled={!allChecked}
        style={{
          width: "100%",
          padding: "16px",
          background: allChecked ? pillar.color : "#e0e0e0",
          color: allChecked ? "#1A3A2F" : "#999",
          border: "none",
          fontWeight: 800,
          fontSize: "0.9rem",
          cursor: allChecked ? "pointer" : "not-allowed",
          letterSpacing: "0.02em",
          transition: "all 0.2s",
        }}
      >
        {allChecked ? `\u2713 ${pillar.name} Complete \u2014 Next \u2192` : `Capture all 3 shots to continue`}
      </button>
    </div>
  );
}
