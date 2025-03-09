// src/components/GameBoard.js
import React from 'react';
import PlayerPanel from './PlayerPanel';
import Controls from './Controls';
import { motion } from 'framer-motion'; // For animations

function GameBoard({
  players,
  currentPlayer,
  onContinue,
  onOut,
  variation,
  prizePool,
  gamePhase,
  onShow,
  onQuit,
  dealing,
  dealtHands,
  showAICards,
}) {
  const activePlayersCount = players.filter((p) => p.active).length;

  return (
    <div className="text-center">
      <h1 className="text-4xl text-white mb-8">Teen Patti - {variation.name}</h1>
      <p className="text-2xl text-yellow-300 mb-4">Total Prize Pool: {prizePool}</p>
      <div className="grid grid-cols-3 gap-4">
        {players.map((player, index) => (
          <PlayerPanel
            key={index}
            player={player}
            isCurrent={index === currentPlayer}
            dealing={dealing}
            dealtHand={dealtHands[index] || []}
            showAICards={showAICards}
          />
        ))}
      </div>
      {gamePhase === 'showdown' && activePlayersCount === 2 && players[currentPlayer].isHuman ? (
        <div className="mt-8 flex space-x-4">
          <button
            onClick={onShow}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Show
          </button>
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Continue
          </button>
          <button
            onClick={onQuit}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Quit
          </button>
        </div>
      ) : (
        <Controls
          onContinue={onContinue}
          onOut={onOut}
          isHumanTurn={players[currentPlayer].isHuman && players[currentPlayer].active}
        />
      )}
    </div>
  );
}

export default GameBoard;