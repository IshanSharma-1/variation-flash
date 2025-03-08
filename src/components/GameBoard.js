import React from 'react';
import PlayerPanel from './PlayerPanel';

function GameBoard({ players, variation, currentPlayer, onEndTurn, onPlayAgain }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white">
      {/* Game Info */}
      <div className="mb-6 text-2xl font-semibold text-yellow-300">
        Playing: {variation.name}
      </div>

      {/* Circular Player Layout */}
      <div className="relative w-[700px] h-[700px]">
        {players.map((player, index) => (
          <div
            key={player.name}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(-50%, -50%) rotate(${(360 / players.length) * index}deg) translate(250px) rotate(-${(360 / players.length) * index}deg)`,
            }}
          >
            <PlayerPanel player={player} isCurrent={index === currentPlayer} />
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={onEndTurn}
          className="bg-blue-600 text-white px-8 py-3 rounded-full hover:bg-blue-700 transition duration-200 shadow-md"
        >
          End Turn
        </button>
        <button
          onClick={onPlayAgain}
          className="bg-red-600 text-white px-8 py-3 rounded-full hover:bg-red-700 transition duration-200 shadow-md"
        >
          Play Again
        </button>
      </div>
    </div>
  );
}

export default GameBoard;