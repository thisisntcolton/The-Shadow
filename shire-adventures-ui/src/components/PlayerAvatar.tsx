import { motion } from "framer-motion";
import { CharacterData } from "./CharacterSheet";

interface PlayerAvatarProps {
  character: CharacterData;
  onClick: () => void;
  delay?: number;
}

export function PlayerAvatar({ character, onClick, delay = 0 }: PlayerAvatarProps) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative flex flex-col items-center gap-2"
    >
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full bg-gold/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Avatar ring */}
      <div className="relative w-20 h-20 rounded-full p-1 bg-gradient-to-b from-gold to-gold-dark animate-glow">
        <div className="w-full h-full rounded-full overflow-hidden border-2 border-background">
          <img 
            src={character.image}
            alt={character.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Level badge */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-forest text-foreground text-xs font-display px-2 py-0.5 rounded-full border border-gold/50">
          Lv.{character.level}
        </div>
      </div>
      
      {/* Name */}
      <span className="font-display text-sm text-foreground group-hover:text-gold transition-colors">
        {character.name}
      </span>
      <span className="text-xs text-muted-foreground">
        {character.race} {character.class}
      </span>
    </motion.button>
  );
}
