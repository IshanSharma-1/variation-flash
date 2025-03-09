// src/components/PlayerPanel.js
import React from 'react';
import { motion } from 'framer-motion'; // For animations

function PlayerPanel({ player, isCurrent, dealing, dealtHand, showAICards }) {
  const cardVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-lg ${
        isCurrent && player.active
          ? 'border-4 border-yellow-500 neon-glow'
          : player.active
          ? 'border border-gray-500'
          : 'border-4 border-red-500 neon-glow-red'
      }`}
    >
      <p className="font-bold text-white">
        {player.name} {player.isHuman ? '(You)' : '(AI)'} (Coins: {player.coins})
      </p>
      <div className="flex space-x-2 mt-2">
        {dealing ? (
          dealtHand.map((card, i) => (
            <motion.img
              key={i}
              src={player.isHuman ? `/assets/cards/${card.rank}_of_${card.suit}.png` : `/assets/cards/back.png`}
              alt={player.isHuman ? `${card.rank} of ${card.suit}` : 'Card back'}
              className="w-16 h-24 object-contain"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.9 }}
            />
          ))
        ) : (
          (player.hand || []).map((card, i) => (
            <img
              key={i}
              src={
                player.isHuman || showAICards
                  ? `/assets/cards/${card.rank}_of_${card.suit}.png`
                  : `/assets/cards/back.png`
              }
              alt={player.isHuman || showAICards ? `${card.rank} of ${card.suit}` : 'Card back'}
              className="w-16 h-24 object-contain"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;