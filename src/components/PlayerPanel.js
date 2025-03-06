import React from 'react';

const PlayerPanel = ({ player, isCurrent }) => {
  return (
    <div className={`p-4 border rounded shadow ${isCurrent ? 'bg-green-100' : 'bg-white'}`}>
      <h3 className="font-bold">{player.name}</h3>
      <p>Balance: {player.coins}</p>
      <p>Status: {player.active ? 'Playing' : 'Packed'}</p>
      {player.isBlind && !player.hasRevealed ? (
        <p>Cards: [Hidden]</p>
      ) : (
        <p>Cards: [Revealed]</p>
      )}
      {player.compulsoryBlind && (
        <p className="text-red-500">Compulsory Blind</p>
      )}
    </div>
  );
};

export default PlayerPanel;
