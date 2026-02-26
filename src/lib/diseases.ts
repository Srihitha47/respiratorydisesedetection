export const CLASS_NAMES = ["Pneumonia", "Asthma", "COPD", "Bronchitis", "Tuberculosis", "Healthy"] as const;
export type DiseaseName = typeof CLASS_NAMES[number];

export interface DiseaseInfo {
  name: DiseaseName;
  icon: string;
  description: string;
  symptoms: string[];
  color: string;
}

export const DISEASES: DiseaseInfo[] = [
  {
    name: "Pneumonia",
    icon: "🦠",
    description: "Infection of the lungs causing inflammation, cough, fever, and difficulty breathing.",
    symptoms: ["Persistent cough", "High fever", "Chest pain", "Shortness of breath"],
    color: "destructive",
  },
  {
    name: "Asthma",
    icon: "🌬️",
    description: "Chronic condition with airway inflammation leading to wheezing and shortness of breath.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Nighttime coughing"],
    color: "warning",
  },
  {
    name: "COPD",
    icon: "🫁",
    description: "Chronic obstructive pulmonary disease causing airflow blockage and breathing problems.",
    symptoms: ["Chronic cough", "Mucus production", "Breathlessness", "Fatigue"],
    color: "info",
  },
  {
    name: "Bronchitis",
    icon: "🤧",
    description: "Inflammation of the bronchial tubes causing cough, mucus production, and chest discomfort.",
    symptoms: ["Persistent cough", "Mucus", "Chest discomfort", "Mild fever"],
    color: "warning",
  },
  {
    name: "Tuberculosis",
    icon: "🔬",
    description: "Bacterial infection primarily affecting lungs, leading to persistent cough and weight loss.",
    symptoms: ["Persistent cough (3+ weeks)", "Coughing blood", "Weight loss", "Night sweats"],
    color: "destructive",
  },
  {
    name: "Healthy",
    icon: "💚",
    description: "No signs of lung disease detected; lungs are functioning normally.",
    symptoms: ["Normal breathing", "No cough", "Good oxygen levels", "Clear lung sounds"],
    color: "success",
  },
];

export function simulatePrediction(hasImage: boolean, hasAudio: boolean): { disease: DiseaseName; confidence: number } {
  const probs = CLASS_NAMES.map(() => Math.random());
  if (hasImage) probs.forEach((_, i) => (probs[i] += Math.random() * 1.2));
  if (hasAudio) probs.forEach((_, i) => (probs[i] += Math.random() * 1.5));
  const sum = probs.reduce((a, b) => a + b, 0);
  const normalized = probs.map((p) => p / sum);
  const maxIdx = normalized.indexOf(Math.max(...normalized));
  const confidence = Math.min(0.4 + normalized[maxIdx] * 0.55, 0.95) * 0.85;
  return { disease: CLASS_NAMES[maxIdx], confidence };
}

export function getSeverity(confidence: number): "High" | "Medium" | "Low" {
  if (confidence >= 0.8) return "High";
  if (confidence >= 0.6) return "Medium";
  return "Low";
}

export function getUrgency(disease: DiseaseName, severity: string): "Immediate" | "Recommended" | "Monitor at Home" {
  if (severity === "High" && disease !== "Healthy") return "Immediate";
  if (severity === "Medium" || (severity === "High" && disease === "Healthy")) return "Recommended";
  return "Monitor at Home";
}

export function getDietRecommendations(disease: DiseaseName): string[] {
  const diets: Record<string, string[]> = {
    asthma: ["Include antioxidant-rich foods (fruits & veggies)", "Stay hydrated with warm fluids", "Avoid smoking & pollution exposure", "Omega-3 rich foods (fish, flaxseed)"],
    copd: ["Include antioxidant-rich foods", "Stay hydrated", "Small frequent meals", "High-calorie nutritious snacks"],
    bronchitis: ["Include antioxidant-rich foods", "Stay hydrated", "Warm soups and broths", "Avoid dairy if mucus increases"],
    pneumonia: ["High-protein diet to support recovery", "Warm fluids & soups", "Vitamin C rich foods", "Plenty of rest and hydration"],
    tuberculosis: ["Protein-rich foods and dairy", "Whole grains and fruits", "Avoid alcohol and junk foods", "Iron-rich foods (spinach, lentils)"],
    healthy: ["Maintain a balanced, healthy diet", "Regular exercise and deep breathing", "Stay hydrated", "Annual lung health checkups"],
  };
  return diets[disease.toLowerCase()] || diets.healthy;
}

export function generateReport(disease: DiseaseName, confidence: number, severity: string): string {
  const urgency = getUrgency(disease, severity);
  const diet = getDietRecommendations(disease);
  return `📝 PATIENT LUNG HEALTH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Disease Detected: ${disease}
Confidence: ${(confidence * 100).toFixed(1)}%
Severity: ${severity}
Consultation Urgency: ${urgency}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍎 DIET & LIFESTYLE RECOMMENDATIONS
${diet.map((d) => `  • ${d}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER
This report is AI-generated and for informational purposes only.
Please consult a qualified healthcare professional for diagnosis.

Generated: ${new Date().toLocaleDateString()}`;
}
