import { MOCK_DOCTORS, CITIES } from "@/lib/doctors";
import { useState } from "react";

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");

  const filtered = MOCK_DOCTORS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.specialty.toLowerCase().includes(search.toLowerCase()) ||
      d.hospital.toLowerCase().includes(search.toLowerCase());
    const matchesCity = selectedCity === "All Cities" || d.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">🏥 Find a Doctor</h1>
        <p className="text-muted-foreground mb-6">
          Locate nearby pulmonologists and respiratory healthcare centers across India.
        </p>

        {/* City filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCity === city
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Search by name, specialty, or hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card"
        />

        <p className="text-sm text-muted-foreground mb-4">{filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found{selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}</p>

        <div className="grid md:grid-cols-2 gap-5">
          {filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display text-lg font-semibold">{doc.name}</h3>
                  <p className="text-sm text-primary font-medium">{doc.specialty}</p>
                </div>
                <div className="flex items-center gap-1 bg-secondary px-2.5 py-1 rounded-full">
                  <span className="text-sm">⭐</span>
                  <span className="text-sm font-semibold text-secondary-foreground">{doc.rating}</span>
                </div>
              </div>
              <div className="space-y-1.5 text-sm text-muted-foreground">
                <p>🏥 {doc.hospital}</p>
                <p>📍 {doc.address}, {doc.city} · {doc.distance}</p>
                <p>🕐 {doc.availability}</p>
                <p>📞 {doc.phone}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">No doctors found matching your search.</p>
        )}
      </div>
    </div>
  );
}
