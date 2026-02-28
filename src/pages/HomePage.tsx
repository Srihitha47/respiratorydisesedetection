import { DISEASES } from "@/lib/diseases";
import heroImage from "@/assets/hero-bg.jpg";
import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative container py-24 md:py-36 text-center">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-4 animate-fade-in">
            AI-Powered Respiratory Healthcare
          </p>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 animate-fade-in" style={{ animationDelay: "0.1s" }}>
            Lung Health Platform
          </h1>
          <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Advanced multimodal AI system analyzing chest X-rays and lung sounds for accurate disease detection, severity assessment, and personalized health guidance.
          </p>
          <div className="flex flex-wrap justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Link
              to="/detect"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-primary-foreground text-teal-dark font-semibold text-lg shadow-elevated hover:scale-105 transition-transform"
            >
              🩺 Start Diagnosis
            </Link>
            <Link
              to="/chatbot"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 border-primary-foreground/30 text-primary-foreground font-semibold text-lg hover:bg-primary-foreground/10 transition-colors"
            >
              💬 AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: "93.7%", label: "Classification Accuracy" },
            { value: "6,877", label: "Lung Sound Samples" },
            { value: "112K+", label: "Chest X-rays Analyzed" },
            { value: "5", label: "Diseases Detected" },
          ].map((stat) => (
            <div key={stat.label} className="bg-card rounded-2xl p-6 text-center shadow-card hover:shadow-card-hover transition-shadow">
              <p className="font-display text-3xl md:text-4xl font-bold text-gradient">{stat.value}</p>
              <p className="text-muted-foreground text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container py-12">
        <h2 className="font-display text-3xl font-bold text-center mb-3">Platform Features</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Comprehensive respiratory healthcare powered by deep learning models
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🔬", title: "Multimodal Detection", desc: "CNN, ResNet & DenseNet with attention mechanisms analyze X-rays and lung audio simultaneously." },
            { icon: "📊", title: "Risk Prediction", desc: "Early deterioration forecasting within 24–72 hours using severity trends and historical data." },
            { icon: "🩺", title: "Clinical Decision Support", desc: "Urgency classification: Immediate, Recommended, or Monitor-at-Home consultation advice." },
            { icon: "📄", title: "Automated Reports", desc: "Personalized health reports with diet, lifestyle recommendations, and severity assessment." },
            { icon: "🏥", title: "Doctor Finder", desc: "Geolocation-based pulmonologist and hospital recommendations sorted by proximity." },
            { icon: "💬", title: "AI Chatbot", desc: "Intelligent assistant for respiratory health queries with X-ray & audio upload support." },
            { icon: "📋", title: "Symptom Tracker", desc: "Log daily symptoms, track trends with charts, and monitor oxygen saturation over time." },
            { icon: "🧘", title: "Breathing Exercises", desc: "Guided breathing techniques — Box, 4-7-8, Diaphragmatic — with interactive timers." },
            { icon: "🚨", title: "Emergency SOS", desc: "One-tap emergency button with auto-location, nearby hospitals, and first aid guidance." },
          ].map((f) => (
            <div key={f.title} className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
              <span className="text-3xl mb-3 block">{f.icon}</span>
              <h3 className="font-display text-lg font-semibold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disease Cards */}
      <section className="container py-12 pb-20">
        <h2 className="font-display text-3xl font-bold text-center mb-3">Diseases We Detect</h2>
        <p className="text-muted-foreground text-center mb-10 max-w-xl mx-auto">
          Our AI models are trained to identify these respiratory conditions
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DISEASES.map((d) => (
            <div key={d.name} className="gradient-card rounded-2xl p-6 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{d.icon}</span>
                <h3 className="font-display text-lg font-semibold text-secondary-foreground">{d.name}</h3>
              </div>
              <p className="text-muted-foreground text-sm mb-3">{d.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {d.symptoms.map((s) => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-card text-muted-foreground">{s}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
