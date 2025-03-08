import React from 'react';

function PlayerPanel({ player, isCurrent }) {
    console.log('Player:', player);
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
      {/* Display player name and coins */}
      <p className="font-bold text-white">
        {player.name} {player.isHuman ? '(You)' : '(AI)'} (Coins: {player.coins})
      </p>
      <div className="flex space-x-2 mt-2">
  {player.isHuman ? (
    (player.hand || []).map((card, i) => (
      <img
        key={i}
        src={`/assets/cards/${card.rank}_of_${card.suit}.png`}
        alt={`${card.rank} of ${card.suit}`}
        className="w-16 h-24 object-contain"
      />
    ))
  ) : (
    (player.hand || []).map((_, i) => (
      <img
        key={i}
        src={`/assets/cards/back.png`}
        alt="Card back"
        className="w-16 h-24 object-contain"
      />
    ))
  )}
</div>
    </div>
  );
}

const neonGlowRed = {
    boxShadow: '0 0 5px #ff0000, 0 0 10px #ff0000, 0 0 15px #ff0000, 0 0 20px #ff0000',
  };

export default PlayerPanel;