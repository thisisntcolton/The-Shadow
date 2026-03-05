import { useState, useRef, useEffect } from "react";
import { MapPin, X } from "lucide-react";

interface Pin {
  id: string;
  title: string;
  notes: string;
  x: number;
  y: number;
  created_by: string;
}

interface MapViewProps {
  pins: Pin[];
  isDM: boolean;
  currentUser: any;
  onAddPin: (pin: Omit<Pin, 'id'>) => Promise<void>;
  onDeletePin: (id: string) => Promise<void>;
}

export const MapView = ({ pins, isDM, currentUser, onAddPin, onDeletePin }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [placingPin, setPlacingPin] = useState(false);
  const [newPinPos, setNewPinPos] = useState<{ x: number; y: number } | null>(null);
  const [newPinTitle, setNewPinTitle] = useState("");
  const [newPinNotes, setNewPinNotes] = useState("");

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDM || !placingPin) return;
    const rect = mapRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setNewPinPos({ x, y });
  };

  const handleSavePin = async () => {
    if (!newPinPos || !newPinTitle) return;
    await onAddPin({
      title: newPinTitle,
      notes: newPinNotes,
      x: newPinPos.x,
      y: newPinPos.y,
      created_by: currentUser?.name || "DM"
    });
    setNewPinPos(null);
    setNewPinTitle("");
    setNewPinNotes("");
    setPlacingPin(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* DM Controls */}
      {isDM && (
        <div className="flex items-center gap-3">
          <button
            onClick={() => { setPlacingPin(!placingPin); setNewPinPos(null); }}
            className={`flex items-center gap-2 px-4 py-2 rounded font-display text-sm transition-colors ${
              placingPin
                ? "bg-gold text-background"
                : "border border-gold/30 text-gold hover:bg-gold/10"
            }`}
          >
            <MapPin className="w-4 h-4" />
            {placingPin ? "Click map to place pin..." : "Place Pin"}
          </button>
          {placingPin && (
            <span className="text-gold/50 text-xs italic">Click anywhere on the map</span>
          )}
        </div>
      )}

      {/* Map Container */}
      <div
        ref={mapRef}
        onClick={handleMapClick}
        className={`relative w-full rounded-lg overflow-hidden border border-gold/20 shadow-xl ${
          placingPin ? "cursor-crosshair" : "cursor-default"
        }`}
        style={{ paddingBottom: "56.25%" }}
      >
        <img
          src="/middle-earth-map.jpeg"
          alt="Map of Middle-earth"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Existing Pins */}
        {pins.map(pin => (
          <button
            key={pin.id}
            onClick={(e) => { e.stopPropagation(); setSelectedPin(pin); }}
            className="absolute transform -translate-x-1/2 -translate-y-full group"
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
          >
            <MapPin className="w-6 h-6 text-gold drop-shadow-lg group-hover:scale-125 transition-transform" fill="#D4AF37" />
          </button>
        ))}

        {/* New Pin Preview */}
        {newPinPos && (
          <div
            className="absolute transform -translate-x-1/2 -translate-y-full"
            style={{ left: `${newPinPos.x}%`, top: `${newPinPos.y}%` }}
          >
            <MapPin className="w-6 h-6 text-red-400 animate-bounce" fill="#f87171" />
          </div>
        )}
      </div>

      {/* New Pin Form */}
      {newPinPos && (
        <div className="p-4 border border-gold/30 bg-muted/10 rounded-lg">
          <h3 className="text-gold font-display mb-3">Name this location</h3>
          <div className="flex flex-col gap-3">
            <input
              value={newPinTitle}
              onChange={e => setNewPinTitle(e.target.value)}
              placeholder="Location name (e.g. Rivendell)"
              className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
            />
            <textarea
              value={newPinNotes}
              onChange={e => setNewPinNotes(e.target.value)}
              placeholder="Notes about this location..."
              className="p-2 bg-background border border-gold/20 text-gold rounded h-20 outline-none focus:border-gold/50"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSavePin}
                disabled={!newPinTitle}
                className="bg-gold text-background font-bold py-2 px-4 rounded hover:bg-gold/80 transition-colors disabled:opacity-50"
              >
                Plant the Flag
              </button>
              <button
                onClick={() => setNewPinPos(null)}
                className="border border-gold/30 text-gold py-2 px-4 rounded hover:bg-muted/20 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pin Detail Modal */}
      {selectedPin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-background border border-gold/30 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" fill="#D4AF37" />
                <h2 className="text-gold font-display text-xl">{selectedPin.title}</h2>
              </div>
              <button onClick={() => setSelectedPin(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-gold transition-colors" />
              </button>
            </div>
            {selectedPin.notes && (
              <p className="text-muted-foreground font-body italic mb-4">{selectedPin.notes}</p>
            )}
            <p className="text-muted-foreground/50 text-xs mb-4">Marked by {selectedPin.created_by}</p>
            {isDM && (
              <button
                onClick={async () => { await onDeletePin(selectedPin.id); setSelectedPin(null); }}
                className="text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                Remove pin
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};