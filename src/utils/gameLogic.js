// src/utils/gameLogic.js

export const aiDecisions = (activePlayersCount) => {
  const decisions = {};
  const continueProbability = activePlayersCount > 2 ? 0.7 : 0.9;
  decisions.ai1 = Math.random() < continueProbability;
  decisions.ai2 = Math.random() < continueProbability;
  return decisions;
};

// Update upfrontDeduction to implement the different upfront costs

// Function to deduct initial amount from players
export const upfrontDeduction = (players, currentStake) => {
  const updatedPlayers = [...players];
  let pot = 0;
  
  // Deduct upfront costs from each player
  updatedPlayers.forEach((player) => {
    // Calculate upfront amount based on player mode
    // Blind player pays currentStake + 1
    // Seen players (AI) pay currentStake
    let upfrontAmount = currentStake;
    if (player.isHuman && player.mode === 'blind') {
      upfrontAmount += 1; // Add 1 extra coin for blind human player
    }
    
    // Ensure player doesn't pay more than they have
    const actualDeduction = Math.min(player.coins, upfrontAmount);
    
    // Update player state
    player.coins -= actualDeduction;
    player.bet += actualDeduction;
    pot += actualDeduction;
  });
  
  return { updatedPlayers, pot };
};

// Update the initializeRound function to accept player mode
export function initializeRound(players, dragMeterValue, humanPlayerMode = 'blind') {
  let validStake = Math.min(dragMeterValue, 3);
  const minBalance = Math.min(...players.map(p => p.coins));
  if (minBalance < validStake) {
    validStake = minBalance > 0 ? minBalance : 1;
  }
  
  const updatedPlayers = players.map(p => ({
    ...p,
    bet: 0,
    hasFolded: false,
    // Human player gets the selected mode, AI players are always seen
    isSeen: p.isHuman ? (humanPlayerMode === 'seen') : true,
    hasSeenCards: p.isHuman ? (humanPlayerMode === 'seen') : true,
    mode: p.isHuman ? humanPlayerMode : 'seen'
  }));
  
  return {
    players: updatedPlayers,
    currentStake: validStake,
    pot: 0
  };
}

// Process player's turn action
export const processPlayerTurn = (players, currentPlayerIndex, choice, currentStake, pot) => {
  const updatedPlayers = [...players];
  let updatedPot = pot;
  let updatedStake = currentStake;
  const currentPlayer = updatedPlayers[currentPlayerIndex];
  
  switch (choice) {
    case "blind":
      // Blind action costs currentStake
      if (currentPlayer.coins >= currentStake) {
        currentPlayer.coins -= currentStake;
        currentPlayer.bet += currentStake;
        updatedPot += currentStake;
      }
      break;
    
    case "seen":
      // Reveal cards, change mode to seen if not already
      if (currentPlayer.mode === "blind") {
        currentPlayer.mode = "seen";
        currentPlayer.isSeen = true;
        // No additional coins needed here since this is just changing the mode
      }
      
      // Seen action costs 2 * currentStake
      if (currentPlayer.coins >= currentStake * 2) {
        currentPlayer.coins -= currentStake * 2;
        currentPlayer.bet += currentStake * 2;
        updatedPot += currentStake * 2;
      }
      break;
    
    case "show":
      // For "show" case, same behavior as "seen" in terms of betting
      if (currentPlayer.coins >= currentStake * 2) {
        currentPlayer.coins -= currentStake * 2;
        currentPlayer.bet += currentStake * 2;
        updatedPot += currentStake * 2;
      }
      break;
    
    case "fold":
      currentPlayer.hasFolded = true;
      break;
    
    default:
      console.error("Unknown choice:", choice);
  }
  
  return {
    players: updatedPlayers,
    currentStake: updatedStake,
    pot: updatedPot
  };
};

export function determineWinnerAndDistributePot(players, pot) {
  const activePlayers = players.filter(p => !p.hasFolded);
  
  if (activePlayers.length === 1) {
    const winnerIndex = players.findIndex(p => p.id === activePlayers[0].id);
    const updatedPlayers = [...players];
    updatedPlayers[winnerIndex].coins += pot;
    return {
      players: updatedPlayers,
      winner: updatedPlayers[winnerIndex],
      pot: 0
    };
  }
  
  return {
    players,
    winner: null,
    pot
  };
}

export function isRoundOver(players) {
  const activePlayers = players.filter(p => !p.hasFolded);
  return (
    activePlayers.length === 1 ||
    (activePlayers.length > 1 && activePlayers.every(p => p.bet > 0))
  );
}

export function getAIDecision(player, currentStake, activePlayers) {
  const foldThreshold = activePlayers > 2 ? 0.3 : 0.2;
  const lowCoinsThreshold = currentStake * 5;
  const randomFactor = Math.random();
  
  if (player.coins < lowCoinsThreshold) {
    if (randomFactor < foldThreshold * 1.5) {
      return "fold";
    }
  }
  
  if (randomFactor < foldThreshold) {
    return "fold";
  }
  
  return "seen";
}