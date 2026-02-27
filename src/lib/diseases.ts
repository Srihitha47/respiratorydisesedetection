export const CLASS_NAMES = ["Pneumonia", "Asthma", "COPD", "Bronchitis", "Tuberculosis", "Healthy"] as const;
export type DiseaseName = typeof CLASS_NAMES[number];

export interface DiseaseInfo {
  name: DiseaseName;
  icon: string;
  description: string;
  symptoms: string[];
  causes: string[];
  precautions: string[];
  color: string;
}

export const DISEASES: DiseaseInfo[] = [
  {
    name: "Pneumonia",
    icon: "🦠",
    description: "Infection of the lungs causing inflammation, cough, fever, and difficulty breathing.",
    symptoms: ["Persistent cough", "High fever", "Chest pain", "Shortness of breath"],
    causes: [
      "Bacterial infection (Streptococcus pneumoniae)",
      "Viral infections (influenza, COVID-19, RSV)",
      "Fungal infections (in immunocompromised patients)",
      "Aspiration of food, liquid, or vomit into lungs",
      "Weakened immune system due to chronic illness",
      "Prolonged hospitalization or ventilator use",
    ],
    precautions: [
      "Get pneumococcal and flu vaccinations",
      "Wash hands frequently with soap",
      "Avoid close contact with infected individuals",
      "Don't smoke — it damages lung defenses",
      "Practice good oral hygiene to prevent aspiration",
      "Seek medical care promptly for persistent cough/fever",
    ],
    color: "destructive",
  },
  {
    name: "Asthma",
    icon: "🌬️",
    description: "Chronic condition with airway inflammation leading to wheezing and shortness of breath.",
    symptoms: ["Wheezing", "Shortness of breath", "Chest tightness", "Nighttime coughing"],
    causes: [
      "Genetic predisposition and family history",
      "Allergens (dust mites, pollen, pet dander, mold)",
      "Air pollution and cigarette smoke exposure",
      "Respiratory infections in early childhood",
      "Occupational exposure to chemicals/fumes",
      "Obesity and sedentary lifestyle",
      "Cold air and sudden weather changes",
    ],
    precautions: [
      "Identify and avoid personal triggers",
      "Always carry a rescue inhaler",
      "Use air purifiers at home",
      "Monitor air quality index before outdoor activities",
      "Follow prescribed controller medication regimen",
      "Create an asthma action plan with your doctor",
      "Keep home clean and dust-free",
    ],
    color: "warning",
  },
  {
    name: "COPD",
    icon: "🫁",
    description: "Chronic obstructive pulmonary disease causing airflow blockage and breathing problems.",
    symptoms: ["Chronic cough", "Mucus production", "Breathlessness", "Fatigue"],
    causes: [
      "Long-term cigarette smoking (primary cause, 85-90%)",
      "Prolonged exposure to secondhand smoke",
      "Occupational dust and chemical fumes",
      "Indoor air pollution from biomass fuel cooking",
      "Alpha-1 antitrypsin deficiency (genetic)",
      "History of severe childhood respiratory infections",
      "Aging and cumulative lung damage",
    ],
    precautions: [
      "Quit smoking immediately — most critical step",
      "Avoid secondhand smoke and air pollutants",
      "Get flu and pneumonia vaccines annually",
      "Practice pulmonary rehabilitation exercises",
      "Use supplemental oxygen as prescribed",
      "Monitor lung function regularly with spirometry",
      "Stay active with gentle exercises like walking",
    ],
    color: "info",
  },
  {
    name: "Bronchitis",
    icon: "🤧",
    description: "Inflammation of the bronchial tubes causing cough, mucus production, and chest discomfort.",
    symptoms: ["Persistent cough", "Mucus", "Chest discomfort", "Mild fever"],
    causes: [
      "Viral infections (common cold, influenza viruses)",
      "Bacterial infections (secondary to viral illness)",
      "Cigarette smoking and tobacco use",
      "Exposure to air pollutants and industrial fumes",
      "Gastroesophageal reflux disease (GERD)",
      "Weakened immune system",
      "Repeated exposure to lung irritants",
    ],
    precautions: [
      "Avoid smoking and secondhand smoke",
      "Wash hands frequently to prevent infection",
      "Wear a mask in polluted or dusty environments",
      "Stay hydrated to thin mucus secretions",
      "Use a humidifier to moisten indoor air",
      "Rest adequately during acute episodes",
      "Get annual flu vaccination",
    ],
    color: "warning",
  },
  {
    name: "Tuberculosis",
    icon: "🔬",
    description: "Bacterial infection primarily affecting lungs, leading to persistent cough and weight loss.",
    symptoms: ["Persistent cough (3+ weeks)", "Coughing blood", "Weight loss", "Night sweats"],
    causes: [
      "Mycobacterium tuberculosis bacterial infection",
      "Close contact with an infected person (airborne spread)",
      "Weakened immune system (HIV/AIDS, diabetes, malnutrition)",
      "Living in overcrowded or poorly ventilated areas",
      "Substance abuse (alcohol, IV drugs)",
      "Healthcare workers' occupational exposure",
      "Migration from high TB-burden countries",
    ],
    precautions: [
      "BCG vaccination for infants in endemic areas",
      "Complete the full course of TB medication (6-9 months)",
      "Ensure proper ventilation in living spaces",
      "Wear N95 masks when near suspected TB patients",
      "Get tested if exposed to someone with active TB",
      "Maintain a strong immune system with proper nutrition",
      "Isolate during active infectious phase",
    ],
    color: "destructive",
  },
  {
    name: "Healthy",
    icon: "💚",
    description: "No signs of lung disease detected; lungs are functioning normally.",
    symptoms: ["Normal breathing", "No cough", "Good oxygen levels", "Clear lung sounds"],
    causes: [],
    precautions: [
      "Continue maintaining a healthy lifestyle",
      "Exercise regularly for strong lung capacity",
      "Avoid smoking and polluted environments",
      "Get annual health checkups including lung function",
      "Practice deep breathing exercises daily",
      "Stay hydrated and eat a balanced diet",
    ],
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
  const info = DISEASES.find((d) => d.name === disease);
  return `📝 PATIENT LUNG HEALTH REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Disease Detected: ${disease}
Confidence: ${(confidence * 100).toFixed(1)}%
Severity: ${severity}
Consultation Urgency: ${urgency}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 POSSIBLE CAUSES
${info?.causes.length ? info.causes.map((c) => `  • ${c}`).join("\n") : "  • No specific causes (healthy lungs)"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ PRECAUTIONS
${info?.precautions.map((p) => `  • ${p}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🍎 DIET & LIFESTYLE RECOMMENDATIONS
${diet.map((d) => `  • ${d}`).join("\n")}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ DISCLAIMER
This report is AI-generated and for informational purposes only.
Please consult a qualified healthcare professional for diagnosis.

Generated: ${new Date().toLocaleDateString()}`;
}
