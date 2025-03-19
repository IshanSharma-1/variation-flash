import React from 'react';
import { motion } from 'framer-motion';

function PlayerPanel({ player, isCurrent, dealing, dealtHand = [], showAllCards, isSmallScreen }) {
  // Defensive check to prevent undefined player errors
  if (!player) return null;

  const cardVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  // Function to determine card src based on visibility rules
  const getCardSrc = (card) => {
    if (showAllCards) {
      return `/assets/cards/${card.rank}_of_${card.suit}.png`;
    }
    
    if (player.isHuman && player.hasSeenCards) {
      return `/assets/cards/${card.rank}_of_${card.suit}.png`;
    }
    
    return '/assets/cards/back.png';
  };

  const cardSize = isSmallScreen ? "w-12 h-18 md:w-16 md:h-24" : "w-16 h-24";

  return (
    <div className={`transition-transform duration-300 ${
      isCurrent ? 'scale-110' : ''
    }`}>
      {/* Player name and coins */}
      <div className="text-center mb-2">
        <p className="font-bold text-white text-sm md:text-lg truncate">
          {player.name} {player.isHuman ? '(You)' : ''}
        </p>
        <div className="flex justify-center items-center mt-1">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full mr-1" />
          <span className="text-sm md:text-lg text-yellow-300">{player.coins}</span>
        </div>
      </div>

      {/* Cards */}
      <div className="flex justify-center space-x-1 md:space-x-2">
        {dealing ? (
          (dealtHand.length > 0 ? dealtHand : []).map((card, i) => (
            <motion.img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ 
                duration: 1.2,
                delay: i * 0.4,
                ease: "easeOut" 
              }}
            />
          ))
        ) : (
          (player.hand || []).map((card, i) => (
            <img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain`}
            />
          ))
        )}
      </div>

      {/* Status badges */}
      <div className="mt-2 flex justify-center space-x-1">
        {player.isSeen && (
          <span className="px-2 py-1 bg-blue-600 rounded-full text-xs text-white">Seen</span>
        )}
        {!player.isSeen && player.bet > 0 && (
          <span className="px-2 py-1 bg-purple-600 rounded-full text-xs text-white">Blind</span>
        )}
        {player.hasFolded && (
          <span className="px-2 py-1 bg-red-600 rounded-full text-xs text-white">Folded</span>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;