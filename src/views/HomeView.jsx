import { PILLARS } from "../data/pillars";

export function HomeView({ onNavigate, setIsRunning, hasSession, onResumeSession, onClearSession }) {
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
          fontSize: "1.3rem", fontWeight: 700, color: "#D4E157",
          margin: "0 0 32px", letterSpacing: "0.15em", textTransform: "uppercase",
          textShadow: "0 0 8px #D4E157, 0 0 20px #D4E157, 0 0 40px rgba(212,225,87,0.6), 0 0 80px rgba(212,225,87,0.3)",
        }}>B-Roll Companion</h2>

        <p style={{
          color: "#C8E6C9", fontSize: "0.9rem", lineHeight: 1.6,
          marginBottom: 40, maxWidth: 320, marginLeft: "auto", marginRight: "auto",
        }}>
          Plan your shots before the shoot. Get timed reminders during the shoot. Walk away with weeks of content.
        </p>

        {hasSession && (
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={onResumeSession}
              style={{
                width: "100%", padding: "14px 24px", fontSize: "0.95rem", fontWeight: 700,
                color: "#1A3A2F", background: "#C9A961", border: "none", borderRadius: 12,
                cursor: "pointer", marginBottom: 8, letterSpacing: "0.02em",
                boxShadow: "0 4px 15px rgba(201,169,97,0.3)",
              }}
            >{"\u{1F504}"} Resume Session</button>
            <button
              onClick={onClearSession}
              style={{
                background: "none", border: "none", color: "#999",
                fontSize: "0.75rem", cursor: "pointer", fontWeight: 500,
                textDecoration: "underline",
              }}
            >Clear saved session</button>
          </div>
        )}

        <button
          onClick={() => onNavigate("plan")}
          style={{
            width: "100%", padding: "16px 24px", fontSize: "1rem", fontWeight: 700,
            color: "#1A3A2F", background: "#D4E157", border: "none", borderRadius: 12,
            cursor: "pointer", marginBottom: 12, letterSpacing: "0.02em",
            boxShadow: "0 4px 15px rgba(212,225,87,0.3)",
          }}
        >{"\u{1F4DD}"} Plan My Shots</button>

        <button
          onClick={() => { onNavigate("shoot"); setIsRunning(true); }}
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
