import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { OrnateCard } from "./OrnateCard";
import { Shield, Sword, Heart, Sparkles, BookOpen, Package } from "lucide-react";

interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

interface CharacterData {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  image: string;
  hitPoints: { current: number; max: number };
  armorClass: number;
  stats: CharacterStats;
  equipment: string[];
  traits: string[];
  assignedTo?: string;
}

interface LootItem {
  id: string;
  name: string;
  type: string;
  rarity: string;
  quantity: number;
  description: string;
  value?: number;
  assignedTo?: string;
}

interface CharacterSheetProps {
  character: CharacterData;
  isOpen: boolean;
  onClose: () => void;
  assignedLoot?: LootItem[];
}

export function CharacterSheet({ character, isOpen, onClose, assignedLoot = [] }: CharacterSheetProps) {
  const statLabels: (keyof CharacterStats)[] = [
    "strength", "dexterity", "constitution",
    "intelligence", "wisdom", "charisma"
  ];

  const getModifier = (stat: number) => {
    const mod = Math.floor((stat - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  const rarityColors: Record<string, string> = {
    common: "text-muted-foreground",
    uncommon: "text-green-400",
    rare: "text-blue-400",
    legendary: "text-gold",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-gold/40 bg-gradient-to-b from-leather to-background p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-6">
            <DialogTitle className="font-display text-3xl gold-text text-center">
              {character.name}
            </DialogTitle>
            <p className="text-center text-muted-foreground font-body italic">
              Level {character.level} {character.race} {character.class}
            </p>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-6">
            {/* Character Portrait */}
            <div className="col-span-1">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <div className="aspect-square rounded-lg overflow-hidden gold-border">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-3">
                  <div className="flex items-center gap-1 bg-destructive/90 px-2 py-1 rounded text-sm">
                    <Heart className="w-3 h-3" />
                    <span>{character.hitPoints.current}/{character.hitPoints.max}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-forest px-2 py-1 rounded text-sm">
                    <Shield className="w-3 h-3" />
                    <span>{character.armorClass}</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Stats */}
            <div className="col-span-2">
              <OrnateCard variant="parchment" animated={false} className="p-4">
                <h3 className="font-display text-lg mb-3 flex items-center gap-2 text-leather">
                  <Sword className="w-4 h-4" />
                  Ability Scores
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {statLabels.map((stat, index) => (
                    <motion.div
                      key={stat}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="text-center p-2 bg-leather/10 rounded border border-leather/20"
                    >
                      <p className="text-xs uppercase tracking-wider text-leather/70">
                        {stat.slice(0, 3)}
                      </p>
                      <p className="text-2xl font-display text-leather">
                        {character.stats[stat]}
                      </p>
                      <p className="text-sm text-forest font-semibold">
                        {getModifier(character.stats[stat])}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </OrnateCard>
            </div>

            {/* Equipment */}
            <div className="col-span-1">
              <OrnateCard className="p-4 h-full">
                <h3 className="font-display text-sm mb-2 flex items-center gap-2 text-gold">
                  <Sparkles className="w-3 h-3" />
                  Equipment
                </h3>
                <ul className="text-sm space-y-1">
                  {character.equipment.map((item, i) => (
                    <li key={i} className="text-muted-foreground">• {item}</li>
                  ))}
                </ul>
              </OrnateCard>
            </div>

            {/* Traits */}
            <div className="col-span-2">
              <OrnateCard className="p-4 h-full">
                <h3 className="font-display text-sm mb-2 flex items-center gap-2 text-gold">
                  <BookOpen className="w-3 h-3" />
                  Traits & Features
                </h3>
                <div className="flex flex-wrap gap-2">
                  {character.traits.map((trait, i) => (
                    <span
                      key={i}
                      className="text-xs bg-forest/50 text-foreground px-2 py-1 rounded"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </OrnateCard>
            </div>

            {/* Assigned Loot */}
            {assignedLoot.length > 0 && (
              <div className="col-span-3">
                <OrnateCard className="p-4">
                  <h3 className="font-display text-sm mb-3 flex items-center gap-2 text-gold">
                    <Package className="w-3 h-3" />
                    Carried Items
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {assignedLoot.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-2 p-2 bg-muted/20 rounded border border-gold/10"
                      >
                        <div className="min-w-0">
                          <p className={`font-display text-sm ${rarityColors[item.rarity] || 'text-foreground'}`}>
                            {item.name}
                            {item.quantity > 1 && <span className="text-muted-foreground ml-1">×{item.quantity}</span>}
                          </p>
                          <p className="text-xs text-muted-foreground italic truncate">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </OrnateCard>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export type { CharacterData };