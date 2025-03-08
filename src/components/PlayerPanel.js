import React from 'react';

function PlayerPanel({ player, isCurrent }) {
  return (
    <div className={`p-4 rounded-lg shadow-lg ${isCurrent ? 'border-4 border-yellow-500' : 'border border-gray-500'}`}>
      <p className="font-bold text-white">{player.name} {player.isHuman ? '(You)' : '(AI)'} (Coins: {player.coins})</p>
      <div className="flex space-x-2 mt-2">
        {player.isHuman ? (
          player.hand.map((card, i) => (
            <img
              key={i}
              src={`/assets/images/${card.rank}_of_${card.suit}.png`}
              alt={`${card.rank} of ${card.suit}`}
              className="w-16 h-24 object-contain"
            />
          ))
        ) : (
          player.hand.map((_, i) => (
            <img
              key={i}
              src={`/assets/images/back.png`}
              alt="Card back"
              className="w-16 h-24 object-contain"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default PlayerPanel;