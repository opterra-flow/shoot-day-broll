import { useState, useEffect, useRef, useCallback } from "react";

// Camera shutter sound using Web Audio API
function playShutter() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Click sound
    const clickOsc = ctx.createOscillator();
    const clickGain = ctx.createGain();
    clickOsc.type = "square";
    clickOsc.frequency.setValueAtTime(1800, ctx.currentTime);
    clickOsc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);
    clickGain.gain.setValueAtTime(0.3, ctx.currentTime);
    clickGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
    clickOsc.connect(clickGain).connect(ctx.destination);
    clickOsc.start(ctx.currentTime);
    clickOsc.stop(ctx.currentTime + 0.06);

    // Mechanical shutter slap
    const noiseLen = 0.08;
    const buf = ctx.createBuffer(1, ctx.sampleRate * noiseLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 3);
    }
    const noise = ctx.createBufferSource();
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 2000;
    noiseFilter.Q.value = 1.5;
    noise.buffer = buf;
    noiseGain.gain.setValueAtTime(0.5, ctx.currentTime + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    noise.connect(noiseFilter).connect(noiseGain).connect(ctx.destination);
    noise.start(ctx.currentTime + 0.02);
  } catch (e) {}
}

// Confetti component
function Confetti({ active, onDone }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animRef = useRef(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#D4E157", "#CE93D8", "#4FC3F7", "#FFD54F", "#FF8A65", "#81C784", "#F06292", "#4DD0E1"];
    const shapes = ["rect", "circle", "strip"];
    const particles = [];

    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      particles.push({
        x,
        y: canvas.height + Math.random() * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: -(Math.random() * 14 + 8),
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.25 + Math.random() * 0.15,
        opacity: 1,
        decay: 0.008 + Math.random() * 0.006,
      });
    }
    particlesRef.current = particles;

    let frame = 0;
    const maxFrames = 180;

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = 0;

      for (const p of particles) {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotSpeed;
        if (frame > 40) p.opacity -= p.decay;
        if (p.opacity <= 0) continue;
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -1, p.size, 3);
        }
        ctx.restore();
      }

      frame++;
      if (alive > 0 && frame < maxFrames) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (onDone) onDone();
      }
    }
    animate();

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, onDone]);

  if (!active) return null;
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}

const PILLARS = [
  {
    id: "magnet",
    emoji: "\u{1F9F2}",
    name: "MAGNET",
    subtitle: "The Attention-Grabbing Shots",
    color: "#D4E157",
    darkColor: "#9E9D24",
    bgColor: "#F9FBE7",
    description: "Content that stops the scroll. These shots reach strangers \u2014 no context needed.",
    examples: [
      "Satisfying set reveal \u2014 empty table to styled scene",
      "ASMR detail work \u2014 hands styling, pouring, adjusting",
      "Before/after \u2014 raw setup vs. final shot",
      "A/B comparison \u2014 two options side by side",
    ],
    timerMinutes: 0,
    timerLabel: "Start of Shoot",
    shots: [
      { angle: "Wide", prompt: "The full scene \u2014 establishing shot of the space" },
      { angle: "Medium", prompt: "You in the scene \u2014 setting up, working" },
      { angle: "Tight", prompt: "Just the detail \u2014 first thing you touch" },
    ],
  },
  {
    id: "mirror",
    emoji: "\u{1FA9E}",
    name: "MIRROR",
    subtitle: "The Connection Shots",
    color: "#CE93D8",
    darkColor: "#7B1FA2",
    bgColor: "#F3E5F5",
    description: "Content that makes people see themselves in you. The human stuff.",
    examples: [
      "Genuine reaction when you nail the shot",
      "Behind the scenes \u2014 don\u2019t stage it, just capture it",
      "The moment something goes hilariously wrong",
      "Post-shoot voice memo in your car (30 seconds)",
    ],
    timerMinutes: 30,
    timerLabel: "30 min in",
    shots: [
      { angle: "Wide", prompt: "The real moment \u2014 you reacting, working, being human" },
      { angle: "Medium", prompt: "BTS of whatever is happening right now" },
      { angle: "Tight", prompt: "Your face \u2014 the reaction, the emotion" },
    ],
  },
  {
    id: "bridge",
    emoji: "\u{1F309}",
    name: "BRIDGE",
    subtitle: "The Booking Shots",
    color: "#4FC3F7",
    darkColor: "#0277BD",
    bgColor: "#E1F5FE",
    description: "Content that answers: what would it be like to hire this person?",
    examples: [
      "Client collaboration \u2014 reviewing images together",
      "The process \u2014 from inquiry to final delivery",
      "Final reveal with context and story",
      "\"What it\u2019s like to work with me\" walkthrough",
    ],
    timerMinutes: 60,
    timerLabel: "60 min in",
    shots: [
      { angle: "Wide", prompt: "The collaboration \u2014 you and client together" },
      { angle: "Medium", prompt: "Camera screen showing the shot you just got" },
      { angle: "Tight", prompt: "The detail crop \u2014 the final product up close" },
    ],
  },
];

