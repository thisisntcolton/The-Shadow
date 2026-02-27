import { motion } from "framer-motion";
import { ReactNode } from "react";

interface OrnateCardProps {
  children: ReactNode;
  className?: string;
  variant?: "leather" | "parchment" | "forest";
  animated?: boolean;
}

export function OrnateCard({ 
  children, 
  className = "", 
  variant = "leather",
  animated = true 
}: OrnateCardProps) {
  const baseClasses = "relative rounded-lg overflow-hidden";
  
  const variantClasses = {
    leather: "tavern-card",
    parchment: "scroll-card",
    forest: "bg-forest border border-gold/30",
  };

  const content = (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Corner ornaments */}
      <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-gold/50" />
      <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-gold/50" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-gold/50" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-gold/50" />
      
      {children}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
