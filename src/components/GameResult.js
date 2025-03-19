import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import AudioManager from '../utils/AudioManager';
import Confetti from 'react-confetti';

function GameResult({ winner, winAmount, onNextGame }) {
  // Play win sequence when component mounts
  useEffect(() => {
    // If player won, play the winning sound sequence
    if (winner.isHuman) {
      AudioManager.playWinSequence();
    }
  }, [winner]);

  const isHumanWinner = winner.isHuman;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
      {isHumanWinner && <Confetti recycle={false} numberOfPieces={500} />}
      
      <div className="royal-card p-8 rounded-xl text-center w-11/12 max-w-md">
        <h2 className="text-2xl mb-4 royal-text embossed">
          {isHumanWinner ? "Congratulations!" : "Better luck next time!"}
        </h2>
        <div className="royal-divider"></div>
        
        <div className="my-6">
          <p className="text-xl text-yellow-100">
            {isHumanWinner 
              ? `You won ${winAmount} coins!` 
              : `${winner.name} won the game.`}
          </p>
          {/* Winner's cards display */}
        </div>
        
        <div className="royal-divider"></div>
        
        <motion.button
          onClick={onNextGame}
          className="royal-btn mt-6 px-8 py-3"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="card-suit suit-diamond mr-2">♦</span>
          Next Game
          <span className="card-suit suit-heart ml-2">♥</span>
        </motion.button>
      </div>
    </div>
  );
}

export default GameResult;