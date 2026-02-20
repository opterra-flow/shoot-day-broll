import { useState } from "react";
import { PILLARS } from "../data/pillars";
import { PlanPillarCard } from "../plan/PlanPillarCard";
import { HookBankModal } from "../plan/HookBankModal";
import { DownloadButtons } from "../components/DownloadButtons";

export function PlanView({ notes, setNotes, selectedHooks, setSelectedHooks, onNavigate, onStartShoot }) {
  const [hookModalOpen, setHookModalOpen] = useState(false);
  const [hookTarget, setHookTarget] = useState(null); // { pillarId, shotIndex }

  const handleOpenHookBank = (pillarId, shotIndex) => {
    setHookTarget({ pillarId, shotIndex });
    setHookModalOpen(true);
  };

  const handleSelectHook = (hookText) => {
    if (!hookTarget) return;
    const key = `${hookTarget.pillarId}-${hookTarget.shotIndex}`;
    setSelectedHooks((prev) => ({ ...prev, [key]: hookText }));
    setHookModalOpen(false);
    setHookTarget(null);
  };

  const handleRemoveHook = (pillarId, shotIndex) => {
    const key = `${pillarId}-${shotIndex}`;
    setSelectedHooks((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

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
        <button onClick={() => onNavigate("home")} style={{
          background: "none", border: "none", color: "#A5D6A7",
          fontSize: "0.85rem", cursor: "pointer", fontWeight: 600,
        }}>{"\u2190"} Back</button>
        <span style={{
          color: "#D4E157", fontWeight: 800, fontSize: "0.8rem",
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>{"\u{1F4DD}"} Shot Planning</span>
        <button onClick={onStartShoot} style={{
          background: "#D4E157", border: "none", color: "#1A3A2F",
          fontSize: "0.75rem", fontWeight: 700, padding: "6px 12px",
          borderRadius: 6, cursor: "pointer",
        }}>Start Shoot {"\u2192"}</button>
      </div>

      <div style={{ padding: "20px 16px", maxWidth: 500, margin: "0 auto" }}>
        <p style={{
          fontSize: "0.85rem", color: "#777", textAlign: "center",
          marginBottom: 12, lineHeight: 1.5,
        }}>
          Tap each pillar to see examples, then write your concepts for wide, medium, and tight.
        </p>

        <div style={{ marginBottom: 16 }}>
          <DownloadButtons notes={notes} selectedHooks={selectedHooks} pillarTimers={null} elapsed={0} />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {PILLARS.map((pillar) => (
            <PlanPillarCard
              key={pillar.id}
              pillar={pillar}
              notes={notes}
              setNotes={setNotes}
              selectedHooks={selectedHooks}
              onOpenHookBank={handleOpenHookBank}
              onRemoveHook={handleRemoveHook}
            />
          ))}
        </div>
      </div>

      <HookBankModal
        isOpen={hookModalOpen}
        onClose={() => { setHookModalOpen(false); setHookTarget(null); }}
        onSelect={handleSelectHook}
      />
    </div>
  );
}
