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

// Enhanced WinnerSelectionModal with card comparison
const WinnerSelectionModal = ({ players, onSelectWinner }) => {
  const handleSelect = (winnerName) => {
    onSelectWinner(winnerName);
  };

  // Get the human player and the remaining AI player
  const humanPlayer = players.find(p => p.isHuman);
  const aiPlayer = players.find(p => !p.isHuman);

  // Card rendering helper function with increased size
  const renderCard = (card, index) => (
    <div 
      key={index} 
      className="relative transform transition-transform duration-300 hover:scale-110"
      style={{ zIndex: index + 1 }}
    >
      <img 
        src={`/assets/cards/${card.rank}_of_${card.suit}.png`}
        alt={`${card.rank} of ${card.suit}`}
        className="w-24 h-36 md:w-32 md:h-48 lg:w-40 lg:h-56 object-contain border-2 border-white rounded-lg shadow-xl"
      />
    </div>
  );

  // Hand comparison with increased size
  const renderHandComparison = () => (
    <div className="mb-8 p-6 bg-gradient-to-r from-gray-900 to-gray-800 rounded-lg">
      <h3 className="text-white text-xl font-bold mb-4">Card Comparison</h3>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Human player's cards */}
        <div className="p-4 border-2 border-blue-500 rounded-lg bg-blue-900 bg-opacity-30">
          <h4 className="text-blue-300 text-lg font-bold mb-3">{humanPlayer?.name} (You)</h4>
          <div className="flex justify-center space-x-4 md:space-x-6">
            {humanPlayer?.hand.map((card, i) => renderCard(card, i))}
          </div>
        </div>
        
        {/* AI player's cards */}
        <div className="p-4 border-2 border-red-500 rounded-lg bg-red-900 bg-opacity-30 mt-4">
          <h4 className="text-red-300 text-lg font-bold mb-3">{aiPlayer?.name}</h4>
          <div className="flex justify-center space-x-4 md:space-x-6">
            {aiPlayer?.hand.map((card, i) => renderCard(card, i))}
          </div>
        </div>
      </div>

      <div className="mt-6 text-center text-gray-300 text-base">
        <p>Compare the hands and select the winner below</p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 overflow-y-auto py-6">
      {/* Glass effect container - increased width */}
      <div className="glassmorphic-bg rounded-xl shadow-2xl p-6 w-full max-w-3xl mx-4 animate-slide-in">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-100 text-center mb-6 gold-gradient-text">
          Select a Winner
        </h2>

        {/* Card comparison section */}
        {renderHandComparison()}

        <div className="text-center mb-6">
          <p className="text-gray-200 text-lg mb-4">Choose the winner of the round:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player) => (
              <button
                key={player.name}
                onClick={() => handleSelect(player.name)}
                className={`px-6 py-3 bg-gradient-to-r text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out animate-pulse-once golden-hover ${
                  player.isHuman 
                    ? "from-blue-600 to-blue-800 text-white" 
                    : "from-red-600 to-red-800 text-white"
                }`}
              >
                {player.name}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-center">
          <button
            onClick={() => handleSelect(null)}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-all duration-200 ease-in-out transform hover:-translate-y-1"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinnerSelectionModal;