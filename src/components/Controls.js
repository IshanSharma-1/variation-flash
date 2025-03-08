import React from 'react';

function Controls({ onContinue, onOut, isHumanTurn }) {
  return (
    <div className="mt-8 flex space-x-4">
      {isHumanTurn && (
        <>
          {/* Show buttons only when it's the human player's turn */}
          <button
            onClick={onContinue}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Continue
          </button>
          <button
            onClick={onOut}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Out
          </button>
        </>
      )}
    </div>
  );
}

export default Controls;