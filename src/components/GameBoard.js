import React, { useState, useEffect } from 'react';
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
  currentCycle,
  handleStakeSelection // Correctly receive this prop
}) {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  // Track screen size for responsive layout with debounce for better performance
  useEffect(() => {
    let timeoutId = null;
    
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setScreenSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      }, 150);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Initial size check
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  
  // Determine columns based on screen size and player count
  const getGridColumns = () => {
    const { width } = screenSize;
    const playerCount = players.length;
    
    if (width < 640) { // Mobile
      return 'grid-cols-1';
    } else if (width < 768) { // Small tablets
      return playerCount <= 4 ? 'grid-cols-2' : 'grid-cols-2';
    } else if (width < 1024) { // Tablets
      return playerCount <= 3 ? 'grid-cols-3' : 'grid-cols-2';
    } else { // Desktops
      return playerCount <= 3 ? 'grid-cols-3' : 
             playerCount <= 6 ? 'grid-cols-3' : 'grid-cols-4';
    }
  };

  // Safety check for valid player index
  if (currentPlayerIndex < 0 || currentPlayerIndex >= players.length) {
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];
  const isHumanTurn = currentPlayer?.isHuman;
  const activePlayers = players.filter(p => !p.hasFolded).length;
  const gridColumns = getGridColumns();
  const isSmallScreen = screenSize.width < 640;
  const isMediumScreen = screenSize.width >= 640 && screenSize.width < 768;

  // Render the stake selection UI
  const renderStakeSelection = () => (
    <div className="flex flex-col items-center space-y-6 glassmorphic-bg p-4 md:p-6 rounded-xl">
      <h2 className="text-xl md:text-2xl text-white royal-text">Set the Current Stake</h2>
      <div className="w-64 flex items-center">
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          defaultValue={dragMeterValue}
          className="w-full touch-action-manipulation custom-slider"
          onChange={(e) => onStakeChange(parseInt(e.target.value))}
        />
      </div>
      <div className="text-lg md:text-xl text-white">
        Current Stake: <span className="text-yellow-300">{dragMeterValue}</span> coins
      </div>
      <button
        onClick={handleStakeSelection} // Use the prop directly, don't redefine it
        className="royal-btn mt-6 px-8 py-3 text-white text-xl font-semibold"
      >
        <span className="card-suit suit-spade">♠</span> Start Round with Stake: {dragMeterValue} <span className="card-suit suit-heart">♥</span>
      </button>
    </div>
  );

  return (
    <div className="text-center w-full max-w-6xl responsive-container">
      <div className="aquamorphic-bg mx-auto p-3 md:p-6 rounded-lg">
        <h1 className="text-2xl md:text-4xl text-white mb-3 md:mb-6 gold-gradient-text royal-text">
          {isSmallScreen ? variation?.name : `Teen Patti - ${variation?.name}`}
        </h1>
        
        {/* Game status indicators */}
        <div className={`flex ${isSmallScreen ? 'flex-col space-y-2' : 'justify-between'} items-center mb-3 md:mb-6`}>
          <div className={`flex ${isSmallScreen ? 'flex-col space-y-1' : 'space-x-6'}`}>
            <p className="text-base md:text-xl text-yellow-300">Stake: {currentStake}</p>
            <p className="text-base md:text-xl text-green-300">Pot: {pot}</p>
          </div>
          <p className="text-base md:text-xl text-blue-300">
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
        {gamePhase === 'stakeSelection' && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            {renderStakeSelection()}
          </div>
        )}
        
        {/* Player panels in a responsive grid */}
        <div className={`grid ${gridColumns} gap-2 md:gap-4 lg:gap-6`}>
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
                isSmallScreen={isSmallScreen || isMediumScreen}
              />
            );
          })}
        </div>
        
        {/* Game controls - only shown when it's human player's turn during betting */}
        {isHumanTurn && gamePhase === 'betting' && (
          <Controls
            player={currentPlayer}
            currentStake={currentStake}
            onPlayerAction={onPlayerAction}
            currentCycle={currentCycle} 
            activePlayersCount={activePlayers}
            isSmallScreen={isSmallScreen}
          />
        )}
        
        {/* Reaction button - hide on very small screens */}
        {screenSize.width > 480 && (
          <div className="mt-4 md:mt-6">
            <ReactionButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;