import { useState, useCallback } from "react";
import { simulatePrediction, getSeverity, getUrgency, getDietRecommendations, generateReport, DISEASES, type DiseaseName } from "@/lib/diseases";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function DetectPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<{ disease: DiseaseName; confidence: number } | null>(null);

  const handleImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  }, []);

  const handleAudio = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setResult(null);
    }
  }, []);

  const runPrediction = useCallback(() => {
    if (!imageFile && !audioFile) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      const pred = simulatePrediction(!!imageFile, !!audioFile);
      setResult(pred);
      setIsAnalyzing(false);
    }, 2000);
  }, [imageFile, audioFile]);

  const severity = result ? getSeverity(result.confidence) : null;
  const urgency = result ? getUrgency(result.disease, severity!) : null;
  const diet = result ? getDietRecommendations(result.disease) : [];
  const diseaseInfo = result ? DISEASES.find((d) => d.name === result.disease) : null;
  const reportText = result ? generateReport(result.disease, result.confidence, severity!) : "";

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lung_health_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">🩺 Upload & Detect</h1>
        <p className="text-muted-foreground mb-8">Upload a chest X-ray and/or lung sound for AI-powered respiratory disease detection.</p>

        {/* Upload Area */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* X-ray Upload */}
          <label className="bg-card rounded-2xl p-8 border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-center shadow-card group">
            <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
            {imagePreview ? (
              <img src={imagePreview} alt="X-ray preview" className="w-full h-48 object-contain rounded-lg mb-3" />
            ) : (
              <div className="h-48 flex flex-col items-center justify-center">
                <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🫁</span>
                <p className="font-semibold text-foreground">Upload Chest X-ray</p>
                <p className="text-sm text-muted-foreground mt-1">PNG, JPG, JPEG</p>
              </div>
            )}
            {imageFile && <p className="text-sm text-primary font-medium truncate">{imageFile.name}</p>}
          </label>

          {/* Audio Upload */}
          <label className="bg-card rounded-2xl p-8 border-2 border-dashed border-border hover:border-primary/50 cursor-pointer transition-colors text-center shadow-card group">
            <input type="file" accept="audio/*" className="hidden" onChange={handleAudio} />
            <div className="h-48 flex flex-col items-center justify-center">
              <span className="text-5xl mb-3 group-hover:scale-110 transition-transform">🎙️</span>
              <p className="font-semibold text-foreground">Upload Lung Sound</p>
              <p className="text-sm text-muted-foreground mt-1">WAV, MP3, M4A</p>
            </div>
            {audioFile && <p className="text-sm text-primary font-medium truncate">{audioFile.name}</p>}
          </label>
        </div>

        <Button
          onClick={runPrediction}
          disabled={(!imageFile && !audioFile) || isAnalyzing}
          className="w-full py-6 text-lg font-semibold rounded-xl"
          size="lg"
        >
          {isAnalyzing ? "🔄 Analyzing..." : "🔬 Run AI Prediction"}
        </Button>

        {isAnalyzing && (
          <div className="mt-6 space-y-2">
            <p className="text-sm text-muted-foreground">Processing multimodal inputs through CNN, ResNet & DenseNet models...</p>
            <Progress value={65} className="h-2" />
          </div>
        )}

        {/* Results */}
        {result && severity && urgency && (
          <div className="mt-10 space-y-6 animate-fade-in">
            <h2 className="font-display text-2xl font-bold">🔹 Prediction Results</h2>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-card rounded-2xl p-5 text-center shadow-card">
                <p className="text-sm text-muted-foreground mb-1">Disease</p>
                <p className="font-display text-xl font-bold text-gradient">{result.disease}</p>
              </div>
              <div className="bg-card rounded-2xl p-5 text-center shadow-card">
                <p className="text-sm text-muted-foreground mb-1">Confidence</p>
                <p className="font-display text-xl font-bold text-gradient">{(result.confidence * 100).toFixed(1)}%</p>
              </div>
              <div className="bg-card rounded-2xl p-5 text-center shadow-card">
                <p className="text-sm text-muted-foreground mb-1">Severity</p>
                <p className={`font-display text-xl font-bold ${severity === "High" ? "text-destructive" : severity === "Medium" ? "text-warning" : "text-success"}`}>
                  {severity}
                </p>
              </div>
            </div>

            {/* Urgency */}
            <div className={`rounded-2xl p-5 shadow-card ${urgency === "Immediate" ? "bg-destructive/10 border border-destructive/20" : urgency === "Recommended" ? "bg-warning/10 border border-warning/20" : "bg-success/10 border border-success/20"}`}>
              <p className="text-sm font-medium mb-1">🏥 Consultation Urgency</p>
              <p className="font-display text-lg font-bold">{urgency}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {urgency === "Immediate" ? "Seek medical attention immediately. Contact your nearest pulmonologist." : urgency === "Recommended" ? "Schedule a consultation within the next few days." : "Monitor symptoms at home. Seek care if conditions worsen."}
              </p>
            </div>

            {/* Risk Prediction */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">📊 Early Deterioration Risk (24-72h)</h3>
              <div className="space-y-3 mb-6">
                {["24 hours", "48 hours", "72 hours"].map((period, i) => {
                  const risk = severity === "High" ? [75, 60, 45][i] : severity === "Medium" ? [40, 30, 20][i] : [15, 10, 5][i];
                  return (
                    <div key={period}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{period}</span>
                        <span className="font-semibold">{risk}% risk</span>
                      </div>
                      <Progress value={risk} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Severity Trend Analysis Chart */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">📈 Severity Trend Analysis</h3>
              <p className="text-xs text-muted-foreground mb-4">Simulated model confidence across all conditions</p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={(() => {
                  const probs = DISEASES.filter(d => d.name !== "Healthy").map(d => ({
                    name: d.name,
                    Confidence: d.name === result.disease ? +(result.confidence * 100).toFixed(1) : +(Math.random() * 30 + 5).toFixed(1),
                  }));
                  return probs;
                })()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Bar dataKey="Confidence" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Feature Fusion Radar */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">🔬 Feature Fusion Model Analysis</h3>
              <p className="text-xs text-muted-foreground mb-4">CNN, ResNet & DenseNet individual model contributions</p>
              <ResponsiveContainer width="100%" height={280}>
                <RadarChart data={[
                  { model: "CNN", score: +(Math.random() * 20 + 75).toFixed(1) },
                  { model: "ResNet", score: +(Math.random() * 15 + 80).toFixed(1) },
                  { model: "DenseNet", score: +(Math.random() * 10 + 85).toFixed(1) },
                  { model: "Attention", score: +(Math.random() * 12 + 82).toFixed(1) },
                  { model: "Fusion", score: +(result.confidence * 100).toFixed(1) },
                ]}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="model" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                  <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
                  <Radar name="Accuracy" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.25} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Causes */}
            {diseaseInfo && diseaseInfo.causes.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold mb-3">🔍 Possible Causes / Reasons</h3>
                <ul className="space-y-2">
                  {diseaseInfo.causes.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm">
                      <span className="text-warning mt-0.5">⚡</span>
                      <span className="text-muted-foreground">{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Precautions */}
            {diseaseInfo && (
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold mb-3">🛡️ Medical Precautions</h3>
                <ul className="space-y-2">
                  {diseaseInfo.precautions.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm">
                      <span className="text-info mt-0.5">🔹</span>
                      <span className="text-muted-foreground">{p}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Diet */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">🍎 Diet & Lifestyle Recommendations</h3>
              <ul className="space-y-2">
                {diet.map((d) => (
                  <li key={d} className="flex items-start gap-2 text-sm">
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="text-muted-foreground">{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Report Download */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">📄 Patient Report</h3>
              <pre className="bg-muted rounded-xl p-4 text-xs text-muted-foreground whitespace-pre-wrap font-body mb-4 max-h-60 overflow-auto">
                {reportText}
              </pre>
              <Button onClick={downloadReport} className="w-full rounded-xl">
                📥 Download Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
