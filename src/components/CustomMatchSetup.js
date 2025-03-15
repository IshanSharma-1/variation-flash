import React, { useState } from 'react';
import { motion } from 'framer-motion';

function CustomMatchSetup({ variations, onStartCustomMatch, onBack }) {
  const [playerCount, setPlayerCount] = useState(3);
  const [selectedVariation, setSelectedVariation] = useState(null);
  
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
        
        {/* Player Count Selection */}
        <div className="mb-8 mt-6">
          <h2 className="text-xl text-white mb-4 royal-text">Select Number of Players</h2>
          <div className="flex justify-center space-x-3">
            {[2, 3, 4, 5, 6, 7, 8].map((count) => (
              <motion.button
                key={count}
                onClick={() => setPlayerCount(count)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-lg ${
                  playerCount === count 
                    ? 'bg-gradient-to-r from-red-900 to-yellow-700 shadow-lg border border-yellow-400' 
                    : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600'
                }`}
                variants={buttonVariants}
                initial="initial"
                whileHover="hover"
                whileTap="tap"
              >
                {count}
              </motion.button>
            ))}
          </div>
          <p className="text-yellow-200 text-sm mt-2">You + {playerCount-1} AI opponents</p>
        </div>
        
        {/* Game Variation Selection */}
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
        <div className="flex justify-center space-x-6 mt-6">
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
      </div>
    </div>
  );
}

export default CustomMatchSetup;