function TimerDisplay({ seconds, isRunning }) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return (
    <span style={{
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      color: isRunning ? "#D4E157" : "#666",
    }}>
      {pad(hrs)}:{pad(mins)}:{pad(secs)}
    </span>
  );
}

function ShotCheckItem({ shot, checked, onCheck, index }) {
  return (
    <div
      onClick={() => { if (!checked) onCheck(); }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: checked ? "#E8F5E9" : "#fff",
        borderRadius: 12,
        marginBottom: 8,
        border: checked ? "1.5px solid #81C784" : "1.5px solid #e0e0e0",
        cursor: checked ? "default" : "pointer",
        transition: "all 0.2s",
        transform: checked ? "scale(0.98)" : "scale(1)",
      }}
    >
      <div style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        border: checked ? "none" : "2px solid #ccc",
        background: checked ? "#66BB6A" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s",
      }}>
        {checked && <span style={{ color: "#fff", fontWeight: 700, fontSize: "0.9rem" }}>{"\u2713"}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 2,
        }}>
          <span style={{
            fontSize: "0.6rem",
            fontWeight: 800,
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            background: checked ? "#81C784" : "#1A3A2F",
            color: checked ? "#fff" : "#D4E157",
            padding: "2px 7px",
            borderRadius: 4,
          }}>{shot.angle}</span>
        </div>
        <div style={{
          fontSize: "0.82rem",
          color: checked ? "#999" : "#444",
          textDecoration: checked ? "line-through" : "none",
          lineHeight: 1.4,
          marginTop: 4,
        }}>{shot.prompt}</div>
      </div>
      {!checked && (
        <div style={{
          fontSize: "0.65rem",
          color: "#bbb",
          fontWeight: 600,
          textTransform: "uppercase",
        }}>tap</div>
      )}
    </div>
  );
}

