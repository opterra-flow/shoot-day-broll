import { WRAP_CHECKLIST, WRAP_TOTAL } from "../data/wrapChecklist";
import { TimerDisplay } from "../components/TimerDisplay";
import { VoiceMemoRecorder } from "../components/VoiceMemoRecorder";

export function ChecklistView({ elapsed, isRunning, setIsRunning, wrapChecked, setWrapChecked, onBack, onComplete }) {
  const checkedCount = wrapChecked.length;
  const allChecked = checkedCount === WRAP_TOTAL;

  // Flatten items with global index for tracking
  let globalIndex = 0;
  const sections = WRAP_CHECKLIST.map((cat) => ({
    category: cat.category,
    items: cat.items.map((item) => ({ text: item, index: globalIndex++ })),
  }));

  const toggleItem = (idx) => {
    setWrapChecked((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F5F5F0",
      fontFamily: "'Inter', -apple-system, sans-serif",
    }}>
      {/* Header */}
      <div style={{
        background: "#1A3A2F", padding: "16px 20px",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: 8,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={onBack} style={{
              background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 6,
              color: "#A5D6A7", fontSize: "0.85rem", fontWeight: 700,
              padding: "4px 10px", cursor: "pointer",
            }}>{"\u2039"} Back</button>
            <span style={{
              color: "#D4E157", fontWeight: 800, fontSize: "0.8rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>{"\u2705"} Wrap-Up Checklist</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <TimerDisplay seconds={elapsed} isRunning={isRunning} />
            <button onClick={() => setIsRunning(!isRunning)} style={{
              background: isRunning ? "#EF5350" : "#D4E157",
              color: isRunning ? "#fff" : "#1A3A2F",
              border: "none", borderRadius: 6, padding: "6px 12px",
              fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
            }}>{isRunning ? "Pause" : "Resume"}</button>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{
          background: "rgba(255,255,255,0.1)", borderRadius: 4, height: 6,
          overflow: "hidden",
        }}>
          <div style={{
            width: `${(checkedCount / WRAP_TOTAL) * 100}%`,
            height: "100%",
            background: allChecked ? "#81C784" : "#D4E157",
            borderRadius: 4,
            transition: "width 0.3s ease",
          }} />
        </div>
        <div style={{
          color: allChecked ? "#81C784" : "#A5D6A7",
          fontSize: "0.7rem", fontWeight: 600, marginTop: 6, textAlign: "center",
        }}>
          {allChecked
            ? "All items checked \u2014 ready to finish!"
            : `${checkedCount} of ${WRAP_TOTAL} complete`}
        </div>
      </div>

      {/* Checklist sections */}
      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        <p style={{
          fontSize: "0.85rem", color: "#777", textAlign: "center",
          marginBottom: 20, lineHeight: 1.5,
        }}>
          Complete all items before wrapping up your shoot.
        </p>

        {sections.map((section) => (
          <div key={section.category} style={{ marginBottom: 20 }}>
            <div style={{
              fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
              letterSpacing: "0.12em", color: "#1A3A2F", marginBottom: 8,
              paddingBottom: 4, borderBottom: "1px solid #e0e0e0",
            }}>{section.category}</div>

            {section.items.map((item) => {
              const isChecked = wrapChecked.includes(item.index);
              return (
                <div
                  key={item.index}
                  onClick={() => toggleItem(item.index)}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", background: isChecked ? "#E8F5E9" : "#fff",
                    borderRadius: 10, marginBottom: 6,
                    border: isChecked ? "1.5px solid #81C784" : "1.5px solid #e0e0e0",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: isChecked ? "none" : "2px solid #ccc",
                    background: isChecked ? "#66BB6A" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 0.2s",
                  }}>
                    {isChecked && <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.8rem" }}>{"\u2713"}</span>}
                  </div>
                  <span style={{
                    fontSize: "0.85rem",
                    color: isChecked ? "#999" : "#333",
                    textDecoration: isChecked ? "line-through" : "none",
                  }}>{item.text}</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Voice memo */}
        <div style={{ marginBottom: 20 }}>
          <VoiceMemoRecorder />
        </div>

        {/* Complete button */}
        <button
          onClick={onComplete}
          disabled={!allChecked}
          style={{
            width: "100%", padding: "16px",
            background: allChecked ? "#D4E157" : "#e0e0e0",
            color: allChecked ? "#1A3A2F" : "#999",
            border: "none", borderRadius: 12,
            fontWeight: 800, fontSize: "1rem",
            cursor: allChecked ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: allChecked ? "0 4px 15px rgba(212,225,87,0.3)" : "none",
          }}
        >
          {allChecked ? "Complete Shoot \u2192" : `Check all ${WRAP_TOTAL} items to continue`}
        </button>
      </div>
    </div>
  );
}
