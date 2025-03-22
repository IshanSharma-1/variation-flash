import React from 'react';
import { motion } from 'framer-motion';

function GameModeSelection({ onSelectMode }) {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <div 
        className="text-center p-10"
      >
        <motion.h1 
          className="font-extrabold mb-8 tracking-wide royal-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-4xl embossed">SELECT GAME MODE</span>
        </motion.h1>
        
        <div className="royal-divider"></div>
        
        <div className="space-y-6 mt-8">
          <motion.button
            onClick={() => onSelectMode('custom')}
            className="btn btn-primary btn-gold-accent w-full py-4 text-xl btn-ripple"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="card-suit suit-spade mr-2">♠</span>
            Custom AI Match
            <span className="card-suit suit-heart ml-2">♥</span>
          </motion.button>
          
          <motion.button
            onClick={() => onSelectMode('local')}
            className="btn btn-secondary btn-gold-accent w-full py-4 text-xl relative btn-ripple"
            variants={buttonVariants}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
          >
            <span className="card-suit suit-club mr-2">♣</span>
            Local Multiplayer
            <span className="card-suit suit-diamond ml-2">♦</span>
            <span className="absolute top-1 right-2 text-xs text-gray-300">(Coming Soon)</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default GameModeSelection;