function ShotNoteCard({ shot, pillarId, shotIndex, notes, setNotes }) {
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

function ActivePillarView({ pillar, checkedShots, onCheckShot, notes, setNotes, onComplete, allChecked }) {
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

function PlanPillarCard({ pillar, notes, setNotes }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div style={{
      background: "#fff", borderRadius: 16, overflow: "hidden",
      border: "1px solid #e8e8e8", boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        padding: "16px 20px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
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
        <div style={{ padding: "0 20px 20px" }}>
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
            <ShotNoteCard key={i} shot={shot} pillarId={pillar.id} shotIndex={i} notes={notes} setNotes={setNotes} />
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

export default function ShootDayApp() {
  const [view, setView] = useState("home");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState({});
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [checkedShots, setCheckedShots] = useState({});
  const [completedPillars, setCompletedPillars] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleCheckShot = useCallback((pillarId, shotIndex) => {
    playShutter();
    const key = pillarId;
    setCheckedShots((prev) => {
      const current = prev[key] || [];
      if (current.includes(shotIndex)) return prev;
      return { ...prev, [key]: [...current, shotIndex] };
    });
  }, []);

  const handleCompletePillar = useCallback((pillarId) => {
    setShowConfetti(true);
    setCompletedPillars((prev) => [...prev, pillarId]);
    const nextIndex = PILLARS.findIndex((p) => p.id === pillarId) + 1;
    if (nextIndex < PILLARS.length) {
      setTimeout(() => setActivePillarIndex(nextIndex), 400);
    }
  }, []);

  const confettiDone = useCallback(() => setShowConfetti(false), []);

  const resetAll = () => {
    setIsRunning(false);
    setElapsed(0);
    setActivePillarIndex(0);
    setCheckedShots({});
    setCompletedPillars([]);
  };

  // HOME
  if (view === "home") {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(165deg, #1A3A2F 0%, #2D5A3F 50%, #1A3A2F 100%)",
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", padding: 32,
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 400, textAlign: "center" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: 12 }}>{"\u{1F3AC}"}</div>
          <h1 style={{
            fontSize: "1.8rem", fontWeight: 900, color: "#D4E157",
            margin: "0 0 4px", letterSpacing: "-0.02em",
          }}>SHOOT DAY</h1>
          <h2 style={{
            fontSize: "0.85rem", fontWeight: 600, color: "#A5D6A7",
            margin: "0 0 32px", letterSpacing: "0.15em", textTransform: "uppercase",
          }}>B-Roll Companion</h2>

          <p style={{
            color: "#C8E6C9", fontSize: "0.9rem", lineHeight: 1.6,
            marginBottom: 40, maxWidth: 320, marginLeft: "auto", marginRight: "auto",
          }}>
            Plan your shots before the shoot. Get timed reminders during the shoot. Walk away with weeks of content.
          </p>

          <button
            onClick={() => setView("plan")}
            style={{
              width: "100%", padding: "16px 24px", fontSize: "1rem", fontWeight: 700,
              color: "#1A3A2F", background: "#D4E157", border: "none", borderRadius: 12,
              cursor: "pointer", marginBottom: 12, letterSpacing: "0.02em",
              boxShadow: "0 4px 15px rgba(212,225,87,0.3)",
            }}
          >{"\u{1F4DD}"} Plan My Shots</button>

          <button
            onClick={() => { setView("shoot"); setIsRunning(true); }}
            style={{
              width: "100%", padding: "16px 24px", fontSize: "1rem", fontWeight: 700,
              color: "#D4E157", background: "transparent", border: "2px solid #D4E157",
              borderRadius: 12, cursor: "pointer", letterSpacing: "0.02em",
            }}
          >{"\u{1F3AC}"} Start Shoot Timer</button>

          <div style={{ marginTop: 40, display: "flex", justifyContent: "center", gap: 24 }}>
            {PILLARS.map((p) => (
              <div key={p.id} style={{ textAlign: "center" }}>
                <div style={{ fontSize: "1.4rem" }}>{p.emoji}</div>
                <div style={{ fontSize: "0.65rem", color: "#81C784", marginTop: 4, fontWeight: 600 }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PLAN
  if (view === "plan") {
    return (
      <div style={{
        minHeight: "100vh", background: "#F5F5F0",
        fontFamily: "'Inter', -apple-system, sans-serif",
      }}>
        <div style={{
          background: "#1A3A2F", padding: "16px 20px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100,
        }}>
          <button onClick={() => setView("home")} style={{
            background: "none", border: "none", color: "#A5D6A7",
            fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
          }}>{"\u2190"} Back</button>
          <span style={{
            color: "#D4E157", fontWeight: 800, fontSize: "0.8rem",
            letterSpacing: "0.1em", textTransform: "uppercase",
          }}>{"\u{1F4DD}"} Shot Planning</span>
          <button onClick={() => { setView("shoot"); setIsRunning(true); }} style={{
            background: "#D4E157", border: "none", color: "#1A3A2F",
            fontSize: "0.75rem", fontWeight: 700, padding: "6px 12px",
            borderRadius: 6, cursor: "pointer",
          }}>Start Shoot {"\u2192"}</button>
        </div>

        <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
          <p style={{
            fontSize: "0.85rem", color: "#777", textAlign: "center",
            marginBottom: 20, lineHeight: 1.5,
          }}>
            Tap each pillar to see examples, then write your concepts for wide, medium, and tight.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {PILLARS.map((pillar) => (
              <PlanPillarCard key={pillar.id} pillar={pillar} notes={notes} setNotes={setNotes} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // SHOOT
  if (view === "shoot") {
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
            <button onClick={() => setView("home")} style={{
              background: "none", border: "none", color: "#A5D6A7",
              fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
            }}>{"\u2190"} Back</button>
            <span style={{
              color: "#D4E157", fontWeight: 800, fontSize: "0.75rem",
              letterSpacing: "0.1em", textTransform: "uppercase",
            }}>{"\u{1F3AC}"} Shoot Mode</span>
            <button onClick={resetAll} style={{
              background: "rgba(255,255,255,0.1)", border: "none", color: "#EF9A9A",
              fontSize: "0.7rem", fontWeight: 600, padding: "4px 10px",
              borderRadius: 4, cursor: "pointer",
            }}>Reset</button>
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

          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 8 }}>
            {PILLARS.map((p, i) => {
              const isDone = completedPillars.includes(p.id);
              const isCurrent = i === activePillarIndex && !allDone;
              return (
                <div key={p.id} style={{
                  display: "flex", alignItems: "center", gap: 4,
                  padding: "3px 10px", borderRadius: 20,
                  background: isCurrent ? `${p.color}30` : "transparent",
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: isDone ? "#81C784" : isCurrent ? p.color : "#555",
                    boxShadow: isCurrent ? `0 0 8px ${p.color}` : "none",
                  }} />
                  <span style={{
                    fontSize: "0.6rem", fontWeight: 700, color: isDone ? "#81C784" : isCurrent ? p.color : "#555",
                    textTransform: "uppercase", letterSpacing: "0.08em",
                  }}>{p.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
          {!allDone && currentPillar && (
            <ActivePillarView
              pillar={currentPillar}
              checkedShots={currentChecked}
              onCheckShot={(i) => handleCheckShot(currentPillar.id, i)}
              notes={notes}
              setNotes={setNotes}
              onComplete={() => handleCompletePillar(currentPillar.id)}
              allChecked={currentChecked.length === currentPillar.shots.length}
            />
          )}

          {completedPillars.length > 0 && !allDone && (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontSize: "0.7rem", fontWeight: 700, color: "#999",
                textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8,
              }}>Completed</div>
              {completedPillars.map((pid) => {
                const p = PILLARS.find((x) => x.id === pid);
                return (
                  <div key={pid} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", background: "#F5F5F5",
                    borderRadius: 12, marginBottom: 6, opacity: 0.6,
                  }}>
                    <span>{p.emoji}</span>
                    <span style={{ fontWeight: 700, color: "#888", fontSize: "0.85rem" }}>{p.name}</span>
                    <span style={{ marginLeft: "auto", color: "#81C784", fontWeight: 700, fontSize: "0.8rem" }}>{"\u2713"}</span>
                  </div>
                );
              })}
            </div>
          )}

          {allDone && (
            <div style={{
              background: "#1A3A2F", borderRadius: 20, padding: "32px 24px",
              textAlign: "center", marginTop: 8,
            }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 10 }}>{"\u{1F389}"}</div>
              <div style={{
                color: "#D4E157", fontWeight: 900, fontSize: "1.2rem", marginBottom: 10,
              }}>Shoot Day Complete!</div>
              <div style={{
                color: "#A5D6A7", fontSize: "0.9rem", lineHeight: 1.6,
              }}>
                You captured B-roll across all three pillars {"\u2014"} MAGNET, MIRROR, and BRIDGE. That's weeks of content from one shoot.
              </div>
              <div style={{
                color: "#FFD54F", fontSize: "0.85rem", marginTop: 16,
                fontWeight: 600, fontStyle: "italic",
              }}>
                {"\u{1F399}\uFE0F"} Don't forget your 30-second voice memo before you leave.
              </div>
              <button onClick={resetAll} style={{
                marginTop: 20, padding: "12px 24px", background: "#D4E157",
                color: "#1A3A2F", border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
              }}>Start New Shoot</button>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
}
