import React from 'react';

// CSS for Slide-In Animation
const styles = `
  @keyframes slideIn {
    from {
      transform: translateY(-20%) scale(0.9);
      opacity: 0;
    }
    to {
      transform: translateY(0) scale(1);
      opacity: 1;
    }
  }
  .animate-slide-in {
    animation: slideIn 0.3s ease-out forwards;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  .animate-pulse-once {
    animation: pulse 1s ease-in-out 1;
  }
`;

// Inject CSS into the document
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// NEW CHANGE: Winner selection now passes the player's name instead of index.
const WinnerSelectionModal = ({ players, onSelectWinner }) => {
  const handleSelect = (winnerName) => {
    onSelectWinner(winnerName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70">
      {/* Glass effect container */}
      <div className="glassmorphic-bg rounded-xl shadow-2xl p-6 w-full max-w-md animate-slide-in">
        <h2 className="text-2xl font-bold text-gray-100 text-center mb-4 gold-gradient-text">
          Select a Winner
        </h2>
        <div className="text-center mb-6">
          <p className="text-gray-200 mb-4">Choose the winner of the round:</p>
          <div className="space-y-3">
            {players.map((player) => (
              <button
                key={player.name}
                onClick={() => handleSelect(player.name)}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out animate-pulse-once golden-hover"
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => handleSelect(null)}
            className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerSelectionModal;