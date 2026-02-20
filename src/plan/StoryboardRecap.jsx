import { useState } from "react";
import { PILLARS } from "../data/pillars";

export function StoryboardRecap({ notes, selectedHooks, currentPillarId }) {
  const [expanded, setExpanded] = useState(false);

  // If currentPillarId is provided, only show that pillar. Otherwise show all.
  const pillarsToShow = currentPillarId
    ? PILLARS.filter((p) => p.id === currentPillarId)
    : PILLARS;

  const hasAnyContent = PILLARS.some((p) =>
    p.shots.some((_, i) => notes[`${p.id}-${i}-concept`]) ||
    notes[`${p.id}-extra`] ||
    p.shots.some((_, i) => selectedHooks?.[`${p.id}-${i}`])
  );

  if (!hasAnyContent) return null;

  return (
    <div style={{
      background: "#fff", borderRadius: 12,
      border: "1px solid #e0e0e0",
      marginBottom: 16,
      overflow: "hidden",
    }}>
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%", padding: "12px 16px",
          background: "#1A3A2F", border: "none",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <span style={{
          color: "#D4E157", fontWeight: 700, fontSize: "0.75rem",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>{"\u{1F4CB}"} {expanded ? "Hide" : "Show"} My Plan</span>
        <span style={{
          color: "#A5D6A7", fontSize: "1rem",
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s",
        }}>{"\u25BE"}</span>
      </button>

      {expanded && (
        <div style={{ padding: "12px 16px" }}>
          {pillarsToShow.map((pillar) => {
            const hasPillarContent = pillar.shots.some((_, i) => notes[`${pillar.id}-${i}-concept`]) ||
              notes[`${pillar.id}-extra`] ||
              pillar.shots.some((_, i) => selectedHooks?.[`${pillar.id}-${i}`]);

            if (!hasPillarContent) return null;

            return (
              <div key={pillar.id} style={{ marginBottom: 16 }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 8,
                }}>
                  <span style={{ fontSize: "1.1rem" }}>{pillar.emoji}</span>
                  <span style={{ fontWeight: 800, fontSize: "0.85rem", color: "#1A3A2F" }}>{pillar.name}</span>
                </div>

                {pillar.shots.map((shot, i) => {
                  const concept = notes[`${pillar.id}-${i}-concept`];
                  const hook = selectedHooks?.[`${pillar.id}-${i}`];
                  if (!concept && !hook) return null;

                  return (
                    <div key={i} style={{
                      padding: "8px 12px", marginBottom: 6,
                      background: pillar.bgColor, borderRadius: 8,
                      borderLeft: `3px solid ${pillar.color}`,
                    }}>
                      <div style={{
                        fontSize: "0.65rem", fontWeight: 700, color: pillar.darkColor,
                        textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4,
                      }}>{shot.angle}</div>
                      {concept && (
                        <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>{concept}</div>
                      )}
                      {hook && (
                        <div style={{ fontSize: "0.75rem", color: "#9E9D24", marginTop: 4, fontStyle: "italic" }}>
                          Hook: {hook}
                        </div>
                      )}
                    </div>
                  );
                })}

                {notes[`${pillar.id}-extra`] && (
                  <div style={{
                    fontSize: "0.78rem", color: "#666", fontStyle: "italic",
                    padding: "4px 12px",
                  }}>
                    Notes: {notes[`${pillar.id}-extra`]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
