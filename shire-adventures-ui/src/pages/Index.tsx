import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerAvatar } from "@/components/PlayerAvatar";
import { CharacterSheet } from "@/components/CharacterSheet";
import { PlayerJournal } from "@/components/PlayerJournal";
import { DMRecap } from "@/components/DMRecap";
import { BagOfLoot, LootItem } from "@/components/BagOfLoot";
import { BookOpen, Scroll, Package, Sparkles } from "lucide-react";
import { SessionCountdown } from "@/components/SessionCountdown";

import wizardImage from "@/assets/characters/gandalf-wizard.jpg";
import hobbitImage from "@/assets/characters/hobbit-adventurer.jpg";
import elfImage from "@/assets/characters/elf-warrior.jpg";
import dwarfImage from "@/assets/characters/dwarf-warrior.jpg";

const imageMap: Record<string, string> = {
  "gandalf-wizard.jpg": wizardImage,
  "hobbit-adventurer.jpg": hobbitImage,
  "elf-warrior.jpg": elfImage,
  "dwarf-warrior.jpg": dwarfImage,
};

const Index = () => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [characters, setCharacters] = useState<any[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<any | null>(null);
  const [lootItems, setLootItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [journalEntries, setJournalEntries] = useState<any[]>([]);
  const [sessionRecaps, setSessionRecaps] = useState<any[]>([]);
  const [nextSession, setNextSession] = useState<string>("");

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true);
        const [lootRes, journalRes, recapRes, userRes, characterRes, sessionRes] = await Promise.all([
          fetch("http://localhost:3000/api/loot"),
          fetch("http://localhost:3000/api/journal"),
          fetch("http://localhost:3000/api/recap"),
          fetch("http://localhost:3000/api/users"),
          fetch("http://localhost:3000/api/characters"),
          fetch("http://localhost:3000/api/session"),
        ]);

        if (lootRes.ok) setLootItems(await lootRes.json());
        if (journalRes.ok) setJournalEntries(await journalRes.json());
        if (recapRes.ok) setSessionRecaps(await recapRes.json());
        if (userRes.ok) setAllUsers(await userRes.json());
        if (characterRes.ok) setCharacters(await characterRes.json());
        if (sessionRes.ok) {
          const sessionData = await sessionRes.json();
          setNextSession(sessionData.nextSession);
        }
      } catch (error) {
        console.error("Failed to sync with the backend:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaignData();
  }, []);

  const handlePostRecap = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const payload = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      session: sessionRecaps.length + 1
    };

    const res = await fetch("http://localhost:3000/api/recap", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
      const updated = await fetch("http://localhost:3000/api/recap").then(r => r.json());
      setSessionRecaps(updated);
      e.currentTarget.reset();
    }
  };

  const handleAddLoot = async (newItem: Omit<LootItem, 'id'>) => {
    const res = await fetch("http://localhost:3000/api/loot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newItem)
    });

    if (res.ok) {
      const updated = await fetch("http://localhost:3000/api/loot").then(r => r.json());
      setLootItems(updated);
    }
  };

  const handleRemoveLoot = async (id: string) => {
    const res = await fetch("http://localhost:3000/api/loot", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });

    if (res.ok) {
      setLootItems(prev => prev.filter((item: any) => item.id !== id));
    }
  };

  const handleAssignLoot = async (id: string, assignedTo: string) => {
    const res = await fetch("http://localhost:3000/api/loot", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, assignedTo })
    });

    if (res.ok) {
      setLootItems(prev =>
        prev.map((item: any) => item.id === id ? { ...item, assignedTo } : item)
      );
    }
  };

  const handleAddJournalEntry = async (newEntry: Omit<{ id: string; title: string; date: string; location: string; content: string; author: string; }, 'id'>) => {
  const res = await fetch("http://localhost:3000/api/journal", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newEntry)
  });

  if (res.ok) {
    const updated = await fetch("http://localhost:3000/api/journal").then(r => r.json());
    setJournalEntries(updated);
  }
};

