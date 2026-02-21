import { PILLARS } from "../data/pillars";
import { formatTime } from "./timer";

export function generateStoryboardMarkdown(notes, selectedHooks, pillarTimers, elapsed, { hasVoiceMemo } = {}) {
  const date = new Date().toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  let md = `# Shoot Day Storyboard\n`;
  md += `Generated: ${date}\n\n`;

  if (elapsed > 0) {
    md += `## Session Stats\n`;
    md += `Total Time: ${formatTime(elapsed)}\n`;
    if (pillarTimers) {
      for (const p of PILLARS) {
        const t = pillarTimers[p.id] || 0;
        if (t > 0) md += `  ${p.name}: ${formatTime(t)}\n`;
      }
    }
    md += `\n`;
  }

  for (const pillar of PILLARS) {
    md += `---\n\n`;
    md += `## ${pillar.emoji} ${pillar.name} \u2014 ${pillar.subtitle}\n\n`;
    md += `*${pillar.description}*\n\n`;

    for (let i = 0; i < pillar.shots.length; i++) {
      const shot = pillar.shots[i];
      const concept = notes[`${pillar.id}-${i}-concept`] || "";
      const hook = selectedHooks?.[`${pillar.id}-${i}`] || "";

      md += `### ${shot.angle}: ${shot.prompt}\n`;
      if (concept) md += `**Your concept:** ${concept}\n`;
      if (hook) md += `**Hook:** ${hook}\n`;
      md += `\n`;
    }

    const extra = notes[`${pillar.id}-extra`] || "";
    if (extra) {
      md += `**Additional Notes:** ${extra}\n\n`;
    }
  }

  if (hasVoiceMemo) {
    md += `---\n\n`;
    md += `## Voice Memo\nA voice memo was recorded for this session. Download it separately from the app.\n`;
  }

  return md;
}

export function downloadMarkdown(md) {
  const blob = new Blob([md], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `storyboard-${new Date().toISOString().slice(0, 10)}.md`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function markdownToSimpleHtml(md) {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^---$/gm, "<hr>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

export function printStoryboard(md) {
  const html = markdownToSimpleHtml(md);
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    // Fallback: download as markdown if popup blocked or standalone PWA
    downloadMarkdown(md);
    return;
  }
  printWindow.document.write(`
    <html><head><title>Shoot Day Storyboard</title>
    <style>
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 700px; margin: 40px auto; padding: 0 20px; color: #1A3A2F; line-height: 1.6; }
      h1 { color: #1A3A2F; border-bottom: 3px solid #D4E157; padding-bottom: 8px; margin-bottom: 4px; }
      h2 { color: #1A3A2F; margin-top: 24px; }
      h3 { color: #555; font-size: 0.95rem; }
      hr { border: none; border-top: 2px solid #e0e0e0; margin: 24px 0; }
      strong { color: #1A3A2F; }
      em { color: #666; }
      @media print { body { margin: 20px; } }
    </style></head><body>${html}</body></html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => printWindow.print(), 300);
}
