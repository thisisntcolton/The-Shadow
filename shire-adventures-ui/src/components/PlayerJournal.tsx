import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrnateCard } from "./OrnateCard";
import { BookOpen, Calendar, MapPin, PenLine, Trash2, Check, X } from "lucide-react";

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
  onEditEntry: (entry: JournalEntry) => Promise<void>;
}

export function PlayerJournal({ entries, currentUser, onAddEntry, onDeleteEntry, onEditEntry }: PlayerJournalProps) {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);

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

  const handleSaveEdit = async () => {
    if (!editingEntry) return;
    await onEditEntry(editingEntry);
    setEditingEntry(null);
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
                {editingEntry?.id === entry.id ? (
                  // Edit Mode
                  <div className="flex flex-col gap-3">
                    <input
                      value={editingEntry.title}
                      onChange={e => setEditingEntry({ ...editingEntry, title: e.target.value })}
                      className="p-2 bg-leather/10 border border-leather/30 text-leather rounded outline-none focus:border-leather/60 font-display w-full"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        value={editingEntry.date}
                        onChange={e => setEditingEntry({ ...editingEntry, date: e.target.value })}
                        className="p-2 bg-leather/10 border border-leather/30 text-leather/80 rounded outline-none focus:border-leather/60 text-sm"
                      />
                      <input
                        value={editingEntry.location}
                        onChange={e => setEditingEntry({ ...editingEntry, location: e.target.value })}
                        className="p-2 bg-leather/10 border border-leather/30 text-leather/80 rounded outline-none focus:border-leather/60 text-sm"
                      />
                    </div>
                    <textarea
                      value={editingEntry.content}
                      onChange={e => setEditingEntry({ ...editingEntry, content: e.target.value })}
                      className="p-2 bg-leather/10 border border-leather/30 text-leather/90 rounded outline-none focus:border-leather/60 h-28 font-body italic resize-none w-full"
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => setEditingEntry(null)}
                        className="flex items-center gap-1 px-3 py-1.5 border border-leather/30 text-leather/60 rounded text-sm hover:bg-leather/10 transition-colors"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="flex items-center gap-1 px-3 py-1.5 bg-leather text-background rounded text-sm font-bold hover:bg-leather/80 transition-colors"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                    </div>
                  </div>
                ) : (
                  // View Mode
                  <>
                    <div className="flex items-start justify-between">
                      <h3 className="font-display text-xl text-leather mb-2">{entry.title}</h3>
                      {currentUser?.name === entry.author && (
                        <div className="flex gap-2 ml-2 shrink-0">
                          <button
                            onClick={() => setEditingEntry(entry)}
                            className="text-leather/30 hover:text-gold transition-colors"
                            title="Edit entry"
                          >
                            <PenLine className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            className="text-leather/30 hover:text-red-400 transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
                  </>
                )}
              </div>
            </OrnateCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export type { JournalEntry };