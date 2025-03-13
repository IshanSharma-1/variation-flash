import React from 'react';
import PlayerPanel from './PlayerPanel';
import Controls from './Controls';
import ReactionButton from './ReactionButton';

console.log('PlayerPanel:', typeof PlayerPanel);
console.log('Controls:', typeof Controls);
console.log('ReactionButton:', typeof ReactionButton);

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
  // NEW UPDATE: additional props
  onPlayBlind,
  onSeeCards,
}) {
  const activePlayersCount = players.filter((p) => p.active).length;

  return (
    <div className="text-center">
      <div className="aquamorphic-bg mx-auto max-w-5xl mt-8">
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
        <div className="mt-8">
          <ReactionButton />
        </div>
        {gamePhase === 'showdown' && activePlayersCount === 2 && players[currentPlayer].isHuman ? (
          <div className="mt-8 flex space-x-4 justify-center">
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
          // NEW UPDATE: pass blind-related actions to Controls
          <Controls
            onContinue={onContinue}
            onOut={onOut}
            isHumanTurn={players[currentPlayer].isHuman && players[currentPlayer].active}
            onPlayBlind={onPlayBlind}
            onSeeCards={onSeeCards}
            currentBlindCount={players[currentPlayer].blindCount}
            isUserBlind={players[currentPlayer].isBlind}
          />
        )}
      </div>
    </div>
  );
}

export default GameBoard;