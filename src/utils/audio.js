export function playShutter() {
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
