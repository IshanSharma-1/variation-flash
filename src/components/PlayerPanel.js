import React from 'react';
import { motion } from 'framer-motion'; // For animations

function PlayerPanel({ player, isCurrent, dealing, dealtHand, showAICards }) {
  const cardVariants = {
    initial: { y: -100, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  // Calculate coin stacks: 10 coins per stack (row)
  const coinsPerStack = 10;
  const totalCoins = player.coins || 0; // Ensure coins is a number
  const numberOfStacks = Math.ceil(totalCoins / coinsPerStack); // Number of stacks needed
  const coinStacks = [];

  // Create stacks of coins
  for (let stack = 0; stack < numberOfStacks; stack++) {
    const coinsInThisStack = Math.min(coinsPerStack, totalCoins - stack * coinsPerStack);
    const coinElements = [];

    // Add coins to the current stack with vertical offset for 3D effect
    for (let i = 0; i < coinsInThisStack; i++) {
      coinElements.push(
        <img
          key={`${stack}-${i}`}
          src="/assets/coin/coin.png" // Adjust path if the file name differs (e.g., coin.jpg)
          alt="Coin"
          className="w-8 h-8 object-contain"
          style={{
            position: 'absolute',
            top: `${i * 2}px`, // Vertical offset to stack coins (2px per coin for 3D effect)
            zIndex: coinsInThisStack - i, // Lower coins have higher z-index to appear on top
            transform: `translateZ(${i * 2}px) rotateX(10deg)`, // Slight 3D rotation
            filter: 'drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.5))', // Enhanced shadow for depth
          }}
        />
      );
    }

    // Add the stack to the display (positioned horizontally)
    coinStacks.push(
      <div
        key={stack}
        className="relative w-8 h-24" // Adjust height based on stack size
        style={{
          perspective: '500px', // Adds 3D perspective to the stack
          marginRight: '10px', // Space between stacks
        }}
      >
        {coinElements}
      </div>
    );
  }

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