import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  dealtHands, // Added back to props
  showAllCards,
  onPlayerAction,
  dragMeterValue,
  onStakeChange,
  currentCycle,
  handleStakeSelection
}) {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const [selectedMode, setSelectedMode] = useState('blind');

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
    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  if (currentPlayerIndex < 0 || currentPlayerIndex >= players.length) {
    return null;
  }

  const currentPlayer = players[currentPlayerIndex];
  const isHumanTurn = currentPlayer?.isHuman;
  const activePlayers = players.filter(p => !p.hasFolded).length;
  const isSmallScreen = screenSize.width < 640;
  const isMediumScreen = screenSize.width >= 640 && screenSize.width < 768;

  const getPlayerPosition = (index, totalPlayers) => {
    // Dynamically set the radius based on player count.
    // With more players, use a larger radius.
    const radius = totalPlayers <= 4 ? 40 : totalPlayers <= 6 ? 60 : 80;
    
    const angleStep = (2 * Math.PI) / totalPlayers;
    const angle = (angleStep * index) - (Math.PI / 2);
    
    // Calculate positions using percentage offsets.
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    
    return {
      left: `${x}%`,
      top: `${y}%`,
      transform: `translate(-50%, -50%)`
    };
  };

  const renderStakeSelection = () => (
    <div className="flex flex-col items-center space-y-6 glassmorphic-bg p-6 md:p-8 rounded-xl w-11/12 max-w-md mx-auto">
      <h2 className="text-2xl md:text-3xl text-white royal-text embossed">Game Setup</h2>
      <div className="royal-divider w-3/4"></div>
      <div className="w-full max-w-xs mb-4">
        <h3 className="text-lg text-white mb-3">Select Your Playing Mode</h3>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setSelectedMode('blind')}
            className={`p-3 rounded-lg flex flex-col items-center ${
              selectedMode === 'blind'
                ? 'bg-gradient-to-r from-blue-900 to-blue-700 border border-blue-400'
                : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600'
            }`}
          >
            <span className="text-white font-bold">Blind</span>
            <span className="text-xs text-gray-300 mt-1">Cards remain hidden</span>
            <span className="card-suit suit-club mt-1">♣</span>
          </button>
          <button
            onClick={() => setSelectedMode('seen')}
            className={`p-3 rounded-lg flex flex-col items-center ${
              selectedMode === 'seen'
                ? 'bg-gradient-to-r from-purple-900 to-purple-700 border border-purple-400'
                : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600'
            }`}
          >
            <span className="text-white font-bold">Seen</span>
            <span className="text-xs text-gray-300 mt-1">See cards immediately</span>
            <span className="card-suit suit-spade mt-1">♠</span>
          </button>
        </div>
        <p className="text-xs text-yellow-200 mt-2">
          {selectedMode === 'blind'
            ? 'Blind mode: Pay 1 extra coin per bet, but opponents cannot see your cards'
            : 'Seen mode: See your cards immediately, but pay double stakes'}
        </p>
      </div>
      <div className="w-full max-w-xs">
        <h3 className="text-lg text-white mb-2">Set Stake</h3>
        <div className="flex justify-between text-sm text-gray-400 px-2 mb-1">
          <span>Low</span>
          <span>Medium</span>
          <span>High</span>
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="1"
          value={dragMeterValue}
          className="w-full touch-action-manipulation custom-slider"
          onChange={(e) => onStakeChange(parseInt(e.target.value))}
        />
        <div className="flex justify-between mt-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            dragMeterValue === 1 ? 'bg-gradient-to-r from-red-900 to-yellow-700 border border-yellow-400' : 'bg-gray-800'
          }`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            dragMeterValue === 2 ? 'bg-gradient-to-r from-red-900 to-yellow-700 border border-yellow-400' : 'bg-gray-800'
          }`}>2</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            dragMeterValue === 3 ? 'bg-gradient-to-r from-red-900 to-yellow-700 border border-yellow-400' : 'bg-gray-800'
          }`}>3</div>
        </div>
      </div>
      <div className="text-lg md:text-xl text-gray-200 mt-2">
        Current Stake: <span className="text-yellow-300 font-bold">{dragMeterValue}</span> coins
      </div>
      <motion.button
        onClick={() => handleStakeSelection(selectedMode)}
        className="royal-btn mt-6 px-10 py-4 text-white text-xl font-semibold"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="card-suit suit-spade mr-2">♠</span>
        Start Game
        <span className="card-suit suit-heart ml-2">♥</span>
      </motion.button>
    </div>
  );

  return (
    <div className="text-center w-full max-w-6xl responsive-container relative table-perspective-container">
      <div style={{ minHeight: "70vh" }}>
        <div className="mb-3 md:mb-6 relative z-20 bg-black bg-opacity-50 p-2 rounded-md">
          <h1 className="text-2xl md:text-4xl text-white gold-gradient-text royal-text">
            {isSmallScreen ? variation?.name : `Teen Patti - ${variation?.name}`}
          </h1>
          <div className={`flex ${isSmallScreen ? 'flex-col space-y-2' : 'justify-between'} items-center mb-2`}>
            <div className={`flex ${isSmallScreen ? 'flex-col space-y-1' : 'space-x-6'}`}>
              <p className="text-base md:text-xl text-yellow-300">Stake: {currentStake}</p>
              <p className="text-base md:text-xl text-green-300">Pot: {pot}</p>
            </div>
            <p className="text-base md:text-xl text-blue-300">
              {gamePhase === 'stakeSelection'
                ? 'Select Mode & Stake'
                : gamePhase === 'betting'
                  ? `${currentPlayer?.name}'s Turn`
                  : gamePhase === 'showdown'
                    ? 'Showdown!'
                    : 'Game Over'}
            </p>
          </div>
        </div>

        <div className="relative table-3d" style={{ height: "60vh" }}>
          <div className="table-rim"></div>
          <div className="table-surface rounded-full absolute inset-0">
            <div className="relative h-full w-full">
              {players.map((player, index) => {
                if (!player) return null;
                const position = getPlayerPosition(index, players.length);
                return (
                  <div
                    key={index}
                    className="absolute player-3d"
                    style={{
                      ...position,
                      zIndex: player.isHuman ? 30 : 20,
                      width: isSmallScreen ? '100px' : '140px'
                    }}
                  >
                    <div className="player-panel-3d">
                      <PlayerPanel
                        player={player}
                        isCurrent={index === currentPlayerIndex}
                        dealing={dealing}
                        dealtHand={dealtHands && dealtHands[index] ? dealtHands[index] : []} // Pass dealtHand safely
                        showAllCards={showAllCards}
                        isSmallScreen={isSmallScreen || isMediumScreen}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="bg-black bg-opacity-50 px-4 py-2 rounded-full">
                <span className="text-green-300 text-xl md:text-2xl font-bold">Pot: {pot}</span>
              </div>
              {pot > 0 && (
                <div className="mt-2 chip-stack">
                  {[...Array(Math.min(5, Math.ceil(pot / 20)))].map((_, i) => (
                    <div key={i} className="chip" style={{ transform: `translateZ(${i * 4}px)` }}></div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {gamePhase === 'stakeSelection' && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            {renderStakeSelection()}
          </div>
        )}
        {isHumanTurn && gamePhase === 'betting' && (
          <div className="absolute w-full left-1/2 transform -translate-x-1/2 bottom-2 z-40">
            <Controls
              player={currentPlayer}
              currentStake={currentStake}
              onPlayerAction={onPlayerAction}
              currentCycle={currentCycle}
              activePlayersCount={activePlayers}
              isSmallScreen={isSmallScreen}
            />
          </div>
        )}
        {screenSize.width > 480 && (
          <div className="absolute right-4 top-4 z-30">
            <ReactionButton />
          </div>
        )}
      </div>
    </div>
  );
}

export default GameBoard;