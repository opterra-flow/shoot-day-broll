export function ShotCheckItem({ shot, checked, onCheck, index }) {
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
