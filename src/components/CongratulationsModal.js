// src/components/CongratulationsModal.js
import React from 'react';
import Confetti from 'react-confetti';

function CongratulationsModal({ winner }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
      <Confetti width={window.innerWidth} height={window.innerHeight} />
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h2 className="text-4xl font-bold mb-4 text-green-600">Congratulations!</h2>
        <p className="text-2xl">Player {winner.name} wins!</p>
      </div>
    </div>
  );
}

export default CongratulationsModal;