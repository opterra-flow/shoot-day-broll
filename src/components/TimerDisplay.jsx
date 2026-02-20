import { formatTime } from "../utils/timer";

export function TimerDisplay({ seconds, isRunning }) {
  return (
    <span style={{
      fontFamily: "'SF Mono', 'Fira Code', monospace",
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "0.05em",
      color: isRunning ? "#D4E157" : "#666",
    }}>
      {formatTime(seconds)}
    </span>
  );
}
