import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function GameManual({ onClose }) {
  const [activeTab, setActiveTab] = useState('basics');
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', stiffness: 300, damping: 30 }
    },
    exit: { 
      opacity: 0, 
      y: 50, 
      scale: 0.9,
      transition: { duration: 0.2 }
    }
  };
  
  const tabContentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };
  
  // Game variation descriptions with rules
  const variations = [
    {
      name: 'Normal',
      cards: 3,
      description: 'Classic Teen Patti with 3 cards where players compare hands to determine the winner.',
      rules: 'Standard poker hand rankings apply. Best three-card combination wins.'
    },
    {
      name: '3 in Muflis',
      cards: 3,
      description: 'In this variation, the lowest hand wins instead of the highest hand.',
      rules: 'Standard poker hand rankings apply but in reverse: A-2-3 unsuited is the best hand.'
    },
    {
      name: '4 in Muflis',
      cards: 4,
      description: 'Four cards are dealt to each player, but the lowest hand wins.',
      rules: 'Players must use all 4 cards. Standard rankings apply in reverse.'
    },
    {
      name: 'Kiss Miss & Jump',
      cards: 5,
      description: 'Players receive 5 cards and must form the best 3-card combination.',
      rules: 'You can discard 2 cards of your choice. The best 3-card combination wins.'
    },
    {
      name: 'AK47 - III',
      cards: 3,
      description: 'Aces and Kings are wild cards that can substitute for any card.',
      rules: 'All Aces and Kings act as wild cards. The best three-card combination wins.'
    },
    {
      name: 'AK47 IV',
      cards: 4,
      description: 'Four-card version where Aces and Kings are wild cards.',
      rules: 'Players receive 4 cards, with all Aces and Kings being wild.'
    },
    {
      name: 'AK56-III',
      cards: 3,
      description: 'Aces, Kings, and 5s are wild cards that can substitute for any card.',
      rules: 'All Aces, Kings, and 5s act as wild cards in this 3-card game.'
    },
    {
      name: 'AK56-IV',
      cards: 4,
      description: 'Four-card version where Aces, Kings, and 5s are wild cards.',
      rules: 'Players receive 4 cards, with all Aces, Kings, and 5s being wild.'
    },
    {
      name: 'K-Little',
      cards: 3,
      description: 'Kings are the lowest cards, even lower than 2s.',
      rules: 'Kings are ranked below 2s in this variation.'
    },
    {
      name: 'J-Little',
      cards: 3,
      description: 'Jacks are the lowest cards, even lower than 2s.',
      rules: 'Jacks are ranked below 2s in this variation.'
    },
    {
      name: 'Lallan Kallan',
      cards: 3,
      description: 'Jokers are introduced. One joker card is drawn face up, and all cards of that rank become wild.',
      rules: 'One card is drawn to determine the wild card rank. All cards of that rank are wild.'
    },
    {
      name: 'Any Card Joker-III',
      cards: 3,
      description: 'A random card is selected as the joker at the beginning of each round.',
      rules: 'All cards of the selected rank become wild cards.'
    },
    {
      name: 'Any Card Joker-IV',
      cards: 4,
      description: 'Four-card version where a random card is selected as the joker.',
      rules: 'Players receive 4 cards, with one randomly selected rank acting as wild.'
    },
    {
      name: '1942: A Love Story-III',
      cards: 3,
      description: 'All cards with face values of 1, 9, 4, and 2 (Aces, 9s, 4s, and 2s) are wild.',
      rules: 'Aces, 9s, 4s, and 2s are wild cards that can substitute for any card.'
    },
    {
      name: '1942: A Love Story-IV',
      cards: 4,
      description: 'Four-card version where cards with face values of 1, 9, 4, and 2 are wild.',
      rules: 'Players receive 4 cards, with Aces, 9s, 4s, and 2s being wild.'
    }
  ];

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <motion.div 
        className="royal-card w-11/12 md:w-4/5 lg:w-3/5 h-4/5 md:h-4/5 overflow-hidden flex flex-col rounded-xl"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {/* Manual Header */}
        <div className="bg-gradient-to-r from-purple-900 via-red-900 to-purple-900 p-4 flex justify-between items-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white royal-text embossed">The Royal Deal: Game Guide</h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-300 transition-colors text-2xl"
          >
            ×
          </button>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700">
          {['basics', 'variations', 'rankings', 'betting'].map(tab => (
            <button
              key={tab}
              className={`px-4 py-3 text-sm md:text-base font-medium flex-shrink-0 transition-all ${
                activeTab === tab 
                  ? 'bg-gradient-to-b from-red-900 to-red-800 text-yellow-200 border-b-2 border-yellow-400' 
                  : 'text-gray-300 hover:bg-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'basics' && '♠ '}
              {tab === 'variations' && '♥ '}
              {tab === 'rankings' && '♣ '}
              {tab === 'betting' && '♦ '}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Content Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 bg-gradient-to-b from-gray-800 to-gray-900">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
            >
              {activeTab === 'basics' && (
                <div className="text-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-yellow-300">How to Play</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Game Objective</h4>
                    <p className="mb-2">The Royal Deal is inspired by Teen Patti (3-Card Poker), where players bet on who has the best hand. The goal is to have the highest-ranking hand or to bluff others into folding.</p>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Getting Started</h4>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Select the number of players (2-8)</li>
                      <li>Choose a game variation</li>
                      <li>Set the stake amount (1-3 coins)</li>
                      <li>Everyone pays an initial ante to form the pot</li>
                      <li>Cards are dealt according to the variation selected</li>
                    </ol>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Turn-Based Play</h4>
                    <p className="mb-2">Players take turns clockwise, with these options:</p>
                    <ul className="list-disc ml-5 space-y-2">
                      <li><span className="text-yellow-300">Blind Play:</span> Play without seeing your cards (costs current stake)</li>
                      <li><span className="text-yellow-300">See Cards:</span> View your cards and continue (costs 2× current stake)</li>
                      <li><span className="text-yellow-300">Show:</span> Request a showdown with the last active player (costs 2× current stake)</li>
                      <li><span className="text-yellow-300">Fold:</span> Drop out of the current round and lose your bets</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-white">Winning</h4>
                    <p>The round ends when only one player remains (others folded) or when a showdown is called. The player with the highest-ranking hand wins the pot!</p>
                  </div>
                </div>
              )}
              
              {activeTab === 'variations' && (
                <div className="text-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-yellow-300">Game Variations</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {variations.map((variation, index) => (
                      <div key={index} className="border border-gray-700 rounded-lg p-4 bg-gradient-to-br from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 transition-all">
                        <h4 className="font-bold text-white flex items-center">
                          <span className="card-suit suit-spade mr-2">♠</span>
                          {variation.name}
                          <span className="ml-2 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{variation.cards} cards</span>
                        </h4>
                        <p className="text-gray-300 my-2">{variation.description}</p>
                        <p className="text-sm text-yellow-200 italic">{variation.rules}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {activeTab === 'rankings' && (
                <div className="text-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-yellow-300">Hand Rankings</h3>
                  
                  <p className="mb-4">Poker hands in Teen Patti are ranked from highest to lowest:</p>
                  
                  <div className="space-y-4">
                    <div className="border-l-4 border-red-600 pl-4">
                      <h4 className="font-bold text-white">Trail/Set/Trio (Three of a Kind)</h4>
                      <p className="text-gray-300">Three cards of the same rank. Example: A♥ A♦ A♣</p>
                    </div>
                    
                    <div className="border-l-4 border-orange-500 pl-4">
                      <h4 className="font-bold text-white">Pure Sequence (Straight Flush)</h4>
                      <p className="text-gray-300">Three consecutive cards of the same suit. Example: 4♥ 5♥ 6♥</p>
                    </div>
                    
                    <div className="border-l-4 border-yellow-500 pl-4">
                      <h4 className="font-bold text-white">Sequence (Straight)</h4>
                      <p className="text-gray-300">Three consecutive cards not all in the same suit. Example: 7♥ 8♦ 9♣</p>
                    </div>
                    
                    <div className="border-l-4 border-green-500 pl-4">
                      <h4 className="font-bold text-white">Color (Flush)</h4>
                      <p className="text-gray-300">Three cards of the same suit, not in sequence. Example: 2♠ 6♠ 10♠</p>
                    </div>
                    
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-bold text-white">Pair</h4>
                      <p className="text-gray-300">Two cards of the same rank. Example: J♥ J♦ 7♣</p>
                    </div>
                    
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h4 className="font-bold text-white">High Card</h4>
                      <p className="text-gray-300">When you don't have any of the above. The highest card determines the winner.</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                    <h4 className="font-semibold text-white">Special Rules:</h4>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                      <li>A-2-3 is the lowest straight</li>
                      <li>Ace can be high (A-K-Q) or low (A-2-3)</li>
                      <li>In variations with more than 3 cards, players make the best 3-card hand unless specified otherwise</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'betting' && (
                <div className="text-gray-200">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-yellow-300">Betting Rules</h3>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Initial Stake</h4>
                    <p className="mb-2">At the beginning of each round, you select a stake amount (1-3 coins). This determines the betting structure for the round.</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Lower stakes (1 coin) - For casual play</li>
                      <li>Medium stakes (2 coins) - Standard play</li>
                      <li>Higher stakes (3 coins) - For bold players willing to risk more</li>
                    </ul>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Blind vs. Seen Play</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-3 bg-blue-900 bg-opacity-30 rounded-lg">
                        <h5 className="font-bold text-blue-300">Blind Play (Haven't seen your cards)</h5>
                        <p className="text-sm">- Costs current stake</p>
                        <p className="text-sm">- Example: If stake is 2, pay 2 coins</p>
                        <p className="text-sm mt-2">- Initial ante: Stake + 1 coin</p>
                        <p className="text-sm">- Example: If stake is 2, pay 3 coins upfront</p>
                      </div>
                      <div className="p-3 bg-purple-900 bg-opacity-30 rounded-lg">
                        <h5 className="font-bold text-purple-300">Seen Play (After viewing cards)</h5>
                        <p className="text-sm">- Costs 2× the current stake</p>
                        <p className="text-sm">- Example: If stake is 2, pay 4 coins</p>
                        <p className="text-sm mt-2">- Initial ante: 2× the stake</p>
                        <p className="text-sm">- Example: If stake is 2, pay 4 coins upfront</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-bold mb-2 text-white">Show (Showdown)</h4>
                    <p className="mb-2">When only two players remain, one player can request a showdown by choosing "Show".</p>
                    <ul className="list-disc ml-5 space-y-1">
                      <li>Costs 2× the current stake (same as a seen play)</li>
                      <li>Both players reveal their cards</li>
                      <li>Highest hand wins the pot</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold mb-2 text-white">The Pot</h4>
                    <p>All bets go into the pot. The winner of each round takes the entire pot. If you fold, you lose your contributed coins for that round.</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Footer with close button */}
        <div className="p-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700 flex justify-end">
          <motion.button
            onClick={onClose}
            className="btn btn-primary btn-gold-accent px-6 py-2 btn-ripple"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="card-suit suit-spade mr-2">♠</span>
            Close Guide
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default GameManual;