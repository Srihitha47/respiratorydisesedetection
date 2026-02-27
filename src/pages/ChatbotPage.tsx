import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { simulatePrediction, getSeverity, getUrgency, getDietRecommendations, DISEASES, type DiseaseName } from "@/lib/diseases";

interface Message {
  role: "user" | "assistant";
  content: string;
  imageUrl?: string;
  audioName?: string;
}

const QUICK_QUESTIONS = [
  "What are symptoms of COPD?",
  "What causes pneumonia?",
  "Precautions for tuberculosis",
  "When should I see a pulmonologist?",
  "Tips for managing asthma",
];

function getResponse(input: string): string {
  const lower = input.toLowerCase();

  // Check for causes/reasons queries
  for (const disease of DISEASES) {
    const name = disease.name.toLowerCase();
    if (lower.includes(name) && (lower.includes("cause") || lower.includes("reason") || lower.includes("why"))) {
      if (disease.causes.length === 0) {
        return `**${disease.name}** — Great news! Your lungs appear healthy. Keep maintaining good habits! 💚`;
      }
      return `**Causes/Reasons for ${disease.name}:**\n\n${disease.causes.map((c, i) => `${i + 1}. ${c}`).join("\n")}\n\n💡 Understanding causes helps in prevention. Ask me about **precautions** too!`;
    }
  }

  // Check for precautions queries
  for (const disease of DISEASES) {
    const name = disease.name.toLowerCase();
    if (lower.includes(name) && (lower.includes("precaution") || lower.includes("prevent") || lower.includes("avoid") || lower.includes("protect"))) {
      return `**Precautions for ${disease.name}:**\n\n${disease.precautions.map((p, i) => `${i + 1}. ${p}`).join("\n")}\n\n🏥 If symptoms persist, use our **Doctor Finder** to locate nearby specialists!`;
    }
  }

  // Disease info queries
  if (lower.includes("pneumonia")) {
    const d = DISEASES.find((x) => x.name === "Pneumonia")!;
    return `**Pneumonia** 🦠\n${d.description}\n\n**Symptoms:** ${d.symptoms.join(", ")}\n\n**Key Causes:** ${d.causes.slice(0, 3).join("; ")}\n\n🍎 **Diet tip:** High-protein foods, warm fluids, and vitamin C-rich fruits support recovery.\n\n💡 Ask me about "causes of pneumonia" or "precautions for pneumonia" for more details!`;
  }
  if (lower.includes("asthma")) {
    const d = DISEASES.find((x) => x.name === "Asthma")!;
    return `**Asthma** 🌬️\n${d.description}\n\n**Symptoms:** ${d.symptoms.join(", ")}\n\n**Key Causes:** ${d.causes.slice(0, 3).join("; ")}\n\n💡 **Management:** Use prescribed inhalers, avoid triggers, and maintain regular check-ups.\n\nAsk about "causes of asthma" or "asthma precautions" for more!`;
  }
  if (lower.includes("copd")) {
    const d = DISEASES.find((x) => x.name === "COPD")!;
    return `**COPD** 🫁\n${d.description}\n\n**Symptoms:** ${d.symptoms.join(", ")}\n\n**Key Causes:** ${d.causes.slice(0, 3).join("; ")}\n\n🚭 **Key advice:** Quit smoking, use bronchodilators as prescribed, and practice breathing exercises.\n\nAsk about "reasons for COPD" or "COPD precautions"!`;
  }
  if (lower.includes("bronchitis")) {
    const d = DISEASES.find((x) => x.name === "Bronchitis")!;
    return `**Bronchitis** 🤧\n${d.description}\n\n**Symptoms:** ${d.symptoms.join(", ")}\n\n**Key Causes:** ${d.causes.slice(0, 3).join("; ")}\n\n💧 **Tip:** Stay hydrated, rest, and use a humidifier. See a doctor if symptoms persist beyond 3 weeks.`;
  }
  if (lower.includes("tuberculosis") || lower.includes("tb")) {
    const d = DISEASES.find((x) => x.name === "Tuberculosis")!;
    return `**Tuberculosis (TB)** 🔬\n${d.description}\n\n**Symptoms:** ${d.symptoms.join(", ")}\n\n**Key Causes:** ${d.causes.slice(0, 3).join("; ")}\n\n⚠️ **Important:** TB is contagious. If you suspect TB, get tested immediately. Treatment involves a 6-9 month antibiotic regimen.`;
  }
  if (lower.includes("pulmonologist") || lower.includes("doctor") || lower.includes("when")) {
    return "You should see a pulmonologist if you experience:\n- Persistent cough lasting more than 3 weeks\n- Shortness of breath during normal activities\n- Wheezing or chest tightness\n- Coughing up blood\n- Recurring respiratory infections\n\n🏥 Use our **Doctor Finder** to locate nearby specialists!";
  }
  return "I'm your **Lung Health AI Assistant** 🫁. I can help you with:\n\n- Information about respiratory diseases (Pneumonia, Asthma, COPD, Bronchitis, TB)\n- **Causes & reasons** for each lung disease\n- **Precautions** and prevention tips\n- **Upload X-ray images or lung sounds** for AI-powered detection\n- When to see a pulmonologist\n- Diet and lifestyle recommendations\n\nTry asking about a specific condition, its causes, or upload medical files!";
}

