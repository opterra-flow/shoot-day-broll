import { useState } from "react";
import { ShotNoteCard } from "../components/ShotNoteCard";
import { SHOT_IDEAS } from "../data/shotIdeas";

export function PlanPillarCard({ pillar, notes, setNotes, selectedHooks, onOpenHookBank, onRemoveHook }) {
  const [expanded, setExpanded] = useState(false);
  const ideas = SHOT_IDEAS[pillar.id] || [];

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
              selectedHook={selectedHooks?.[`${pillar.id}-${i}`] || null}
              onSelectHook={() => onOpenHookBank(pillar.id, i)}
              onRemoveHook={() => onRemoveHook(pillar.id, i)}
              shotIdeas={ideas}
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
        </div>
      )}
    </div>
  );
}
