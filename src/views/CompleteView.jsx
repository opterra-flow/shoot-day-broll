import { useEffect } from "react";
import { PILLARS } from "../data/pillars";
import { formatTime } from "../utils/timer";
import { Confetti } from "../components/Confetti";
import { DownloadButtons } from "../components/DownloadButtons";

export function CompleteView({ elapsed, pillarTimers, notes, selectedHooks, showConfetti, confettiDone, onReset }) {
  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #1A3A2F 0%, #2D5A3F 50%, #1A3A2F 100%)",
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: 32,
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <Confetti active={showConfetti} onDone={confettiDone} />

      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div style={{ fontSize: "3rem", marginBottom: 12 }}>{"\u{1F389}"}</div>
        <h1 style={{
          fontSize: "1.6rem", fontWeight: 900, color: "#D4E157",
          margin: "0 0 8px",
        }}>Shoot Day Complete!</h1>
        <p style={{
          color: "#A5D6A7", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: 24,
        }}>
          You captured B-roll across all three pillars {"\u2014"} MAGNET, MIRROR, and BRIDGE. That's weeks of content from one shoot.
        </p>

        {/* Session stats */}
        <div style={{
          background: "rgba(255,255,255,0.08)", borderRadius: 12,
          padding: "16px 20px", marginBottom: 20, textAlign: "left",
        }}>
          <div style={{
            fontSize: "0.7rem", fontWeight: 800, color: "#C9A961",
            textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10,
          }}>Session Stats</div>
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 8,
          }}>
            <span style={{ color: "#A5D6A7", fontSize: "0.85rem", fontWeight: 600 }}>Total Time</span>
            <span style={{
              color: "#D4E157", fontWeight: 700, fontSize: "1rem",
              fontFamily: "'SF Mono', 'Fira Code', monospace",
            }}>{formatTime(elapsed)}</span>
          </div>
          {PILLARS.map((p) => {
            const t = pillarTimers?.[p.id] || 0;
            return (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "4px 0",
              }}>
                <span style={{
                  display: "flex", alignItems: "center", gap: 8,
                  color: "#ccc", fontSize: "0.8rem",
                }}>
                  <span>{p.emoji}</span> {p.name}
                </span>
                <span style={{
                  color: p.color, fontWeight: 600, fontSize: "0.85rem",
                  fontFamily: "'SF Mono', 'Fira Code', monospace",
                }}>{formatTime(t)}</span>
              </div>
            );
          })}
        </div>

        {/* Voice memo reminder */}
        <div style={{
          color: "#FFD54F", fontSize: "0.85rem", marginBottom: 24,
          fontWeight: 600, fontStyle: "italic",
        }}>
          {"\u{1F399}\uFE0F"} Don't forget your 30-second voice memo before you leave.
        </div>

        {/* Download storyboard */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: "0.7rem", fontWeight: 700, color: "#999",
            textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
          }}>Save Your Storyboard</div>
          <DownloadButtons notes={notes} selectedHooks={selectedHooks} pillarTimers={pillarTimers} elapsed={elapsed} />
        </div>

        <button onClick={onReset} style={{
          width: "100%", padding: "16px 24px",
          background: "#D4E157", color: "#1A3A2F",
          border: "none", borderRadius: 12,
          fontWeight: 800, fontSize: "1rem", cursor: "pointer",
          boxShadow: "0 4px 15px rgba(212,225,87,0.3)",
        }}>Start New Shoot</button>
      </div>
    </div>
  );
}
