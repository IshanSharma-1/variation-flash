import React from 'react';

function Controls({
  onContinue,
  onOut,
  isHumanTurn,
  onPlayBlind,
  onSeeCards,
  isUserBlind,
  currentBlindCount,
  hasSeenCards,
  roundCount,
  didUserPickBlindUpfront,
}) {
  const hideRoundOneControls =
    isUserBlind && didUserPickBlindUpfront && roundCount === 1;
  const canPlayBlind = currentBlindCount < 2 && !isUserBlind && !hasSeenCards;

  // If it's not the human's turn, return null (no controls for AI turn)
  if (!isHumanTurn) {
    return null;
  }

  return (
    <div className="mt-8 flex space-x-4 justify-center">
      {/* If hiding round 1 controls, only show Out button */}
      {hideRoundOneControls ? (
        <button
          onClick={onOut}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Out
        </button>
      ) : (
        <>
          {/* If user is currently blind, show "See Cards" button; else if allowed, show "Play Blind" */}
          {isUserBlind ? (
            <button
              onClick={onSeeCards}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Reveal Cards
            </button>
          ) : (
            canPlayBlind && (
              <button
                onClick={onPlayBlind}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Play Blind
              </button>
            )
          )}

          {/* Show "Continue" only if user is not blind */}
          {!isUserBlind && (
            <button
              onClick={onContinue}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Continue
            </button>
          )}

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