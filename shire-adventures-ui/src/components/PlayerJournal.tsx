import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrnateCard } from "./OrnateCard";
import { BookOpen, Calendar, MapPin, PenLine, Trash2 } from "lucide-react";

interface JournalEntry {
  id: string;
  title: string;
  date: string;
  location: string;
  content: string;
  author: string;
}

interface PlayerJournalProps {
  entries: JournalEntry[];
  currentUser: any;
  onAddEntry: (entry: Omit<JournalEntry, 'id'>) => Promise<void>;
  onDeleteEntry: (id: string) => Promise<void>;
}

export function PlayerJournal({ entries, currentUser, onAddEntry, onDeleteEntry }: PlayerJournalProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    await onAddEntry({
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      location: formData.get('location') as string,
      content: formData.get('content') as string,
      author: currentUser?.name || 'Unknown',
    });

    setIsSubmitting(false);
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-gold" />
          <h2 className="font-display text-2xl gold-text">Journal of Adventures</h2>
        </div>

        {currentUser && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/40 text-gold rounded font-display text-sm hover:bg-gold/30 transition-colors"
          >
            <PenLine className="w-4 h-4" />
            {showForm ? 'Cancel' : 'New Entry'}
          </button>
        )}
      </div>

      {/* Entry Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-6 border border-gold/30 bg-muted/10 rounded-lg shadow-inner"
          >
            <h3 className="text-gold mb-4 font-display italic">Record Your Adventure</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                name="title"
                placeholder="Entry title"
                required
                className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="date"
                  placeholder="Date (e.g. September 22, 1418)"
                  required
                  className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                />
                <input
                  name="location"
                  placeholder="Location"
                  required
                  className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                />
              </div>
              <textarea
                name="content"
                placeholder="What happened on your adventure today?..."
                required
                className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 h-28"
              />
              <p className="text-xs text-gold/50 font-display italic">
                Signing as: {currentUser?.name}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gold text-background font-bold py-2 rounded hover:bg-gold/80 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Sealing...' : 'Seal Entry in the Journal'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {(!entries || entries.length === 0) && (
        <div className="text-center py-12 text-muted-foreground font-body italic">
          No adventures have been recorded yet...
        </div>
      )}

      {/* Entries */}
      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 scrollbar-thin">
        {entries && entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <OrnateCard variant="parchment" className="p-5">
              <div className="pt-4 pb-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-display text-xl text-leather mb-2">{entry.title}</h3>
                  {/* Only show delete to the author */}
                  {currentUser?.name === entry.author && (
                    <button
                      onClick={() => onDeleteEntry(entry.id)}
                      className="text-leather/30 hover:text-red-400 transition-colors ml-2 shrink-0"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-4 text-sm text-leather/60 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {entry.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {entry.location}
                  </span>
                </div>

                <p className="font-body text-leather/90 leading-relaxed italic">
                  "{entry.content}"
                </p>

                <p className="text-right text-sm text-leather/50 mt-3 font-display">
                  — {entry.author}
                </p>
              </div>
            </OrnateCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export type { JournalEntry };