function buildDetectionResponse(disease: DiseaseName, confidence: number): string {
  const severity = getSeverity(confidence);
  const urgency = getUrgency(disease, severity);
  const info = DISEASES.find((d) => d.name === disease)!;
  const diet = getDietRecommendations(disease);

  let response = `🔬 **AI Detection Result**\n\n`;
  response += `**Disease Detected:** ${info.icon} ${disease}\n`;
  response += `**Confidence:** ${(confidence * 100).toFixed(1)}%\n`;
  response += `**Severity:** ${severity}\n`;
  response += `**Consultation Urgency:** ${urgency}\n\n`;

  if (info.causes.length > 0) {
    response += `**🔍 Possible Causes:**\n${info.causes.slice(0, 4).map((c) => `• ${c}`).join("\n")}\n\n`;
  }

  response += `**🛡️ Precautions:**\n${info.precautions.slice(0, 4).map((p) => `• ${p}`).join("\n")}\n\n`;
  response += `**🍎 Diet Recommendations:**\n${diet.map((d) => `• ${d}`).join("\n")}\n\n`;

  if (urgency === "Immediate") {
    response += `⚠️ **URGENT:** Please seek immediate medical attention. Use our Doctor Finder to locate nearby pulmonologists!`;
  } else if (urgency === "Recommended") {
    response += `📋 Schedule a consultation with a pulmonologist within the next few days.`;
  } else {
    response += `✅ Monitor symptoms at home. Seek care if conditions worsen.`;
  }

  response += `\n\n_⚠️ This is AI-generated analysis for informational purposes only. Consult a healthcare professional for diagnosis._`;
  return response;
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm your **Lung Health AI Assistant**. I can:\n\n• Answer questions about respiratory diseases, their **causes**, and **precautions**\n• **Analyze X-ray images** and **lung sounds** you upload\n• Provide diet and lifestyle recommendations\n\nTry asking a question or upload medical files below!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingImage, setPendingImage] = useState<File | null>(null);
  const [pendingAudio, setPendingAudio] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }, []);

  const handleAudioSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPendingAudio(file);
    }
  }, []);

  const clearAttachments = () => {
    setPendingImage(null);
    setPendingAudio(null);
    setImagePreview(null);
  };

  const send = (text: string) => {
    const hasMedia = !!pendingImage || !!pendingAudio;
    if (!text.trim() && !hasMedia) return;

    const userContent = text.trim() || (hasMedia ? "Analyze my uploaded medical files" : "");
    const userMsg: Message = {
      role: "user",
      content: userContent,
      imageUrl: imagePreview || undefined,
      audioName: pendingAudio?.name || undefined,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    const hadImage = !!pendingImage;
    const hadAudio = !!pendingAudio;
    clearAttachments();

    setTimeout(() => {
      let response: string;
      if (hadImage || hadAudio) {
        const pred = simulatePrediction(hadImage, hadAudio);
        response = buildDetectionResponse(pred.disease, pred.confidence);
      } else {
        response = getResponse(userContent);
      }
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, hadImage || hadAudio ? 2000 : 800);
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      <div className="container max-w-3xl flex-1 flex flex-col py-4">
        <h1 className="font-display text-2xl font-bold mb-4">💬 Lung Health AI Assistant</h1>

        {/* Hidden file inputs */}
        <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
        <input ref={audioInputRef} type="file" accept="audio/*" className="hidden" onChange={handleAudioSelect} />

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground shadow-card rounded-bl-md"
                }`}
              >
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Uploaded X-ray" className="w-full max-w-[240px] rounded-lg mb-2" />
                )}
                {msg.audioName && (
                  <div className="flex items-center gap-2 mb-2 text-xs opacity-80 bg-black/10 rounded-lg px-3 py-1.5">
                    <span>🎙️</span>
                    <span className="truncate">{msg.audioName}</span>
                  </div>
                )}
                {msg.content.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
                  part.startsWith("**") && part.endsWith("**") ? (
                    <strong key={j}>{part.slice(2, -2)}</strong>
                  ) : (
                    <span key={j}>{part}</span>
                  )
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card rounded-2xl px-5 py-3.5 shadow-card text-muted-foreground text-sm">
                {pendingImage || pendingAudio ? "🔬 Analyzing medical files" : "Typing"}
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Attachments preview */}
        {(pendingImage || pendingAudio) && (
          <div className="flex items-center gap-3 mb-3 p-3 rounded-xl bg-card border border-border shadow-card">
            {imagePreview && (
              <div className="relative">
                <img src={imagePreview} alt="X-ray preview" className="w-16 h-16 rounded-lg object-cover" />
                <button onClick={() => { setPendingImage(null); setImagePreview(null); }} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            )}
            {pendingAudio && (
              <div className="relative flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 text-xs">
                <span>🎙️</span>
                <span className="truncate max-w-[120px]">{pendingAudio.name}</span>
                <button onClick={() => setPendingAudio(null)} className="ml-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full text-xs flex items-center justify-center">×</button>
              </div>
            )}
            <span className="text-xs text-muted-foreground flex-1">Ready for AI analysis</span>
          </div>
        )}

        {/* Quick questions */}
        <div className="flex flex-wrap gap-2 mb-3">
          {QUICK_QUESTIONS.map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-accent transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <button
            onClick={() => imageInputRef.current?.click()}
            className="px-3 py-3 rounded-xl bg-card border border-border hover:bg-accent transition-colors text-lg"
            title="Upload X-ray image"
          >
            🫁
          </button>
          <button
            onClick={() => audioInputRef.current?.click()}
            className="px-3 py-3 rounded-xl bg-card border border-border hover:bg-accent transition-colors text-lg"
            title="Upload lung sound"
          >
            🎙️
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about respiratory health or upload files..."
            className="flex-1 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card"
          />
          <Button onClick={() => send(input)} disabled={!input.trim() && !pendingImage && !pendingAudio} className="rounded-xl px-6">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
