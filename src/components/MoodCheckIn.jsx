const MOODS = [
  { label: "Joyful", emoji: "\u{1F60A}" },
  { label: "Energized", emoji: "\u{1F525}" },
  { label: "Calm", emoji: "\u{1F60C}" },
  { label: "Neutral", emoji: "\u{1F610}" },
  { label: "Overwhelmed", emoji: "\u{1F635}" },
  { label: "Frustrated", emoji: "\u{1F624}" },
];

const PROMPTS = [
  { key: "wentWell", label: "Something that went well on today\u2019s shoot:" },
  { key: "nextTime", label: "One adjustment I\u2019d make for next time:" },
  { key: "proud", label: "One thing that made me proud of myself today:" },
];

const promptInput = {
  width: "100%", minHeight: 48, padding: "10px 12px",
  border: "none", borderBottom: "1.5px solid #e0e0e0",
  fontSize: "0.82rem", fontFamily: "inherit",
  resize: "vertical", background: "transparent",
  boxSizing: "border-box", lineHeight: 1.5,
  outline: "none",
};

export function MoodCheckIn({ selectedMood, onSelectMood, reflection, onReflectionChange }) {
  const updateField = (key, value) => {
    onReflectionChange({ ...reflection, [key]: value });
  };

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Mood selector */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #e0e0e0",
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div style={{
          background: "#FAFAF5",
          padding: "14px 16px 10px",
          borderBottom: "1px solid #eee",
        }}>
          <div style={{
            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.12em", color: "#1A3A2F", marginBottom: 4,
            textAlign: "center",
          }}>Shoot Day Mindset Check</div>
          <p style={{
            fontSize: "0.82rem", color: "#777", textAlign: "center",
            margin: 0, fontStyle: "italic", lineHeight: 1.4,
          }}>How did your shoot go today?</p>
        </div>

        <div style={{ padding: "16px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}>
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood.label;
              return (
                <button
                  key={mood.label}
                  onClick={() => onSelectMood(isSelected ? null : mood.label)}
                  style={{
                    display: "flex", flexDirection: "column",
                    alignItems: "center", gap: 4,
                    padding: "12px 8px",
                    background: isSelected ? "#E8F5E9" : "#FAFAF5",
                    border: isSelected ? "2px solid #66BB6A" : "1.5px solid #e8e8e8",
                    borderRadius: 12,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    transform: isSelected ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <span style={{
                    fontSize: "1.6rem",
                    filter: isSelected ? "none" : "grayscale(0.3)",
                    transition: "filter 0.2s",
                  }}>{mood.emoji}</span>
                  <span style={{
                    fontSize: "0.65rem", fontWeight: 700,
                    color: isSelected ? "#2E7D32" : "#888",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}>{mood.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reflection & Insight */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #e0e0e0",
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div style={{
          padding: "14px 16px",
          borderBottom: "1px solid #e0e0e0",
          textAlign: "center",
        }}>
          <span style={{
            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.14em", color: "#1A3A2F",
          }}>{"\u00B7"} Reflection & Insight {"\u00B7"}</span>
        </div>

        {PROMPTS.map((prompt) => (
          <div key={prompt.key} style={{ borderBottom: "1px solid #e0e0e0" }}>
            <p style={{
              fontSize: "0.82rem", color: "#555", fontStyle: "italic",
              textAlign: "center", padding: "14px 16px 0", margin: 0,
              lineHeight: 1.4,
            }}>{prompt.label}</p>
            <textarea
              placeholder="..."
              value={reflection?.[prompt.key] || ""}
              onChange={(e) => updateField(prompt.key, e.target.value)}
              style={promptInput}
            />
          </div>
        ))}

        {/* Things that made me smile */}
        <div style={{ padding: "14px 16px" }}>
          <div style={{
            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "#1A3A2F", marginBottom: 10,
          }}>Things that made me smile today</div>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              marginBottom: 8,
            }}>
              <span style={{ fontSize: "1rem", opacity: 0.4 }}>{"\u{1F603}"}</span>
              <input
                type="text"
                placeholder="..."
                value={reflection?.[`smile${i}`] || ""}
                onChange={(e) => updateField(`smile${i}`, e.target.value)}
                style={{
                  flex: 1, border: "none", borderBottom: "1.5px solid #e0e0e0",
                  padding: "6px 2px", fontSize: "0.82rem", fontFamily: "inherit",
                  background: "transparent", outline: "none",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notes & Free Thoughts */}
      <div style={{
        background: "#fff",
        borderRadius: 14,
        border: "1.5px solid #e0e0e0",
        overflow: "hidden",
        marginBottom: 16,
      }}>
        <div style={{
          padding: "12px 16px",
          borderBottom: "1px solid #e0e0e0",
        }}>
          <span style={{
            fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "#1A3A2F",
          }}>Notes & Free Thoughts</span>
          <span style={{ float: "right", fontSize: "1rem", opacity: 0.15 }}>{"\u2661"}</span>
        </div>
        <textarea
          placeholder="Anything else on your mind..."
          value={reflection?.freeThoughts || ""}
          onChange={(e) => updateField("freeThoughts", e.target.value)}
          style={{
            width: "100%", minHeight: 70, padding: "12px 16px",
            border: "none", fontSize: "0.82rem", fontFamily: "inherit",
            resize: "vertical", background: "transparent",
            boxSizing: "border-box", lineHeight: 1.5, outline: "none",
          }}
        />
      </div>

      {/* Inspirational quote */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: 12,
        padding: "12px 16px",
      }}>
        <span style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{"\u{1F4A1}"}</span>
        <p style={{
          fontSize: "0.8rem", color: "#777", fontStyle: "italic",
          lineHeight: 1.6, margin: 0,
        }}>
          Running a creative business brings to light every insecurity, mindset block,
          and area for personal growth, inviting you to cultivate resilience.
        </p>
      </div>
    </div>
  );
}
