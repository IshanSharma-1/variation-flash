import React from 'react';
import { motion } from 'framer-motion';

function PlayerPanel({ player, isCurrent, dealing, dealtHand, showAllCards, isSmallScreen }) {
  if (!player) return null;

  const cardVariants = {
    initial: { y: -100, opacity: 0, rotateX: 10 },
    animate: { y: 0, opacity: 1, rotateX: 0 },
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

  // Reduced card size for better appearance in 3D view
  const cardSize = isSmallScreen ? "w-6 h-9" : "w-8 h-12";

  return (
    <div className={`transition-transform duration-300 ${isCurrent ? 'scale-110' : ''}`}>
      <div className="text-center mb-2">
        <p className="font-bold text-white text-sm md:text-lg truncate" 
           style={{textShadow: "0 2px 4px rgba(0,0,0,0.8)"}}>
          {player.name} {player.isHuman ? '(You)' : ''}
        </p>
        <div className="flex justify-center items-center mt-1">
          <div className="w-4 h-4 md:w-5 md:h-5 bg-yellow-400 rounded-full mr-1 shadow-lg" 
               style={{boxShadow: "0 2px 5px rgba(0,0,0,0.5)"}} />
          <span className="text-sm md:text-lg text-yellow-300"
                style={{textShadow: "0 2px 4px rgba(0,0,0,0.8)"}}>
            {player.coins}
          </span>
        </div>
      </div>

      <div className="flex justify-center space-x-0.5">
        {dealing ? (
          dealtHand.map((card, i) => (
            <motion.img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain playing-card`}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              transition={{ 
                duration: 0.5,
                delay: i * 0.4,
                ease: "easeOut" 
              }}
              style={{
                boxShadow: "0 5px 10px rgba(0,0,0,0.4)", 
                transformStyle: "preserve-3d",
                transformOrigin: "bottom center"
              }}
            />
          ))
        ) : (
          (player.hand || []).map((card, i) => (
            <img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain playing-card`}
              style={{
                boxShadow: "0 5px 10px rgba(0,0,0,0.4)",
                transform: `rotate(${(i-1)*2}deg) translateZ(${i*1.5}px)`,
                transformOrigin: "bottom center"
              }}
            />
          ))
        )}
      </div>

      <div className="mt-2 flex justify-center space-x-1">
        {player.isSeen && (
          <span className="px-2 py-0.5 bg-blue-600 rounded-full text-xs text-white shadow-lg"
                style={{boxShadow: "0 3px 6px rgba(0,0,0,0.4)"}}>
            Seen
          </span>
        )}
        {!player.isSeen && player.bet > 0 && (
          <span className="px-2 py-0.5 bg-purple-600 rounded-full text-xs text-white shadow-lg"
                style={{boxShadow: "0 3px 6px rgba(0,0,0,0.4)"}}>
            Blind
          </span>
        )}
        {player.hasFolded && (
          <span className="px-2 py-0.5 bg-red-600 rounded-full text-xs text-white shadow-lg"
                style={{boxShadow: "0 3px 6px rgba(0,0,0,0.4)"}}>
            Folded
          </span>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;