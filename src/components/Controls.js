import React from 'react';

function Controls({
  onContinue,
  onOut,
  isHumanTurn,
  // NEW UPDATE: new props
  onPlayBlind,
  onSeeCards,
  isUserBlind,
  currentBlindCount,
}) {
  // If user is already blind, show "See Cards"
  // If user is not blind, but has used < 2 blinds, show "Play Blind"
  const canPlayBlind = currentBlindCount < 2 && !isUserBlind;

  return (
    <div className="mt-8 flex space-x-4 justify-center">
      {isHumanTurn && (
        <>
          {/* NEW UPDATE: Blind/Seen buttons */}
          {isUserBlind ? (
            <button
              onClick={onSeeCards}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              See Cards
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