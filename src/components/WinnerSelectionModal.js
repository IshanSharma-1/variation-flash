// src/components/WinnerSelectionModal.js
import React from 'react';
import { motion } from 'framer-motion'; // For animations

function WinnerSelectionModal({ players, onSelectWinner }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center"
    >
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Select the Winner</h2>
        <div className="flex space-x-4">
          {players.map((player, index) => (
            <button
              key={index}
              onClick={() => onSelectWinner(player.isHuman ? 0 : player.name === 'AI 1' ? 1 : 2)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {player.name}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default WinnerSelectionModal;