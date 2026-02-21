import { useState, useEffect, useRef, useCallback } from "react";
import { PILLARS } from "./data/pillars";
import { playShutter } from "./utils/audio";
import { saveSession, loadSession, clearSession } from "./utils/storage";
import { QuoteView } from "./views/QuoteView";
import { HomeView } from "./views/HomeView";
import { PlanView } from "./views/PlanView";
import { ShootView } from "./views/ShootView";
import { ChecklistView } from "./views/ChecklistView";
import { CompleteView } from "./views/CompleteView";

export default function ShootDayApp() {
  const saved = useRef(loadSession());
  const [hasSession, setHasSession] = useState(saved.current !== null);

  const [view, setView] = useState("quote");
  const [isRunning, setIsRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [notes, setNotes] = useState({});
  const [activePillarIndex, setActivePillarIndex] = useState(0);
  const [checkedShots, setCheckedShots] = useState({});
  const [completedPillars, setCompletedPillars] = useState([]);
  const [selectedHooks, setSelectedHooks] = useState({});
  const [pillarTimers, setPillarTimers] = useState({ magnet: 0, mirror: 0, bridge: 0 });
  const [wrapChecked, setWrapChecked] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const intervalRef = useRef(null);

  // Auto-save on state changes
  useEffect(() => {
    // Don't save if we're still on the quote screen with no data
    if (view === "quote" && Object.keys(notes).length === 0 && elapsed === 0) return;
    saveSession({
      view, elapsed, pillarTimers, notes, activePillarIndex,
      checkedShots, completedPillars, selectedHooks, wrapChecked,
    });
  }, [view, elapsed, pillarTimers, notes, activePillarIndex, checkedShots, completedPillars, selectedHooks, wrapChecked]);

  // Timer
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setElapsed((e) => e + 1);
        setPillarTimers((prev) => {
          const currentId = PILLARS[activePillarIndex]?.id;
          if (!currentId) return prev;
          return { ...prev, [currentId]: (prev[currentId] || 0) + 1 };
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, activePillarIndex]);

  const handleCheckShot = useCallback((pillarId, shotIndex) => {
    setCheckedShots((prev) => {
      const current = prev[pillarId] || [];
      if (current.includes(shotIndex)) {
        return { ...prev, [pillarId]: current.filter((i) => i !== shotIndex) };
      }
      playShutter();
      return { ...prev, [pillarId]: [...current, shotIndex] };
    });
  }, []);

  const handleCompletePillar = useCallback((pillarId) => {
    setShowConfetti(true);
    setCompletedPillars((prev) => {
      const next = [...prev, pillarId];
      if (next.length === PILLARS.length) {
        setTimeout(() => {
          setIsRunning(false);
          setView("checklist");
        }, 1500);
      } else {
        // Auto-advance to next uncompleted pillar as a convenience
        const nextUncompleted = PILLARS.findIndex((p) => !next.includes(p.id));
        if (nextUncompleted !== -1) {
          setTimeout(() => setActivePillarIndex(nextUncompleted), 400);
        }
      }
      return next;
    });
  }, []);

  const confettiDone = useCallback(() => setShowConfetti(false), []);

  const resetAll = () => {
    setIsRunning(false);
    setElapsed(0);
    setPillarTimers({ magnet: 0, mirror: 0, bridge: 0 });
    setActivePillarIndex(0);
    setCheckedShots({});
    setCompletedPillars([]);
    setSelectedHooks({});
    setWrapChecked([]);
    setNotes({});
    clearSession();
    setView("quote");
  };

  const handleResumeSession = () => {
    const s = saved.current;
    if (!s) return;
    setView(s.view || "home");
    setElapsed(s.elapsed || 0);
    setPillarTimers(s.pillarTimers || { magnet: 0, mirror: 0, bridge: 0 });
    setNotes(s.notes || {});
    setActivePillarIndex(s.activePillarIndex || 0);
    setCheckedShots(s.checkedShots || {});
    setCompletedPillars(s.completedPillars || []);
    setSelectedHooks(s.selectedHooks || {});
    setWrapChecked(s.wrapChecked || []);
    // Always resume paused
    setIsRunning(false);
  };

  const handleClearSession = () => {
    clearSession();
    saved.current = null;
    setHasSession(false);
  };

  const handleStartShoot = () => {
    setView("shoot");
    setIsRunning(true);
  };

  switch (view) {
    case "quote":
      return <QuoteView onContinue={() => setView("home")} />;
    case "home":
      return (
        <HomeView
          onNavigate={setView}
          setIsRunning={setIsRunning}
          hasSession={hasSession}
          onResumeSession={handleResumeSession}
          onClearSession={handleClearSession}
        />
      );
    case "plan":
      return (
        <PlanView
          notes={notes}
          setNotes={setNotes}
          selectedHooks={selectedHooks}
          setSelectedHooks={setSelectedHooks}
          onNavigate={setView}
          onStartShoot={handleStartShoot}
        />
      );
    case "shoot":
      return (
        <ShootView
          elapsed={elapsed}
          pillarTimers={pillarTimers}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          activePillarIndex={activePillarIndex}
          checkedShots={checkedShots}
          completedPillars={completedPillars}
          notes={notes}
          setNotes={setNotes}
          selectedHooks={selectedHooks}
          showConfetti={showConfetti}
          confettiDone={confettiDone}
          handleCheckShot={handleCheckShot}
          handleCompletePillar={handleCompletePillar}
          onSetActivePillar={setActivePillarIndex}
          resetAll={resetAll}
          onNavigate={setView}
        />
      );
    case "checklist":
      return (
        <ChecklistView
          elapsed={elapsed}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          wrapChecked={wrapChecked}
          setWrapChecked={setWrapChecked}
          onComplete={() => {
            setShowConfetti(true);
            setView("complete");
          }}
        />
      );
    case "complete":
      return (
        <CompleteView
          elapsed={elapsed}
          pillarTimers={pillarTimers}
          notes={notes}
          selectedHooks={selectedHooks}
          showConfetti={showConfetti}
          confettiDone={confettiDone}
          onReset={resetAll}
        />
      );
    default:
      return null;
  }
}
