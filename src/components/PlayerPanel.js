import React from 'react';
import { motion } from 'framer-motion';

function PlayerPanel({ player, isCurrent, dealing, dealtHand, showAllCards, isSmallScreen }) {
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
  
  const renderBetInfo = () => {
    if (player.bet === 0) return null;
    return (
      <div className={`mt-2 px-2 md:px-3 py-1 rounded-md ${player.isSeen ? 'bg-blue-600' : 'bg-purple-600'}`}>
        <span className="text-xs md:text-sm text-white">
          {player.isSeen ? 'Seen' : 'Blind'}: {player.bet}
        </span>
      </div>
    );
  };

  const renderCoinStack = () => {
    if (player.coins <= 0) return <p className="text-xs md:text-sm text-gray-400">No coins</p>;
    return (
      <div className="flex items-center">
        <div className="w-4 h-4 md:w-6 md:h-6 bg-yellow-400 rounded-full mr-1 md:mr-2" />
        <span className="text-sm md:text-lg text-yellow-300">{player.coins}</span>
      </div>
    );
  };

  const cardSize = isSmallScreen ? "w-12 h-18 md:w-16 md:h-24" : "w-16 h-24";

  return (
    <div
      className={`p-2 md:p-4 rounded-lg shadow-lg aquamorphic-bg transition-transform duration-300 ${
        isCurrent ? 'border-4 border-yellow-500 neon-glow transform scale-105' : 
        player.hasFolded ? 'border-4 border-red-500 neon-glow-red opacity-50' : 'border border-gray-500'
      }`}
    >
      <div className="flex justify-between items-center">
        <p className="font-bold text-white text-sm md:text-lg truncate max-w-[120px]">
          {player.name} {player.isHuman ? '(You)' : ''}
        </p>
        <div className="text-right">
          {renderCoinStack()}
        </div>
      </div>
      {renderBetInfo()}
      <div className="flex justify-center space-x-1 md:space-x-2 mt-2 md:mt-4">
        {dealing ? (
          dealtHand.map((card, i) => (
            <motion.img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ duration: 0.9, delay: i * 0.2 }}
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
      <div className="mt-2 md:mt-3 flex justify-center space-x-1 md:space-x-2">
        {player.isSeen && (
          <span className="px-1 md:px-2 py-0.5 md:py-1 bg-blue-600 rounded-md text-xs text-white">Seen</span>
        )}
        {!player.isSeen && player.bet > 0 && (
          <span className="px-1 md:px-2 py-0.5 md:py-1 bg-purple-600 rounded-md text-xs text-white">Blind</span>
        )}
        {player.hasFolded && (
          <span className="px-1 md:px-2 py-0.5 md:py-1 bg-red-600 rounded-md text-xs text-white">Folded</span>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;