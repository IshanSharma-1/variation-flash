import React from 'react';

const GameLayout = ({ roomCode, variation, players }) => {
  // Demo stats – replace with real game state as needed.
  const totalPool = 100;
  const numPlayers = players.length;
  const currentBalance = players[0].coins;
  const currentCoins = 5;

  // Circular layout: calculate positions for player names.
  const radius = 150;
  const center = { x: 200, y: 200 };

  return (
    <div className="container mx-auto p-4">
      {/* Top Stats Bar */}
      <div className="flex justify-around items-center mb-6 bg-black bg-opacity-50 p-4 rounded">
        <div className="text-xl font-bold text-yellow-300">Total Pool: {totalPool} coins</div>
        <div className="text-xl font-bold text-yellow-300">Players: {numPlayers}</div>
        <div className="text-xl font-bold text-yellow-300">Balance: {currentBalance} coins</div>
        <div className="text-xl font-bold text-yellow-300">Current Coins: {currentCoins}</div>
      </div>

      {/* Circular Player Layout */}
      <div className="relative w-96 h-96 mx-auto border border-yellow-500 rounded-full">
        {players.map((player, index) => {
          const angle = (2 * Math.PI * index) / numPlayers;
          const x = center.x + radius * Math.cos(angle);
          const y = center.y + radius * Math.sin(angle);
          return (
            <div 
              key={index} 
              className="absolute bg-black bg-opacity-50 text-yellow-300 p-2 rounded shadow"
              style={{ top: y, left: x, transform: 'translate(-50%, -50%)' }}
            >
              {player.name}
            </div>
          );
        })}
      </div>

      {/* Options: Play Blind / Play Normal */}
      <div className="flex justify-center space-x-4 mt-8">
        <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 transition rounded-full text-xl font-bold shadow">
          Play Blind (2 coins)
        </button>
        <button className="px-6 py-3 bg-green-600 hover:bg-green-500 transition rounded-full text-xl font-bold shadow">
          Play Normal (1 coin)
        </button>
      </div>

      {/* Start Game Button */}
      <div className="mt-8">
        <button className="px-8 py-4 bg-red-600 hover:bg-red-500 transition rounded-full text-2xl font-bold shadow-lg">
          Start Game
        </button>
      </div>

      {/* Room and Variation Info */}
      <div className="mt-4 text-center text-lg">
        <p>Room Code: {roomCode}</p>
        <p>Variation: {variation}</p>
      </div>

      {/* Card Distribution (sample) */}
      <div className="flex justify-center space-x-4 mt-8">
        <img src="/assets/cards/2_of_hearts.png" alt="card" className="w-24 h-36 border rounded shadow"/>
        <img src="/assets/cards/A_of_spades.png" alt="card" className="w-24 h-36 border rounded shadow"/>
        <img src="/assets/cards/10_of_diamonds.png" alt="card" className="w-24 h-36 border rounded shadow"/>
      </div>
    </div>
  );
};

export default GameLayout;