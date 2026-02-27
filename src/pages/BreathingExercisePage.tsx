import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";

interface Exercise {
  name: string;
  icon: string;
  description: string;
  inhale: number;
  hold: number;
  exhale: number;
  holdAfter: number;
  cycles: number;
  benefits: string[];
}

const EXERCISES: Exercise[] = [
  {
    name: "Box Breathing",
    icon: "🟦",
    description: "Used by Navy SEALs for stress relief and focus. Equal counts for each phase.",
    inhale: 4, hold: 4, exhale: 4, holdAfter: 4, cycles: 6,
    benefits: ["Reduces stress & anxiety", "Improves focus", "Lowers blood pressure", "Calms nervous system"],
  },
  {
    name: "4-7-8 Relaxation",
    icon: "🌙",
    description: "Dr. Andrew Weil's technique for deep relaxation and better sleep.",
    inhale: 4, hold: 7, exhale: 8, holdAfter: 0, cycles: 4,
    benefits: ["Promotes sleep", "Reduces anxiety", "Manages cravings", "Controls anger responses"],
  },
  {
    name: "Diaphragmatic Breathing",
    icon: "🫁",
    description: "Strengthens the diaphragm and increases lung efficiency. Ideal for COPD and asthma.",
    inhale: 4, hold: 2, exhale: 6, holdAfter: 0, cycles: 8,
    benefits: ["Strengthens diaphragm", "Improves lung capacity", "Reduces effort of breathing", "Great for COPD patients"],
  },
  {
    name: "Pursed Lip Breathing",
    icon: "💨",
    description: "Slows breathing rate and keeps airways open longer. Recommended for chronic lung conditions.",
    inhale: 2, hold: 0, exhale: 4, holdAfter: 1, cycles: 10,
    benefits: ["Opens airways longer", "Slows breathing rate", "Relieves shortness of breath", "Easy to learn"],
  },
];

type Phase = "inhale" | "hold" | "exhale" | "holdAfter" | "rest";

export default function BreathingExercisePage() {
  const [selected, setSelected] = useState<Exercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<Phase>("rest");
  const [timer, setTimer] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsActive(false);
    setPhase("rest");
    setTimer(0);
    setCycle(0);
    setTotalSeconds(0);
  }, []);

  const start = useCallback(() => {
    if (!selected) return;
    setIsActive(true);
    setPhase("inhale");
    setTimer(selected.inhale);
    setCycle(1);
    setTotalSeconds(0);
  }, [selected]);

  useEffect(() => {
    if (!isActive || !selected) return;

    intervalRef.current = window.setInterval(() => {
      setTotalSeconds((t) => t + 1);
      setTimer((prev) => {
        if (prev > 1) return prev - 1;

        // Move to next phase
        setPhase((currentPhase) => {
          if (currentPhase === "inhale") {
            if (selected.hold > 0) { setTimer(selected.hold); return "hold"; }
            setTimer(selected.exhale); return "exhale";
          }
          if (currentPhase === "hold") { setTimer(selected.exhale); return "exhale"; }
          if (currentPhase === "exhale") {
            if (selected.holdAfter > 0) { setTimer(selected.holdAfter); return "holdAfter"; }
            setCycle((c) => {
              if (c >= selected.cycles) { stop(); return c; }
              setTimer(selected.inhale); return c + 1;
            });
            return "inhale";
          }
          if (currentPhase === "holdAfter") {
            setCycle((c) => {
              if (c >= selected.cycles) { stop(); return c; }
              setTimer(selected.inhale); return c + 1;
            });
            return "inhale";
          }
          return currentPhase;
        });
        return prev;
      });
    }, 1000);

    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isActive, selected, stop]);

  const phaseLabel = phase === "inhale" ? "Breathe In" : phase === "hold" ? "Hold" : phase === "exhale" ? "Breathe Out" : phase === "holdAfter" ? "Hold" : "Ready";
  const phaseColor = phase === "inhale" ? "text-primary" : phase === "exhale" ? "text-info" : phase === "hold" || phase === "holdAfter" ? "text-warning" : "text-muted-foreground";
  const circleScale = phase === "inhale" ? "scale-110" : phase === "exhale" ? "scale-90" : "scale-100";

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">🧘 Breathing Exercises</h1>
        <p className="text-muted-foreground mb-8">Guided breathing techniques to strengthen lungs, reduce stress, and manage respiratory conditions.</p>

        {!selected ? (
          <div className="grid sm:grid-cols-2 gap-5">
            {EXERCISES.map((ex) => (
              <button
                key={ex.name}
                onClick={() => setSelected(ex)}
                className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{ex.icon}</span>
                  <h3 className="font-display text-lg font-semibold">{ex.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{ex.description}</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">In: {ex.inhale}s</span>
                  {ex.hold > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-warning/10 text-warning">Hold: {ex.hold}s</span>}
                  <span className="text-xs px-2.5 py-1 rounded-full bg-info/10 text-info">Out: {ex.exhale}s</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground">{ex.cycles} cycles</span>
                </div>
                <ul className="space-y-1">
                  {ex.benefits.map((b) => (
                    <li key={b} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <span className="text-success">✓</span> {b}
                    </li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-lg mx-auto text-center">
            <button onClick={() => { stop(); setSelected(null); }} className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1">
              ← Back to exercises
            </button>

            <h2 className="font-display text-2xl font-bold mb-2">{selected.icon} {selected.name}</h2>
            <p className="text-muted-foreground text-sm mb-8">{selected.description}</p>

            {/* Animated circle */}
            <div className="flex justify-center mb-8">
              <div className={`w-52 h-52 rounded-full border-4 border-primary/30 flex flex-col items-center justify-center transition-transform duration-1000 ease-in-out ${isActive ? circleScale : ""} ${isActive ? "bg-primary/5" : "bg-card"}`}>
                <span className={`font-display text-4xl font-bold ${phaseColor} transition-colors`}>
                  {isActive ? timer : "—"}
                </span>
                <span className={`text-sm font-semibold mt-1 ${phaseColor}`}>{phaseLabel}</span>
                {isActive && (
                  <span className="text-xs text-muted-foreground mt-2">Cycle {cycle}/{selected.cycles}</span>
                )}
              </div>
            </div>

            {isActive && (
              <p className="text-sm text-muted-foreground mb-4">Total time: {Math.floor(totalSeconds / 60)}:{String(totalSeconds % 60).padStart(2, "0")}</p>
            )}

            <div className="flex gap-3 justify-center">
              {!isActive ? (
                <Button onClick={start} size="lg" className="rounded-xl px-10">
                  ▶️ Start Exercise
                </Button>
              ) : (
                <Button onClick={stop} variant="outline" size="lg" className="rounded-xl px-10">
                  ⏹️ Stop
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
