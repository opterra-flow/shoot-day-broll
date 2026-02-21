function playCameraClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 0.08;

    // Sharp click noise burst
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      const t = i / bufferSize;
      // Shaped noise that decays fast — sounds like a shutter snap
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 8);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    // Bandpass to make it sound more mechanical/clicky
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 3000;
    filter.Q.value = 1.5;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.6, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + duration);

    // Second click for the "mirror slap" feel
    setTimeout(() => {
      const buf2 = ctx.createBuffer(1, ctx.sampleRate * 0.04, ctx.sampleRate);
      const d2 = buf2.getChannelData(0);
      for (let i = 0; i < d2.length; i++) {
        const t = i / d2.length;
        d2[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 12);
      }
      const n2 = ctx.createBufferSource();
      n2.buffer = buf2;
      const f2 = ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 4500;
      f2.Q.value = 2;
      const g2 = ctx.createGain();
      g2.gain.setValueAtTime(0.3, ctx.currentTime);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      n2.connect(f2);
      f2.connect(g2);
      g2.connect(ctx.destination);
      n2.start();
      n2.stop(ctx.currentTime + 0.04);
    }, 30);
  } catch (e) {
    // Audio not supported — silent fallback
  }
}

export function ShotCheckItem({ shot, checked, onCheck, index }) {
  const handleClick = () => {
    if (!checked) playCameraClick();
    onCheck();
  };

  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 16px",
        background: checked ? "#E8F5E9" : "#fff",
        borderRadius: 12,
        marginBottom: 8,
        border: checked ? "1.5px solid #81C784" : "1.5px solid #e0e0e0",
        cursor: "pointer",
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