const handleDeleteJournalEntry = async (id: string) => {
  const res = await fetch("http://localhost:3000/api/journal", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });

  if (res.ok) {
    setJournalEntries(prev => prev.filter((entry: any) => entry.id !== id));
  }
};

  const handleUpdateSession = async (newDateTime: string) => {
  const res = await fetch("http://localhost:3000/api/session", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nextSession: newDateTime })
  });

  if (res.ok) setNextSession(newDateTime);
};

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1614] flex items-center justify-center text-[#d4af37]">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-gold animate-flicker mx-auto mb-4" />
          <p className="animate-pulse tracking-widest uppercase font-display">Opening the Vault...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <Sparkles className="w-6 h-6 text-gold animate-flicker" />
          <h1 className="font-display text-4xl md:text-5xl gold-text">
            Tales of Middle-earth
          </h1>
          <Sparkles className="w-6 h-6 text-gold animate-flicker" />
        </div>
        <p className="text-muted-foreground font-body italic">
          A Chronicle of the Fellowship's Journey
        </p>
      </motion.header>

      {nextSession && (
        <SessionCountdown
        nextSession={nextSession}
        isDM={currentUser?.role === 'DM'}
        onUpdateSession={handleUpdateSession}
      />
    )}

      {/* User Selection */}
      <div className="flex flex-col items-center justify-center mb-12 p-6 border-b border-gold/10 bg-muted/5">
        <label className="text-gold/60 text-xs uppercase tracking-widest mb-2 font-display">
          Identify Yourself
        </label>
        <select
          className="bg-background border-2 border-gold/20 text-gold p-3 rounded-md font-display min-w-[250px] focus:border-gold/50 outline-none transition-all cursor-pointer shadow-lg hover:bg-muted/20"
          onChange={(e) => {
            const user = allUsers.find(u => u.name === e.target.value);
            setCurrentUser(user);
          }}
        >
          <option value="">— Who enters the Shire? —</option>
          {allUsers.map(user => (
            <option key={user.id} value={user.name} className="bg-background text-foreground">
              {user.name} ({user.role})
            </option>
          ))}
        </select>

        {currentUser && (
          <p className="mt-4 text-gold animate-in fade-in slide-in-from-top-2 font-serif italic">
            Welcome back, <span className="font-bold not-italic">{currentUser.name}</span>.
          </p>
        )}
      </div>

      {/* Party Members */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {characters.map((character, index) => (
            <PlayerAvatar
              key={character.name}
              character={{ ...character, image: imageMap[character.image] || character.image }}
              onClick={() => setSelectedCharacter(character)}
              delay={0.3 + index * 0.1}
            />
          ))}
        </div>
      </motion.section>

      {/* Character Sheet Modal */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterSheet
            character={{ ...selectedCharacter, image: imageMap[selectedCharacter.image] || selectedCharacter.image }}
            isOpen={!!selectedCharacter}
            onClose={() => setSelectedCharacter(null)}
            assignedLoot={lootItems.filter((item: any) => item.assignedTo === selectedCharacter.name)}
          />
        )}
      </AnimatePresence>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Tabs defaultValue="journal" className="max-w-5xl mx-auto">
          <TabsList className="w-full bg-muted/30 border border-gold/20 p-1 mb-6">
            <TabsTrigger
              value="journal"
              className="flex-1 gap-2 font-display data-[state=active]:bg-gold data-[state=active]:text-background"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Player Journal</span>
              <span className="sm:hidden">Journal</span>
            </TabsTrigger>
            <TabsTrigger
              value="recap"
              className="flex-1 gap-2 font-display data-[state=active]:bg-gold data-[state=active]:text-background"
            >
              <Scroll className="w-4 h-4" />
              <span className="hidden sm:inline">DM Recap</span>
              <span className="sm:hidden">Recap</span>
            </TabsTrigger>
            <TabsTrigger
              value="loot"
              className="flex-1 gap-2 font-display data-[state=active]:bg-gold data-[state=active]:text-background"
            >
              <Package className="w-4 h-4" />
              <span className="hidden sm:inline">Bag of Loot</span>
              <span className="sm:hidden">Loot</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="journal">
                <PlayerJournal
                entries={journalEntries}
                currentUser={currentUser}
                onAddEntry={handleAddJournalEntry}
                onDeleteEntry={handleDeleteJournalEntry}
              />
          </TabsContent>

          <TabsContent value="recap">
            {currentUser?.role === 'DM' && (
              <div className="mb-8 p-6 border border-gold/30 bg-muted/10 rounded-lg shadow-inner">
                <h3 className="text-gold mb-4 font-display italic">Record a New Chronicle</h3>
                <form onSubmit={handlePostRecap} className="flex flex-col gap-4">
                  <input
                    name="title"
                    placeholder="Session Title"
                    required
                    className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
                  />
                  <textarea
                    name="summary"
                    placeholder="What happened in the Shire today?..."
                    required
                    className="p-2 bg-background border border-gold/20 text-gold rounded h-24 outline-none focus:border-gold/50"
                  />
                  <button
                    type="submit"
                    className="bg-gold text-background font-bold py-2 rounded hover:bg-gold/80 transition-colors"
                  >
                    Seal Entry in Archives
                  </button>
                </form>
              </div>
            )}
            <DMRecap recaps={sessionRecaps} />
          </TabsContent>

          <TabsContent value="loot">
            <BagOfLoot
              items={lootItems}
              goldPieces={2847}
              onAddItem={handleAddLoot}
              onRemoveItem={handleRemoveLoot}
              onAssignItem={handleAssignLoot}
              isDM={currentUser?.role === 'DM'}
              characters={characters}
            />
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center mt-12"
      >
        <div className="flex items-center gap-4 text-muted-foreground/50">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-gold/30" />
          <span className="font-display text-xs tracking-widest">THE ONE RING</span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-gold/30" />
        </div>
      </motion.div>
    </div>
  );
};

export default Index;