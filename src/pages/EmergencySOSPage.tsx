import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { MOCK_DOCTORS } from "@/lib/doctors";

interface EmergencyContact {
  name: string;
  relation: string;
  phone: string;
}

const DEFAULT_CONTACTS: EmergencyContact[] = [
  { name: "Emergency Services", relation: "Ambulance", phone: "112" },
  { name: "AIIMS Helpline", relation: "Hospital", phone: "1800-11-6263" },
  { name: "National Health Helpline", relation: "Health Info", phone: "1800-180-1104" },
];

export default function EmergencySOSPage() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);
  const [sosTriggered, setSosTriggered] = useState(false);
  const [contacts, setContacts] = useState<EmergencyContact[]>(DEFAULT_CONTACTS);
  const [newContact, setNewContact] = useState({ name: "", relation: "", phone: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  const getLocation = useCallback(() => {
    setLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          setLocation({ lat: 12.9716, lng: 77.5946 }); // fallback to Bengaluru
          setLocating(false);
        }
      );
    } else {
      setLocation({ lat: 12.9716, lng: 77.5946 });
      setLocating(false);
    }
  }, []);

  const triggerSOS = useCallback(() => {
    setSosTriggered(true);
    if (!location) getLocation();
  }, [location, getLocation]);

  const nearbyDoctors = location
    ? MOCK_DOCTORS.slice(0, 3).map((d) => ({
        ...d,
        distance: `${(Math.random() * 5 + 0.5).toFixed(1)} km`,
      }))
    : [];

  const addContact = () => {
    if (newContact.name && newContact.phone) {
      setContacts((prev) => [...prev, newContact]);
      setNewContact({ name: "", relation: "", phone: "" });
      setShowAddForm(false);
    }
  };

  const mapUrl = location
    ? `https://www.google.com/maps?q=hospitals+near+${location.lat},${location.lng}`
    : "#";

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">🚨 Emergency SOS</h1>
        <p className="text-muted-foreground mb-8">One-tap emergency assistance with location sharing and nearby hospital finder.</p>

        {/* SOS Button */}
        <div className="flex justify-center mb-10">
          <button
            onClick={triggerSOS}
            className={`w-48 h-48 rounded-full flex flex-col items-center justify-center text-white font-display font-bold shadow-elevated transition-all duration-300 ${
              sosTriggered
                ? "bg-destructive scale-95 animate-pulse"
                : "bg-destructive hover:scale-105 hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]"
            }`}
          >
            <span className="text-5xl mb-2">🆘</span>
            <span className="text-lg">{sosTriggered ? "SOS ACTIVE" : "TAP FOR SOS"}</span>
          </button>
        </div>

        {sosTriggered && (
          <div className="animate-fade-in space-y-6">
            {/* Location */}
            <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-6">
              <h3 className="font-display text-lg font-semibold mb-3 text-destructive">📍 Your Location</h3>
              {location ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Latitude: {location.lat.toFixed(4)}, Longitude: {location.lng.toFixed(4)}</p>
                  <a
                    href={mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-primary font-medium hover:underline"
                  >
                    🗺️ View nearby hospitals on Google Maps →
                  </a>
                </div>
              ) : (
                <Button onClick={getLocation} disabled={locating} variant="outline" size="sm" className="rounded-xl">
                  {locating ? "Locating..." : "📍 Detect My Location"}
                </Button>
              )}
            </div>

            {/* Emergency contacts */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold">📞 Emergency Contacts</h3>
                <button onClick={() => setShowAddForm(!showAddForm)} className="text-sm text-primary font-medium hover:underline">
                  + Add Contact
                </button>
              </div>

              {showAddForm && (
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <input placeholder="Name" value={newContact.name} onChange={(e) => setNewContact((c) => ({ ...c, name: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                  <input placeholder="Relation" value={newContact.relation} onChange={(e) => setNewContact((c) => ({ ...c, relation: e.target.value }))}
                    className="px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                  <div className="flex gap-1">
                    <input placeholder="Phone" value={newContact.phone} onChange={(e) => setNewContact((c) => ({ ...c, phone: e.target.value }))}
                      className="flex-1 px-3 py-2 rounded-lg bg-background border border-border text-sm text-foreground placeholder:text-muted-foreground" />
                    <Button onClick={addContact} size="sm" className="rounded-lg">Add</Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {contacts.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors">
                    <div>
                      <p className="font-medium text-sm">{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.relation}</p>
                    </div>
                    <a href={`tel:${c.phone}`} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                      📞 {c.phone}
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby doctors */}
            {nearbyDoctors.length > 0 && (
              <div className="bg-card rounded-2xl p-6 shadow-card">
                <h3 className="font-display text-lg font-semibold mb-4">🏥 Nearest Available Doctors</h3>
                <div className="space-y-3">
                  {nearbyDoctors.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.hospital} · {doc.distance}</p>
                      </div>
                      <a href={`tel:${doc.phone}`} className="px-3 py-1.5 rounded-lg bg-success/10 text-success text-xs font-semibold">
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* First aid tips */}
            <div className="bg-card rounded-2xl p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold mb-3">🩹 Respiratory Emergency First Aid</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {[
                  "Help the person sit upright — do not lay them flat",
                  "Loosen any tight clothing around chest and neck",
                  "If they have an inhaler, help them use it (2 puffs, 30 seconds apart)",
                  "Keep them calm, encourage slow deep breaths",
                  "If oxygen saturation drops below 92%, seek immediate medical help",
                  "Call 112 (India) or local emergency services if breathing worsens",
                  "Do not give food or water if they're struggling to breathe",
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-warning mt-0.5">⚡</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button onClick={() => setSosTriggered(false)} variant="outline" className="w-full rounded-xl">
              ✅ I'm Safe — Dismiss SOS
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
