import { motion } from "framer-motion";
import { OrnateCard } from "./OrnateCard";
import { Scroll, Swords, Users, AlertTriangle } from "lucide-react";

interface SessionRecap {
  id: string;
  session: number;
  title: string;
  date?: string;
  summary: string;
  keyEvents?: string[];
  npcsEncountered?: string[];
  treasureFound?: string[];
}

interface DMRecapProps {
  recaps: SessionRecap[];
}

export function DMRecap({ recaps }: DMRecapProps) {
  if (!recaps || recaps.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <Scroll className="w-6 h-6 text-gold" />
          <h2 className="font-display text-2xl gold-text">Dungeon Master's Chronicles</h2>
        </div>
        <div className="text-center py-12 text-muted-foreground font-body italic">
          No chronicles have been written yet...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Scroll className="w-6 h-6 text-gold" />
        <h2 className="font-display text-2xl gold-text">Dungeon Master's Chronicles</h2>
      </div>

      <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
        {recaps.map((recap, index) => (
          <motion.div
            key={recap.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
          >
            <OrnateCard className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="text-xs text-gold uppercase tracking-wider">
                    Session {recap.session}
                  </span>
                  <h3 className="font-display text-xl text-foreground">{recap.title}</h3>
                  {recap.date && <p className="text-sm text-muted-foreground">{recap.date}</p>}
                </div>
                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">
                  <span className="font-display text-gold">{recap.session}</span>
                </div>
              </div>

              <p className="font-body text-muted-foreground mb-4 leading-relaxed">
                {recap.summary}
              </p>

              {/* Only show grid if any of the optional fields exist */}
              {(recap.keyEvents?.length || recap.npcsEncountered?.length || recap.treasureFound?.length) ? (
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {recap.keyEvents && recap.keyEvents.length > 0 && (
                    <div className="bg-muted/30 rounded p-3">
                      <div className="flex items-center gap-2 text-gold mb-2">
                        <Swords className="w-4 h-4" />
                        <span className="font-display">Key Events</span>
                      </div>
                      <ul className="space-y-1">
                        {recap.keyEvents.map((event, i) => (
                          <li key={i} className="text-muted-foreground text-xs">• {event}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recap.npcsEncountered && recap.npcsEncountered.length > 0 && (
                    <div className="bg-muted/30 rounded p-3">
                      <div className="flex items-center gap-2 text-forest-light mb-2">
                        <Users className="w-4 h-4" />
                        <span className="font-display">NPCs Met</span>
                      </div>
                      <ul className="space-y-1">
                        {recap.npcsEncountered.map((npc, i) => (
                          <li key={i} className="text-muted-foreground text-xs">• {npc}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {recap.treasureFound && recap.treasureFound.length > 0 && (
                    <div className="bg-muted/30 rounded p-3">
                      <div className="flex items-center gap-2 text-ember mb-2">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-display">Loot Found</span>
                      </div>
                      <ul className="space-y-1">
                        {recap.treasureFound.map((treasure, i) => (
                          <li key={i} className="text-muted-foreground text-xs">• {treasure}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : null}
            </OrnateCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export type { SessionRecap };