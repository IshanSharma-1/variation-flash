import React from 'react';
import { motion } from 'framer-motion';

function PlayerPanel({ player, isCurrent, dealing, dealtHand = [], showAllCards, isSmallScreen, isMediumScreen }) {
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

  // Determine card sizes based on screen size and number of cards
  const getCardSize = () => {
    const cardCount = player.hand?.length || 0;
    
    if (isSmallScreen) {
      return "w-10 h-15";
    } else if (isMediumScreen) {
      return cardCount > 3 ? "w-12 h-18" : "w-14 h-21";
    } else {
      return cardCount > 3 ? "w-14 h-21" : "w-16 h-24";
    }
  };

  // Calculate card arrangement style based on card count
  const getCardArrangementStyle = () => {
    const cardCount = player.hand?.length || 0;
    
    if (cardCount <= 3) {
      return "flex justify-center space-x-1 md:space-x-2";
    } else {
      // Fan arrangement for more cards
      return "flex justify-center items-center relative h-24 md:h-28";
    }
  };

  // For cards that need special positioning (like fanned cards)
  const getCardStyle = (index, total) => {
    if (total <= 3) return {};
    
    // For 4+ cards, create a fan effect
    const fanAngle = 25; // max angle of the fan
    const startAngle = -fanAngle / 2;
    const angleDelta = total > 1 ? fanAngle / (total - 1) : 0;
    const angle = startAngle + (index * angleDelta);
    
    return {
      position: 'absolute',
      transform: `rotate(${angle}deg) translateX(${index * 2}px)`,
      transformOrigin: 'bottom center',
      zIndex: index + 1
    };
  };

  const cardSize = getCardSize();
  const cardArrangementClass = getCardArrangementStyle();

  return (
    <div className={`player-container bg-black bg-opacity-30 rounded-lg p-2 transition-all duration-300 ${
      isCurrent ? 'ring-2 ring-yellow-400 shadow-glow-yellow scale-105' : 'opacity-80'
    }`}>
      {/* Player name and coins */}
      <div className="text-center mb-2">
        <p className={`font-bold text-white ${isSmallScreen ? 'text-xs' : 'text-sm md:text-base'} truncate`}>
          {player.name} {player.isHuman ? '(You)' : ''}
        </p>
        <div className="flex justify-center items-center mt-1">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-yellow-400 rounded-full mr-1" />
          <span className={`${isSmallScreen ? 'text-xs' : 'text-sm md:text-base'} text-yellow-300`}>{player.coins}</span>
        </div>
      </div>

      {/* Cards */}
      <div className={cardArrangementClass}>
        {dealing ? (
          (dealtHand.length > 0 ? dealtHand : []).map((card, i) => (
            <motion.img
              key={i}
              src={getCardSrc(card)}
              alt="Playing card"
              className={`${cardSize} object-contain playing-card`}
              style={getCardStyle(i, dealtHand.length)}
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
              className={`${cardSize} object-contain playing-card`}
              style={getCardStyle(i, player.hand.length)}
            />
          ))
        )}
      </div>

      {/* Status badges - condensed for small screens */}
      <div className="mt-2 flex justify-center space-x-1">
        {player.isSeen && (
          <span className={`px-2 py-0.5 bg-blue-600 rounded-full ${isSmallScreen ? 'text-xs' : 'text-xs md:text-sm'} text-white`}>Seen</span>
        )}
        {!player.isSeen && player.bet > 0 && (
          <span className={`px-2 py-0.5 bg-purple-600 rounded-full ${isSmallScreen ? 'text-xs' : 'text-xs md:text-sm'} text-white`}>Blind</span>
        )}
        {player.hasFolded && (
          <span className={`px-2 py-0.5 bg-red-600 rounded-full ${isSmallScreen ? 'text-xs' : 'text-xs md:text-sm'} text-white`}>Folded</span>
        )}
      </div>
      
      {/* Current turn indicator */}
      {isCurrent && (
        <div className="mt-1">
          <div className="animate-pulse w-full h-1 bg-yellow-400 rounded-full"></div>
        </div>
      )}
    </div>
  );
}

export default PlayerPanel;