import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { OrnateCard } from "./OrnateCard";
import { Package, Coins, Gem, Scroll, Sword, Shield, FlaskConical, Trash2, Plus, User } from "lucide-react";

type ItemRarity = "common" | "uncommon" | "rare" | "legendary";

interface LootItem {
  id: string;
  name: string;
  type: "weapon" | "armor" | "potion" | "scroll" | "treasure" | "misc";
  rarity: ItemRarity;
  quantity: number;
  description: string;
  value?: number;
  assignedTo?: string;
}

interface BagOfLootProps {
  items: LootItem[];
  goldPieces: number;
  onAddItem: (newItem: Omit<LootItem, 'id'>) => Promise<void>;
  onRemoveItem: (id: string) => Promise<void>;
  onAssignItem: (id: string, assignedTo: string) => Promise<void>;
  isDM: boolean;
  characters: any[];
}

const rarityColors: Record<ItemRarity, string> = {
  common: "text-muted-foreground border-muted",
  uncommon: "text-forest-light border-forest",
  rare: "text-blue-400 border-blue-400",
  legendary: "text-gold border-gold",
};

const typeIcons = {
  weapon: Sword,
  armor: Shield,
  potion: FlaskConical,
  scroll: Scroll,
  treasure: Gem,
  misc: Package,
};

export function BagOfLoot({ items, goldPieces, onAddItem, onRemoveItem, onAssignItem, isDM, characters }: BagOfLootProps) {
  const [selectedItem, setSelectedItem] = useState<LootItem | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [showAddForm, setShowAddForm] = useState(false);

  const filteredItems = filter === "all"
    ? items
    : items.filter(item => item.type === filter);

  const filterButtons = [
    { key: "all", label: "All", icon: Package },
    { key: "weapon", label: "Weapons", icon: Sword },
    { key: "armor", label: "Armor", icon: Shield },
    { key: "potion", label: "Potions", icon: FlaskConical },
    { key: "treasure", label: "Treasure", icon: Gem },
  ];

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    await onAddItem({
      name: formData.get('name') as string,
      type: formData.get('type') as LootItem['type'],
      rarity: formData.get('rarity') as ItemRarity,
      quantity: Number(formData.get('quantity')),
      description: formData.get('description') as string,
      value: Number(formData.get('value')) || undefined,
    });
    e.currentTarget.reset();
    setShowAddForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-gold" />
          <h2 className="font-display text-2xl gold-text">Bag of Holding</h2>
        </div>
        <div className="flex items-center gap-3">
          {isDM && (
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gold/20 border border-gold/40 text-gold rounded font-display text-sm hover:bg-gold/30 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          )}
          <div className="flex items-center gap-2 bg-gold/20 px-4 py-2 rounded-lg border border-gold/40">
            <Coins className="w-5 h-5 text-gold" />
            <span className="font-display text-xl text-gold">{goldPieces.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">GP</span>
          </div>
        </div>
      </div>

      {/* Add Item Form - DM only */}
      {isDM && showAddForm && (
        <div className="p-6 border border-gold/30 bg-muted/10 rounded-lg shadow-inner mb-4">
          <h3 className="text-gold mb-4 font-display italic">Add Item to Vault</h3>
          <form onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-3">
            <input
              name="name"
              placeholder="Item name"
              required
              className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 col-span-2"
            />
            <select name="type" required className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50">
              <option value="weapon">Weapon</option>
              <option value="armor">Armor</option>
              <option value="potion">Potion</option>
              <option value="scroll">Scroll</option>
              <option value="treasure">Treasure</option>
              <option value="misc">Misc</option>
            </select>
            <select name="rarity" required className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50">
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="legendary">Legendary</option>
            </select>
            <input
              name="quantity"
              type="number"
              min="1"
              defaultValue="1"
              required
              className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
            />
            <input
              name="value"
              type="number"
              placeholder="Value (GP)"
              className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50"
            />
            <textarea
              name="description"
              placeholder="Description"
              required
              className="p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 col-span-2 h-20"
            />
            <button
              type="submit"
              className="col-span-2 bg-gold text-background font-bold py-2 rounded hover:bg-gold/80 transition-colors"
            >
              Add to Vault
            </button>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded transition-all font-display text-sm ${
              filter === key
                ? "bg-gold text-background"
                : "bg-muted/30 text-muted-foreground hover:bg-muted/50"
            }`}
          >
            <Icon className="w-3 h-3" />
            {label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, index) => {
            const Icon = typeIcons[item.type];
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  onClick={() => setSelectedItem(item)}
                  className={`w-full text-left p-3 rounded-lg border transition-all hover:scale-105 ${rarityColors[item.rarity]} bg-muted/20 hover:bg-muted/40`}
                >
                  <div className="flex items-start gap-2">
                    <Icon className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-display text-sm truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.assignedTo
                          ? <span className="text-gold/70">→ {item.assignedTo}</span>
                          : item.quantity > 1 ? `×${item.quantity}` : item.rarity
                        }
                      </p>
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <OrnateCard className={`p-6 max-w-md border-2 ${rarityColors[selectedItem.rarity]}`}>
                <div className="flex items-start gap-4">
                  {(() => {
                    const Icon = typeIcons[selectedItem.type];
                    return <Icon className={`w-8 h-8 ${rarityColors[selectedItem.rarity].split(" ")[0]}`} />;
                  })()}
                  <div>
                    <h3 className="font-display text-xl">{selectedItem.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedItem.rarity} {selectedItem.type}
                    </p>
                  </div>
                </div>

                <p className="mt-4 font-body text-muted-foreground italic">
                  {selectedItem.description}
                </p>

                {selectedItem.value && (
                  <div className="mt-3 flex items-center gap-2 text-gold">
                    <Coins className="w-4 h-4" />
                    <span className="font-display">{selectedItem.value} GP</span>
                  </div>
                )}

                {/* Assign to character - DM only */}
                {isDM && (
                  <div className="mt-4">
                    <label className="text-xs text-gold/60 uppercase tracking-widest font-display flex items-center gap-2 mb-2">
                      <User className="w-3 h-3" />
                      Assign to Character
                    </label>
                    <select
                      className="w-full p-2 bg-background border border-gold/20 text-gold rounded outline-none focus:border-gold/50 font-display text-sm"
                      value={selectedItem.assignedTo || ""}
                      onChange={async (e) => {
                        await onAssignItem(selectedItem.id, e.target.value);
                        setSelectedItem(prev => prev ? { ...prev, assignedTo: e.target.value } : null);
                      }}
                    >
                      <option value="">— Unassigned —</option>
                      {characters.map((char: any) => (
                        <option key={char.id} value={char.name}>
                          {char.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Show who it's assigned to for non-DM */}
                {!isDM && selectedItem.assignedTo && (
                  <div className="mt-3 flex items-center gap-2 text-gold/70 text-sm font-display">
                    <User className="w-3 h-3" />
                    Carried by {selectedItem.assignedTo}
                  </div>
                )}

                <div className="mt-4 flex gap-2">
                  {isDM && (
                    <button
                      onClick={async () => {
                        await onRemoveItem(selectedItem.id);
                        setSelectedItem(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-red-900/30 border border-red-700/40 text-red-400 rounded font-display text-sm hover:bg-red-900/50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="flex-1 py-2 bg-muted/30 rounded font-display text-sm hover:bg-muted/50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </OrnateCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export type { LootItem };