import { PILLARS } from "../data/pillars";
import { formatTime } from "../utils/timer";
import { Confetti } from "../components/Confetti";
import { TimerDisplay } from "../components/TimerDisplay";
import { ActivePillarView } from "../components/ActivePillarView";
import { DownloadButtons } from "../components/DownloadButtons";
import { StoryboardRecap } from "../plan/StoryboardRecap";

export function ShootView({
  elapsed, pillarTimers, isRunning, setIsRunning,
  activePillarIndex, checkedShots, completedPillars,
  notes, setNotes, selectedHooks,
  showConfetti, confettiDone,
  handleCheckShot, handleCompletePillar,
  handleSkipPillar, isLastUncompleted,
  onSetActivePillar, onFinishEarly, resetAll, onNavigate,
}) {
  const currentPillar = PILLARS[activePillarIndex];
  const currentChecked = checkedShots[currentPillar?.id] || [];
  const allDone = completedPillars.length === 3;

  return (
    <div style={{
      minHeight: "100vh", background: "#F5F5F0",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      <Confetti active={showConfetti} onDone={confettiDone} />

      <div style={{
        background: "#1A3A2F", padding: "14px 20px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 10,
        }}>
          <button onClick={() => onNavigate("home")} style={{
            background: "none", border: "none", color: "#A5D6A7",
            fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
          }}>{"\u2190"} Back</button>
          <span style={{
            color: "#D4E157", fontWeight: 800, fontSize: "0.75rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>{"\u{1F3AC}"} Shoot Mode</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <DownloadButtons notes={notes} selectedHooks={selectedHooks} pillarTimers={pillarTimers} elapsed={elapsed} compact />
            <button onClick={resetAll} style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "#EF9A9A",
              fontSize: "0.7rem", fontWeight: 600, padding: "4px 10px",
              borderRadius: 4, cursor: "pointer",
            }}>Reset</button>
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 16, paddingBottom: 4,
        }}>
          <TimerDisplay seconds={elapsed} isRunning={isRunning} />
          <button onClick={() => setIsRunning(!isRunning)} style={{
            background: isRunning ? "#EF5350" : "#D4E157",
            color: isRunning ? "#fff" : "#1A3A2F",
            border: "none", borderRadius: 8, padding: "8px 16px",
            fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
          }}>{isRunning ? "Pause" : "Resume"}</button>
        </div>

        {/* Per-pillar timer breakdown */}
        <div style={{
          display: "flex", justifyContent: "center", gap: 12, marginTop: 6,
          fontSize: "0.6rem", fontWeight: 600,
        }}>
          {PILLARS.map((p) => {
            const isDone = completedPillars.includes(p.id);
            const isCurrent = PILLARS[activePillarIndex]?.id === p.id && !allDone;
            const t = pillarTimers?.[p.id] || 0;
            return (
              <span key={p.id} style={{
                color: isDone ? "#81C784" : isCurrent ? p.color : "#555",
                fontFamily: "'SF Mono', 'Fira Code', monospace",
              }}>
                {p.name}: {t > 0 ? formatTime(t) : "--:--"}
              </span>
            );
          })}
        </div>

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 4, marginTop: 8 }}>
          {activePillarIndex > 0 && (
            <button
              onClick={() => onSetActivePillar(activePillarIndex - 1)}
              style={{
                background: "none", border: "none", color: "#A5D6A7",
                fontSize: "1rem", cursor: "pointer", padding: "2px 6px",
                fontWeight: 700,
              }}
            >{"\u2039"}</button>
          )}
          {PILLARS.map((p, i) => {
            const isDone = completedPillars.includes(p.id);
            const isCurrent = i === activePillarIndex;
            return (
              <button
                key={p.id}
                onClick={() => onSetActivePillar(i)}
                style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 10px", borderRadius: 20,
                  background: isCurrent ? `${p.color}30` : "transparent",
                  border: "none", cursor: "pointer",
                }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: isDone ? "#81C784" : isCurrent ? p.color : "#555",
                  boxShadow: isCurrent ? `0 0 8px ${p.color}` : "none",
                }} />
                <span style={{
                  fontSize: "0.6rem", fontWeight: 700, color: isDone ? "#81C784" : isCurrent ? p.color : "#555",
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>{p.name}</span>
              </button>
            );
          })}
          {activePillarIndex < PILLARS.length - 1 && (
            <button
              onClick={() => onSetActivePillar(activePillarIndex + 1)}
              style={{
                background: "none", border: "none", color: "#A5D6A7",
                fontSize: "1rem", cursor: "pointer", padding: "2px 6px",
                fontWeight: 700,
              }}
            >{"\u203A"}</button>
          )}
        </div>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        {/* Storyboard recap */}
        {currentPillar && (
          <StoryboardRecap
            notes={notes}
            selectedHooks={selectedHooks}
            currentPillarId={currentPillar.id}
          />
        )}

        {currentPillar && (
          <ActivePillarView
            pillar={currentPillar}
            checkedShots={currentChecked}
            onCheckShot={(i) => handleCheckShot(currentPillar.id, i)}
            notes={notes}
            setNotes={setNotes}
            onComplete={() => handleCompletePillar(currentPillar.id)}
            onSkip={() => handleSkipPillar(currentPillar.id)}
            isLastUncompleted={isLastUncompleted}
            allChecked={currentChecked.length === currentPillar.shots.length}
            isCompleted={completedPillars.includes(currentPillar.id)}
          />
        )}

        {completedPillars.length > 0 && !allDone && (
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 700, color: "#999",
              textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
            }}>Completed</div>
            {completedPillars.filter((pid) => pid !== currentPillar?.id).map((pid) => {
              const p = PILLARS.find((x) => x.id === pid);
              const idx = PILLARS.findIndex((x) => x.id === pid);
              return (
                <button
                  key={pid}
                  onClick={() => onSetActivePillar(idx)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", background: "#F5F5F5",
                    borderRadius: 12, marginBottom: 6, opacity: 0.7,
                    width: "100%", border: "none", cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <span>{p.emoji}</span>
                  <span style={{ fontWeight: 700, color: "#888", fontSize: "0.85rem" }}>{p.name}</span>
                  <span style={{
                    marginLeft: "auto", color: "#81C784", fontWeight: 700, fontSize: "0.7rem",
                    fontFamily: "'SF Mono', 'Fira Code', monospace",
                  }}>{formatTime(pillarTimers?.[p.id] || 0)}</span>
                  <span style={{ color: "#81C784", fontWeight: 700, fontSize: "0.8rem" }}>{"\u2713"}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Done — finish early */}
        {!allDone && (
          <button
            onClick={onFinishEarly}
            style={{
              width: "100%", marginTop: 24, padding: "14px",
              background: "transparent",
              border: "1.5px dashed #ccc", borderRadius: 12,
              color: "#999", fontWeight: 700, fontSize: "0.85rem",
              cursor: "pointer", transition: "all 0.2s",
            }}
          >Done — Finish Shoot Early</button>
        )}

      </div>
    </div>
  );
}
