import { MOCK_DOCTORS, CITIES } from "@/lib/doctors";
import { useState, useEffect, useCallback } from "react";

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function DoctorsPage() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [userLoc, setUserLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [urgencyFilter, setUrgencyFilter] = useState<string>("All");

  const detectLocation = useCallback(() => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      (pos) => { setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); },
      () => setLocating(false)
    );
  }, []);

  useEffect(() => { detectLocation(); }, [detectLocation]);

  const doctorsWithDistance = MOCK_DOCTORS.map((d) => ({
    ...d,
    realDistance: userLoc ? haversine(userLoc.lat, userLoc.lng, d.lat, d.lng) : null,
  }));

  const filtered = doctorsWithDistance
    .filter((d) => {
      const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()) || d.hospital.toLowerCase().includes(search.toLowerCase());
      const matchesCity = selectedCity === "All Cities" || d.city === selectedCity;
      return matchesSearch && matchesCity;
    })
    .sort((a, b) => {
      if (a.realDistance !== null && b.realDistance !== null) return a.realDistance - b.realDistance;
      return 0;
    });

  const urgencyFiltered = urgencyFilter === "All" ? filtered :
    urgencyFilter === "Emergency" ? filtered.slice(0, 3) :
    urgencyFilter === "Nearest" ? filtered.slice(0, 5) : filtered;

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">🏥 Find a Doctor</h1>
        <p className="text-muted-foreground mb-4">Locate nearby pulmonologists and respiratory healthcare centers across India.</p>

        {/* Location status */}
        <div className="flex items-center gap-3 mb-4">
          {userLoc ? (
            <span className="text-sm text-success flex items-center gap-1.5 bg-success/10 px-3 py-1.5 rounded-full">
              📍 Location detected — sorting by proximity
            </span>
          ) : (
            <button onClick={detectLocation} disabled={locating} className="text-sm text-primary flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">
              {locating ? "📡 Detecting..." : "📍 Enable location for nearby results"}
            </button>
          )}
        </div>

        {/* Urgency filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {["All", "Emergency", "Nearest"].map((u) => (
            <button key={u} onClick={() => setUrgencyFilter(u)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                urgencyFilter === u ? "bg-destructive text-destructive-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {u === "Emergency" ? "🚨 Emergency (Top 3)" : u === "Nearest" ? "📍 Nearest 5" : "All Doctors"}
            </button>
          ))}
        </div>

        {/* City filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {CITIES.map((city) => (
            <button key={city} onClick={() => setSelectedCity(city)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCity === city ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >{city}</button>
          ))}
        </div>

        <input type="text" placeholder="Search by name, specialty, or hospital..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 px-5 py-3.5 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring shadow-card" />

        <p className="text-sm text-muted-foreground mb-4">{urgencyFiltered.length} doctor{urgencyFiltered.length !== 1 ? "s" : ""} found{selectedCity !== "All Cities" ? ` in ${selectedCity}` : ""}</p>

        <div className="grid md:grid-cols-2 gap-5">
          {urgencyFiltered.map((doc) => (
            <div key={doc.id} className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
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
                <p>📍 {doc.address}, {doc.city} · {doc.realDistance ? `${doc.realDistance.toFixed(1)} km` : doc.distance}</p>
                <p>🕐 {doc.availability}</p>
                <p>📞 <a href={`tel:${doc.phone}`} className="text-primary hover:underline">{doc.phone}</a></p>
              </div>
            </div>
          ))}
        </div>

        {urgencyFiltered.length === 0 && (
          <p className="text-center text-muted-foreground mt-10">No doctors found matching your search.</p>
        )}
      </div>
    </div>
  );
}
