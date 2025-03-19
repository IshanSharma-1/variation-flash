import React from 'react';
import { motion } from 'framer-motion';

function CardDealer({ dealing }) {
  if (!dealing) return null;
  
  // Simple card deck in center that pulses while dealing
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 dealing-deck"
      animate={{ 
        scale: [1, 0.92, 1],
        y: [0, -5, 0]
      }}
      transition={{ 
        duration: 1.2, 
        repeat: Infinity,
        repeatType: "reverse"
      }}
    >
      <motion.img 
        src="/assets/cards/back.png"
        alt="Card deck" 
        className="w-10 h-14 md:w-12 md:h-16 object-contain"
        style={{
          boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
          transform: "translateZ(10px)",
          transformStyle: "preserve-3d"
        }}
      />
    </motion.div>
  );
}

export default CardDealer;