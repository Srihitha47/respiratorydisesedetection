import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const QUICK_QUESTIONS = [
  "What are symptoms of COPD?",
  "How to prevent pneumonia?",
  "When should I see a pulmonologist?",
  "Tips for managing asthma",
];

// Simple rule-based responses for now (AI chatbot needs Cloud backend)
function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes("pneumonia")) {
    return "**Pneumonia** is a lung infection causing inflammation. Key symptoms include persistent cough, high fever, chest pain, and difficulty breathing. Treatment often involves antibiotics and rest. Seek immediate care if you have severe breathing difficulty.\n\n🍎 **Diet tip:** High-protein foods, warm fluids, and vitamin C-rich fruits support recovery.";
  }
  if (lower.includes("asthma")) {
    return "**Asthma** is a chronic condition where airways narrow and produce extra mucus. Symptoms include wheezing, shortness of breath, and chest tightness. Triggers can include allergens, exercise, and cold air.\n\n💡 **Management:** Use prescribed inhalers, avoid triggers, and maintain regular check-ups with your pulmonologist.";
  }
  if (lower.includes("copd")) {
    return "**COPD (Chronic Obstructive Pulmonary Disease)** causes airflow blockage and breathing difficulties. It's often caused by long-term smoking. Symptoms include chronic cough, mucus production, and breathlessness.\n\n🚭 **Key advice:** Quit smoking immediately, use bronchodilators as prescribed, and practice breathing exercises.";
  }
  if (lower.includes("bronchitis")) {
    return "**Bronchitis** is inflammation of the bronchial tubes. Acute bronchitis often follows a cold, while chronic bronchitis is a serious ongoing condition. Symptoms include persistent cough, mucus, and chest discomfort.\n\n💧 **Tip:** Stay hydrated, rest, and use a humidifier. See a doctor if symptoms persist beyond 3 weeks.";
  }
  if (lower.includes("tuberculosis") || lower.includes("tb")) {
    return "**Tuberculosis (TB)** is a bacterial infection that primarily affects the lungs. Symptoms include a persistent cough lasting 3+ weeks, coughing blood, night sweats, and weight loss.\n\n⚠️ **Important:** TB is contagious. If you suspect TB, get tested immediately. Treatment involves a 6-9 month antibiotic regimen.";
  }
  if (lower.includes("pulmonologist") || lower.includes("doctor") || lower.includes("when")) {
    return "You should see a pulmonologist if you experience:\n- Persistent cough lasting more than 3 weeks\n- Shortness of breath during normal activities\n- Wheezing or chest tightness\n- Coughing up blood\n- Recurring respiratory infections\n\n🏥 Use our **Doctor Finder** to locate nearby specialists!";
  }
  if (lower.includes("prevent")) {
    return "**Prevention tips for respiratory diseases:**\n\n1. 🚭 Avoid smoking and secondhand smoke\n2. 💉 Get vaccinated (flu, pneumonia vaccines)\n3. 🧼 Practice good hand hygiene\n4. 😷 Wear masks in polluted areas\n5. 🏃 Exercise regularly for lung strength\n6. 🥗 Eat a balanced, nutrient-rich diet\n7. 💨 Ensure good indoor air quality";
  }
  return "I'm your **Lung Health AI Assistant** 🫁. I can help you with:\n\n- Information about respiratory diseases (Pneumonia, Asthma, COPD, Bronchitis, TB)\n- Symptom guidance and prevention tips\n- When to see a pulmonologist\n- Diet and lifestyle recommendations\n\nTry asking about a specific condition or concern!";
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! 👋 I'm your **Lung Health AI Assistant**. Ask me anything about respiratory health, disease symptoms, prevention, or lifestyle recommendations." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getResponse(text);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div className="min-h-screen pt-16 flex flex-col">
      <div className="container max-w-3xl flex-1 flex flex-col py-4">
        <h1 className="font-display text-2xl font-bold mb-4">💬 Lung Health Chatbot</h1>

        {/* Messages */}
        <div className="flex-1 overflow-auto space-y-4 mb-4 pr-2">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card text-card-foreground shadow-card rounded-bl-md"
                }`}
              >
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
                Typing<span className="animate-pulse">...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

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
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send(input)}
            placeholder="Ask about respiratory health..."
            className="flex-1 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card"
          />
          <Button onClick={() => send(input)} disabled={!input.trim()} className="rounded-xl px-6">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
