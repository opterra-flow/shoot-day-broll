import { generateStoryboardMarkdown, downloadMarkdown, printStoryboard } from "../utils/storyboardExport";

export function DownloadButtons({ notes, selectedHooks, pillarTimers, elapsed, compact, hasVoiceMemo }) {
  const handleDownloadMd = () => {
    const md = generateStoryboardMarkdown(notes, selectedHooks, pillarTimers, elapsed, { hasVoiceMemo });
    downloadMarkdown(md);
  };

  const handlePrintPdf = () => {
    const md = generateStoryboardMarkdown(notes, selectedHooks, pillarTimers, elapsed, { hasVoiceMemo });
    printStoryboard(md);
  };

  if (compact) {
    return (
      <div style={{ display: "flex", gap: 6 }}>
        <button onClick={handlePrintPdf} style={{
          background: "rgba(255,255,255,0.1)", border: "none", color: "#A5D6A7",
          fontSize: "0.65rem", fontWeight: 600, padding: "4px 8px",
          borderRadius: 4, cursor: "pointer",
        }}>PDF</button>
        <button onClick={handleDownloadMd} style={{
          background: "rgba(255,255,255,0.1)", border: "none", color: "#A5D6A7",
          fontSize: "0.65rem", fontWeight: 600, padding: "4px 8px",
          borderRadius: 4, cursor: "pointer",
        }}>.md</button>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <button onClick={handlePrintPdf} style={{
        flex: 1, padding: "10px 16px",
        background: "#C9A961", border: "none", color: "#fff",
        borderRadius: 8, cursor: "pointer",
        fontSize: "0.8rem", fontWeight: 700,
      }}>Save as PDF</button>
      <button onClick={handleDownloadMd} style={{
        flex: 1, padding: "10px 16px",
        background: "transparent", border: "1.5px solid #C9A961", color: "#C9A961",
        borderRadius: 8, cursor: "pointer",
        fontSize: "0.8rem", fontWeight: 700,
      }}>Download .md</button>
    </div>
  );
}
