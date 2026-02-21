import { useState, useRef, useEffect } from "react";

export function VoiceMemoRecorder() {
  const [state, setState] = useState("idle"); // idle | recording | done
  const [seconds, setSeconds] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorder = useRef(null);
  const chunks = useRef([]);
  const timerRef = useRef(null);
  const mimeRef = useRef("audio/webm");

  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Pick a MIME type the browser supports (Safari doesn't support webm)
  const getMimeType = () => {
    if (typeof MediaRecorder === "undefined") return null;
    for (const type of ["audio/webm", "audio/mp4", "audio/ogg", ""]) {
      if (type === "" || MediaRecorder.isTypeSupported(type)) return type;
    }
    return "";
  };

  const getFileExt = (mime) => {
    if (mime.includes("mp4")) return "m4a";
    if (mime.includes("ogg")) return "ogg";
    return "webm";
  };

  const startRecording = async () => {
    if (!window.isSecureContext) {
      alert("Voice memos require HTTPS. Please access this page over HTTPS.");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getMimeType();
      const options = mimeType ? { mimeType } : {};
      const recorder = new MediaRecorder(stream, options);
      mediaRecorder.current = recorder;
      mimeRef.current = recorder.mimeType || mimeType || "audio/webm";
      chunks.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.current.push(e.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunks.current, { type: mimeRef.current });
        setAudioUrl(URL.createObjectURL(blob));
        setState("done");
      };

      recorder.start();
      setState("recording");
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s >= 29) {
            clearInterval(timerRef.current);
            mediaRecorder.current?.stop();
            return 30;
          }
          return s + 1;
        });
      }, 1000);
    } catch (e) {
      alert("Microphone access is required for voice memos. Please allow microphone permissions and try again.");
    }
  };

  const stopRecording = () => {
    clearInterval(timerRef.current);
    mediaRecorder.current?.stop();
  };

  const resetRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setSeconds(0);
    setState("idle");
  };

  const downloadMemo = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = `voice-memo-${new Date().toISOString().slice(0, 10)}.${getFileExt(mimeRef.current)}`;
    a.click();
  };

  return (
    <div style={{
      background: "#FFFDE7", borderRadius: 12, padding: "14px 16px",
      border: "1.5px solid #FFE082",
    }}>
      <div style={{
        fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase",
        letterSpacing: "0.12em", color: "#F9A825", marginBottom: 8,
      }}>{"\u{1F399}\uFE0F"} 30-Second Voice Memo</div>

      {state === "idle" && (
        <button
          onClick={startRecording}
          style={{
            width: "100%", padding: "12px",
            background: "#EF5350", color: "#fff",
            border: "none", borderRadius: 10,
            fontWeight: 700, fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          <span style={{
            width: 10, height: 10, borderRadius: "50%",
            background: "#fff", display: "inline-block",
          }} />
          Record Voice Memo
        </button>
      )}

      {state === "recording" && (
        <div>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: 10, marginBottom: 10,
          }}>
            <span style={{
              width: 10, height: 10, borderRadius: "50%",
              background: "#EF5350",
              animation: "pulse-dot 1s infinite",
            }} />
            <span style={{
              fontFamily: "'SF Mono', 'Fira Code', monospace",
              fontSize: "1.2rem", fontWeight: 700, color: "#EF5350",
            }}>{seconds}s / 30s</span>
          </div>
          <div style={{
            background: "#e0e0e0", borderRadius: 4, height: 6,
            overflow: "hidden", marginBottom: 10,
          }}>
            <div style={{
              width: `${(seconds / 30) * 100}%`, height: "100%",
              background: "#EF5350", borderRadius: 4,
              transition: "width 0.3s",
            }} />
          </div>
          <button
            onClick={stopRecording}
            style={{
              width: "100%", padding: "10px",
              background: "#333", color: "#fff",
              border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: "0.82rem",
              cursor: "pointer",
            }}
          >Stop Recording</button>
          <style>{`@keyframes pulse-dot { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
        </div>
      )}

      {state === "done" && (
        <div>
          <audio src={audioUrl} controls style={{
            width: "100%", marginBottom: 10, borderRadius: 8,
          }} />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={downloadMemo}
              style={{
                flex: 1, padding: "10px",
                background: "#D4E157", color: "#1A3A2F",
                border: "none", borderRadius: 10,
                fontWeight: 700, fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >Download</button>
            <button
              onClick={resetRecording}
              style={{
                flex: 1, padding: "10px",
                background: "#f5f5f5", color: "#666",
                border: "1px solid #ddd", borderRadius: 10,
                fontWeight: 700, fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >Re-record</button>
          </div>
        </div>
      )}
    </div>
  );
}
