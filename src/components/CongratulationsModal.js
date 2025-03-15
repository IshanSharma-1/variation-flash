// UI Updated
import React, { useEffect } from 'react';
import Confetti from 'react-confetti';

const CongratulationsModal = ({ winner }) => {
  useEffect(() => {
    console.log('CongratulationsModal rendered with winner:', winner);
  }, [winner]);

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
      </div>
    </div>
  );
};

export default CongratulationsModal;