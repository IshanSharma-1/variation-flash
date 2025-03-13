import React from 'react';
import { motion } from 'framer-motion'; // For animations

function PlayerPanel({ player, isCurrent, dealing, dealtHand, showAICards }) {
  const cardVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  // Calculate coin stacks: 10 coins per stack (row)
  const coinsPerStack = 10;
  const totalCoins = player.coins || 0;
  const numberOfStacks = Math.ceil(totalCoins / coinsPerStack);
  const coinStacks = [];

  for (let stack = 0; stack < numberOfStacks; stack++) {
    const coinsInThisStack = Math.min(coinsPerStack, totalCoins - stack * coinsPerStack);
    const coinElements = [];

    for (let i = 0; i < coinsInThisStack; i++) {
      coinElements.push(
        <img
          key={`${stack}-${i}`}
          src="/assets/coin/coin.png"
          alt="Coin"
          className="w-8 h-8 object-contain"
          style={{
            position: 'absolute',
            bottom: `${i * 7}px`,
            zIndex: coinsInThisStack - i,
            transform: `translateZ(${i * 7}px) rotateX(10deg)`,
            filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))',
          }}
        />
      );
    }

    coinStacks.push(
      <div
        key={stack}
        className="relative w-8 h-24"
        style={{
          perspective: '500px',
          marginRight: '10px',
        }}
      >
        {coinElements}
      </div>
    );
  }

  // NEW UPDATE: if player.isBlind === true, always show back.png
  // Otherwise, if (player.isHuman || showAICards) show real card, else show back.png
  const getCardSrc = (card) => {
    if (player.isBlind) {
      return '/assets/cards/back.png';
    }
    if (player.isHuman || showAICards) {
      return `/assets/cards/${card.rank}_of_${card.suit}.png`;
    }
    return '/assets/cards/back.png';
  };

  return (
    <div
      className={`p-4 rounded-lg shadow-lg aquamorphic-bg transition-transform duration-300 hover:scale-105 ${
        isCurrent && player.active
          ? 'border-4 border-yellow-500 neon-glow'
          : player.active
          ? 'border border-gray-500'
          : 'border-4 border-red-500 neon-glow-red'
      }`}
    >
      {/* Player Name and Coin Count */}
      <p className="font-bold text-white">
        {player.name} {player.isHuman ? '(You)' : '(AI)'} (Coins: {player.coins})
      </p>

      {/* Player Cards */}
      <div className="flex space-x-2 mt-2">
        {dealing ? (
          dealtHand.map((card, i) => (
            <motion.img
              key={i}
              src={getCardSrc(card)}
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
              src={getCardSrc(card)}
              alt={
                player.isBlind
                  ? 'Card back'
                  : player.isHuman || showAICards
                  ? `${card.rank} of ${card.suit}`
                  : 'Card back'
              }
              className="w-16 h-24 object-contain"
            />
          ))
        )}
      </div>

      {/* 3D Coin Stacks */}
      <div className="mt-4">
        <p className="text-sm text-gray-300">Coin Stack:</p>
        {totalCoins > 0 ? (
          <div className="flex flex-wrap items-start">{coinStacks}</div>
        ) : (
          <p className="text-sm text-gray-500">No coins remaining</p>
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;