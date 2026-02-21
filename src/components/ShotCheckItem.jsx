function playCameraClick() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const rate = ctx.sampleRate;

    // ── Layer 1: Mirror slap — the initial sharp "ka" ──
    const mirrorLen = Math.floor(rate * 0.015);
    const mirrorBuf = ctx.createBuffer(1, mirrorLen, rate);
    const mirrorData = mirrorBuf.getChannelData(0);
    for (let i = 0; i < mirrorLen; i++) {
      const t = i / mirrorLen;
      // Very fast impulse with metallic ring
      mirrorData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 20)
        + Math.sin(2 * Math.PI * 1800 * t) * 0.3 * Math.pow(1 - t, 15);
    }
    const mirrorSrc = ctx.createBufferSource();
    mirrorSrc.buffer = mirrorBuf;
    const mirrorFilter = ctx.createBiquadFilter();
    mirrorFilter.type = "highpass";
    mirrorFilter.frequency.value = 1200;
    const mirrorGain = ctx.createGain();
    mirrorGain.gain.setValueAtTime(0.9, now);
    mirrorSrc.connect(mirrorFilter);
    mirrorFilter.connect(mirrorGain);
    mirrorGain.connect(ctx.destination);
    mirrorSrc.start(now);

    // ── Layer 2: Shutter curtain — the mechanical "chk" body ──
    const curtainLen = Math.floor(rate * 0.06);
    const curtainBuf = ctx.createBuffer(1, curtainLen, rate);
    const curtainData = curtainBuf.getChannelData(0);
    for (let i = 0; i < curtainLen; i++) {
      const t = i / curtainLen;
      // Filtered noise shaped like a mechanical slide
      curtainData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 6)
        * (1 + 0.5 * Math.sin(2 * Math.PI * 220 * t)); // low body resonance
    }
    const curtainSrc = ctx.createBufferSource();
    curtainSrc.buffer = curtainBuf;
    const curtainBP = ctx.createBiquadFilter();
    curtainBP.type = "bandpass";
    curtainBP.frequency.value = 2200;
    curtainBP.Q.value = 0.8;
    const curtainGain = ctx.createGain();
    curtainGain.gain.setValueAtTime(0.5, now);
    curtainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    curtainSrc.connect(curtainBP);
    curtainBP.connect(curtainGain);
    curtainGain.connect(ctx.destination);
    curtainSrc.start(now + 0.008); // slight delay after mirror

    // ── Layer 3: Second curtain close — the trailing "click" ──
    const closeLen = Math.floor(rate * 0.012);
    const closeBuf = ctx.createBuffer(1, closeLen, rate);
    const closeData = closeBuf.getChannelData(0);
    for (let i = 0; i < closeLen; i++) {
      const t = i / closeLen;
      closeData[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 25)
        + Math.sin(2 * Math.PI * 2800 * t) * 0.2 * Math.pow(1 - t, 18);
    }
    const closeSrc = ctx.createBufferSource();
    closeSrc.buffer = closeBuf;
    const closeHP = ctx.createBiquadFilter();
    closeHP.type = "highpass";
    closeHP.frequency.value = 1800;
    const closeGain = ctx.createGain();
    closeGain.gain.setValueAtTime(0.7, now);
    closeSrc.connect(closeHP);
    closeHP.connect(closeGain);
    closeGain.connect(ctx.destination);
    closeSrc.start(now + 0.055); // the second "click" after the body

    // ── Layer 4: Body resonance — subtle low thump from the camera body ──
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(80, now + 0.05);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(0.15, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);

    // Clean up context after sound finishes
    setTimeout(() => ctx.close(), 200);
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
