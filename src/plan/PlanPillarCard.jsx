import { useState } from "react";
import { ShotNoteCard } from "../components/ShotNoteCard";
import { SHOT_IDEAS } from "../data/shotIdeas";

export function PlanPillarCard({ pillar, notes, setNotes, selectedHooks, onOpenHookBank, onRemoveHook }) {
  const [expanded, setExpanded] = useState(false);
  const getIdeas = (shotIndex) => SHOT_IDEAS[`${pillar.id}-${shotIndex}`] || [];

  return (
    <div style={{
      background: "#fff", borderRadius: 16,
      border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        padding: "16px 20px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderRadius: expanded ? "16px 16px 0 0" : 16,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: "1.6rem" }}>{pillar.emoji}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1A3A2F" }}>{pillar.name}</div>
            <div style={{ fontSize: "0.8rem", color: "#777", marginTop: 2 }}>{pillar.subtitle}</div>
          </div>
        </div>
        <div style={{
          transform: expanded ? "rotate(180deg)" : "rotate(0)",
          transition: "transform 0.2s", fontSize: "1.2rem", color: "#999",
        }}>{"\u25BE"}</div>
      </div>
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderRadius: "0 0 16px 16px" }}>
          <p style={{
            fontSize: "0.85rem", color: "#555", lineHeight: 1.5,
            margin: "0 0 16px", fontStyle: "italic",
          }}>{pillar.description}</p>
          <div style={{
            background: pillar.bgColor, borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.1em", color: pillar.darkColor, marginBottom: 8,
            }}>Quick Examples</div>
            {pillar.examples.map((ex, i) => (
              <div key={i} style={{ fontSize: "0.8rem", color: "#444", padding: "4px 0", display: "flex", gap: 6 }}>
                <span style={{ color: pillar.darkColor }}>{"\u2192"}</span> {ex}
              </div>
            ))}
          </div>

          {/* Brainstorm */}
          <div style={{
            background: "#F3E5F5", borderRadius: 10, padding: "12px 14px", marginBottom: 16,
          }}>
            <label style={{
              fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#7B1FA2", display: "block", marginBottom: 6,
            }}>{"\u{1F9E0}"} Brainstorm</label>
            <textarea
              placeholder="Jot down your ideas..."
              value={notes[`${pillar.id}-brainstorm`] || ""}
              onChange={(e) => setNotes({ ...notes, [`${pillar.id}-brainstorm`]: e.target.value })}
              style={{
                width: "100%", minHeight: 60, padding: "8px 10px",
                border: "1.5px solid #CE93D8", borderRadius: 8, fontSize: "0.85rem",
                fontFamily: "inherit", resize: "vertical", background: "#fff",
                boxSizing: "border-box", lineHeight: 1.5, outline: "none",
              }}
            />
          </div>

          {/* Pillar-level hook */}
          {selectedHooks?.[pillar.id] ? (
            <div style={{
              marginBottom: 16, padding: "10px 12px",
              background: "#F9FBE7", borderRadius: 8,
              border: "1px solid #F0F4C3",
              display: "flex", alignItems: "flex-start", gap: 8,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "0.1em", color: "#9E9D24", marginBottom: 4,
                }}>Hook</div>
                <div style={{ fontSize: "0.82rem", color: "#333", lineHeight: 1.4 }}>{selectedHooks[pillar.id]}</div>
              </div>
              <button
                onClick={() => onRemoveHook(pillar.id)}
                style={{
                  background: "none", border: "none", color: "#ccc",
                  fontSize: "0.9rem", cursor: "pointer", padding: "0 4px",
                  flexShrink: 0,
                }}
              >{"\u2715"}</button>
            </div>
          ) : (
            <button
              onClick={() => onOpenHookBank(pillar.id)}
              style={{
                marginBottom: 16, padding: "8px 14px",
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
          )}

          <div style={{
            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "#1A3A2F", marginBottom: 10,
          }}>Storyboard Your Shots</div>
          {pillar.shots.map((shot, i) => (
            <ShotNoteCard
              key={i}
              shot={shot}
              pillarId={pillar.id}
              shotIndex={i}
              notes={notes}
              setNotes={setNotes}
              shotIdeas={getIdeas(i)}
            />
          ))}
          <div style={{ background: "#FFFDE7", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <label style={{
              fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#F9A825", display: "block", marginBottom: 4,
            }}>{"\u270F\uFE0F"} Additional Notes</label>
            <textarea
              placeholder="Any other ideas, props, moods..."
              value={notes[`${pillar.id}-extra`] || ""}
              onChange={(e) => setNotes({ ...notes, [`${pillar.id}-extra`]: e.target.value })}
              style={{
                width: "100%", minHeight: 50, padding: "8px 10px",
                border: "1.5px solid #FFF176", borderRadius: 8, fontSize: "0.85rem",
                fontFamily: "inherit", resize: "vertical", background: "#fff",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Editing Notes & Effects */}
          <div style={{ background: "#E3F2FD", borderRadius: 10, padding: "12px 14px", marginTop: 8 }}>
            <label style={{
              fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.1em", color: "#1565C0", display: "block", marginBottom: 4,
            }}>{"\u{1F3AC}"} Editing Notes & Effects</label>
            <textarea
              placeholder="Transitions, color grading, text overlays, sound effects..."
              value={notes[`${pillar.id}-editing`] || ""}
              onChange={(e) => setNotes({ ...notes, [`${pillar.id}-editing`]: e.target.value })}
              style={{
                width: "100%", minHeight: 50, padding: "8px 10px",
                border: "1.5px solid #90CAF9", borderRadius: 8, fontSize: "0.85rem",
                fontFamily: "inherit", resize: "vertical", background: "#fff",
                boxSizing: "border-box", lineHeight: 1.5, outline: "none",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
