import React from 'react';

const Controls = ({ onPlay, onPack, onReveal, currentPlayer }) => {
  return (
    <div className="space-x-4">
      {currentPlayer && currentPlayer.isBlind && !currentPlayer.hasRevealed && !currentPlayer.compulsoryBlind && (
        <button onClick={onReveal} className="px-4 py-2 bg-purple-500 text-white rounded">
          Reveal Cards
        </button>
      )}
      <button onClick={onPlay} className="px-4 py-2 bg-blue-500 text-white rounded">
        Play (Add 2 Coins)
      </button>
      <button onClick={onPack} className="px-4 py-2 bg-red-500 text-white rounded">
        Pack (Forfeit)
      </button>
    </div>
  );
};

export default Controls;
