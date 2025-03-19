import React, { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { playWinSequence } from '../utils/AudioManager';

const CongratulationsModal = ({ winner, onClose }) => {
  const [audioAttempted, setAudioAttempted] = useState(false);
  
  useEffect(() => {
    console.log('CongratulationsModal rendered with winner:', winner);

    // Attempt to play the win sound immediately
    const playSound = async () => {
      if (audioAttempted) return; // Prevent multiple attempts
      
      setAudioAttempted(true);
      try {
        // Try to play the win sound with a small delay to ensure component is mounted
        setTimeout(async () => {
          try {
            await playWinSequence();
            console.log('Win sequence played successfully');
          } catch (err) {
            console.error('Error in delayed win sound play:', err);
          }
        }, 300);
      } catch (error) {
        console.error("Error scheduling win sound:", error);
      }
    };
    
    // Play sound and set up interaction-based fallback
    playSound();
    
    // Add a click handler for the entire modal to play on interaction
    const handleInteraction = () => {
      playWinSequence().catch(err => console.log('Interaction-based play failed:', err));
    };
    
    document.addEventListener('click', handleInteraction, { once: true });
    
    return () => {
      document.removeEventListener('click', handleInteraction);
      // Stop any ongoing audio
      const audio = new Audio();
      audio.pause();
    };
  }, [winner, audioAttempted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Confetti Animation using react-confetti */}
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        recycle={false} // Stop after one run
        numberOfPieces={300} // More pieces for a denser effect
        gravity={0.2} // Slower fall
        wind={0.05} // Slight horizontal drift
        colors={['#FFDF00', '#FFF9C4', '#FFD700', '#FFECB3', '#FFE082', '#FFC107']} // Updated colors
      />

      {/* Modal Content */}
      <div className="relative bg-gradient-to-br from-green-400 to-blue-600 rounded-xl shadow-2xl p-6 w-full max-w-md transform transition-all duration-300 ease-out scale-100 hover:scale-105">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Congratulations!</h2>
        <div className="text-center text-white mb-6">
          <p className="text-lg">{winner?.name} won the Royal Deal! 🎉</p>
          <p className="mt-2">Enjoy your victory and claim your prize!</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-4 w-full py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white font-bold rounded-lg transition-all duration-200"
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
};

export default CongratulationsModal;