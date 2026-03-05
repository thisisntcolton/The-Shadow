import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, BookOpen, Loader2 } from "lucide-react";

interface StoryRecapProps {
  journalEntries: any[];
  recaps: any[];
  characters: any[];
  lootItems: any[];
}

export function StoryRecap({ journalEntries, recaps, characters, lootItems }: StoryRecapProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [story, setStory] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateStory = async () => {
    setIsGenerating(true);
    setIsOpen(true);
    setStory("");

    const characterSummary = characters.map(c =>
      `${c.name} (Level ${c.level} ${c.race} ${c.class}, assigned to ${c.assigned_to || c.assignedTo})`
    ).join(", ");

    const journalSummary = journalEntries.map(e =>
      `[${e.author} - ${e.date} at ${e.location}]: ${e.content}`
    ).join("\n\n");

    const recapSummary = recaps.map(r =>
      `[Session ${r.session} - ${r.title}]: ${r.summary}`
    ).join("\n\n");

    const lootSummary = lootItems.map(l =>
      `${l.name} (${l.rarity} ${l.type})`
    ).join(", ");

    const prompt = `You are a master storyteller writing in the style of J.R.R. Tolkien. 
Based on the following campaign notes, write a beautiful storybook-style chronicle of the Fellowship's journey. 
Write it as if it were a chapter from a great fantasy novel — rich with atmosphere, character, and wonder.
Keep it to 4-6 paragraphs.

CHARACTERS: ${characterSummary}

PLAYER JOURNAL ENTRIES:
${journalSummary}

DM RECAPS:
${recapSummary}

NOTABLE ITEMS FOUND: ${lootSummary}

Write the chronicle now:`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "The chronicle could not be written at this time.";
      setStory(text);
    } catch (error) {
      setStory("The chronicle could not be written at this time. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Generate Button */}
      <button
        onClick={generateStory}
        className="flex items-center gap-2 px-4 py-2 border border-gold/30 text-gold rounded hover:bg-gold/10 transition-colors font-display text-sm"
      >
        <Sparkles className="w-4 h-4" />
        Generate Chronicle
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-gold/30 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-gold" />
                  <h2 className="font-display text-xl text-gold">The Chronicle of the Fellowship</h2>
                </div>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-5 h-5 text-muted-foreground hover:text-gold transition-colors" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto flex-1">
                {isGenerating ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-4">
                    <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    <p className="text-gold/60 font-display italic animate-pulse">
                      The scribe is writing your chronicle...
                    </p>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="prose prose-invert max-w-none"
                  >
                    {story.split("\n\n").map((paragraph, i) => (
                      <p key={i} className="text-foreground font-body leading-relaxed mb-4 italic">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-gold/20 flex justify-between items-center">
                <button
                  onClick={generateStory}
                  disabled={isGenerating}
                  className="flex items-center gap-2 text-sm text-gold/60 hover:text-gold transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-3 h-3" />
                  Regenerate
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 bg-gold text-background font-bold rounded text-sm hover:bg-gold/80 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}