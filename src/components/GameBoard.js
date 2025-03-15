import React from 'react';
import PlayerPanel from './PlayerPanel';
import Controls from './Controls';
import ReactionButton from './ReactionButton';

function GameBoard({
  players,
  currentPlayerIndex,
  currentStake,
  pot,
  variation,
  gamePhase,
  dealing,
  dealtHands,
  showAllCards,
  onPlayerAction,
  dragMeterValue,
  onStakeChange,
  currentCycle // Added missing prop
}) {
  if (currentPlayerIndex < 0 || currentPlayerIndex >= players.length) {
    return null; // Prevent out-of-bounds errors
  }

  const currentPlayer = players[currentPlayerIndex];
  const isHumanTurn = currentPlayer?.isHuman;
  const activePlayers = players.filter(p => !p.hasFolded).length;

  // Render the stake selection UI
  const renderStakeSelection = () => (
    <div className="flex flex-col items-center space-y-6 glassmorphic-bg p-6 rounded-xl">
      <h2 className="text-2xl text-white">Set the Current Stake</h2>
      <div className="w-64 flex items-center">
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          defaultValue={dragMeterValue}
          className="w-full"
          onChange={(e) => onStakeChange(parseInt(e.target.value))}
        />
      </div>
      <div className="text-xl text-white">
        Current Stake: <span className="text-yellow-300">{dragMeterValue}</span> coins
      </div>
    </div>
  );

  return (
    <div className="text-center w-full max-w-6xl">
      <div className="aquamorphic-bg mx-auto p-6 rounded-lg">
        <h1 className="text-4xl text-white mb-6 gold-gradient-text">Teen Patti - {variation?.name}</h1>
        
        {/* Game status indicators */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-6">
            <p className="text-xl text-yellow-300">Current Stake: {currentStake} coins</p>
            <p className="text-xl text-green-300">Current Pot: {pot} coins</p>
          </div>
          <p className="text-xl text-blue-300">
            {gamePhase === 'stakeSelection' 
              ? 'Select Stake'
              : gamePhase === 'betting' 
                ? `${currentPlayer?.name}'s Turn`
                : gamePhase === 'showdown' 
                  ? 'Showdown!'
                  : 'Game Over'}
          </p>
        </div>
        
        {/* Stake selection UI during stake selection phase */}
        {gamePhase === 'stakeSelection' && renderStakeSelection()}
        
        {/* Player panels */}
        <div className="grid grid-cols-3 gap-6">
          {players.map((player, index) => {
            if (!player) return null;
            return (
              <PlayerPanel
                key={index}
                player={player}
                isCurrent={index === currentPlayerIndex}
                dealing={dealing}
                dealtHand={dealtHands[index] || []}
                showAllCards={showAllCards}
              />
            );
          })}
        </div>
        
        {/* Reaction button */}
        <div className="mt-8">
          <ReactionButton />
        </div>
        
        {/* Game controls - only shown when it's human player's turn during betting */}
        {isHumanTurn && gamePhase === 'betting' && (
          <Controls
            player={currentPlayer}
            currentStake={currentStake}
            onPlayerAction={onPlayerAction}
            currentCycle={currentCycle} // Pass the prop correctly
            activePlayersCount={activePlayers}
          />
        )}
      </div>
    </div>
  );
}

export default GameBoard;