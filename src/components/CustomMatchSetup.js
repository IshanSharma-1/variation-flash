import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CustomMatchSetup({ variations, onStartCustomMatch, onBack, players = [] }) {
  // Check if this is the first match or a subsequent match
  // First match: players array is empty
  // Subsequent match: players array has existing players
  const isFirstMatch = players.length === 0;
  const initialPlayerCount = isFirstMatch ? 3 : players.length;
  
  const [playerCount, setPlayerCount] = useState(initialPlayerCount);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [showCashOutConfirm, setShowCashOutConfirm] = useState(false);
  
  // Check if player has coins earned (only relevant after first match)
  const playerCoins = !isFirstMatch ? players[0]?.coins : 0;
  const initialCoins = 50; // Starting coins
  const hasProfit = playerCoins > initialCoins;
  
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      boxShadow: "0px 0px 15px rgba(212, 175, 55, 0.5)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 15 
      }
    },
    tap: { scale: 0.97 }
  };

  const startMatch = () => {
    if (selectedVariation) {
      onStartCustomMatch(playerCount, selectedVariation);
    }
  };
  
  const handleCashOut = () => {
    setShowCashOutConfirm(true);
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-auto py-8">
      <div 
        className="text-center p-8 relative z-20 rounded-xl w-11/12 md:w-3/4 lg:w-2/3 max-w-4xl royal-card"
      >
        <motion.h1 
          className="font-bold mb-6 tracking-wide royal-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="block text-3xl embossed">CUSTOM MATCH SETUP</span>
        </motion.h1>
        
        <div className="royal-divider"></div>
        
        {/* Player Count Selection - Disabled for subsequent matches */}
        <div className="mb-8 mt-6">
          <h2 className="text-xl text-white mb-4 royal-text">
            {isFirstMatch ? "Select Number of Players" : "Player Count"}
            {!isFirstMatch && <span className="text-xs text-yellow-300 ml-2">(Fixed for this session)</span>}
          </h2>
          <div className="flex justify-center space-x-3">
            {[2, 3, 4, 5, 6, 7, 8].map((count) => (
              <motion.button
                key={count}
                onClick={() => isFirstMatch && setPlayerCount(count)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg 
                  ${playerCount === count 
                    ? 'bg-gradient-to-r from-red-900 to-yellow-700 shadow-lg border border-yellow-400' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600'
                  }
                  ${!isFirstMatch && playerCount !== count ? 'opacity-40 cursor-not-allowed' : ''}
                `}
                variants={isFirstMatch ? buttonVariants : {}}
                initial="initial"
                whileHover={isFirstMatch ? "hover" : "initial"}
                whileTap={isFirstMatch ? "tap" : "initial"}
              >
                {count}
              </motion.button>
            ))}
          </div>
          <p className="text-yellow-200 text-sm mt-2">
            You + {playerCount-1} AI opponents
          </p>
        </div>
        
        {/* Game Variation Selection - Always enabled */}
        <div className="mb-8">
          <h2 className="text-xl text-white mb-4 royal-text">Select Game Variation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {variations.map((variation) => (
              <motion.button
                key={variation.name}
                onClick={() => setSelectedVariation(variation)}
                className={`p-3 rounded-lg flex flex-col items-center justify-center ${
                  selectedVariation?.name === variation.name 
                    ? 'bg-gradient-to-r from-red-900 to-yellow-700 shadow-lg border border-yellow-400' 
                    : 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-600'
                }`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                <span className="text-white">{variation.name}</span>
                <div className="flex items-center mt-1">
                  {[...Array(variation.cards)].map((_, i) => (
                    <span key={i} className="text-xs mx-0.5">
                      {i % 2 === 0 ? 
                        <span className="card-suit suit-spade">♠</span> : 
                        <span className="card-suit suit-heart">♥</span>
                      }
                    </span>
                  ))}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
        
        <div className="royal-divider"></div>
        
        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6 mt-6">
          {/* Main game buttons */}
          <div className="flex space-x-4">
            <motion.button
              onClick={onBack}
              className="px-6 py-3 rounded-lg text-white bg-gray-700 hover:bg-gray-600 border border-gray-500"
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              Back
            </motion.button>
            
            <motion.button
              onClick={startMatch}
              disabled={!selectedVariation}
              className={selectedVariation 
                ? 'royal-btn px-8 py-3 text-white font-semibold'
                : 'bg-gray-600 opacity-60 cursor-not-allowed px-8 py-3 rounded-lg text-white font-semibold border border-gray-500'}
              variants={buttonVariants}
              initial="initial"
              whileHover={selectedVariation ? "hover" : "initial"}
              whileTap={selectedVariation ? "tap" : "initial"}
            >
              Start Match
              {selectedVariation && <span className="ml-2 card-suit suit-spade">♠</span>}
            </motion.button>
          </div>
          
          {/* Cash Out button - only shown after the first match */}
          {!isFirstMatch && (
            <motion.button
              onClick={handleCashOut}
              className={`px-8 py-3 rounded-lg text-white font-semibold border ${
                hasProfit 
                  ? 'bg-gradient-to-r from-green-700 to-emerald-900 border-green-500' 
                  : 'bg-gradient-to-r from-orange-700 to-red-900 border-orange-500'
              }`}
              variants={buttonVariants}
              initial="initial"
              whileHover="hover"
              whileTap="tap"
            >
              <span className="card-suit suit-diamond mr-2">♦</span>
              Cash Out ({playerCoins} coins)
              <span className="card-suit suit-diamond ml-2">♦</span>
            </motion.button>
          )}
        </div>
        
        {/* Cash Out Confirmation Modal */}
        {showCashOutConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
            <motion.div 
              className="royal-card p-8 rounded-xl text-center w-11/12 max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              <h2 className="text-2xl mb-4 embossed royal-text">Cash Out Confirmation</h2>
              <div className="royal-divider"></div>
              
              <div className="my-6 text-yellow-100">
                <p className="mb-2">Are you sure you want to cash out with {playerCoins} coins?</p>
                {hasProfit ? (
                  <p className="text-green-400 font-bold">You earned {playerCoins - initialCoins} coins profit!</p>
                ) : (
                  <p className="text-red-400 font-bold">You lost {initialCoins - playerCoins} coins!</p>
                )}
              </div>
              
              <div className="flex justify-center space-x-4">
                <motion.button
                  onClick={() => setShowCashOutConfirm(false)}
                  className="px-6 py-2 rounded-lg text-white bg-gray-700 hover:bg-gray-600 border border-gray-500"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  Cancel
                </motion.button>
                
                <motion.button
                  onClick={() => {
                    // Reset the game completely
                    window.location.reload();
                  }}
                  className="royal-btn px-6 py-2"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span className="card-suit suit-diamond mr-2">♦</span>
                  Confirm
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomMatchSetup;