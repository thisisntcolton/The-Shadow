import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

interface SessionCountdownProps {
  nextSession: string;
  isDM: boolean;
  onUpdateSession: (newDateTime: string) => Promise<void>;
}

export function SessionCountdown({ nextSession, isDM, onUpdateSession }: SessionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const [isInProgress, setIsInProgress] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [newDateTime, setNewDateTime] = useState(nextSession);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const session = new Date(nextSession);
      const diff = session.getTime() - now.getTime();

      if (diff <= 0) {
        setIsInProgress(true);
        setTimeLeft(null);
        return;
      }

      setIsInProgress(false);
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [nextSession]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onUpdateSession(newDateTime);
    setShowEditor(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center mb-8"
    >
      {isInProgress ? (
        <div className="flex items-center gap-3 px-6 py-3 border border-gold/40 rounded-lg bg-gold/10">
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="font-display text-gold tracking-widest uppercase text-sm">
            Session in Progress!
          </span>
          <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        </div>
      ) : timeLeft ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-gold/60 text-xs uppercase tracking-widest font-display">
            <Calendar className="w-3 h-3" />
            Next Session
          </div>
          <div className="flex gap-4">
            {[
              { label: "Days", value: timeLeft.days },
              { label: "Hours", value: timeLeft.hours },
              { label: "Min", value: timeLeft.minutes },
              { label: "Sec", value: timeLeft.seconds },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center">
                <div className="w-16 h-16 flex items-center justify-center border border-gold/30 rounded-lg bg-gold/5">
                  <span className="font-display text-2xl text-gold">
                    {String(value).padStart(2, '0')}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground font-display mt-1 uppercase tracking-wider">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* DM editor */}
      {isDM && (
        <div className="mt-4">
          {!showEditor ? (
            <button
              onClick={() => setShowEditor(true)}
              className="flex items-center gap-2 text-xs text-gold/40 hover:text-gold/70 transition-colors font-display uppercase tracking-widest"
            >
              <Clock className="w-3 h-3" />
              Set Next Session
            </button>
          ) : (
            <form onSubmit={handleUpdate} className="flex items-center gap-3 mt-2">
              <input
                type="datetime-local"
                value={newDateTime}
                onChange={(e) => setNewDateTime(e.target.value)}
                className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 font-display text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gold text-background font-bold rounded text-sm hover:bg-gold/80 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowEditor(false)}
                className="px-3 py-2 bg-muted/30 text-muted-foreground rounded text-sm hover:bg-muted/50 transition-colors"
              >
                Cancel
              </button>
            </form>
          )}
        </div>
      )}
    </motion.div>
  );
}