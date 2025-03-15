import React from 'react';

function Controls({ player, currentStake, onPlayerAction, currentCycle, activePlayersCount }) {
  const activeCount = activePlayersCount || 3;
  const buttons = [];
  
  // Only render controls for human player
  if (!player.isHuman) return null;
  
  // If human player is blind, show blind options (after AI turns)
  if (player.mode === "blind") {
    buttons.push(
      { label: `Blind Turn (-${currentStake})`, action: () => onPlayerAction('blind') },
      { label: `Reveal & Continue (-${2 * currentStake})`, action: () => onPlayerAction('seen') },
      { label: 'Forfeit', action: () => onPlayerAction('fold') }
    );
  } else {
    // If human player is seen
    if (activeCount > 2) {
      buttons.push(
        { label: `Continue (-${2 * currentStake})`, action: () => onPlayerAction('seen') },
        { label: 'Forfeit', action: () => onPlayerAction('fold') }
      );
    } else {
      buttons.push(
        { label: `Continue (-${2 * currentStake})`, action: () => onPlayerAction('seen') },
        { label: `Show (-${2 * currentStake})`, action: () => onPlayerAction('show') },
        { label: 'Forfeit', action: () => onPlayerAction('fold') }
      );
    }
  }
  
  return (
    <div className="mt-6 flex justify-center space-x-4">
      {buttons.map((b, idx) => (
        <button
          key={idx}
          onClick={b.action}
          className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
            b.label.includes('Forfeit') 
              ? 'bg-red-600 hover:bg-red-700' 
              : b.label.includes('Show') 
                ? 'bg-purple-600 hover:bg-purple-700'
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {b.label}
        </button>
      ))}
    </div>
  );
}

export default Controls;