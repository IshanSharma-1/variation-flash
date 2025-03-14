import React from 'react';
import PlayerPanel from './PlayerPanel';
import Controls from './Controls';
import ReactionButton from './ReactionButton';

function GameBoard({
  players,
  currentPlayer,
  onContinue,
  onOut,
  variation,
  prizePool,
  currentRoundPool, // New prop
  gamePhase,
  onRevealCards,
  onBlindShow,
  onShow,
  onQuit,
  dealing,
  dealtHands,
  showAICards,
  onPlayBlind,
  onSeeCards,
  roundCount,
  showAllCards,
}) {
  const activePlayersCount = players.filter((p) => p.active).length;
  const currentPlayerHasSeen = players[currentPlayer].hasSeenCards;
  const didUserPickBlindUpfront = players[0].didUserPickBlindUpfront || false;

  return (
    <div className="text-center">
      <div className="aquamorphic-bg mx-auto max-w-5xl mt-8">
        <h1 className="text-4xl text-white mb-8">Teen Patti - {variation.name}</h1>
        <div className="flex justify-center space-x-12 mb-4">
          <p className="text-2xl text-yellow-300">Total Prize Pool: {prizePool}</p>
          <p className="text-2xl text-green-300">Current Pot: {currentRoundPool}</p>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {players.map((player, index) => (
            <PlayerPanel
              key={index}
              player={player}
              isCurrent={index === currentPlayer}
              dealing={dealing}
              dealtHand={dealtHands[index] || []}
              showAICards={showAICards}
              showAllCards={showAllCards}
            />
          ))}
        </div>

        <div className="mt-8">
          <ReactionButton />
        </div>

        {gamePhase === 'showdown' && activePlayersCount === 2 && players[currentPlayer].isHuman ? (
          <div className="mt-8 flex space-x-4 justify-center">
            {!currentPlayerHasSeen && (
              <button
                onClick={onRevealCards}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reveal Cards
              </button>
            )}
            {!currentPlayerHasSeen && (
              <button
                onClick={onBlindShow}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Blind Show
              </button>
            )}
            {currentPlayerHasSeen && (
              <button
                onClick={onShow}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Show
              </button>
            )}
            <button
              onClick={onOut}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Out
            </button>
          </div>
        ) : (
          <Controls
            onContinue={onContinue}
            onOut={onOut}
            isHumanTurn={players[currentPlayer].isHuman && players[currentPlayer].active}
            onPlayBlind={onPlayBlind}
            onSeeCards={onSeeCards}
            currentBlindCount={players[currentPlayer].blindCount}
            isUserBlind={players[currentPlayer].isBlind}
            hasSeenCards={currentPlayerHasSeen}
            roundCount={roundCount}
            didUserPickBlindUpfront={didUserPickBlindUpfront}
          />
        )}
      </div>
    </div>
  );
}

export default GameBoard;