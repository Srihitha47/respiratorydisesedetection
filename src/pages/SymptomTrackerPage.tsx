import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";

interface SymptomEntry {
  date: string;
  cough: number;
  breathlessness: number;
  chestPain: number;
  fatigue: number;
  oxygenLevel: number;
  notes: string;
}

const SYMPTOM_LABELS: Record<string, string> = {
  cough: "Cough Severity",
  breathlessness: "Breathlessness",
  chestPain: "Chest Pain",
  fatigue: "Fatigue",
};

const INITIAL_HISTORY: SymptomEntry[] = [
  { date: "2026-02-20", cough: 3, breathlessness: 2, chestPain: 1, fatigue: 4, oxygenLevel: 97, notes: "Slight morning cough" },
  { date: "2026-02-21", cough: 4, breathlessness: 3, chestPain: 2, fatigue: 4, oxygenLevel: 96, notes: "Cough worsening" },
  { date: "2026-02-22", cough: 5, breathlessness: 4, chestPain: 2, fatigue: 5, oxygenLevel: 95, notes: "Visited doctor" },
  { date: "2026-02-23", cough: 4, breathlessness: 3, chestPain: 1, fatigue: 3, oxygenLevel: 96, notes: "Started medication" },
  { date: "2026-02-24", cough: 3, breathlessness: 2, chestPain: 1, fatigue: 2, oxygenLevel: 97, notes: "Feeling better" },
  { date: "2026-02-25", cough: 2, breathlessness: 2, chestPain: 0, fatigue: 2, oxygenLevel: 97, notes: "Improving" },
  { date: "2026-02-26", cough: 2, breathlessness: 1, chestPain: 0, fatigue: 1, oxygenLevel: 98, notes: "Much better" },
];

export default function SymptomTrackerPage() {
  const [history, setHistory] = useState<SymptomEntry[]>(INITIAL_HISTORY);
  const [form, setForm] = useState({
    cough: 0, breathlessness: 0, chestPain: 0, fatigue: 0, oxygenLevel: 98, notes: "",
  });

  const trend = useMemo(() => {
    if (history.length < 2) return "stable";
    const last = history[history.length - 1];
    const prev = history[history.length - 2];
    const lastTotal = last.cough + last.breathlessness + last.chestPain + last.fatigue;
    const prevTotal = prev.cough + prev.breathlessness + prev.chestPain + prev.fatigue;
    if (lastTotal > prevTotal + 2) return "worsening";
    if (lastTotal < prevTotal - 2) return "improving";
    return "stable";
  }, [history]);

  const addEntry = () => {
    const today = new Date().toISOString().split("T")[0];
    setHistory((prev) => [...prev, { date: today, ...form }]);
    setForm({ cough: 0, breathlessness: 0, chestPain: 0, fatigue: 0, oxygenLevel: 98, notes: "" });
  };

  const chartData = history.map((e) => ({
    date: e.date.slice(5),
    Cough: e.cough,
    Breathlessness: e.breathlessness,
    "Chest Pain": e.chestPain,
    Fatigue: e.fatigue,
  }));

  const oxygenData = history.map((e) => ({
    date: e.date.slice(5),
    "SpO2 %": e.oxygenLevel,
  }));

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">📋 Symptom Tracker</h1>
        <p className="text-muted-foreground mb-6">Log daily symptoms and track your respiratory health progression over time.</p>

        {/* Trend badge */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-8 ${
          trend === "improving" ? "bg-success/10 text-success" : trend === "worsening" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"
        }`}>
          {trend === "improving" ? "📈 Improving" : trend === "worsening" ? "📉 Worsening — Consider consulting a doctor" : "➡️ Stable"}
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Symptom Severity Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Line type="monotone" dataKey="Cough" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Breathlessness" stroke="hsl(var(--warning))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Chest Pain" stroke="hsl(var(--info))" strokeWidth={2} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Fatigue" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-2xl p-6 shadow-card">
            <h3 className="font-display text-lg font-semibold mb-4">Oxygen Saturation (SpO2)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={oxygenData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis domain={[90, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                <Area type="monotone" dataKey="SpO2 %" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Log form */}
        <div className="bg-card rounded-2xl p-6 shadow-card mb-8">
          <h3 className="font-display text-lg font-semibold mb-4">📝 Log Today's Symptoms</h3>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            {(["cough", "breathlessness", "chestPain", "fatigue"] as const).map((key) => (
              <div key={key}>
                <label className="text-sm font-medium text-foreground block mb-1.5">{SYMPTOM_LABELS[key]} (0-10)</label>
                <input
                  type="range" min="0" max="10" value={form[key]}
                  onChange={(e) => setForm((f) => ({ ...f, [key]: Number(e.target.value) }))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>None</span>
                  <span className="font-semibold text-foreground">{form[key]}</span>
                  <span>Severe</span>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Oxygen Level (SpO2 %)</label>
              <input
                type="number" min="80" max="100" value={form.oxygenLevel}
                onChange={(e) => setForm((f) => ({ ...f, oxygenLevel: Number(e.target.value) }))}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Notes</label>
              <input
                type="text" value={form.notes} placeholder="How are you feeling today?"
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>
          <Button onClick={addEntry} className="w-full rounded-xl">📋 Log Symptoms</Button>
        </div>

        {/* History table */}
        <div className="bg-card rounded-2xl p-6 shadow-card">
          <h3 className="font-display text-lg font-semibold mb-4">📅 Symptom History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="text-left py-2 px-3">Date</th>
                  <th className="text-center py-2 px-2">Cough</th>
                  <th className="text-center py-2 px-2">Breath</th>
                  <th className="text-center py-2 px-2">Pain</th>
                  <th className="text-center py-2 px-2">Fatigue</th>
                  <th className="text-center py-2 px-2">SpO2</th>
                  <th className="text-left py-2 px-3">Notes</th>
                </tr>
              </thead>
              <tbody>
                {[...history].reverse().map((e, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                    <td className="py-2.5 px-3 font-medium">{e.date}</td>
                    <td className="text-center py-2.5 px-2">{e.cough}</td>
                    <td className="text-center py-2.5 px-2">{e.breathlessness}</td>
                    <td className="text-center py-2.5 px-2">{e.chestPain}</td>
                    <td className="text-center py-2.5 px-2">{e.fatigue}</td>
                    <td className="text-center py-2.5 px-2">{e.oxygenLevel}%</td>
                    <td className="py-2.5 px-3 text-muted-foreground">{e.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
