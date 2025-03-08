import React from 'react';

function GameSelection({ variations, onSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h2 className="text-4xl font-bold mb-10 text-green-400">Choose Your Game</h2>
      <div className="grid grid-cols-3 gap-6 max-w-4xl">
        {variations.map((variation, index) => (
          <button
            key={index}
            onClick={() => onSelect(variation)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-200 shadow-md text-lg"
          >
            {variation.name} ({variation.cards} Cards)
          </button>
        ))}
      </div>
    </div>
  );
}

export default GameSelection;